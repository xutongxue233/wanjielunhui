-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "role" TEXT NOT NULL DEFAULT 'PLAYER',
    "lastLoginAt" DATETIME,
    "lastLoginIp" TEXT,
    "loginCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "avatarId" INTEGER NOT NULL DEFAULT 1,
    "realm" TEXT NOT NULL DEFAULT '炼气',
    "realmStage" TEXT NOT NULL DEFAULT '初期',
    "cultivation" BIGINT NOT NULL DEFAULT 0,
    "totalCultivation" BIGINT NOT NULL DEFAULT 0,
    "health" INTEGER NOT NULL DEFAULT 100,
    "maxHealth" INTEGER NOT NULL DEFAULT 100,
    "attack" INTEGER NOT NULL DEFAULT 10,
    "defense" INTEGER NOT NULL DEFAULT 5,
    "speed" INTEGER NOT NULL DEFAULT 10,
    "critRate" REAL NOT NULL DEFAULT 0.05,
    "critDamage" REAL NOT NULL DEFAULT 1.5,
    "spiritualRoot" TEXT NOT NULL,
    "spiritStones" BIGINT NOT NULL DEFAULT 0,
    "destinyPoints" INTEGER NOT NULL DEFAULT 0,
    "combatPower" BIGINT NOT NULL DEFAULT 0,
    "pvpRating" INTEGER NOT NULL DEFAULT 1000,
    "reincarnations" INTEGER NOT NULL DEFAULT 0,
    "vipLevel" INTEGER NOT NULL DEFAULT 0,
    "vipExpireAt" DATETIME,
    "lastActiveAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GameSave" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "slot" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL,
    "playerData" TEXT NOT NULL,
    "gameData" TEXT NOT NULL,
    "alchemyData" TEXT NOT NULL,
    "discipleData" TEXT NOT NULL,
    "roguelikeData" TEXT NOT NULL,
    "playTime" INTEGER NOT NULL DEFAULT 0,
    "checkpoint" TEXT,
    "checksum" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GameSave_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ranking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "score" BIGINT NOT NULL,
    "rank" INTEGER,
    "snapshot" TEXT NOT NULL,
    "seasonId" INTEGER,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ranking_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Friend" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "intimacy" INTEGER NOT NULL DEFAULT 0,
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Friend_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Friend_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "notice" TEXT,
    "iconId" INTEGER NOT NULL DEFAULT 1,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" BIGINT NOT NULL DEFAULT 0,
    "fund" BIGINT NOT NULL DEFAULT 0,
    "joinType" TEXT NOT NULL DEFAULT 'APPROVAL',
    "minRealmToJoin" TEXT,
    "memberCount" INTEGER NOT NULL DEFAULT 1,
    "maxMembers" INTEGER NOT NULL DEFAULT 50,
    "totalPower" BIGINT NOT NULL DEFAULT 0,
    "founderId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SectMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "contribution" BIGINT NOT NULL DEFAULT 0,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SectMember_sectId_fkey" FOREIGN KEY ("sectId") REFERENCES "Sect" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SectMember_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SectApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SectApplication_sectId_fkey" FOREIGN KEY ("sectId") REFERENCES "Sect" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "senderId" TEXT,
    "receiverId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'NORMAL',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isClaimed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Mail_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Mail_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MarketListing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sellerId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemData" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 1,
    "price" BIGINT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'spiritStones',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "soldAt" DATETIME,
    CONSTRAINT "MarketListing_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TradeLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sellerId" TEXT,
    "buyerId" TEXT NOT NULL,
    "listingId" TEXT,
    "itemType" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemData" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "price" BIGINT NOT NULL,
    "currency" TEXT NOT NULL,
    "fee" BIGINT NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TradeLog_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PvpMatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "opponentId" TEXT NOT NULL,
    "winnerId" TEXT,
    "result" TEXT NOT NULL,
    "playerRatingChange" INTEGER NOT NULL,
    "opponentRatingChange" INTEGER NOT NULL,
    "battleLog" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PvpMatch_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PvpMatch_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PvpSeason" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME NOT NULL,
    "rewards" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'normal',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ActivityProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activityId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "progress" TEXT NOT NULL,
    "rewards" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ActivityProgress_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActivityProgress_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "channel" TEXT NOT NULL,
    "channelId" TEXT,
    "senderId" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderRealm" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OperationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "playerId" TEXT,
    "action" TEXT NOT NULL,
    "target" TEXT,
    "details" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_token_idx" ON "RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Player_userId_key" ON "Player"("userId");

-- CreateIndex
CREATE INDEX "Player_realm_combatPower_idx" ON "Player"("realm", "combatPower");

-- CreateIndex
CREATE INDEX "Player_pvpRating_idx" ON "Player"("pvpRating");

-- CreateIndex
CREATE INDEX "GameSave_playerId_idx" ON "GameSave"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "GameSave_playerId_slot_key" ON "GameSave"("playerId", "slot");

-- CreateIndex
CREATE INDEX "Ranking_type_score_idx" ON "Ranking"("type", "score");

-- CreateIndex
CREATE UNIQUE INDEX "Ranking_playerId_type_seasonId_key" ON "Ranking"("playerId", "type", "seasonId");

-- CreateIndex
CREATE INDEX "FriendRequest_receiverId_status_idx" ON "FriendRequest"("receiverId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_senderId_receiverId_key" ON "FriendRequest"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "Friend_playerId_idx" ON "Friend"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Friend_playerId_friendId_key" ON "Friend"("playerId", "friendId");

-- CreateIndex
CREATE UNIQUE INDEX "Sect_name_key" ON "Sect"("name");

-- CreateIndex
CREATE INDEX "Sect_totalPower_idx" ON "Sect"("totalPower");

-- CreateIndex
CREATE UNIQUE INDEX "SectMember_playerId_key" ON "SectMember"("playerId");

-- CreateIndex
CREATE INDEX "SectMember_sectId_contribution_idx" ON "SectMember"("sectId", "contribution");

-- CreateIndex
CREATE UNIQUE INDEX "SectApplication_sectId_playerId_key" ON "SectApplication"("sectId", "playerId");

-- CreateIndex
CREATE INDEX "Mail_receiverId_isRead_idx" ON "Mail"("receiverId", "isRead");

-- CreateIndex
CREATE INDEX "Mail_receiverId_createdAt_idx" ON "Mail"("receiverId", "createdAt");

-- CreateIndex
CREATE INDEX "MarketListing_itemType_status_idx" ON "MarketListing"("itemType", "status");

-- CreateIndex
CREATE INDEX "MarketListing_status_price_idx" ON "MarketListing"("status", "price");

-- CreateIndex
CREATE INDEX "MarketListing_sellerId_idx" ON "MarketListing"("sellerId");

-- CreateIndex
CREATE INDEX "TradeLog_buyerId_createdAt_idx" ON "TradeLog"("buyerId", "createdAt");

-- CreateIndex
CREATE INDEX "TradeLog_sellerId_createdAt_idx" ON "TradeLog"("sellerId", "createdAt");

-- CreateIndex
CREATE INDEX "PvpMatch_playerId_seasonId_idx" ON "PvpMatch"("playerId", "seasonId");

-- CreateIndex
CREATE INDEX "PvpMatch_seasonId_createdAt_idx" ON "PvpMatch"("seasonId", "createdAt");

-- CreateIndex
CREATE INDEX "Announcement_isActive_priority_idx" ON "Announcement"("isActive", "priority");

-- CreateIndex
CREATE INDEX "Activity_isActive_startAt_idx" ON "Activity"("isActive", "startAt");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityProgress_activityId_playerId_key" ON "ActivityProgress"("activityId", "playerId");

-- CreateIndex
CREATE INDEX "ChatMessage_channel_channelId_createdAt_idx" ON "ChatMessage"("channel", "channelId", "createdAt");

-- CreateIndex
CREATE INDEX "ChatMessage_createdAt_idx" ON "ChatMessage"("createdAt");

-- CreateIndex
CREATE INDEX "OperationLog_userId_createdAt_idx" ON "OperationLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "OperationLog_action_createdAt_idx" ON "OperationLog"("action", "createdAt");
