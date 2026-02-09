# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

万界轮回 - 一款文字修仙游戏，采用前后端分离架构。

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint

# 预览构建结果
pnpm preview
```

## 技术栈

**前端:**
- React 19 + TypeScript
- Vite 构建工具
- Zustand + Immer 状态管理
- Tailwind CSS 样式
- Framer Motion 动画
- LocalForage 本地存储

**后端（规划中）:**
- Node.js + Fastify
- PostgreSQL + Prisma ORM
- Redis 缓存
- Socket.IO 实时通信

## 代码架构

### 前端结构 (src/)

```
src/
├── components/          # React 组件
│   ├── game/           # 游戏核心组件（修炼、战斗、炼丹等面板）
│   ├── auth/           # 认证相关组件
│   ├── chat/           # 聊天系统
│   ├── social/         # 社交功能
│   ├── market/         # 交易市场
│   ├── pvp/            # PVP对战
│   ├── ranking/        # 排行榜
│   ├── save/           # 存档管理
│   └── navigation/     # 导航组件
├── stores/             # Zustand 状态管理
│   ├── playerStore.ts  # 玩家状态
│   ├── gameStore.ts    # 游戏状态
│   ├── combatStore.ts  # 战斗状态
│   ├── alchemyStore.ts # 炼丹状态
│   ├── discipleStore.ts # 弟子状态
│   └── roguelikeStore.ts # 秘境状态
├── data/               # 游戏数据定义
│   ├── combat/         # 战斗数据（敌人、技能、副本）
│   ├── alchemy/        # 炼丹配方
│   ├── disciples/      # 弟子数据
│   ├── realms/         # 境界数据
│   ├── roguelike/      # 秘境数据
│   └── origins.ts      # 出身/灵根数据
├── services/           # API 服务
├── core/               # 核心逻辑（游戏循环）
├── types/              # TypeScript 类型定义
└── admin/              # 管理后台
    ├── pages/          # 后台页面
    ├── components/     # 后台组件
    └── stores/         # 后台状态
```

### 后端结构 (server/) - 规划中

详见 `BACKEND_DESIGN.md`，采用模块化架构：
- `modules/` - 业务模块（auth, player, save, combat, ranking, social, trade, pvp, admin）
- `shared/` - 共享代码（中间件、工具、类型）
- `socket/` - WebSocket 处理
- `jobs/` - 定时任务

## 游戏模块

| 模块 | 描述 | 主要文件 |
|-----|------|---------|
| 修炼 | 修为积累和境界突破 | CultivationPanel.tsx, playerStore.ts |
| 战斗 | 回合制战斗系统 | CombatPanel.tsx, combatStore.ts |
| 炼丹 | 丹药炼制系统 | AlchemyPanel.tsx, alchemyStore.ts |
| 弟子 | 弟子招募和培养 | DisciplePanel.tsx, discipleStore.ts |
| 秘境 | Roguelike 探索 | roguelikeStore.ts |
| 剧情 | 交互式剧情系统 | StoryPanel.tsx |

## 状态管理模式

使用 Zustand + Immer 进行状态管理。Store 文件位于 `src/stores/`，每个 store 管理独立的游戏子系统状态。

## 样式规范

使用 Tailwind CSS，组件特定样式使用同名 CSS 文件（如 `CombatPanel.css`）。

## 响应语言

始终使用简体中文回复。

---

## 开发团队命令系统

本项目配置了完整的 AI 开发团队命令，覆盖游戏开发全流程。

### 命令总览

#### 策划命令
| 命令 | 说明 | 使用场景 |
|------|------|----------|
| `/plan-feature` | 功能策划 | 设计新功能完整方案 |
| `/balance` | 数值平衡 | 分析调整游戏数值 |

#### 开发命令
| 命令 | 说明 | 使用场景 |
|------|------|----------|
| `/dev-feature` | 功能开发 | 实现完整功能（前后端） |
| `/dev-ui` | UI 开发 | 开发界面组件 |
| `/build` | 一键构建 | 从需求到交付的完整流程 |
| `/quick-fix` | 快速修复 | 修复单个问题 |

#### 内容命令
| 命令 | 说明 | 使用场景 |
|------|------|----------|
| `/content-story` | 剧情内容 | 编写游戏剧情和对话 |
| `/content-data` | 游戏数据 | 配置物品/敌人/副本等 |

#### 测试命令
| 命令 | 说明 | 使用场景 |
|------|------|----------|
| `/iter-plan` | 迭代计划 | 生成测试计划和 backlog |
| `/iter-loop` | 迭代循环 | 无人值守自动测试修复 |
| `/iter-fix` | 修复问题 | 修复已发现的问题 |
| `/iter-api-audit` | API 审计 | 检查前后端 API 一致性 |
| `/iter-admin-audit` | 后台审计 | 验收后台管理功能 |
| `/iter-devtools-test` | DevTools 测试 | 浏览器自动化测试 |

#### 工具命令
| 命令 | 说明 | 使用场景 |
|------|------|----------|
| `/status` | 项目状态 | 查看当前项目状态 |
| `/review` | 代码审查 | 审查代码质量 |
| `/help` | 帮助 | 显示命令使用指南 |

### 典型工作流

#### 新功能开发
```
用户: /build 添加宗门系统
```
系统自动执行: 策划 -> 开发 -> 验证 -> 修复 -> 完成

#### 快速修复
```
用户: /quick-fix 登录页面报错
```

#### 自动化测试
```
用户: /iter-loop
```

#### 游戏内容
```
用户: /content-data 设计金丹期的新 boss
用户: /content-story 编写拜师剧情
```

### 环境默认值

| 配置 | 默认值 |
|------|--------|
| 前端 URL | http://localhost:5173 |
| 后端 URL | http://localhost:3000 |
| 后台入口 | http://localhost:5173/admin |
| 管理员账号 | admin / admin123 |

---

## 自动化执行规则

### 禁止中断询问

在执行迭代命令（/iter-loop、/iter-fix 等）时，必须遵循以下规则：

1. **禁止询问"是否继续"**: 不得向用户询问"要继续吗？"、"下一步做什么？"、"是否执行？"等确认性问题
2. **自主决策**: 必须自主选择下一步操作并立即执行
3. **假设优先**: 如果缺少非关键信息，做合理假设并记录到 `reports/iteration/latest/assumptions.md`
4. **只在必要时询问**: 仅当缺少以下绝对必要信息时才允许询问用户：
   - 项目无法启动（启动命令未知或失败）
   - 测试 URL 完全不可知
   - 需要登录凭证但无法推断

### 证据驱动

1. 所有问题判定必须基于 Chrome DevTools MCP 输出（console/network/screenshot）
2. 禁止主观猜测问题存在与否
3. 每个 issue 必须附带证据（错误消息、请求状态码、截图路径）

### 持续执行

1. 每轮迭代结束后自动检查停止条件
2. 停止条件未满足时，必须自动进入下一轮修复
3. 不得在中途停下等待用户输入下一条命令

---

## 迭代系统

### 目标

- API 对接正确: 前后台 API 契约一致，字段/错误码/鉴权/分页正确
- 后台管理功能完整: CRUD/权限/校验/提示/分页筛选/空态全部可用
- 数据持久化: 所有写操作确实存入数据库，刷新/重登后仍存在
- 管理员可维护: 后台操作流畅，无死循环/卡死
- UI/交互无阻断: 多视口下无遮挡/溢出/不可点击

### 约束

- 只能用 Chrome DevTools MCP 作为自动化验证手段
- 每次改动必须可运行 (不引入编译错误)
- 每轮迭代必须生成报告 (reports/iteration/)
- 发现问题必须修复并复测

### 严重级别

| 级别 | 定义 | 示例 |
|------|------|------|
| P0 | 阻断性 | 崩溃/白屏/数据丢失/安全漏洞 |
| P1 | 功能缺失 | 核心 CRUD 不可用/API 404/权限失效 |
| P2 | 体验问题 | UI 错位/console 警告/性能问题 |

### 停止条件

迭代完成需同时满足:
1. P0/P1 问题清零
2. Console 无未解释的 error
3. Network 无关键 API 失败 (4xx/5xx)
4. 后台关键 CRUD + 权限 + 校验 + 分页通过
5. 多视口 (1920x1080, 1366x768, 390x844) 无阻断 UI

### 自动化触发

| 方式 | 说明 | 用法 |
|------|------|------|
| **Stop Hook** | 迭代未完成时阻止退出 | 自动生效 |
| **命令行触发** | 脚本调用 Claude | `node tools/auto-trigger.cjs iter-loop` |
| **文件监听** | 代码变更触发构建检查 | `node tools/watch-and-test.cjs` |
| **GitHub Actions** | 推送到 main 时检查 | 自动触发 |

### 报告目录

```
reports/
├── iteration/               # 迭代测试报告
│   ├── latest.json          # 指向最新迭代
│   └── <timestamp>/
│       ├── iteration-summary.md
│       ├── issues.json
│       ├── api-contract.json
│       ├── admin-acceptance.md
│       └── screenshots/
├── build/                   # 构建报告
│   └── <timestamp>/
│       ├── summary.md
│       └── screenshots/
└── review/                  # 代码审查报告
    └── <timestamp>.md

docs/design/                 # 功能设计文档
└── [feature-name].md
```
