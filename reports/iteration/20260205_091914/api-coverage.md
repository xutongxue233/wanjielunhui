# API 覆盖率报告

生成时间: 2026-02-05 09:19:14

## 统计摘要

| 指标 | 数量 | 百分比 |
|------|------|--------|
| 总端点数 | 91 | 100% |
| 匹配 | 66 | 72.5% |
| 不匹配 | 11 | 12.1% |
| 后端缺失 | 14 | 15.4% |
| 前端缺失 | 0 | 0% |

## P1 问题列表 (功能缺失)

### 后端缺失端点 (14个)

| 端点 | 分类 | 问题描述 | 严重级别 |
|------|------|----------|----------|
| GET /player/search | player | 后端缺少玩家搜索端点, 好友添加功能依赖此接口 | P1 |
| GET /sect/my | sect | 后端缺少获取当前所属门派端点 | P1 |
| GET /sect/members | sect | 后端缺少获取门派成员列表端点 | P1 |
| POST /sect/contribute | sect | 后端缺少门派贡献端点 | P1 |
| GET /chat/messages | chat | 后端缺少聊天消息获取端点 | P1 |
| POST /chat/send | chat | 后端缺少聊天消息发送端点 | P1 |
| GET /market/shop | market | 后端缺少系统商店列表端点 | P1 |
| POST /market/shop/buy | market | 后端缺少系统商店购买端点 | P1 |
| GET /pvp/rankings | pvp | 后端缺少PVP排名端点 | P2 |
| GET /pvp/battle | pvp | 后端缺少获取当前战斗状态端点 | P1 |
| POST /pvp/battle/action | pvp | 后端缺少战斗行动端点 | P1 |
| POST /pvp/battle/surrender | pvp | 后端缺少投降端点 | P1 |
| GET /admin/activities | admin | 后端缺少活动列表查询端点 | P1 |
| PUT /admin/activities/:id | admin | 后端缺少活动更新端点 | P1 |
| DELETE /admin/activities/:id | admin | 后端缺少活动删除端点 | P1 |

### 前后端不匹配 (11个)

| 端点 | 分类 | 问题描述 | 严重级别 |
|------|------|----------|----------|
| POST /auth/register | auth | 响应字段: 后端返回 createdAt, 前端未定义 | P2 |
| PUT /player/profile | player | 请求参数: 后端支持 avatarId, 前端未定义 | P2 |
| POST /sect/join | sect | 路由路径不匹配: 前端 POST /sect/join + body.sectId, 后端 POST /sect/:id/join | P1 |
| POST /sect/leave | sect | 路由路径不匹配: 前端 POST /sect/leave, 后端需要 /sect/:id/leave | P1 |
| POST /market/buy | market | 路由不匹配: 前端 /market/buy + body.listingId, 后端 /market/buy/:id | P1 |
| POST /market/sell | market | 端点名称不一致: 前端 /market/sell, 后端 /market/list | P1 |
| POST /market/cancel | market | 路由不匹配: 前端 /market/cancel + body.listingId, 后端 /market/cancel/:id | P1 |
| GET /market/my-trades | market | 端点名称不一致: 前端 /market/my-trades, 后端 /market/history | P1 |
| POST /pvp/queue/join | pvp | 路径不匹配: 前端 /pvp/queue/join, 后端 /pvp/match | P1 |
| POST /pvp/queue/leave | pvp | 路径和方法不匹配: 前端 POST /pvp/queue/leave, 后端 DELETE /pvp/match | P1 |

## 按模块统计

| 模块 | 匹配 | 不匹配 | 后端缺失 | 总计 |
|------|------|--------|----------|------|
| auth | 4 | 1 | 0 | 5 |
| save | 4 | 0 | 0 | 4 |
| player | 1 | 1 | 1 | 3 |
| ranking | 6 | 0 | 0 | 6 |
| friend | 6 | 0 | 0 | 6 |
| sect | 2 | 2 | 3 | 7 |
| mail | 5 | 0 | 0 | 5 |
| chat | 0 | 0 | 2 | 2 |
| market | 2 | 4 | 2 | 8 |
| pvp | 2 | 2 | 4 | 8 |
| ops | 1 | 0 | 0 | 1 |
| admin | 33 | 0 | 3 | 36 |

## 鉴权检查

### 需要认证的端点
- 所有 /save/* 端点需要 Bearer Token
- 所有 /friend/* 端点需要 Bearer Token
- 所有 /mail/* 端点需要 Bearer Token
- 所有 /market/* 写操作需要 Bearer Token
- 所有 /pvp/* 端点需要 Bearer Token

### 管理后台权限
- /admin/users/*: ADMIN, GM
- /admin/dashboard/*: ADMIN, GM
- /admin/saves/*: ADMIN, GM (删除需要 ADMIN)
- /admin/announcements/*: ADMIN (需要确认)
- /admin/activities/*: ADMIN (需要确认)
- /admin/ranking/*: ADMIN, GM
- /admin/friends/*: ADMIN, GM
- /admin/sects/*: ADMIN, GM
- /admin/chat/*: ADMIN, GM
- /admin/market/*: ADMIN, GM
- /admin/pvp/*: ADMIN, GM

## 分页检查

### 标准分页参数
- 请求: `page`, `pageSize`
- 响应: `total`, 数据数组

### 已确认支持分页的端点
- GET /ranking/:type
- GET /mail/list
- GET /sect/list
- GET /market/listings
- GET /pvp/history
- GET /admin/users
- GET /admin/announcements
- GET /admin/activities
- GET /admin/saves
- GET /admin/ranking/:type
- GET /admin/friends
- GET /admin/sects
- GET /admin/chat
- GET /admin/market/listings
- GET /admin/market/trades
- GET /admin/pvp/matches

## 修复建议

### 高优先级 (P1)

1. **门派模块 API 路径统一**
   - 前端调整 `/sect/join` 为 `/sect/:id/join`
   - 前端调整 `/sect/leave` 为 `/sect/:id/leave`
   - 后端添加 `/sect/my`, `/sect/members`, `/sect/contribute` 端点

2. **交易市场 API 路径统一**
   - 统一使用路径参数风格: `/market/buy/:id`, `/market/cancel/:id`
   - 或统一使用 body 参数风格
   - 统一 `/market/sell` 与 `/market/list` 命名
   - 统一 `/market/my-trades` 与 `/market/history` 命名

3. **PVP 模块 API 路径统一**
   - 统一匹配队列端点路径
   - 添加战斗状态和行动相关端点

4. **聊天模块**
   - 添加 HTTP API 端点或确认使用 WebSocket

5. **后台活动管理**
   - 添加 GET/PUT/DELETE 端点

### 中优先级 (P2)

1. 统一响应字段格式
2. 前端添加 avatarId 参数支持
