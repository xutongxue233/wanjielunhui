# 万界轮回 - 后端系统设计文档

## 一、技术选型

| 类别 | 技术 | 说明 |
|-----|------|------|
| 运行时 | Node.js 20+ | LTS版本，性能稳定 |
| 框架 | Fastify | 高性能，TypeScript友好 |
| 数据库 | PostgreSQL 16 | 支持JSONB，适合游戏数据 |
| ORM | Prisma | 类型安全，迁移方便 |
| 缓存 | Redis | 排行榜、会话、实时数据 |
| 实时通信 | Socket.IO | 实时对战、消息推送 |
| 认证 | JWT + Refresh Token | 无状态认证 |
| 文档 | Swagger/OpenAPI | 自动生成API文档 |
| 测试 | Vitest | 与前端统一 |
| 部署 | Docker + Docker Compose | 容器化部署 |

---

## 二、项目结构

```
server/
├── src/
│   ├── app.ts                    # 应用入口
│   ├── config/
│   │   ├── index.ts              # 配置加载
│   │   ├── database.ts           # 数据库配置
│   │   └── redis.ts              # Redis配置
│   │
│   ├── modules/                  # 业务模块
│   │   ├── auth/                 # 认证模块
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.schema.ts
│   │   │   └── auth.routes.ts
│   │   │
│   │   ├── player/               # 玩家模块
│   │   │   ├── player.controller.ts
│   │   │   ├── player.service.ts
│   │   │   ├── player.schema.ts
│   │   │   └── player.routes.ts
│   │   │
│   │   ├── save/                 # 存档模块
│   │   │   ├── save.controller.ts
│   │   │   ├── save.service.ts
│   │   │   └── save.routes.ts
│   │   │
│   │   ├── combat/               # 战斗模块
│   │   │   ├── combat.controller.ts
│   │   │   ├── combat.service.ts
│   │   │   ├── combat.validator.ts   # 战斗校验（防作弊）
│   │   │   └── combat.routes.ts
│   │   │
│   │   ├── ranking/              # 排行榜模块
│   │   │   ├── ranking.controller.ts
│   │   │   ├── ranking.service.ts
│   │   │   └── ranking.routes.ts
│   │   │
│   │   ├── social/               # 社交模块
│   │   │   ├── friend/           # 好友系统
│   │   │   ├── sect/             # 门派系统
│   │   │   ├── chat/             # 聊天系统
│   │   │   └── mail/             # 邮件系统
│   │   │
│   │   ├── trade/                # 交易模块
│   │   │   ├── market/           # 交易市场
│   │   │   └── auction/          # 拍卖行
│   │   │
│   │   ├── pvp/                  # PVP模块
│   │   │   ├── arena/            # 竞技场
│   │   │   └── realtime/         # 实时对战
│   │   │
│   │   └── admin/                # 运营后台
│   │       ├── dashboard/        # 数据看板
│   │       ├── announcement/     # 公告管理
│   │       ├── activity/         # 活动管理
│   │       └── user-manage/      # 用户管理
│   │
│   ├── shared/                   # 共享代码
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rateLimit.middleware.ts
│   │   │   └── errorHandler.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── crypto.ts         # 加密工具
│   │   │   ├── validator.ts      # 数据校验
│   │   │   └── gameLogic.ts      # 游戏逻辑校验
│   │   │
│   │   └── types/
│   │       └── index.ts          # 共享类型
│   │
│   ├── socket/                   # WebSocket
│   │   ├── index.ts
│   │   ├── handlers/
│   │   │   ├── chat.handler.ts
│   │   │   ├── pvp.handler.ts
│   │   │   └── notification.handler.ts
│   │   └── rooms/
│   │       └── manager.ts
│   │
│   └── jobs/                     # 定时任务
│       ├── rankingUpdate.ts      # 排行榜刷新
│       ├── dailyReset.ts         # 每日重置
│       └── activityScheduler.ts  # 活动调度
│
├── prisma/
│   ├── schema.prisma             # 数据库模型
│   └── migrations/               # 迁移文件
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 三、数据库设计

### 3.1 ER图概览

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────<│   Player    │────<│  GameSave   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│   Friend    │     │   Ranking   │
└─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Sect     │────<│ SectMember  │     │   Market    │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
┌─────────────┐     ┌─────────────┐            │
│    Mail     │     │    Chat     │            ▼
└─────────────┘     └─────────────┘     ┌─────────────┐
                                        │  TradeLog   │
┌─────────────┐     ┌─────────────┐     └─────────────┘
│  Activity   │     │Announcement │
└─────────────┘     └─────────────┘
```

### 3.2 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== 用户与认证 ====================

model User {
  id            String    @id @default(uuid())
  username      String    @unique @db.VarChar(32)
  email         String    @unique @db.VarChar(255)
  passwordHash  String    @db.VarChar(255)

  // 账号状态
  status        UserStatus @default(ACTIVE)
  role          UserRole   @default(PLAYER)

  // 登录信息
  lastLoginAt   DateTime?
  lastLoginIp   String?    @db.VarChar(45)
  loginCount    Int        @default(0)

  // 时间戳
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  // 关联
  player        Player?
  refreshTokens RefreshToken[]

  @@index([email])
  @@index([username])
}

model RefreshToken {
  id          String   @id @default(uuid())
  token       String   @unique @db.VarChar(500)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  deviceInfo  String?  @db.VarChar(255)
  expiresAt   DateTime
  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([token])
}

enum UserStatus {
  ACTIVE
  BANNED
  SUSPENDED
}

enum UserRole {
  PLAYER
  GM
  ADMIN
}

// ==================== 玩家数据 ====================

model Player {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // 基础信息
  name            String   @db.VarChar(32)
  title           String?  @db.VarChar(64)   // 称号
  avatarId        Int      @default(1)

  // 修炼数据
  realm           String   @default("炼气") @db.VarChar(32)
  realmStage      String   @default("初期") @db.VarChar(32)
  cultivation     BigInt   @default(0)       // 当前修为
  totalCultivation BigInt  @default(0)       // 历史总修为

  // 属性
  health          Int      @default(100)
  maxHealth       Int      @default(100)
  attack          Int      @default(10)
  defense         Int      @default(5)
  speed           Int      @default(10)
  critRate        Float    @default(0.05)
  critDamage      Float    @default(1.5)

  // 灵根
  spiritualRoot   Json     // { type: string, quality: string, purity: number }

  // 资源
  spiritStones    BigInt   @default(0)      // 灵石
  destinyPoints   Int      @default(0)      // 天命点

  // 统计
  combatPower     BigInt   @default(0)      // 战力值
  pvpRating       Int      @default(1000)   // PVP积分
  reincarnations  Int      @default(0)      // 轮回次数

  // VIP
  vipLevel        Int      @default(0)
  vipExpireAt     DateTime?

  // 时间戳
  lastActiveAt    DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // 关联
  gameSaves       GameSave[]
  rankings        Ranking[]
  sentFriendReqs  FriendRequest[] @relation("SentRequests")
  recvFriendReqs  FriendRequest[] @relation("ReceivedRequests")
  friends         Friend[]        @relation("PlayerFriends")
  friendOf        Friend[]        @relation("FriendOfPlayer")
  sectMember      SectMember?
  sentMails       Mail[]          @relation("SentMails")
  receivedMails   Mail[]          @relation("ReceivedMails")
  marketListings  MarketListing[]
  tradeHistory    TradeLog[]
  pvpMatches      PvpMatch[]      @relation("PvpPlayer")
  pvpOpponents    PvpMatch[]      @relation("PvpOpponent")

  @@index([realm, combatPower])
  @@index([pvpRating])
}

// ==================== 存档系统 ====================

model GameSave {
  id          String   @id @default(uuid())
  playerId    String
  player      Player   @relation(fields: [playerId], references: [id], onDelete: Cascade)

  slot        Int      @default(1)          // 存档槽位 1-3
  name        String   @db.VarChar(64)      // 存档名称

  // 存档数据 (JSONB)
  playerData  Json     // 玩家状态
  gameData    Json     // 游戏进度
  alchemyData Json     // 炼丹数据
  discipleData Json    // 弟子数据
  roguelikeData Json   // 秘境数据

  // 存档元信息
  playTime    Int      @default(0)          // 游戏时长(秒)
  checkpoint  String?  @db.VarChar(255)     // 当前进度描述

  // 校验
  checksum    String   @db.VarChar(64)      // 数据校验和
  version     Int      @default(1)          // 存档版本

  // 时间戳
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([playerId, slot])
  @@index([playerId])
}

// ==================== 排行榜 ====================

model Ranking {
  id          String      @id @default(uuid())
  playerId    String
  player      Player      @relation(fields: [playerId], references: [id], onDelete: Cascade)

  type        RankingType
  score       BigInt
  rank        Int?

  // 快照数据（用于显示）
  snapshot    Json        // { name, realm, title, avatarId }

  seasonId    Int?        // 赛季ID（用于PVP排行）

  updatedAt   DateTime    @updatedAt

  @@unique([playerId, type, seasonId])
  @@index([type, score(sort: Desc)])
}

enum RankingType {
  COMBAT_POWER      // 战力排行
  REALM             // 境界排行
  REINCARNATION     // 轮回次数
  PVP_RATING        // PVP积分
  WEALTH            // 财富排行
  SECT              // 门派贡献
}

// ==================== 好友系统 ====================

model FriendRequest {
  id          String              @id @default(uuid())
  senderId    String
  sender      Player              @relation("SentRequests", fields: [senderId], references: [id], onDelete: Cascade)
  receiverId  String
  receiver    Player              @relation("ReceivedRequests", fields: [receiverId], references: [id], onDelete: Cascade)

  status      FriendRequestStatus @default(PENDING)
  message     String?             @db.VarChar(255)

  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt

  @@unique([senderId, receiverId])
  @@index([receiverId, status])
}

enum FriendRequestStatus {
  PENDING
  ACCEPTED
  REJECTED
}

model Friend {
  id          String   @id @default(uuid())
  playerId    String
  player      Player   @relation("PlayerFriends", fields: [playerId], references: [id], onDelete: Cascade)
  friendId    String
  friend      Player   @relation("FriendOfPlayer", fields: [friendId], references: [id], onDelete: Cascade)

  // 亲密度
  intimacy    Int      @default(0)

  // 备注
  remark      String?  @db.VarChar(32)

  createdAt   DateTime @default(now())

  @@unique([playerId, friendId])
  @@index([playerId])
}

// ==================== 门派系统 ====================

model Sect {
  id              String   @id @default(uuid())
  name            String   @unique @db.VarChar(32)

  // 门派信息
  description     String?  @db.VarChar(500)
  notice          String?  @db.VarChar(500)   // 公告
  iconId          Int      @default(1)

  // 门派属性
  level           Int      @default(1)
  experience      BigInt   @default(0)
  fund            BigInt   @default(0)        // 门派资金

  // 门派设置
  joinType        SectJoinType @default(APPROVAL)
  minRealmToJoin  String?  @db.VarChar(32)    // 加入最低境界

  // 统计
  memberCount     Int      @default(1)
  maxMembers      Int      @default(50)
  totalPower      BigInt   @default(0)        // 总战力

  // 创建者
  founderId       String

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // 关联
  members         SectMember[]
  applications    SectApplication[]

  @@index([totalPower(sort: Desc)])
}

enum SectJoinType {
  OPEN        // 自由加入
  APPROVAL    // 需要审批
  INVITE_ONLY // 仅限邀请
}

model SectMember {
  id          String       @id @default(uuid())
  sectId      String
  sect        Sect         @relation(fields: [sectId], references: [id], onDelete: Cascade)
  playerId    String       @unique
  player      Player       @relation(fields: [playerId], references: [id], onDelete: Cascade)

  role        SectRole     @default(MEMBER)
  contribution BigInt      @default(0)        // 贡献值

  joinedAt    DateTime     @default(now())

  @@index([sectId, contribution(sort: Desc)])
}

enum SectRole {
  LEADER      // 掌门
  ELDER       // 长老
  DEACON      // 执事
  MEMBER      // 弟子
}

model SectApplication {
  id          String   @id @default(uuid())
  sectId      String
  sect        Sect     @relation(fields: [sectId], references: [id], onDelete: Cascade)
  playerId    String

  message     String?  @db.VarChar(255)
  status      String   @default("PENDING") @db.VarChar(20)

  createdAt   DateTime @default(now())

  @@unique([sectId, playerId])
}

// ==================== 邮件系统 ====================

model Mail {
  id          String    @id @default(uuid())

  // 发送者（null表示系统邮件）
  senderId    String?
  sender      Player?   @relation("SentMails", fields: [senderId], references: [id], onDelete: SetNull)

  // 接收者
  receiverId  String
  receiver    Player    @relation("ReceivedMails", fields: [receiverId], references: [id], onDelete: Cascade)

  // 邮件内容
  type        MailType  @default(NORMAL)
  title       String    @db.VarChar(64)
  content     String    @db.VarChar(1000)

  // 附件
  attachments Json?     // [{ type, itemId, amount }]

  // 状态
  isRead      Boolean   @default(false)
  isClaimed   Boolean   @default(false)     // 附件是否领取

  // 过期时间
  expiresAt   DateTime?

  createdAt   DateTime  @default(now())

  @@index([receiverId, isRead])
  @@index([receiverId, createdAt(sort: Desc)])
}

enum MailType {
  NORMAL      // 普通邮件
  SYSTEM      // 系统邮件
  REWARD      // 奖励邮件
  TRADE       // 交易邮件
}

// ==================== 交易市场 ====================

model MarketListing {
  id          String        @id @default(uuid())
  sellerId    String
  seller      Player        @relation(fields: [sellerId], references: [id], onDelete: Cascade)

  // 物品信息
  itemType    String        @db.VarChar(32)   // equipment, material, pill, etc.
  itemId      String        @db.VarChar(64)
  itemData    Json          // 物品详细数据
  amount      Int           @default(1)

  // 价格
  price       BigInt
  currency    String        @default("spiritStones") @db.VarChar(32)

  // 状态
  status      ListingStatus @default(ACTIVE)

  // 时间
  expiresAt   DateTime
  createdAt   DateTime      @default(now())
  soldAt      DateTime?

  @@index([itemType, status])
  @@index([status, price])
  @@index([sellerId])
}

enum ListingStatus {
  ACTIVE
  SOLD
  CANCELLED
  EXPIRED
}

model TradeLog {
  id          String   @id @default(uuid())

  // 交易双方
  sellerId    String?
  buyerId     String
  buyer       Player   @relation(fields: [buyerId], references: [id], onDelete: Cascade)

  // 交易内容
  listingId   String?
  itemType    String   @db.VarChar(32)
  itemId      String   @db.VarChar(64)
  itemData    Json
  amount      Int

  // 价格
  price       BigInt
  currency    String   @db.VarChar(32)

  // 税费
  fee         BigInt   @default(0)

  createdAt   DateTime @default(now())

  @@index([buyerId, createdAt(sort: Desc)])
  @@index([sellerId, createdAt(sort: Desc)])
}

// ==================== PVP系统 ====================

model PvpMatch {
  id          String      @id @default(uuid())

  playerId    String
  player      Player      @relation("PvpPlayer", fields: [playerId], references: [id], onDelete: Cascade)
  opponentId  String
  opponent    Player      @relation("PvpOpponent", fields: [opponentId], references: [id], onDelete: Cascade)

  // 结果
  winnerId    String?
  result      PvpResult

  // 积分变化
  playerRatingChange   Int
  opponentRatingChange Int

  // 战斗数据
  battleLog   Json        // 战斗回放数据
  duration    Int         // 战斗时长(秒)

  // 赛季
  seasonId    Int

  createdAt   DateTime    @default(now())

  @@index([playerId, seasonId])
  @@index([seasonId, createdAt(sort: Desc)])
}

enum PvpResult {
  WIN
  LOSE
  DRAW
}

model PvpSeason {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(64)

  startAt     DateTime
  endAt       DateTime

  // 奖励配置
  rewards     Json     // [{ minRank, maxRank, rewards }]

  isActive    Boolean  @default(false)

  createdAt   DateTime @default(now())
}

// ==================== 运营系统 ====================

model Announcement {
  id          String   @id @default(uuid())

  title       String   @db.VarChar(128)
  content     String   @db.Text
  type        String   @default("normal") @db.VarChar(32) // normal, urgent, maintenance

  // 显示控制
  priority    Int      @default(0)
  isActive    Boolean  @default(true)

  startAt     DateTime @default(now())
  endAt       DateTime?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([isActive, priority(sort: Desc)])
}

model Activity {
  id          String   @id @default(uuid())

  name        String   @db.VarChar(64)
  description String   @db.VarChar(500)
  type        String   @db.VarChar(32)      // signin, double_exp, boss, etc.

  // 活动配置
  config      Json

  // 时间
  startAt     DateTime
  endAt       DateTime

  isActive    Boolean  @default(false)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([isActive, startAt])
}

model ActivityProgress {
  id          String   @id @default(uuid())
  activityId  String
  playerId    String

  progress    Json     // 活动进度数据
  rewards     Json?    // 已领取奖励

  updatedAt   DateTime @updatedAt

  @@unique([activityId, playerId])
}

// ==================== 聊天记录 ====================

model ChatMessage {
  id          String      @id @default(uuid())

  channel     ChatChannel
  channelId   String?     // 门派ID或私聊对象ID

  senderId    String
  senderName  String      @db.VarChar(32)
  senderRealm String      @db.VarChar(32)

  content     String      @db.VarChar(500)

  createdAt   DateTime    @default(now())

  @@index([channel, channelId, createdAt(sort: Desc)])
  @@index([createdAt])
}

enum ChatChannel {
  WORLD       // 世界频道
  SECT        // 门派频道
  PRIVATE     // 私聊
}

// ==================== 操作日志 ====================

model OperationLog {
  id          String   @id @default(uuid())

  userId      String?
  playerId    String?

  action      String   @db.VarChar(64)
  target      String?  @db.VarChar(64)
  details     Json?

  ip          String?  @db.VarChar(45)
  userAgent   String?  @db.VarChar(255)

  createdAt   DateTime @default(now())

  @@index([userId, createdAt(sort: Desc)])
  @@index([action, createdAt(sort: Desc)])
}
```

---

## 四、API设计

### 4.1 API规范

- RESTful风格
- 统一响应格式
- JWT认证
- 版本控制 `/api/v1/`

### 4.2 响应格式

```typescript
// 成功响应
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100
  }
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_TOKEN",
    "message": "Token已过期",
    "details": { ... }
  }
}
```

### 4.3 API列表

#### 认证模块 `/api/v1/auth`

| 方法 | 路径 | 说明 |
|-----|------|------|
| POST | `/register` | 注册账号 |
| POST | `/login` | 登录 |
| POST | `/logout` | 登出 |
| POST | `/refresh` | 刷新Token |
| POST | `/password/reset` | 重置密码 |
| GET | `/me` | 获取当前用户信息 |

#### 玩家模块 `/api/v1/player`

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/profile` | 获取玩家信息 |
| PUT | `/profile` | 更新玩家信息 |
| GET | `/:id` | 查看其他玩家 |
| POST | `/sync` | 同步游戏数据 |

#### 存档模块 `/api/v1/save`

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/list` | 获取存档列表 |
| GET | `/:slot` | 获取指定存档 |
| POST | `/:slot` | 保存存档 |
| DELETE | `/:slot` | 删除存档 |
| POST | `/upload` | 上传本地存档 |
| GET | `/download/:slot` | 下载存档 |

#### 排行榜模块 `/api/v1/ranking`

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/:type` | 获取排行榜 |
| GET | `/:type/me` | 获取自己排名 |
| GET | `/:type/around` | 获取周围排名 |

#### 好友模块 `/api/v1/friend`

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/list` | 好友列表 |
| POST | `/request` | 发送好友请求 |
| GET | `/requests` | 好友请求列表 |
| POST | `/accept/:id` | 接受请求 |
| POST | `/reject/:id` | 拒绝请求 |
| DELETE | `/:id` | 删除好友 |

#### 门派模块 `/api/v1/sect`

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/list` | 门派列表 |
| POST | `/create` | 创建门派 |
| GET | `/:id` | 门派详情 |
| PUT | `/:id` | 更新门派信息 |
| POST | `/:id/join` | 申请加入 |
| POST | `/:id/leave` | 离开门派 |
| GET | `/:id/members` | 成员列表 |
| POST | `/:id/kick/:playerId` | 踢出成员 |
| POST | `/:id/promote/:playerId` | 晋升成员 |

#### 邮件模块 `/api/v1/mail`

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/list` | 邮件列表 |
| GET | `/:id` | 邮件详情 |
| POST | `/send` | 发送邮件 |
| POST | `/:id/read` | 标记已读 |
| POST | `/:id/claim` | 领取附件 |
| DELETE | `/:id` | 删除邮件 |

#### 交易市场 `/api/v1/market`

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/listings` | 商品列表 |
| POST | `/list` | 上架商品 |
| POST | `/buy/:id` | 购买商品 |
| POST | `/cancel/:id` | 取消上架 |
| GET | `/my-listings` | 我的上架 |
| GET | `/history` | 交易记录 |

#### PVP模块 `/api/v1/pvp`

| 方法 | 路径 | 说明 |
|-----|------|------|
| POST | `/match` | 开始匹配 |
| POST | `/cancel-match` | 取消匹配 |
| POST | `/battle/:id/action` | 战斗行动 |
| POST | `/battle/:id/surrender` | 投降 |
| GET | `/history` | 战斗记录 |
| GET | `/season` | 当前赛季信息 |

#### 聊天模块 `/api/v1/chat`

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/history/:channel` | 聊天记录 |
| POST | `/send` | 发送消息 |

#### 运营模块 `/api/v1/ops`

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/announcements` | 公告列表 |
| GET | `/activities` | 活动列表 |
| GET | `/activity/:id/progress` | 活动进度 |
| POST | `/activity/:id/claim` | 领取奖励 |

#### 管理后台 `/api/v1/admin`

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/dashboard/stats` | 数据统计 |
| GET | `/users` | 用户列表 |
| POST | `/users/:id/ban` | 封禁用户 |
| POST | `/announcements` | 发布公告 |
| POST | `/activities` | 创建活动 |
| POST | `/mail/broadcast` | 群发邮件 |

---

## 五、WebSocket事件

### 5.1 连接

```typescript
// 客户端连接
socket.connect({
  auth: { token: 'jwt_token' }
});
```

### 5.2 事件列表

#### 服务端 -> 客户端

| 事件 | 说明 | 数据 |
|-----|------|------|
| `notification` | 系统通知 | `{ type, title, content }` |
| `mail:new` | 新邮件 | `{ mailId, title }` |
| `friend:request` | 好友请求 | `{ from, message }` |
| `friend:online` | 好友上线 | `{ friendId }` |
| `friend:offline` | 好友下线 | `{ friendId }` |
| `chat:message` | 聊天消息 | `{ channel, sender, content }` |
| `sect:notice` | 门派通知 | `{ type, content }` |
| `pvp:matched` | 匹配成功 | `{ matchId, opponent }` |
| `pvp:action` | 对手行动 | `{ action, result }` |
| `pvp:end` | 战斗结束 | `{ result, ratingChange }` |

#### 客户端 -> 服务端

| 事件 | 说明 | 数据 |
|-----|------|------|
| `chat:send` | 发送聊天 | `{ channel, content }` |
| `pvp:action` | PVP行动 | `{ matchId, action }` |
| `pvp:surrender` | 投降 | `{ matchId }` |

---

## 六、防作弊设计

### 6.1 数据校验

```typescript
// 战斗结果校验
class CombatValidator {
  // 验证伤害计算
  validateDamage(attacker: Player, skill: Skill, damage: number): boolean {
    const expectedDamage = this.calculateExpectedDamage(attacker, skill);
    const tolerance = 0.1; // 10%容差
    return Math.abs(damage - expectedDamage) / expectedDamage <= tolerance;
  }

  // 验证修为获取
  validateCultivation(player: Player, gained: number, duration: number): boolean {
    const maxRate = this.getMaxCultivationRate(player);
    return gained <= maxRate * duration * 1.1;
  }

  // 验证突破
  validateBreakthrough(player: Player, success: boolean): boolean {
    // 服务端重新计算成功率并验证
  }
}
```

### 6.2 存档校验

```typescript
// 存档checksum生成
function generateChecksum(saveData: GameSave): string {
  const key = process.env.SAVE_SECRET_KEY;
  const data = JSON.stringify({
    cultivation: saveData.playerData.cultivation,
    realm: saveData.playerData.realm,
    spiritStones: saveData.playerData.spiritStones,
    timestamp: saveData.updatedAt
  });
  return crypto.createHmac('sha256', key).update(data).digest('hex');
}
```

### 6.3 频率限制

```typescript
// 接口限流配置
const rateLimits = {
  'auth/login': { max: 5, window: '1m' },
  'save/sync': { max: 10, window: '1m' },
  'market/buy': { max: 30, window: '1m' },
  'chat/send': { max: 20, window: '1m' },
};
```

---

## 七、缓存策略

### 7.1 Redis缓存

```typescript
// 缓存Key设计
const CacheKeys = {
  // 玩家在线状态
  playerOnline: (id: string) => `player:online:${id}`,

  // 排行榜
  ranking: (type: string) => `ranking:${type}`,

  // 玩家排名
  playerRank: (type: string, id: string) => `ranking:${type}:player:${id}`,

  // 门派成员
  sectMembers: (sectId: string) => `sect:${sectId}:members`,

  // PVP匹配池
  pvpMatchPool: () => `pvp:match:pool`,

  // 会话
  session: (userId: string) => `session:${userId}`,
};
```

### 7.2 缓存时间

| 数据类型 | TTL | 说明 |
|---------|-----|------|
| 排行榜 | 5分钟 | 定时任务更新 |
| 玩家在线状态 | 5分钟 | 心跳续期 |
| 会话信息 | 7天 | 长期有效 |
| 门派成员 | 10分钟 | 变更时清除 |

---

## 八、定时任务

```typescript
// 任务调度配置
const jobs = [
  {
    name: 'ranking-update',
    cron: '*/5 * * * *',      // 每5分钟
    handler: updateRankings
  },
  {
    name: 'daily-reset',
    cron: '0 0 * * *',        // 每天0点
    handler: dailyReset
  },
  {
    name: 'market-cleanup',
    cron: '0 * * * *',        // 每小时
    handler: cleanupExpiredListings
  },
  {
    name: 'pvp-season-check',
    cron: '0 0 * * *',        // 每天0点
    handler: checkPvpSeason
  },
  {
    name: 'activity-scheduler',
    cron: '* * * * *',        // 每分钟
    handler: checkActivityStatus
  },
];
```

---

## 九、部署架构

### 9.1 Docker Compose

```yaml
# docker/docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/wanjie
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=wanjie
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### 9.2 生产环境架构

```
                    ┌─────────────┐
                    │   Nginx     │
                    │ (负载均衡)   │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
    │  App #1   │    │  App #2   │    │  App #3   │
    │ (Fastify) │    │ (Fastify) │    │ (Fastify) │
    └─────┬─────┘    └─────┬─────┘    └─────┬─────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
    │ PostgreSQL│    │   Redis   │    │   Redis   │
    │ (Primary) │    │ (Master)  │    │ (Replica) │
    └───────────┘    └───────────┘    └───────────┘
```

---

## 十、开发计划

### 第一阶段：基础架构（1-2周）

- [ ] 项目初始化与配置
- [ ] 数据库Schema设计与迁移
- [ ] 认证模块实现
- [ ] 玩家模块实现
- [ ] 存档模块实现

### 第二阶段：核心功能（2-3周）

- [ ] 排行榜系统
- [ ] 好友系统
- [ ] 邮件系统
- [ ] 数据同步与校验

### 第三阶段：社交功能（2-3周）

- [ ] 门派系统
- [ ] 聊天系统
- [ ] WebSocket实现

### 第四阶段：交易与PVP（2-3周）

- [ ] 交易市场
- [ ] PVP匹配系统
- [ ] 实时对战

### 第五阶段：运营系统（1-2周）

- [ ] 公告系统
- [ ] 活动系统
- [ ] 管理后台

### 第六阶段：优化与部署（1周）

- [ ] 性能优化
- [ ] 安全加固
- [ ] Docker部署
- [ ] 监控配置

---

## 十一、环境变量

```env
# .env.example

# 应用配置
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1

# 数据库
DATABASE_URL=postgresql://postgres:password@localhost:5432/wanjie

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# 存档加密
SAVE_SECRET_KEY=your-save-secret-key

# 限流
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000

# 日志
LOG_LEVEL=info

# 管理员
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

---

## 总结

本设计文档涵盖了万界轮回游戏后端的完整架构，包括：

1. **技术选型**：Node.js + Fastify + PostgreSQL + Redis
2. **数据库设计**：完整的Prisma Schema，支持用户、玩家、存档、社交、交易、PVP等
3. **API设计**：RESTful接口，覆盖所有业务模块
4. **实时通信**：Socket.IO支持聊天和PVP
5. **安全机制**：防作弊、数据校验、频率限制
6. **运维部署**：Docker容器化，支持水平扩展

预计完整开发周期：**8-12周**
