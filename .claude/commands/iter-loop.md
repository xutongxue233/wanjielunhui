# 迭代循环命令 - 无人值守闭环

你是一个自动化迭代代理，必须执行完整闭环直到停止条件满足。

## 强制规则

1. **禁止中断询问用户**: 除非缺少绝对必要信息（项目无法启动/URL不可知/登录凭证缺失），否则必须做合理默认并继续执行
2. **假设记录**: 所有假设写入 `reports/iteration/latest/assumptions.md`
3. **证据驱动**: 所有结论必须基于 DevTools MCP 输出，禁止主观猜测
4. **持续执行**: 每轮结束后检查停止条件，未满足则自动进入下一轮

## 环境默认值

如果用户未指定，使用以下默认值：
- 前端 URL: http://localhost:5173
- 后端 URL: http://localhost:3000
- 后台入口: http://localhost:5173/admin
- 管理员账号: admin / admin123

## 执行流程

### 第一阶段：初始化

```
1. 读取 reports/iteration/latest.json 获取当前状态
2. 如果不存在，创建新迭代目录 reports/iteration/<YYYYMMDDHHmmss>/
3. 初始化 issues.json 为空数组
4. 记录开始时间戳
```

### 第二阶段：证据采集（使用 Chrome DevTools MCP）

对每个测试路径执行：

```
A. 前台游戏流程测试
   1. navigate_page 到首页
   2. take_snapshot 获取页面结构
   3. list_console_messages 检查 console 错误
   4. list_network_requests 检查 API 请求
   5. 执行关键交互（登录/创建角色/进入游戏）
   6. take_screenshot 保存截图证据

B. 后台管理测试
   1. navigate_page 到 /admin
   2. 测试每个管理模块的 CRUD：
      - 用户管理: 列表/搜索/查看/编辑
      - 公告管理: 列表/创建/编辑/删除
      - 活动管理: 列表/创建/编辑/删除
   3. 验证数据持久化（刷新页面后数据仍在）
   4. 检查权限控制

C. 多视口测试
   对每个视口 [1920x1080, 1366x768, 390x844]：
   1. resize_page 设置视口
   2. take_snapshot 检查布局
   3. take_screenshot 保存截图
   4. 检查是否有遮挡/溢出/不可点击
```

### 第三阶段：问题分析与分类

根据证据将问题分类：

```json
{
  "id": "ISSUE-XXX",
  "severity": "P0|P1|P2",
  "area": "api|admin|ui|console",
  "title": "问题描述",
  "evidence": {
    "console": ["错误消息"],
    "network": {"url": "...", "status": 500},
    "screenshot": "screenshots/xxx.png",
    "steps": ["复现步骤"]
  },
  "status": "open|fixed|verified"
}
```

### 第四阶段：自动修复

对每个 open 状态的 P0/P1 问题：

```
1. 分析问题根因（基于 network/console 证据）
2. 定位相关代码文件
3. 实施修复
4. 更新 issue.fix_files 字段
5. 标记 status = "fixed"
```

### 第五阶段：复测验证

对每个 fixed 状态的问题：

```
1. 使用 DevTools MCP 重新执行测试步骤
2. 检查 console/network 是否还有错误
3. 如果通过，标记 status = "verified"
4. 如果失败，标记 status = "open" 并更新 evidence
```

### 第六阶段：停止条件检查

检查以下所有条件：

```javascript
const stopConditions = {
  // 1. P0/P1 全部解决
  p0_p1_cleared: issues.filter(i =>
    (i.severity === 'P0' || i.severity === 'P1') &&
    i.status !== 'verified'
  ).length === 0,

  // 2. Console 无未解释错误
  no_console_errors: consoleErrors.filter(e =>
    !isWhitelisted(e)
  ).length === 0,

  // 3. Network 无关键失败
  no_network_failures: networkRequests.filter(r =>
    r.status >= 400 && isCriticalAPI(r.url)
  ).length === 0,

  // 4. 后台 CRUD 通过
  admin_crud_passed: adminTests.every(t => t.passed),

  // 5. 数据持久化验证
  persistence_verified: persistenceTests.every(t => t.passed),

  // 6. 多视口无阻断
  multi_viewport: viewportTests.every(t => !t.hasBlockingIssue)
};

const allPassed = Object.values(stopConditions).every(v => v === true);
```

### 第七阶段：循环或完成

```
如果 allPassed:
  1. 生成最终报告 iteration-summary.md
  2. 更新 latest.json status = "completed"
  3. 输出完成消息
  4. 结束执行

否则:
  1. 更新 latest.json 当前迭代轮次 +1
  2. 检查是否超过最大轮次 (10轮)
  3. 如果未超过，立即返回第四阶段继续修复
  4. 如果超过，生成报告并请求人工介入
```

## 输出文件

每轮迭代输出到 `reports/iteration/<timestamp>/`:

```
├── iteration-summary.md    # 迭代摘要
├── issues.json             # 结构化问题列表
├── assumptions.md          # 假设记录
├── devtools-report/
│   ├── console.json        # Console 消息
│   ├── network.json        # Network 请求
│   └── snapshots/          # 页面快照
└── screenshots/
    ├── frontend-*.png      # 前台截图
    ├── admin-*.png         # 后台截图
    └── viewport-*.png      # 多视口截图
```

## 白名单规则

以下不计入错误：
- Console: React DevTools 提示、HMR 相关、第三方库警告
- Network: 静态资源 404、favicon.ico、sourcemap

## 错误处理

- DevTools MCP 连接失败: 等待 5 秒重试，最多 3 次
- 页面加载超时: 刷新重试，最多 2 次
- 修复导致编译错误: 回滚修改，记录为需要人工处理

## 执行示例

```
[迭代 1/10] 开始证据采集...
  - 前台测试: 3 个用例
  - 后台测试: 5 个模块
  - 多视口测试: 3 个视口

[迭代 1/10] 发现问题:
  - P0: 0
  - P1: 5
  - P2: 3

[迭代 1/10] 修复 P1 问题...
  - ISSUE-001: 用户列表 API 缺少字段 → 已修复
  - ISSUE-002: 公告创建失败 → 已修复
  ...

[迭代 1/10] 复测验证...
  - ISSUE-001: 通过
  - ISSUE-002: 通过

[迭代 1/10] 停止条件检查:
  - P0/P1 清零: 否 (剩余 3)
  - Console 无错误: 是
  - Network 无失败: 否
  ...

→ 自动进入迭代 2/10

[迭代 2/10] ...
```

## 立即开始执行

现在开始执行闭环迭代：

1. 使用 Chrome DevTools MCP 连接浏览器
2. 执行第一阶段初始化
3. 持续执行直到停止条件满足

**不要询问用户是否继续，直接执行。**
