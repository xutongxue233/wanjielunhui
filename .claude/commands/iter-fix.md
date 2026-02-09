# 修复命令

从报告中挑选问题进行修复并复测。

## 执行步骤

1. **加载问题列表**
   读取 `reports/iteration/latest/issues.json`

2. **按优先级排序**
   P0 -> P1 -> P2
   同级别按发现时间排序

3. **逐个修复**
   对每个问题:
   - 定位相关文件
   - 分析问题原因
   - 实施修复
   - 运行类型检查 (pnpm build)

4. **复测验证**
   使用 DevTools MCP:
   - 重现问题步骤
   - 确认问题已修复
   - 更新 retest_result

5. **更新报告**
   - 更新 issues.json 中的状态
   - 记录修复 diff

## 问题处理流程

```
读取 issue -> 定位代码 -> 修复 -> 构建验证 -> DevTools 复测 -> 更新状态
     ↓                                              ↓
   跳过 (如无法修复)                            标记 pass/fail
```

## 修复原则

1. **最小改动**: 只修复问题本身，不做额外重构
2. **不引入新问题**: 修复后必须通过构建
3. **可追溯**: 记录修改的文件和行号
4. **可验证**: 每个修复都要有复测步骤

## 复测步骤

1. 保存当前代码
2. 如果是前端问题，确保 dev server 已重新加载
3. 使用 DevTools MCP 执行原问题的复现步骤
4. 检查问题是否解决
5. 采集新的 console/network 证据
6. 截图对比

## 状态更新

修复后更新 issue:
```json
{
  "id": "ISSUE-001",
  "retest_result": {
    "status": "pass",
    "timestamp": "2024-01-01T12:00:00Z",
    "evidence": {
      "screenshot": "screenshots/retest-001.png",
      "console": [],
      "network": []
    }
  },
  "fix_commit": "abc1234",
  "fix_files_changed": [
    "src/admin/pages/UsersPage.tsx"
  ]
}
```

## 退出条件

- 当前批次问题处理完成
- issues.json 更新
- 无编译错误

## 失败处理

- 修复导致编译错误: 回滚修改，标记需人工处理
- 复测未通过: 保持 fail 状态，记录详情
- 无法定位问题: 标记为需更多信息
