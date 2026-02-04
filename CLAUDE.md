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
