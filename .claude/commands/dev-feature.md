# 功能开发命令

你是全栈开发工程师，负责实现游戏功能。

## 输入

- 功能需求描述 或
- 设计文档路径 (`docs/design/*.md`)

## 执行流程

### 1. 理解需求

如果提供了设计文档，读取并理解。
如果只有简单描述，先调用 `/plan-feature` 生成设计。

### 2. 创建任务列表

```
TaskCreate(subject="实现 [功能名]", description="...")
```

按顺序创建子任务：
1. 数据库迁移（如需要）
2. 后端 API
3. 前端 UI
4. 状态管理
5. 集成测试

### 3. 逐步实现

#### 3.1 数据库层（如需要）

```bash
# 修改 schema
Edit: server/prisma/schema.prisma

# 生成迁移
pnpm --filter server prisma migrate dev --name [feature_name]
```

#### 3.2 后端 API

按模块化结构创建：
```
server/src/modules/[module]/
├── [feature].controller.ts
├── [feature].service.ts
├── [feature].schema.ts
└── [feature].routes.ts
```

遵循现有代码模式：
- Controller: 处理请求/响应
- Service: 业务逻辑
- Schema: Zod 校验
- Routes: 路由注册

#### 3.3 前端 UI

使用现有组件库（`src/components/ui/`）：
```tsx
import { Button, Card, Modal } from '@/components/ui'
```

遵循样式规范：
- Tailwind CSS 优先
- 复杂样式用同名 .css 文件
- 响应式设计（mobile-first）

#### 3.4 状态管理

Zustand + Immer 模式：
```typescript
// src/stores/[feature]Store.ts
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
```

### 4. 代码质量检查

每完成一个模块：
```bash
pnpm build  # 类型检查
pnpm lint   # 代码规范
```

### 5. 功能验证

使用 DevTools MCP 验证：
```
mcp__chrome-devtools__navigate_page(url="...")
mcp__chrome-devtools__take_snapshot()
mcp__chrome-devtools__list_console_messages()
mcp__chrome-devtools__list_network_requests()
```

### 6. 完成任务

```
TaskUpdate(taskId="...", status="completed")
```

## 开发原则

1. **增量开发**：小步提交，每步可运行
2. **类型安全**：TypeScript 严格模式
3. **错误处理**：用户友好的错误提示
4. **最小改动**：不做超出需求的重构

## 禁止事项

- 不引入新依赖（除非必要且用户同意）
- 不修改无关代码
- 不添加无用注释/文档
- 不创建示例/测试数据（除非需求明确）

## 退出条件

- 所有任务完成
- 构建通过（pnpm build 无错误）
- 功能可正常使用
