# 万界轮回 - 后端开发任务清单

## 任务概览

| 阶段 | 任务数 | 状态 |
|-----|--------|------|
| 阶段一：项目初始化 | 8 | 待开始 |
| 阶段二：认证模块 | 6 | 待开始 |
| 阶段三：玩家与存档 | 7 | 待开始 |
| 阶段四：排行榜系统 | 5 | 待开始 |
| 阶段五：好友系统 | 5 | 待开始 |
| 阶段六：邮件系统 | 4 | 待开始 |
| 阶段七：门派系统 | 6 | 待开始 |
| 阶段八：聊天系统 | 4 | 待开始 |
| 阶段九：交易市场 | 5 | 待开始 |
| 阶段十：PVP系统 | 6 | 待开始 |
| 阶段十一：运营系统 | 5 | 待开始 |
| 阶段十二：部署与优化 | 6 | 待开始 |
| **总计** | **67** | |

---

## 阶段一：项目初始化

### 任务 1.1：创建项目结构
- **描述**：初始化Node.js项目，配置TypeScript、ESLint、Prettier
- **交付物**：
  - `server/package.json` - 依赖配置
  - `server/tsconfig.json` - TypeScript配置
  - `server/.eslintrc.js` - ESLint配置
  - `server/.prettierrc` - Prettier配置
- **验收标准**：`npm run build` 编译成功
- **状态**：[ ] 待开始

### 任务 1.2：安装核心依赖
- **描述**：安装Fastify、Prisma、Redis等核心依赖
- **依赖包**：
  ```
  fastify @fastify/cors @fastify/jwt @fastify/cookie @fastify/rate-limit
  @fastify/swagger @fastify/swagger-ui @fastify/websocket
  @prisma/client prisma
  ioredis
  zod
  bcrypt uuid
  socket.io
  node-cron
  pino pino-pretty
  dotenv
  ```
- **验收标准**：所有依赖安装成功，无版本冲突
- **状态**：[ ] 待开始

### 任务 1.3：配置环境变量
- **描述**：创建环境变量配置和加载逻辑
- **交付物**：
  - `server/.env.example` - 环境变量模板
  - `server/.env.development` - 开发环境配置
  - `server/src/config/index.ts` - 配置加载模块
  - `server/src/config/env.ts` - 环境变量验证
- **验收标准**：配置加载正确，缺失必要变量时报错
- **状态**：[ ] 待开始

### 任务 1.4：设置Prisma数据库
- **描述**：初始化Prisma，创建数据库Schema
- **交付物**：
  - `server/prisma/schema.prisma` - 完整数据模型
  - `server/src/lib/prisma.ts` - Prisma客户端实例
- **验收标准**：`npx prisma db push` 成功创建表
- **状态**：[ ] 待开始

### 任务 1.5：配置Redis连接
- **描述**：创建Redis连接管理模块
- **交付物**：
  - `server/src/lib/redis.ts` - Redis客户端
  - `server/src/lib/cache.ts` - 缓存工具函数
- **验收标准**：Redis连接成功，基础读写测试通过
- **状态**：[ ] 待开始

### 任务 1.6：创建Fastify应用
- **描述**：配置Fastify实例，注册插件
- **交付物**：
  - `server/src/app.ts` - Fastify应用配置
  - `server/src/server.ts` - 服务器启动入口
  - `server/src/plugins/` - 插件目录
- **验收标准**：服务器启动成功，访问健康检查端点返回200
- **状态**：[ ] 待开始

### 任务 1.7：配置错误处理
- **描述**：创建统一错误处理机制
- **交付物**：
  - `server/src/shared/errors/index.ts` - 错误类定义
  - `server/src/shared/errors/codes.ts` - 错误码常量
  - `server/src/plugins/errorHandler.ts` - 错误处理插件
- **验收标准**：错误响应格式统一，包含错误码和消息
- **状态**：[ ] 待开始

### 任务 1.8：配置日志系统
- **描述**：配置Pino日志，区分开发和生产环境
- **交付物**：
  - `server/src/lib/logger.ts` - 日志配置
- **验收标准**：日志输出正常，开发环境美化输出
- **状态**：[ ] 待开始

---

## 阶段二：认证模块

### 任务 2.1：实现用户注册
- **描述**：创建用户注册接口
- **接口**：`POST /api/v1/auth/register`
- **交付物**：
  - `server/src/modules/auth/auth.schema.ts` - 请求/响应Schema
  - `server/src/modules/auth/auth.service.ts` - 业务逻辑
  - `server/src/modules/auth/auth.controller.ts` - 控制器
  - `server/src/modules/auth/auth.routes.ts` - 路由配置
- **验收标准**：
  - 用户名/邮箱唯一性校验
  - 密码加密存储
  - 注册成功返回用户信息
- **状态**：[ ] 待开始

### 任务 2.2：实现用户登录
- **描述**：创建用户登录接口，返回JWT
- **接口**：`POST /api/v1/auth/login`
- **交付物**：
  - 登录逻辑实现
  - JWT生成逻辑
  - Refresh Token生成与存储
- **验收标准**：
  - 账号密码验证正确
  - 返回Access Token和Refresh Token
  - 记录登录信息
- **状态**：[ ] 待开始

### 任务 2.3：实现Token刷新
- **描述**：创建Token刷新接口
- **接口**：`POST /api/v1/auth/refresh`
- **交付物**：
  - Refresh Token验证逻辑
  - 新Token生成逻辑
- **验收标准**：
  - 有效Refresh Token可获取新Access Token
  - 过期Token返回401
  - Token轮换机制
- **状态**：[ ] 待开始

### 任务 2.4：实现登出
- **描述**：创建登出接口，清除Token
- **接口**：`POST /api/v1/auth/logout`
- **交付物**：
  - Refresh Token删除逻辑
  - Token黑名单机制（可选）
- **验收标准**：登出后Refresh Token失效
- **状态**：[ ] 待开始

### 任务 2.5：创建认证中间件
- **描述**：创建JWT验证中间件
- **交付物**：
  - `server/src/shared/middleware/auth.middleware.ts`
- **验收标准**：
  - 无Token返回401
  - 无效Token返回401
  - 有效Token解析用户信息
- **状态**：[ ] 待开始

### 任务 2.6：实现获取当前用户
- **描述**：创建获取当前用户信息接口
- **接口**：`GET /api/v1/auth/me`
- **验收标准**：返回当前登录用户完整信息
- **状态**：[ ] 待开始

---

## 阶段三：玩家与存档模块

### 任务 3.1：实现玩家创建
- **描述**：用户注册后自动创建玩家角色
- **交付物**：
  - `server/src/modules/player/player.service.ts`
  - `server/src/modules/player/player.controller.ts`
  - `server/src/modules/player/player.routes.ts`
- **验收标准**：
  - 用户注册时自动创建Player记录
  - 初始化默认属性
- **状态**：[ ] 待开始

### 任务 3.2：实现玩家信息查询
- **描述**：查询自己和其他玩家信息
- **接口**：
  - `GET /api/v1/player/profile` - 查询自己
  - `GET /api/v1/player/:id` - 查询他人
- **验收标准**：
  - 自己可查看完整信息
  - 他人仅返回公开信息
- **状态**：[ ] 待开始

### 任务 3.3：实现玩家信息更新
- **描述**：更新玩家昵称、头像等
- **接口**：`PUT /api/v1/player/profile`
- **验收标准**：
  - 名称唯一性校验
  - 敏感词过滤
- **状态**：[ ] 待开始

### 任务 3.4：实现存档列表查询
- **描述**：获取玩家所有存档
- **接口**：`GET /api/v1/save/list`
- **交付物**：
  - `server/src/modules/save/save.service.ts`
  - `server/src/modules/save/save.controller.ts`
  - `server/src/modules/save/save.routes.ts`
- **验收标准**：返回存档列表，包含元信息
- **状态**：[ ] 待开始

### 任务 3.5：实现存档保存
- **描述**：上传存档到服务器
- **接口**：`POST /api/v1/save/:slot`
- **验收标准**：
  - 数据完整性校验
  - Checksum验证
  - 覆盖已有存档
- **状态**：[ ] 待开始

### 任务 3.6：实现存档读取
- **描述**：下载指定存档
- **接口**：`GET /api/v1/save/:slot`
- **验收标准**：返回完整存档数据
- **状态**：[ ] 待开始

### 任务 3.7：实现存档删除
- **描述**：删除指定存档
- **接口**：`DELETE /api/v1/save/:slot`
- **验收标准**：存档删除成功
- **状态**：[ ] 待开始

---

## 阶段四：排行榜系统

### 任务 4.1：设计排行榜数据结构
- **描述**：设计Redis排行榜数据结构
- **交付物**：
  - `server/src/modules/ranking/ranking.service.ts`
  - `server/src/modules/ranking/ranking.types.ts`
- **验收标准**：支持多种排行榜类型
- **状态**：[ ] 待开始

### 任务 4.2：实现排行榜更新
- **描述**：玩家数据变化时更新排行榜
- **交付物**：
  - 排行榜更新逻辑
  - 定时同步任务
- **验收标准**：
  - 数据变化触发更新
  - 定时全量同步
- **状态**：[ ] 待开始

### 任务 4.3：实现排行榜查询
- **描述**：查询排行榜数据
- **接口**：`GET /api/v1/ranking/:type`
- **参数**：`page`, `pageSize`
- **验收标准**：
  - 分页查询
  - 返回玩家快照信息
- **状态**：[ ] 待开始

### 任务 4.4：实现自己排名查询
- **描述**：查询自己在排行榜中的位置
- **接口**：`GET /api/v1/ranking/:type/me`
- **验收标准**：返回自己的排名和分数
- **状态**：[ ] 待开始

### 任务 4.5：实现周围排名查询
- **描述**：查询自己排名附近的玩家
- **接口**：`GET /api/v1/ranking/:type/around`
- **验收标准**：返回上下各N名玩家
- **状态**：[ ] 待开始

---

## 阶段五：好友系统

### 任务 5.1：实现发送好友请求
- **描述**：向其他玩家发送好友请求
- **接口**：`POST /api/v1/friend/request`
- **交付物**：
  - `server/src/modules/social/friend/friend.service.ts`
  - `server/src/modules/social/friend/friend.controller.ts`
  - `server/src/modules/social/friend/friend.routes.ts`
- **验收标准**：
  - 不能重复发送
  - 不能添加自己
  - 已是好友不能再发送
- **状态**：[ ] 待开始

### 任务 5.2：实现好友请求列表
- **描述**：查询收到的好友请求
- **接口**：`GET /api/v1/friend/requests`
- **验收标准**：返回待处理的请求列表
- **状态**：[ ] 待开始

### 任务 5.3：实现接受/拒绝好友请求
- **描述**：处理好友请求
- **接口**：
  - `POST /api/v1/friend/accept/:id`
  - `POST /api/v1/friend/reject/:id`
- **验收标准**：
  - 接受后双方互为好友
  - 拒绝后请求删除
- **状态**：[ ] 待开始

### 任务 5.4：实现好友列表
- **描述**：查询好友列表
- **接口**：`GET /api/v1/friend/list`
- **验收标准**：
  - 返回好友列表
  - 包含在线状态
- **状态**：[ ] 待开始

### 任务 5.5：实现删除好友
- **描述**：删除好友关系
- **接口**：`DELETE /api/v1/friend/:id`
- **验收标准**：双向删除好友关系
- **状态**：[ ] 待开始

---

## 阶段六：邮件系统

### 任务 6.1：实现发送邮件
- **描述**：玩家之间发送邮件
- **接口**：`POST /api/v1/mail/send`
- **交付物**：
  - `server/src/modules/social/mail/mail.service.ts`
  - `server/src/modules/social/mail/mail.controller.ts`
  - `server/src/modules/social/mail/mail.routes.ts`
- **验收标准**：
  - 邮件发送成功
  - 支持附件
- **状态**：[ ] 待开始

### 任务 6.2：实现邮件列表
- **描述**：查询收件箱
- **接口**：`GET /api/v1/mail/list`
- **验收标准**：
  - 分页查询
  - 按时间排序
  - 显示未读数量
- **状态**：[ ] 待开始

### 任务 6.3：实现邮件详情与标记已读
- **描述**：查看邮件详情
- **接口**：
  - `GET /api/v1/mail/:id`
  - `POST /api/v1/mail/:id/read`
- **验收标准**：查看后自动标记已读
- **状态**：[ ] 待开始

### 任务 6.4：实现领取附件
- **描述**：领取邮件附件
- **接口**：`POST /api/v1/mail/:id/claim`
- **验收标准**：
  - 附件发放到玩家背包
  - 标记已领取
  - 不能重复领取
- **状态**：[ ] 待开始

---

## 阶段七：门派系统

### 任务 7.1：实现创建门派
- **描述**：玩家创建门派
- **接口**：`POST /api/v1/sect/create`
- **交付物**：
  - `server/src/modules/social/sect/sect.service.ts`
  - `server/src/modules/social/sect/sect.controller.ts`
  - `server/src/modules/social/sect/sect.routes.ts`
- **验收标准**：
  - 扣除创建费用
  - 名称唯一
  - 创建者成为掌门
- **状态**：[ ] 待开始

### 任务 7.2：实现门派列表与详情
- **描述**：查询门派列表和详情
- **接口**：
  - `GET /api/v1/sect/list`
  - `GET /api/v1/sect/:id`
- **验收标准**：
  - 支持按战力、等级排序
  - 详情包含成员数、公告等
- **状态**：[ ] 待开始

### 任务 7.3：实现申请加入门派
- **描述**：玩家申请加入门派
- **接口**：`POST /api/v1/sect/:id/join`
- **验收标准**：
  - 检查境界要求
  - 检查是否已有门派
  - 根据门派设置处理
- **状态**：[ ] 待开始

### 任务 7.4：实现审批申请
- **描述**：管理层审批入门申请
- **接口**：
  - `GET /api/v1/sect/:id/applications`
  - `POST /api/v1/sect/:id/approve/:playerId`
  - `POST /api/v1/sect/:id/reject/:playerId`
- **验收标准**：
  - 仅掌门/长老可审批
  - 检查人数上限
- **状态**：[ ] 待开始

### 任务 7.5：实现门派管理
- **描述**：门派设置、晋升、踢出
- **接口**：
  - `PUT /api/v1/sect/:id` - 更新门派信息
  - `POST /api/v1/sect/:id/promote/:playerId` - 晋升
  - `POST /api/v1/sect/:id/kick/:playerId` - 踢出
- **验收标准**：
  - 权限校验
  - 不能踢出掌门
- **状态**：[ ] 待开始

### 任务 7.6：实现离开门派
- **描述**：玩家主动离开门派
- **接口**：`POST /api/v1/sect/:id/leave`
- **验收标准**：
  - 掌门不能直接离开
  - 清除门派成员记录
- **状态**：[ ] 待开始

---

## 阶段八：聊天系统

### 任务 8.1：配置Socket.IO
- **描述**：集成Socket.IO到Fastify
- **交付物**：
  - `server/src/socket/index.ts`
  - `server/src/socket/auth.ts` - Socket认证
- **验收标准**：
  - WebSocket连接成功
  - JWT认证
- **状态**：[ ] 待开始

### 任务 8.2：实现世界聊天
- **描述**：世界频道聊天
- **事件**：
  - `chat:send` - 发送消息
  - `chat:message` - 接收消息
- **交付物**：
  - `server/src/socket/handlers/chat.handler.ts`
- **验收标准**：
  - 消息广播给所有在线玩家
  - 消息持久化
  - 频率限制
- **状态**：[ ] 待开始

### 任务 8.3：实现门派聊天
- **描述**：门派频道聊天
- **验收标准**：
  - 仅门派成员可见
  - 加入/离开门派时更新订阅
- **状态**：[ ] 待开始

### 任务 8.4：实现私聊
- **描述**：玩家之间私聊
- **验收标准**：
  - 消息仅发送给目标玩家
  - 支持离线消息
- **状态**：[ ] 待开始

---

## 阶段九：交易市场

### 任务 9.1：实现上架商品
- **描述**：玩家上架物品到市场
- **接口**：`POST /api/v1/market/list`
- **交付物**：
  - `server/src/modules/trade/market/market.service.ts`
  - `server/src/modules/trade/market/market.controller.ts`
  - `server/src/modules/trade/market/market.routes.ts`
- **验收标准**：
  - 扣除物品
  - 设置价格和过期时间
  - 收取上架费
- **状态**：[ ] 待开始

### 任务 9.2：实现商品列表
- **描述**：浏览市场商品
- **接口**：`GET /api/v1/market/listings`
- **验收标准**：
  - 支持分类筛选
  - 支持价格排序
  - 分页查询
- **状态**：[ ] 待开始

### 任务 9.3：实现购买商品
- **描述**：购买市场商品
- **接口**：`POST /api/v1/market/buy/:id`
- **验收标准**：
  - 扣除买家货币
  - 物品发送给买家
  - 货币发送给卖家（扣税）
  - 记录交易日志
- **状态**：[ ] 待开始

### 任务 9.4：实现取消上架
- **描述**：卖家取消上架
- **接口**：`POST /api/v1/market/cancel/:id`
- **验收标准**：
  - 物品返还卖家
  - 上架费不退
- **状态**：[ ] 待开始

### 任务 9.5：实现交易记录
- **描述**：查询交易历史
- **接口**：`GET /api/v1/market/history`
- **验收标准**：
  - 显示买入/卖出记录
  - 分页查询
- **状态**：[ ] 待开始

---

## 阶段十：PVP系统

### 任务 10.1：实现匹配队列
- **描述**：玩家加入匹配队列
- **接口**：`POST /api/v1/pvp/match`
- **交付物**：
  - `server/src/modules/pvp/pvp.service.ts`
  - `server/src/modules/pvp/pvp.controller.ts`
  - `server/src/modules/pvp/pvp.routes.ts`
  - `server/src/modules/pvp/matchmaker.ts`
- **验收标准**：
  - 按积分匹配相近玩家
  - 超时扩大匹配范围
- **状态**：[ ] 待开始

### 任务 10.2：实现匹配通知
- **描述**：匹配成功通知双方
- **事件**：`pvp:matched`
- **验收标准**：
  - 双方收到通知
  - 创建战斗房间
- **状态**：[ ] 待开始

### 任务 10.3：实现实时对战
- **描述**：回合制实时对战
- **事件**：
  - `pvp:action` - 发送/接收行动
  - `pvp:turn` - 回合更新
  - `pvp:end` - 战斗结束
- **交付物**：
  - `server/src/socket/handlers/pvp.handler.ts`
  - `server/src/modules/pvp/battle.ts` - 战斗逻辑
- **验收标准**：
  - 回合时间限制
  - 行动校验
  - 伤害计算
- **状态**：[ ] 待开始

### 任务 10.4：实现战斗结算
- **描述**：战斗结束后结算
- **验收标准**：
  - 计算积分变化
  - 更新玩家积分
  - 记录战斗日志
  - 发放奖励
- **状态**：[ ] 待开始

### 任务 10.5：实现战斗记录
- **描述**：查询战斗历史
- **接口**：`GET /api/v1/pvp/history`
- **验收标准**：
  - 显示对手、结果、积分变化
  - 支持回放数据
- **状态**：[ ] 待开始

### 任务 10.6：实现赛季系统
- **描述**：PVP赛季管理
- **接口**：`GET /api/v1/pvp/season`
- **验收标准**：
  - 赛季信息查询
  - 赛季结束时结算奖励
  - 重置积分
- **状态**：[ ] 待开始

---

## 阶段十一：运营系统

### 任务 11.1：实现公告系统
- **描述**：公告发布与查询
- **接口**：
  - `GET /api/v1/ops/announcements` - 玩家查询
  - `POST /api/v1/admin/announcements` - 管理员发布
- **交付物**：
  - `server/src/modules/admin/announcement/announcement.service.ts`
  - `server/src/modules/admin/announcement/announcement.controller.ts`
- **验收标准**：
  - 公告按优先级排序
  - 支持定时发布
- **状态**：[ ] 待开始

### 任务 11.2：实现活动系统
- **描述**：活动配置与进度
- **接口**：
  - `GET /api/v1/ops/activities` - 活动列表
  - `GET /api/v1/ops/activity/:id/progress` - 活动进度
  - `POST /api/v1/ops/activity/:id/claim` - 领取奖励
- **交付物**：
  - `server/src/modules/admin/activity/activity.service.ts`
  - `server/src/modules/admin/activity/activity.controller.ts`
- **验收标准**：
  - 活动自动开启/关闭
  - 进度跟踪
  - 奖励领取
- **状态**：[ ] 待开始

### 任务 11.3：实现系统邮件群发
- **描述**：管理员群发系统邮件
- **接口**：`POST /api/v1/admin/mail/broadcast`
- **验收标准**：
  - 支持全服/条件筛选
  - 支持附件
- **状态**：[ ] 待开始

### 任务 11.4：实现用户管理
- **描述**：用户查询、封禁
- **接口**：
  - `GET /api/v1/admin/users` - 用户列表
  - `POST /api/v1/admin/users/:id/ban` - 封禁
  - `POST /api/v1/admin/users/:id/unban` - 解封
- **验收标准**：
  - 封禁后无法登录
  - 记录操作日志
- **状态**：[ ] 待开始

### 任务 11.5：实现数据统计
- **描述**：运营数据看板
- **接口**：`GET /api/v1/admin/dashboard/stats`
- **验收标准**：
  - 在线人数
  - 注册人数
  - 活跃用户
  - 交易数据
- **状态**：[ ] 待开始

---

## 阶段十二：部署与优化

### 任务 12.1：编写Dockerfile
- **描述**：创建Docker镜像配置
- **交付物**：
  - `server/Dockerfile`
  - `server/.dockerignore`
- **验收标准**：镜像构建成功
- **状态**：[ ] 待开始

### 任务 12.2：编写Docker Compose
- **描述**：创建完整部署配置
- **交付物**：
  - `server/docker-compose.yml`
  - `server/docker-compose.prod.yml`
- **验收标准**：`docker-compose up` 服务正常启动
- **状态**：[ ] 待开始

### 任务 12.3：配置Nginx
- **描述**：配置反向代理和SSL
- **交付物**：
  - `server/nginx/nginx.conf`
  - `server/nginx/ssl/` - SSL证书目录
- **验收标准**：HTTPS访问正常
- **状态**：[ ] 待开始

### 任务 12.4：实现频率限制
- **描述**：配置API频率限制
- **交付物**：
  - `server/src/plugins/rateLimit.ts`
- **验收标准**：
  - 超过限制返回429
  - 不同接口不同限制
- **状态**：[ ] 待开始

### 任务 12.5：实现数据校验
- **描述**：防作弊数据校验
- **交付物**：
  - `server/src/shared/utils/validator.ts`
  - `server/src/shared/utils/gameLogic.ts`
- **验收标准**：
  - 存档校验和验证
  - 战斗数据校验
- **状态**：[ ] 待开始

### 任务 12.6：编写测试
- **描述**：编写单元测试和集成测试
- **交付物**：
  - `server/tests/unit/` - 单元测试
  - `server/tests/integration/` - 集成测试
- **验收标准**：
  - 核心模块测试覆盖
  - CI通过
- **状态**：[ ] 待开始

---

## 依赖关系图

```
阶段一 ──┬──> 阶段二 ──> 阶段三 ──┬──> 阶段四
         │                        │
         │                        ├──> 阶段五 ──> 阶段六
         │                        │
         │                        └──> 阶段七
         │
         └──> 阶段八 ──> 阶段十
                    │
                    └──> 阶段九

阶段三 + 阶段五 + 阶段七 ──> 阶段十一

全部阶段 ──> 阶段十二
```

---

## 里程碑

### M1：基础可用（阶段一~三）
- 用户注册登录
- 云存档功能
- 预计：2周

### M2：社交功能（阶段四~七）
- 排行榜
- 好友系统
- 邮件系统
- 门派系统
- 预计：3周

### M3：交互功能（阶段八~十）
- 聊天系统
- 交易市场
- PVP对战
- 预计：3周

### M4：运营上线（阶段十一~十二）
- 运营系统
- 部署优化
- 预计：2周

**总计：约10周**

---

## 更新日志

| 日期 | 更新内容 |
|-----|---------|
| 2026-01-30 | 初始版本，创建67个任务 |
