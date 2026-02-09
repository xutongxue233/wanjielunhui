# 迭代系统文档

## 概述

本项目实现了一套无人值守的自动化迭代系统，使用 Chrome DevTools MCP 进行证据采集和验证。系统会自动执行"审计 -> 修复 -> 验证 -> 复测"循环，直到满足停止条件。

## 快速开始

### 1. 启动项目

```bash
# 安装依赖
pnpm install

# 终端 1: 启动前端
pnpm dev

# 终端 2: 启动后端
cd server && pnpm dev
```

默认端口：
- 前端: http://localhost:5173
- 后端: http://localhost:3000
- 后台管理: http://localhost:5173/admin

### 2. 确保 Chrome DevTools MCP 可用

Chrome DevTools MCP 需要连接到 Chrome 浏览器。确保：
1. Chrome 浏览器已启动并打开了项目页面
2. MCP 服务器已正确配置

### 3. 运行迭代循环

```bash
# 在 Claude Code 中执行
/iter-loop
```

系统将自动执行完整闭环，无需手动干预。

## 迭代命令

| 命令 | 描述 |
|------|------|
| `/iter-loop` | 完整迭代循环（无人值守） |
| `/iter-plan` | 生成迭代计划 |
| `/iter-api-audit` | API 契约审计 |
| `/iter-admin-audit` | 后台功能验收 |
| `/iter-devtools-test` | DevTools MCP 验证 |
| `/iter-fix` | 修复问题并复测 |

## 系统架构

### 工作流程

```
┌─────────────────────────────────────────────────────────────┐
│                    /iter-loop 执行流程                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                                           │
│  │   初始化     │ 创建迭代目录，读取/初始化状态              │
│  └──────┬───────┘                                           │
│         ▼                                                   │
│  ┌──────────────┐                                           │
│  │  证据采集    │ DevTools MCP: console/network/screenshot  │
│  └──────┬───────┘                                           │
│         ▼                                                   │
│  ┌──────────────┐                                           │
│  │  问题分析    │ 分类问题: P0/P1/P2                        │
│  └──────┬───────┘                                           │
│         ▼                                                   │
│  ┌──────────────┐                                           │
│  │  自动修复    │ 修复 P0/P1 问题                           │
│  └──────┬───────┘                                           │
│         ▼                                                   │
│  ┌──────────────┐                                           │
│  │  复测验证    │ DevTools MCP 重新验证                     │
│  └──────┬───────┘                                           │
│         ▼                                                   │
│  ┌──────────────┐     ┌─────────────┐                       │
│  │ 停止条件检查 │────▶│  全部满足?  │                       │
│  └──────────────┘     └──────┬──────┘                       │
│                              │                              │
│              ┌───────────────┼───────────────┐              │
│              ▼               ▼               ▼              │
│        ┌─────────┐    ┌─────────────┐  ┌──────────┐         │
│        │   否    │    │ 超过10轮?   │  │    是    │         │
│        └────┬────┘    └──────┬──────┘  └────┬─────┘         │
│             │                │              │               │
│             ▼                ▼              ▼               │
│      返回"自动修复"    请求人工介入     生成最终报告        │
│                                             完成            │
└─────────────────────────────────────────────────────────────┘
```

### 子代理

| 代理 | 职责 | 主要工具 |
|------|------|----------|
| orchestrator | 调度迭代流程 | Task, Read, Write |
| devtools_qa | DevTools MCP 测试 | Chrome DevTools MCP |
| api_contract | API 契约审计 | Grep, Read |
| admin_audit | 后台功能验收 | Chrome DevTools MCP |
| db_integrity | 数据持久化验证 | Chrome DevTools MCP |

### Stop Hook

系统配置了 Stop Hook 阻止在停止条件未满足时结束对话：

```json
// .claude/settings.json
{
  "hooks": {
    "Stop": [{
      "command": "node tools/iteration/check-stop-condition.js",
      "description": "检查迭代停止条件"
    }]
  }
}
```

跳过 Hook（紧急情况）：
```bash
SKIP_ITER_HOOKS=1
```

## 停止条件

迭代完成需同时满足以下所有条件：

| 条件 | 描述 |
|------|------|
| p0_p1_cleared | issues.json 中无未解决的 P0/P1 问题 |
| no_console_errors | Console 无未解释的 error |
| no_network_failures | 关键 API 无 4xx/5xx 错误 |
| admin_crud_passed | 后台 CRUD 全部通过 |
| persistence_verified | 数据持久化验证通过 |
| multi_viewport | 三种视口无阻断 UI 问题 |

### 视口配置

| 名称 | 尺寸 | 说明 |
|------|------|------|
| desktop-large | 1920x1080 | 大屏桌面 |
| desktop-small | 1366x768 | 小屏桌面 |
| mobile | 390x844 | 移动端 |

## 报告结构

每轮迭代输出到 `reports/iteration/<timestamp>/`：

```
reports/iteration/
├── latest.json                 # 指向最新迭代
└── 20260205_120000/
    ├── iteration-summary.md    # 迭代摘要
    ├── issues.json             # 结构化问题列表
    ├── assumptions.md          # 假设记录
    ├── api-contract.json       # API 契约
    ├── api-coverage.md         # API 覆盖率
    ├── admin-acceptance.md     # 后台验收
    ├── devtools-report/
    │   ├── console.json        # Console 消息
    │   ├── network.json        # Network 请求
    │   └── snapshots/          # 页面快照
    └── screenshots/
        ├── frontend-*.png      # 前台截图
        ├── admin-*.png         # 后台截图
        └── viewport-*.png      # 多视口截图
```

### Issue 格式

```json
{
  "id": "ISSUE-001",
  "severity": "P1",
  "area": "api",
  "route": "/admin/users",
  "title": "用户列表 API 返回字段缺失",
  "evidence": {
    "console": [],
    "network": { "url": "/api/v1/admin/users", "status": 200, "missing_fields": ["email"] },
    "screenshot": "screenshots/admin-users.png",
    "steps": ["1. 打开后台", "2. 点击用户管理"]
  },
  "status": "open",
  "fix_files": [],
  "retest_result": null
}
```

### 严重级别

| 级别 | 定义 | 示例 |
|------|------|------|
| P0 | 阻断性 | 崩溃/白屏/数据丢失/安全漏洞 |
| P1 | 功能缺失 | 核心 CRUD 不可用/API 404/权限失效 |
| P2 | 体验问题 | UI 错位/console 警告/性能问题 |

## 添加新的测试用例

### 1. 创建用例配置

在 `tools/iteration/cases/` 目录创建 JSON 文件：

```json
{
  "name": "my-new-case",
  "description": "测试新功能",
  "startUrl": "http://localhost:5173/my-page",
  "steps": [
    { "action": "wait_for", "text": "页面标题" },
    { "action": "click", "selector": "button.submit" },
    { "action": "fill", "selector": "input[name='field']", "value": "test" }
  ],
  "assertions": [
    { "type": "element_exists", "selector": ".success-message" },
    { "type": "no_console_errors" },
    { "type": "api_status", "url": "/api/v1/my-endpoint", "expected": 200 }
  ]
}
```

### 2. 添加截图 Baseline

首次运行时，系统会自动生成 baseline 截图。后续运行会与 baseline 对比。

手动更新 baseline：
```bash
# 将当前截图设为新的 baseline
cp reports/iteration/latest/screenshots/*.png tools/iteration/baselines/
```

## 环境变量

| 变量 | 默认值 | 描述 |
|------|--------|------|
| SKIP_ITER_HOOKS | 0 | 设为 1 跳过 Stop Hook |
| ITER_MAX_ROUNDS | 10 | 最大迭代轮次 |
| FRONTEND_URL | http://localhost:5173 | 前端 URL |
| BACKEND_URL | http://localhost:3000 | 后端 URL |

## 白名单

以下不计入错误：

### Console 白名单
- React DevTools 提示
- HMR 相关消息
- Vite 开发服务器消息
- 第三方库警告

### Network 白名单
- 静态资源 404（favicon.ico、.map 文件）
- Hot update 请求

## 故障排除

### DevTools MCP 连接失败

1. 确保 Chrome 浏览器已启动
2. 检查 MCP 服务器配置
3. 重启 Claude Code

### 迭代卡住

1. 检查 `reports/iteration/latest.json` 状态
2. 查看最新的 `issues.json` 了解未解决问题
3. 使用 `SKIP_ITER_HOOKS=1` 强制停止

### 修复导致编译错误

系统会自动回滚修改。检查 `issues.json` 中标记为 `needs_manual` 的问题。

## 最佳实践

1. **启动前检查**: 确保前后端都已启动且可访问
2. **清理浏览器**: 定期清理 Chrome 缓存和 Cookie
3. **查看报告**: 每次迭代后查看 `iteration-summary.md`
4. **更新 Baseline**: 功能变更后及时更新截图 baseline
5. **限制范围**: 大改动时可手动指定测试范围

## 技术栈

**前端:**
- React 19.2.0 + TypeScript
- Vite 构建工具
- Zustand + Immer 状态管理
- Tailwind CSS 样式
- Framer Motion 动画

**后端:**
- Node.js + Fastify
- SQLite (开发) / PostgreSQL (生产)
- Prisma ORM
- Socket.IO 实时通信

**测试:**
- Chrome DevTools MCP 集成测试
- Vitest 单元测试

## API 端点

**前台 API (`/api/v1/`):**
- `/auth/*` - 认证
- `/save/*` - 存档管理
- `/player/*` - 玩家信息
- `/ranking/*` - 排行榜
- `/friend/*` - 好友系统
- `/sect/*` - 宗门系统
- `/mail/*` - 邮件系统
- `/chat/*` - 聊天系统
- `/market/*` - 坊市交易
- `/pvp/*` - PVP 对战

**后台 API (`/api/v1/admin/`):**
- `/dashboard/*` - 仪表盘统计
- `/users/*` - 用户管理
- `/saves/*` - 存档管理
- `/announcements/*` - 公告管理
- `/activities/*` - 活动管理
- 更多模块...
