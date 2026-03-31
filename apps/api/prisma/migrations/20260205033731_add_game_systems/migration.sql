-- CreateTable
CREATE TABLE "ItemTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quality" TEXT NOT NULL,
    "stackable" BOOLEAN NOT NULL DEFAULT true,
    "maxStack" INTEGER NOT NULL DEFAULT 99,
    "effects" TEXT,
    "sellPrice" INTEGER NOT NULL DEFAULT 0,
    "buyPrice" INTEGER,
    "iconId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EquipmentTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "equipmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slot" TEXT NOT NULL,
    "quality" TEXT NOT NULL,
    "baseStats" TEXT NOT NULL,
    "bonusStats" TEXT,
    "maxEnhanceLevel" INTEGER NOT NULL DEFAULT 10,
    "requirements" TEXT,
    "specialEffect" TEXT,
    "sellPrice" INTEGER NOT NULL DEFAULT 0,
    "iconId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerInventory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "extraData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerEquipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "weapon" TEXT,
    "armor" TEXT,
    "helmet" TEXT,
    "boots" TEXT,
    "accessory" TEXT,
    "talisman" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StoryChapter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chapterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "unlockConditions" TEXT,
    "rewards" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StoryNode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nodeId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "speaker" TEXT,
    "content" TEXT NOT NULL,
    "nextNodeId" TEXT,
    "choices" TEXT,
    "conditions" TEXT,
    "effects" TEXT,
    "enemyIds" TEXT,
    "battleRewards" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StoryNode_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "StoryChapter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlayerStoryProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "currentChapterId" TEXT,
    "currentNodeId" TEXT,
    "completedChapters" TEXT NOT NULL DEFAULT '[]',
    "flags" TEXT NOT NULL DEFAULT '{}',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "QuestTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "rewards" TEXT NOT NULL,
    "unlockConditions" TEXT,
    "prerequisiteQuestId" TEXT,
    "chapterId" TEXT,
    "repeatable" BOOLEAN NOT NULL DEFAULT false,
    "repeatLimit" INTEGER,
    "timeLimit" INTEGER,
    "recommendedRealm" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerQuest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "progress" TEXT NOT NULL DEFAULT '[]',
    "completedCount" INTEGER NOT NULL DEFAULT 0,
    "acceptedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME
);

-- CreateTable
CREATE TABLE "EnemyTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enemyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "baseHp" INTEGER NOT NULL,
    "baseAttack" INTEGER NOT NULL,
    "baseDefense" INTEGER NOT NULL,
    "baseSpeed" INTEGER NOT NULL,
    "hpMultiplier" REAL NOT NULL DEFAULT 1.0,
    "attackMultiplier" REAL NOT NULL DEFAULT 1.0,
    "defenseMultiplier" REAL NOT NULL DEFAULT 1.0,
    "skillIds" TEXT,
    "dropTable" TEXT,
    "expReward" INTEGER NOT NULL DEFAULT 10,
    "element" TEXT,
    "iconId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DungeonTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dungeonId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "chapterId" TEXT,
    "stages" TEXT NOT NULL,
    "requirements" TEXT,
    "energyCost" INTEGER NOT NULL DEFAULT 10,
    "dailyLimit" INTEGER,
    "recommendedPower" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SkillTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skillId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "element" TEXT,
    "mpCost" INTEGER NOT NULL DEFAULT 0,
    "cooldown" INTEGER NOT NULL DEFAULT 0,
    "damageMultiplier" REAL NOT NULL DEFAULT 1.0,
    "effects" TEXT,
    "requirements" TEXT,
    "iconId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TechniqueTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "techniqueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "element" TEXT,
    "cultivationBonus" INTEGER NOT NULL DEFAULT 0,
    "skillIds" TEXT,
    "requirements" TEXT,
    "maxLevel" INTEGER NOT NULL DEFAULT 10,
    "iconId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerTechnique" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "techniqueId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "proficiency" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "learnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PlayerSkill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "learnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemTemplate_itemId_key" ON "ItemTemplate"("itemId");

-- CreateIndex
CREATE INDEX "ItemTemplate_type_quality_idx" ON "ItemTemplate"("type", "quality");

-- CreateIndex
CREATE INDEX "ItemTemplate_isActive_idx" ON "ItemTemplate"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentTemplate_equipmentId_key" ON "EquipmentTemplate"("equipmentId");

-- CreateIndex
CREATE INDEX "EquipmentTemplate_slot_quality_idx" ON "EquipmentTemplate"("slot", "quality");

-- CreateIndex
CREATE INDEX "PlayerInventory_playerId_idx" ON "PlayerInventory"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerInventory_playerId_itemId_itemType_key" ON "PlayerInventory"("playerId", "itemId", "itemType");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerEquipment_playerId_key" ON "PlayerEquipment"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "StoryChapter_chapterId_key" ON "StoryChapter"("chapterId");

-- CreateIndex
CREATE INDEX "StoryChapter_order_idx" ON "StoryChapter"("order");

-- CreateIndex
CREATE UNIQUE INDEX "StoryNode_nodeId_key" ON "StoryNode"("nodeId");

-- CreateIndex
CREATE INDEX "StoryNode_chapterId_order_idx" ON "StoryNode"("chapterId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStoryProgress_playerId_key" ON "PlayerStoryProgress"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestTemplate_questId_key" ON "QuestTemplate"("questId");

-- CreateIndex
CREATE INDEX "QuestTemplate_type_isActive_idx" ON "QuestTemplate"("type", "isActive");

-- CreateIndex
CREATE INDEX "QuestTemplate_chapterId_idx" ON "QuestTemplate"("chapterId");

-- CreateIndex
CREATE INDEX "PlayerQuest_playerId_status_idx" ON "PlayerQuest"("playerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerQuest_playerId_questId_key" ON "PlayerQuest"("playerId", "questId");

-- CreateIndex
CREATE UNIQUE INDEX "EnemyTemplate_enemyId_key" ON "EnemyTemplate"("enemyId");

-- CreateIndex
CREATE INDEX "EnemyTemplate_type_idx" ON "EnemyTemplate"("type");

-- CreateIndex
CREATE UNIQUE INDEX "DungeonTemplate_dungeonId_key" ON "DungeonTemplate"("dungeonId");

-- CreateIndex
CREATE INDEX "DungeonTemplate_type_isActive_idx" ON "DungeonTemplate"("type", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "SkillTemplate_skillId_key" ON "SkillTemplate"("skillId");

-- CreateIndex
CREATE INDEX "SkillTemplate_type_element_idx" ON "SkillTemplate"("type", "element");

-- CreateIndex
CREATE UNIQUE INDEX "TechniqueTemplate_techniqueId_key" ON "TechniqueTemplate"("techniqueId");

-- CreateIndex
CREATE INDEX "TechniqueTemplate_grade_idx" ON "TechniqueTemplate"("grade");

-- CreateIndex
CREATE INDEX "PlayerTechnique_playerId_idx" ON "PlayerTechnique"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerTechnique_playerId_techniqueId_key" ON "PlayerTechnique"("playerId", "techniqueId");

-- CreateIndex
CREATE INDEX "PlayerSkill_playerId_idx" ON "PlayerSkill"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerSkill_playerId_skillId_key" ON "PlayerSkill"("playerId", "skillId");
