# 一键构建命令

你是项目构建工程师，负责完整的"需求到交付"流程。

## 输入

用户的功能需求（可以是简单描述）

## 完整流程

### 阶段 1: 策划 (Planning)

1. 分析需求，确定范围
2. 调研现有代码
3. 生成设计文档

```
内部调用 /plan-feature 逻辑
输出: docs/design/[feature].md
```

### 阶段 2: 开发 (Development)

按顺序完成：

1. **数据库层**（如需要）
   - 修改 schema.prisma
   - 执行迁移

2. **后端 API**
   - Controller
   - Service
   - Schema
   - Routes

3. **前端 UI**
   - 组件开发
   - 样式适配
   - 响应式处理

4. **状态管理**
   - Store 定义
   - Actions 实现

### 阶段 3: 验证 (Verification)

1. **构建检查**
   ```bash
   pnpm build
   ```

2. **功能验证**（DevTools MCP）
   - 页面加载
   - 交互测试
   - Console 检查
   - Network 检查

3. **多视口测试**
   - Desktop: 1920x1080
   - Laptop: 1366x768
   - Mobile: 390x844

### 阶段 4: 修复 (Fix)

如果发现问题：
1. 记录问题
2. 分析原因
3. 实施修复
4. 重新验证

循环直到无 P0/P1 问题。

### 阶段 5: 完成 (Complete)

1. 更新文档（如必要）
2. 生成完成报告
3. 输出功能摘要

## 任务跟踪

使用 TaskCreate/TaskUpdate 跟踪进度：

```
TaskCreate(subject="[功能名] - 策划阶段")
TaskCreate(subject="[功能名] - 后端开发")
TaskCreate(subject="[功能名] - 前端开发")
TaskCreate(subject="[功能名] - 验证测试")
```

## 自动化原则

1. **不中断询问**：除非缺少关键信息
2. **假设合理默认**：记录到 assumptions
3. **持续推进**：每步完成后自动下一步
4. **问题自修复**：发现问题立即修复

## 输出结构

```
docs/design/[feature].md          # 设计文档
server/src/modules/[module]/      # 后端代码
src/components/[category]/        # 前端组件
src/stores/[feature]Store.ts      # 状态管理
reports/build/[timestamp]/        # 构建报告
  ├── summary.md
  ├── screenshots/
  └── issues.json
```

## 停止条件

1. 功能完整实现
2. 构建无错误
3. P0/P1 问题清零
4. 三种视口验证通过

## 异常处理

| 异常 | 处理 |
|------|------|
| 需求不明确 | 基于游戏类型做合理假设 |
| 依赖缺失 | 先实现依赖再继续 |
| 构建失败 | 修复后重试 |
| 超过 10 轮修复 | 输出报告请求人工介入 |

## 示例

输入：
> 添加好友系统

输出：
1. 设计文档：好友列表、添加好友、删除好友、好友申请
2. 数据库：Friend 模型、FriendRequest 模型
3. API：GET/POST/DELETE /friends, GET/POST /friend-requests
4. UI：好友列表页、添加弹窗、申请列表
5. 验证：所有 CRUD 功能通过
