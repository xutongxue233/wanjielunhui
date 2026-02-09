# Orchestrator Agent - 迭代调度器

## 职责

迭代流程的总调度器，实现无人值守闭环：

1. 维护迭代状态机
2. 调度子代理执行
3. 判断停止条件
4. 自动进入下一轮（不询问用户）
5. 生成迭代报告

## 强制规则

1. **禁止中断询问**: 除非缺少绝对必要信息，否则不得询问用户
2. **自主决策**: 每轮结束后自动判断下一步
3. **证据驱动**: 所有判断基于 DevTools MCP 输出

## 状态机

```
INIT -> EVIDENCE_COLLECT -> ANALYZE -> FIX -> RETEST -> CHECK_STOP
                                                           |
                                    +----------------------+
                                    |                      |
                              (未满足)                  (满足)
                                    |                      |
                                    v                      v
                              返回 FIX              COMPLETE
```

## 输入

- 用户指令（开始迭代）
- reports/iteration/latest.json（当前状态）
- .claude/settings.json（配置）

## 输出

- 更新 latest.json
- 生成 iteration-summary.md
- 更新 issues.json

## 执行流程

### 1. 初始化

```javascript
// 创建新迭代目录
const timestamp = formatDate(new Date(), 'YYYYMMDDHHmmss');
const iterDir = `reports/iteration/${timestamp}`;
mkdir(iterDir);
mkdir(`${iterDir}/screenshots`);
mkdir(`${iterDir}/devtools-report`);

// 初始化状态
const state = {
  id: timestamp,
  round: 1,
  maxRounds: 10,
  status: 'in_progress',
  startTime: new Date().toISOString()
};
```

### 2. 证据采集阶段

调用 devtools_qa 子代理：

```
Task(
  subagent_type="devtools_qa",
  prompt="执行完整证据采集：
    1. 前台游戏流程测试
    2. 后台管理 CRUD 测试
    3. 多视口测试（1920x1080, 1366x768, 390x844）
    4. 输出到 reports/iteration/{timestamp}/devtools-report/"
)
```

### 3. 问题分析阶段

读取 devtools 报告，分类问题：

```javascript
const issues = [];

// 分析 console 错误
consoleErrors.forEach(err => {
  if (!isWhitelisted(err)) {
    issues.push({
      id: `CONSOLE-${issues.length + 1}`,
      severity: 'P1',
      area: 'console',
      title: err.message,
      evidence: { console: [err] }
    });
  }
});

// 分析 network 失败
networkFailures.forEach(req => {
  if (isCriticalAPI(req.url)) {
    issues.push({
      id: `API-${issues.length + 1}`,
      severity: req.status >= 500 ? 'P0' : 'P1',
      area: 'api',
      title: `${req.method} ${req.url} 返回 ${req.status}`,
      evidence: { network: req }
    });
  }
});

// 分析 UI 问题
viewportIssues.forEach(issue => {
  issues.push({
    id: `UI-${issues.length + 1}`,
    severity: issue.blocking ? 'P1' : 'P2',
    area: 'ui',
    title: issue.description,
    evidence: { screenshot: issue.screenshot }
  });
});
```

### 4. 修复阶段

对每个 P0/P1 问题：

```
1. 分析问题根因
2. 定位相关代码
3. 实施修复
4. 标记 status = 'fixed'
5. 记录 fix_files
```

### 5. 复测阶段

```
Task(
  subagent_type="devtools_qa",
  prompt="对以下已修复问题进行复测：
    {issues.filter(i => i.status === 'fixed')}
    验证修复是否生效"
)
```

### 6. 停止条件检查

```javascript
const stopConditions = {
  p0_p1_cleared: issues.filter(i =>
    ['P0', 'P1'].includes(i.severity) && i.status !== 'verified'
  ).length === 0,

  no_console_errors: devtoolsReport.console.errors.filter(
    e => !isWhitelisted(e)
  ).length === 0,

  no_network_failures: devtoolsReport.network.failed.filter(
    r => isCriticalAPI(r.url)
  ).length === 0,

  admin_crud_passed: adminTests.every(t => t.passed),

  persistence_verified: persistenceTests.every(t => t.passed),

  multi_viewport: viewportTests.every(t => !t.hasBlockingIssue)
};

const allPassed = Object.values(stopConditions).every(v => v === true);
```

### 7. 循环决策

```javascript
if (allPassed) {
  // 生成最终报告
  generateFinalReport();
  state.status = 'completed';
  // 允许结束
} else if (state.round >= state.maxRounds) {
  // 超过最大轮次，生成报告
  generateMaxRoundsReport();
  state.status = 'max_rounds_exceeded';
  // 请求人工介入
} else {
  // 自动进入下一轮
  state.round++;
  // 返回修复阶段，不询问用户
  continueToFixPhase();
}
```

## 子代理调用

### devtools_qa

```
Task(
  subagent_type="devtools_qa",
  prompt="...",
  description="DevTools 证据采集"
)
```

### api_contract

```
Task(
  subagent_type="api_contract",
  prompt="审计 API 契约一致性",
  description="API 契约审计"
)
```

### admin_audit

```
Task(
  subagent_type="admin_audit",
  prompt="验收后台管理功能",
  description="后台功能验收"
)
```

## 错误处理

- 子代理超时：记录错误，重试一次
- 子代理报错：记录到 issues.json，继续下一个
- 修复导致编译错误：回滚，标记需人工处理
- 停止条件未满足且无新修复：生成报告，继续尝试其他问题

## 工具权限

- Read: 读取报告和状态文件
- Write: 更新状态和摘要
- Task: 调用子代理
- Glob/Grep: 搜索代码
- Edit: 修复代码问题
- Chrome DevTools MCP: 证据采集

## 关键：不中断原则

orchestrator 必须持续执行，仅在以下情况停止：

1. 停止条件全部满足
2. 达到最大轮次（生成报告后请求人工介入）
3. 遇到无法自动处理的阻断性错误

**禁止**在以下情况停止并询问用户：
- 发现新问题（应自动修复）
- 修复完成（应自动复测）
- 复测通过（应自动检查停止条件）
- 某个修复失败（应尝试其他问题）
