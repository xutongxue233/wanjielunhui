# API Contract 接口契约清单

## 一、前端用户API

### 1. 认证模块 (Auth)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 注册 | POST | /api/v1/auth/register | `{username, email, password}` | `{id, username, email, role}` | 无 |
| 登录 | POST | /api/v1/auth/login | `{account, password}` | `{accessToken, refreshToken, expiresIn, user}` | 无 |
| 登出 | POST | /api/v1/auth/logout | `{refreshToken}` | `void` | JWT |
| 刷新Token | POST | /api/v1/auth/refresh | `{refreshToken}` | `{accessToken, refreshToken}` | 无 |
| 获取当前用户 | GET | /api/v1/auth/me | - | `{id, username, email, role}` | JWT |

### 2. 存档模块 (Save)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 存档列表 | GET | /api/v1/save/list | - | `SaveSlot[]` | JWT |
| 获取存档 | GET | /api/v1/save/:slot | slot: number | `SaveData` | JWT |
| 保存存档 | POST | /api/v1/save/:slot | `{name, playerData, gameData, alchemyData, discipleData, roguelikeData, playTime?, checkpoint?}` | `SaveData` | JWT |
| 删除存档 | DELETE | /api/v1/save/:slot | slot: number | `void` | JWT |

### 3. 玩家模块 (Player)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 获取玩家资料 | GET | /api/v1/player/profile | - | `PlayerProfile` | JWT |
| 更新玩家资料 | PUT | /api/v1/player/profile | `{name?, title?}` | `PlayerProfile` | JWT |
| 搜索玩家 | GET | /api/v1/player/search | `?keyword=string` | `{id, name, realm}[]` | JWT |

### 4. 排行榜模块 (Ranking)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 战力排行 | GET | /api/v1/ranking/combat-power | `?page=1&pageSize=50` | `{rankings: RankingEntry[], total}` | JWT |
| 境界排行 | GET | /api/v1/ranking/realm | `?page=1&pageSize=50` | `{rankings: RankingEntry[], total}` | JWT |
| 轮回排行 | GET | /api/v1/ranking/reincarnation | `?page=1&pageSize=50` | `{rankings: RankingEntry[], total}` | JWT |
| 财富排行 | GET | /api/v1/ranking/wealth | `?page=1&pageSize=50` | `{rankings: RankingEntry[], total}` | JWT |
| PVP排行 | GET | /api/v1/ranking/pvp | `?page=1&pageSize=50` | `{rankings: RankingEntry[], total}` | JWT |
| 我的排名 | GET | /api/v1/ranking/:type/me | type: string | `{rank, score}` | JWT |

### 5. 好友模块 (Friend)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 好友列表 | GET | /api/v1/friend/list | - | `{friends: Friend[], total}` | JWT |
| 好友请求列表 | GET | /api/v1/friend/requests | - | `{requests: FriendRequest[], total}` | JWT |
| 发送好友请求 | POST | /api/v1/friend/request | `{targetId, message?}` | `void` | JWT |
| 接受好友请求 | POST | /api/v1/friend/accept/:requestId | requestId: string | `void` | JWT |
| 拒绝好友请求 | POST | /api/v1/friend/reject/:requestId | requestId: string | `void` | JWT |
| 删除好友 | DELETE | /api/v1/friend/:friendId | friendId: string | `void` | JWT |

### 6. 宗门模块 (Sect)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 我的宗门 | GET | /api/v1/sect/my | - | `Sect \| null` | JWT |
| 宗门成员 | GET | /api/v1/sect/members | - | `SectMember[]` | JWT |
| 宗门列表 | GET | /api/v1/sect/list | `?page=1&pageSize=20` | `{sects: Sect[], total}` | JWT |
| 创建宗门 | POST | /api/v1/sect/create | `{name, description?}` | `Sect` | JWT |
| 加入宗门 | POST | /api/v1/sect/join | `{sectId}` | `void` | JWT |
| 离开宗门 | POST | /api/v1/sect/leave | - | `void` | JWT |
| 宗门贡献 | POST | /api/v1/sect/contribute | `{amount}` | `void` | JWT |

### 7. 邮件模块 (Mail)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 邮件列表 | GET | /api/v1/mail/list | `?page=1&pageSize=20` | `{mails: Mail[], total, unreadCount}` | JWT |
| 读取邮件 | GET | /api/v1/mail/:mailId | mailId: string | `Mail` | JWT |
| 领取附件 | POST | /api/v1/mail/:mailId/claim | mailId: string | `void` | JWT |
| 删除邮件 | DELETE | /api/v1/mail/:mailId | mailId: string | `void` | JWT |
| 发送邮件 | POST | /api/v1/mail/send | `{toPlayerId, title, content}` | `void` | JWT |

### 8. 聊天模块 (Chat)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 获取消息 | GET | /api/v1/chat/messages | `?channel=world&limit=50&before?` | `ChatMessage[]` | JWT |
| 发送消息 | POST | /api/v1/chat/send | `{channel, content}` | `ChatMessage` | JWT |

### 9. 坊市模块 (Market)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 商品列表 | GET | /api/v1/market/listings | `?page=1&pageSize=20&type?&search?` | `{listings: MarketListing[], total}` | JWT |
| 购买商品 | POST | /api/v1/market/buy | `{listingId, quantity?}` | `void` | JWT |
| 上架商品 | POST | /api/v1/market/sell | `{itemId, price, quantity?}` | `MarketListing` | JWT |
| 下架商品 | POST | /api/v1/market/cancel | `{listingId}` | `void` | JWT |
| 我的上架 | GET | /api/v1/market/my-listings | - | `MyTrade[]` | JWT |
| 我的交易 | GET | /api/v1/market/my-trades | - | `MyTrade[]` | JWT |
| 商店列表 | GET | /api/v1/market/shop | `?category?` | `ShopItem[]` | JWT |
| 商店购买 | POST | /api/v1/market/shop/buy | `{itemId, quantity?}` | `void` | JWT |

### 10. PVP模块

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 获取统计 | GET | /api/v1/pvp/stats | - | `PvpStats` | JWT |
| 战斗历史 | GET | /api/v1/pvp/history | `?page=1&pageSize=10` | `{matches: PvpMatch[], total}` | JWT |
| PVP排行 | GET | /api/v1/pvp/rankings | `?page=1&pageSize=50` | `{rankings: RankingEntry[], total}` | JWT |
| 加入队列 | POST | /api/v1/pvp/queue/join | - | `{status, estimatedWait?}` | JWT |
| 离开队列 | POST | /api/v1/pvp/queue/leave | - | `void` | JWT |
| 获取战斗 | GET | /api/v1/pvp/battle | - | `PvpBattleState \| null` | JWT |
| 战斗行动 | POST | /api/v1/pvp/battle/action | `{action: 'attack'\|'skill'\|'defend'}` | `PvpBattleState` | JWT |
| 投降 | POST | /api/v1/pvp/battle/surrender | - | `void` | JWT |

### 11. 运营模块 (Ops)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 公告列表 | GET | /api/v1/ops/announcements | - | `Announcement[]` | JWT |

---

## 二、管理后台API

### 1. 仪表盘 (Dashboard)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 获取统计 | GET | /api/v1/admin/dashboard/stats | - | `DashboardStats` | JWT+ADMIN |
| 近期趋势 | GET | /api/v1/admin/dashboard/trends | `?days=7` | `TrendData[]` | JWT+ADMIN |

### 2. 用户管理 (Users)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 用户列表 | GET | /api/v1/admin/users | `?page=1&pageSize=20&search?` | `{users, total, page, pageSize}` | JWT+ADMIN |
| 更新状态 | PUT | /api/v1/admin/users/:id/status | `{status: 'ACTIVE'\|'BANNED'\|'SUSPENDED'}` | `User` | JWT+ADMIN |
| 更新角色 | PUT | /api/v1/admin/users/:id/role | `{role: 'PLAYER'\|'GM'\|'ADMIN'}` | `User` | JWT+ADMIN |

### 3. 存档管理 (Saves)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 存档列表 | GET | /api/v1/admin/saves | `?page&pageSize&userId?&search?` | `{saves, total}` | JWT+ADMIN |
| 获取存档 | GET | /api/v1/admin/saves/:id | id: string | `SaveData` | JWT+ADMIN |
| 删除存档 | DELETE | /api/v1/admin/saves/:id | id: string | `void` | JWT+ADMIN |
| 回滚存档 | POST | /api/v1/admin/saves/:id/rollback | `{version}` | `SaveData` | JWT+ADMIN |

### 4. 公告管理 (Announcements)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 公告列表 | GET | /api/v1/admin/announcements | `?page&pageSize&status?` | `{announcements, total}` | JWT+ADMIN |
| 创建公告 | POST | /api/v1/admin/announcements | `{title, content, type, priority, startsAt?, endsAt?}` | `Announcement` | JWT+ADMIN |
| 更新公告 | PUT | /api/v1/admin/announcements/:id | `{title?, content?, type?, priority?, status?}` | `Announcement` | JWT+ADMIN |
| 删除公告 | DELETE | /api/v1/admin/announcements/:id | id: string | `void` | JWT+ADMIN |

### 5. 活动管理 (Activities)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 活动列表 | GET | /api/v1/admin/activities | `?page&pageSize&status?` | `{activities, total}` | JWT+ADMIN |
| 创建活动 | POST | /api/v1/admin/activities | `{name, type, config, startsAt, endsAt}` | `Activity` | JWT+ADMIN |
| 更新活动 | PUT | /api/v1/admin/activities/:id | 同创建 | `Activity` | JWT+ADMIN |
| 删除活动 | DELETE | /api/v1/admin/activities/:id | id: string | `void` | JWT+ADMIN |

### 6. 邮件管理 (Mail)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 系统邮件列表 | GET | /api/v1/admin/mail | `?page&pageSize` | `{mails, total}` | JWT+ADMIN |
| 发送系统邮件 | POST | /api/v1/admin/mail/send | `{title, content, recipients, attachments?}` | `Mail` | JWT+ADMIN |
| 群发邮件 | POST | /api/v1/admin/mail/broadcast | `{title, content, attachments?}` | `{count}` | JWT+ADMIN |

### 7. 排行榜管理 (Ranking)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 刷新排行榜 | POST | /api/v1/admin/ranking/refresh | `{type}` | `void` | JWT+ADMIN |
| 重置赛季 | POST | /api/v1/admin/ranking/reset-season | `{type, rewards?}` | `void` | JWT+ADMIN |

### 8. 好友管理 (Friends)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 好友关系列表 | GET | /api/v1/admin/friends | `?page&pageSize&playerId?` | `{friendships, total}` | JWT+ADMIN |
| 删除好友关系 | DELETE | /api/v1/admin/friends/:id | id: string | `void` | JWT+ADMIN |

### 9. 宗门管理 (Sects)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 宗门列表 | GET | /api/v1/admin/sects | `?page&pageSize&search?` | `{sects, total}` | JWT+ADMIN |
| 宗门详情 | GET | /api/v1/admin/sects/:id | id: string | `Sect` | JWT+ADMIN |
| 解散宗门 | DELETE | /api/v1/admin/sects/:id | id: string | `void` | JWT+ADMIN |
| 更新宗门 | PUT | /api/v1/admin/sects/:id | `{level?, maxMembers?}` | `Sect` | JWT+ADMIN |

### 10. 聊天管理 (Chat)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 消息列表 | GET | /api/v1/admin/chat | `?page&pageSize&channel?&senderId?` | `{messages, total}` | JWT+ADMIN |
| 删除消息 | DELETE | /api/v1/admin/chat/:id | id: string | `void` | JWT+ADMIN |
| 禁言用户 | POST | /api/v1/admin/chat/mute | `{playerId, duration, reason?}` | `void` | JWT+ADMIN |

### 11. 坊市管理 (Market)

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 商品列表 | GET | /api/v1/admin/market | `?page&pageSize&status?&sellerId?` | `{listings, total}` | JWT+ADMIN |
| 下架商品 | DELETE | /api/v1/admin/market/:id | id: string | `void` | JWT+ADMIN |
| 交易记录 | GET | /api/v1/admin/market/transactions | `?page&pageSize&from?&to?` | `{transactions, total}` | JWT+ADMIN |

### 12. PVP管理

| 接口 | 方法 | 路径 | 请求参数 | 返回结构 | 认证 |
|-----|------|------|---------|---------|------|
| 赛季列表 | GET | /api/v1/admin/pvp/seasons | - | `Season[]` | JWT+ADMIN |
| 创建赛季 | POST | /api/v1/admin/pvp/seasons | `{name, startsAt, endsAt, config?}` | `Season` | JWT+ADMIN |
| 比赛记录 | GET | /api/v1/admin/pvp/matches | `?page&pageSize&playerId?` | `{matches, total}` | JWT+ADMIN |

---

## 三、覆盖矩阵 (Coverage Matrix)

### 前端页面 -> API映射

| 页面/功能 | 使用的API | 关键字段 | 数据库行为 | 权限角色 |
|----------|----------|---------|-----------|---------|
| **AuthPage (登录注册)** |
| 登录 | POST /auth/login | account, password | READ User, UPDATE lastLoginAt/loginCount | 无 |
| 注册 | POST /auth/register | username, email, password | CREATE User | 无 |
| 登出 | POST /auth/logout | refreshToken | DELETE RefreshToken | PLAYER |
| **TitleScreen (标题页)** |
| 显示公告 | GET /ops/announcements | - | READ Announcement | PLAYER |
| **GameScreen (游戏主界面)** |
| 未读数量 | GET /friend/requests, GET /mail/list | - | READ FriendRequest, Mail | PLAYER |
| **SaveManager (存档管理)** |
| 存档列表 | GET /save/list | - | READ GameSave | PLAYER |
| 加载存档 | GET /save/:slot | slot | READ GameSave | PLAYER |
| 保存存档 | POST /save/:slot | slot, playerData, gameData... | UPSERT GameSave | PLAYER |
| 删除存档 | DELETE /save/:slot | slot | DELETE GameSave | PLAYER |
| **SocialPage (社交页)** |
| 好友列表 | GET /friend/list | - | READ Friendship | PLAYER |
| 好友请求 | GET /friend/requests | - | READ FriendRequest | PLAYER |
| 接受请求 | POST /friend/accept/:id | requestId | UPDATE FriendRequest, CREATE Friendship | PLAYER |
| 拒绝请求 | POST /friend/reject/:id | requestId | UPDATE FriendRequest | PLAYER |
| 删除好友 | DELETE /friend/:id | friendId | DELETE Friendship | PLAYER |
| 我的宗门 | GET /sect/my | - | READ Sect, SectMember | PLAYER |
| 宗门成员 | GET /sect/members | - | READ SectMember | PLAYER |
| **MarketPage (坊市页)** |
| 商品列表 | GET /market/listings | page, type, search | READ MarketListing | PLAYER |
| 购买商品 | POST /market/buy | listingId, quantity | UPDATE MarketListing, CREATE Transaction | PLAYER |
| 上架商品 | POST /market/sell | itemId, price, quantity | CREATE MarketListing | PLAYER |
| 下架商品 | POST /market/cancel | listingId | UPDATE MarketListing | PLAYER |
| 我的上架 | GET /market/my-listings | - | READ MarketListing | PLAYER |
| 商店 | GET /market/shop | category | READ ShopItem | PLAYER |
| 商店购买 | POST /market/shop/buy | itemId, quantity | UPDATE Player inventory | PLAYER |
| **PvpPage (论剑页)** |
| PVP统计 | GET /pvp/stats | - | READ PvpStats | PLAYER |
| 战斗历史 | GET /pvp/history | page, pageSize | READ PvpMatch | PLAYER |
| PVP排行 | GET /pvp/rankings | page, pageSize | READ PvpRanking | PLAYER |
| 加入队列 | POST /pvp/queue/join | - | CREATE QueueEntry | PLAYER |
| 离开队列 | POST /pvp/queue/leave | - | DELETE QueueEntry | PLAYER |
| 战斗状态 | GET /pvp/battle | - | READ PvpBattle | PLAYER |
| 战斗行动 | POST /pvp/battle/action | action | UPDATE PvpBattle | PLAYER |
| 投降 | POST /pvp/battle/surrender | - | UPDATE PvpBattle | PLAYER |
| **RankingPage (天榜页)** |
| 战力榜 | GET /ranking/combat-power | page, pageSize | READ Ranking | PLAYER |
| 境界榜 | GET /ranking/realm | page, pageSize | READ Ranking | PLAYER |
| 轮回榜 | GET /ranking/reincarnation | page, pageSize | READ Ranking | PLAYER |
| 财富榜 | GET /ranking/wealth | page, pageSize | READ Ranking | PLAYER |
| PVP榜 | GET /ranking/pvp | page, pageSize | READ Ranking | PLAYER |
| **ChatPanel (聊天面板)** |
| 获取消息 | GET /chat/messages | channel, limit, before | READ ChatMessage | PLAYER |
| 发送消息 | POST /chat/send | channel, content | CREATE ChatMessage | PLAYER |

### 管理后台页面 -> API映射

| 页面/功能 | 使用的API | 关键字段 | 数据库行为 | 权限角色 |
|----------|----------|---------|-----------|---------|
| **Dashboard (仪表盘)** |
| 统计数据 | GET /admin/dashboard/stats | - | READ aggregates | ADMIN/GM |
| 趋势数据 | GET /admin/dashboard/trends | days | READ aggregates | ADMIN/GM |
| **UserManagement (用户管理)** |
| 用户列表 | GET /admin/users | page, pageSize, search | READ User, Player | ADMIN |
| 更新状态 | PUT /admin/users/:id/status | status | UPDATE User.status | ADMIN |
| 更新角色 | PUT /admin/users/:id/role | role | UPDATE User.role | ADMIN |
| **SaveManagement (存档管理)** |
| 存档列表 | GET /admin/saves | page, userId, search | READ GameSave | ADMIN/GM |
| 存档详情 | GET /admin/saves/:id | id | READ GameSave | ADMIN/GM |
| 删除存档 | DELETE /admin/saves/:id | id | DELETE GameSave | ADMIN |
| 回滚存档 | POST /admin/saves/:id/rollback | version | UPDATE GameSave | ADMIN |
| **AnnouncementManagement (公告管理)** |
| 公告列表 | GET /admin/announcements | page, status | READ Announcement | ADMIN/GM |
| 创建公告 | POST /admin/announcements | title, content, type, priority | CREATE Announcement | ADMIN/GM |
| 更新公告 | PUT /admin/announcements/:id | 同上 | UPDATE Announcement | ADMIN/GM |
| 删除公告 | DELETE /admin/announcements/:id | id | DELETE Announcement | ADMIN |

---

## 四、缺失项分析

### 1. 页面无API (有UI无后端接口)

| 页面/功能 | 缺失的API | 说明 |
|----------|----------|------|
| CultivationPanel (修炼面板) | 修炼相关API | 当前使用本地Store，无服务端同步 |
| CombatPanel (战斗面板) | PVE战斗API | 当前使用本地Store，无服务端验证 |
| AlchemyPanel (炼丹面板) | 炼丹相关API | 纯前端逻辑 |
| DisciplePanel (弟子面板) | 弟子管理API | 纯前端逻辑 |
| ExplorationPanel (探索面板) | 探索/秘境API | 纯前端逻辑 |
| StoryPanel (剧情面板) | 剧情进度API | 纯前端逻辑 |
| CharacterCreation (角色创建) | 创建角色API | 需要服务端创建Player记录 |
| PlayerStatus (玩家状态) | 实时状态同步API | 当前仅本地显示 |
| SocialPage - 寻找道友 | 玩家推荐API | 按钮存在但无功能 |
| SocialPage - 寻找宗门 | 宗门推荐API | 按钮存在但无功能 |

### 2. 有API无UI入口

| API | 说明 |
|-----|------|
| PUT /player/profile | 有API定义，但UI无修改入口 |
| GET /player/search | 有API但无搜索UI |
| POST /sect/create | 有API但无创建宗门UI |
| GET /sect/list | 有API但无宗门列表浏览UI |
| POST /sect/join | 有API但无加入宗门流程UI |
| POST /sect/leave | 有API但无离开宗门按钮 |
| POST /sect/contribute | 有API但无贡献UI |
| POST /mail/send | 有API但无发送邮件UI |
| GET /ranking/:type/me | 有API但未在排行榜显示自己排名 |

### 3. 数据类型不匹配

| 问题 | 位置 | 说明 |
|-----|------|------|
| friendApi.list() | SocialPage.tsx | 前端期望数组，后端返回`{friends:[], total}` |
| friendApi.requests() | GameScreen.tsx | 前端期望数组，后端返回`{requests:[], total}` |
| player.combatPower | user.service.ts | BigInt需转换为Number |

### 4. 后端模块未完全实现

| 模块 | 状态 | 缺失功能 |
|-----|------|---------|
| Player模块 | 部分 | 缺少角色创建、属性同步 |
| Combat模块 | 规划中 | PVE战斗验证 |
| Alchemy模块 | 规划中 | 炼丹系统 |
| Disciple模块 | 规划中 | 弟子系统 |
| Roguelike模块 | 规划中 | 秘境探索 |

---

## 五、API响应标准格式

```typescript
// 成功响应
{
  "success": true,
  "data": { ... }
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

### 常见错误码

| 错误码 | HTTP状态 | 说明 |
|-------|---------|------|
| UNAUTHORIZED | 401 | 未登录或Token过期 |
| FORBIDDEN | 403 | 权限不足 |
| NOT_FOUND | 404 | 资源不存在 |
| VALIDATION_ERROR | 400 | 参数验证失败 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |

---

*文档生成时间: 2026-02-04*
*适用版本: v0.1.0*
