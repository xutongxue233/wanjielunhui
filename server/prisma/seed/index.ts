// 主种子文件 - 初始化游戏数据
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { storyChaptersData, allChapterNodes } from './story-chapters';
import { questTemplatesData } from './quests';
import { itemTemplatesData } from './items';
import { equipmentTemplatesData } from './equipments';
import { enemyTemplatesData } from './enemies';
import { skillTemplatesData } from './skills';
import { dungeonTemplatesData } from './dungeons';
import { alchemyRecipesData, alchemyCauldronsData } from './alchemy';
import { realmConfigsData } from './realms';
import { originConfigsData, spiritRootConfigsData } from './origins';
import { roguelikeDungeonsData, roguelikeTalentsData } from './roguelike';
import { expeditionTemplatesData } from './expeditions';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('开始填充游戏数据...');

  // 1. 填充物品模板
  console.log('填充物品模板...');
  for (const item of itemTemplatesData) {
    await prisma.itemTemplate.upsert({
      where: { itemId: item.itemId },
      update: item,
      create: item,
    });
  }
  console.log(`已填充 ${itemTemplatesData.length} 个物品模板`);

  // 2. 填充装备模板
  console.log('填充装备模板...');
  for (const equipment of equipmentTemplatesData) {
    await prisma.equipmentTemplate.upsert({
      where: { equipmentId: equipment.equipmentId },
      update: equipment,
      create: equipment,
    });
  }
  console.log(`已填充 ${equipmentTemplatesData.length} 个装备模板`);

  // 3. 填充剧情章节
  console.log('填充剧情章节...');
  for (const chapter of storyChaptersData) {
    await prisma.storyChapter.upsert({
      where: { chapterId: chapter.chapterId },
      update: {
        name: chapter.name,
        description: chapter.description,
        order: chapter.order,
        unlockConditions: chapter.unlockConditions,
        rewards: chapter.rewards,
      },
      create: chapter,
    });
  }
  console.log(`已填充 ${storyChaptersData.length} 个剧情章节`);

  // 4. 填充剧情节点
  console.log('填充剧情节点...');
  for (const node of allChapterNodes) {
    const chapter = await prisma.storyChapter.findUnique({
      where: { chapterId: node.chapterId },
    });
    if (!chapter) {
      console.warn(`章节 ${node.chapterId} 不存在，跳过节点 ${node.nodeId}`);
      continue;
    }

    await prisma.storyNode.upsert({
      where: { nodeId: node.nodeId },
      update: {
        type: node.type as any,
        order: node.order,
        speaker: node.speaker || null,
        content: node.content,
        nextNodeId: node.nextNodeId || null,
        choices: node.choices || null,
        effects: node.effects || null,
        enemyIds: node.enemyIds || null,
        battleRewards: node.battleRewards || null,
      },
      create: {
        nodeId: node.nodeId,
        chapterId: chapter.id,
        type: node.type as any,
        order: node.order,
        speaker: node.speaker || null,
        content: node.content,
        nextNodeId: node.nextNodeId || null,
        choices: node.choices || null,
        effects: node.effects || null,
        enemyIds: node.enemyIds || null,
        battleRewards: node.battleRewards || null,
      },
    });
  }
  console.log(`已填充 ${allChapterNodes.length} 个剧情节点`);

  // 5. 填充任务模板
  console.log('填充任务模板...');
  for (const quest of questTemplatesData) {
    await prisma.questTemplate.upsert({
      where: { questId: quest.questId },
      update: quest,
      create: quest,
    });
  }
  console.log(`已填充 ${questTemplatesData.length} 个任务模板`);

  // 6. 填充敌人模板
  console.log('填充敌人模板...');
  for (const enemy of enemyTemplatesData) {
    await prisma.enemyTemplate.upsert({
      where: { enemyId: enemy.enemyId },
      update: enemy,
      create: enemy,
    });
  }
  console.log(`已填充 ${enemyTemplatesData.length} 个敌人模板`);

  // 7. 填充技能模板
  console.log('填充技能模板...');
  for (const skill of skillTemplatesData) {
    await prisma.skillTemplate.upsert({
      where: { skillId: skill.skillId },
      update: skill,
      create: skill,
    });
  }
  console.log(`已填充 ${skillTemplatesData.length} 个技能模板`);

  // 8. 填充副本模板
  console.log('填充副本模板...');
  for (const dungeon of dungeonTemplatesData) {
    await prisma.dungeonTemplate.upsert({
      where: { dungeonId: dungeon.dungeonId },
      update: dungeon,
      create: dungeon,
    });
  }
  console.log(`已填充 ${dungeonTemplatesData.length} 个副本模板`);

  // 9. 填充炼丹配方
  console.log('填充炼丹配方...');
  for (const recipe of alchemyRecipesData) {
    await prisma.alchemyRecipe.upsert({
      where: { recipeId: recipe.recipeId },
      update: recipe,
      create: recipe,
    });
  }
  console.log(`已填充 ${alchemyRecipesData.length} 个炼丹配方`);

  // 10. 填充丹炉
  console.log('填充丹炉...');
  for (const cauldron of alchemyCauldronsData) {
    await prisma.alchemyCauldron.upsert({
      where: { cauldronId: cauldron.cauldronId },
      update: cauldron,
      create: cauldron,
    });
  }
  console.log(`已填充 ${alchemyCauldronsData.length} 个丹炉`);

  // 11. 填充境界配置
  console.log('填充境界配置...');
  for (const realm of realmConfigsData) {
    await prisma.realmConfig.upsert({
      where: { realmId: realm.realmId },
      update: realm,
      create: realm,
    });
  }
  console.log(`已填充 ${realmConfigsData.length} 个境界配置`);

  // 12. 填充出身配置
  console.log('填充出身配置...');
  for (const origin of originConfigsData) {
    await prisma.originConfig.upsert({
      where: { originId: origin.originId },
      update: origin,
      create: origin,
    });
  }
  console.log(`已填充 ${originConfigsData.length} 个出身配置`);

  // 13. 填充灵根配置
  console.log('填充灵根配置...');
  for (const root of spiritRootConfigsData) {
    await prisma.spiritRootConfig.upsert({
      where: { rootId: root.rootId },
      update: root,
      create: root,
    });
  }
  console.log(`已填充 ${spiritRootConfigsData.length} 个灵根配置`);

  // 14. 填充秘境副本
  console.log('填充秘境副本...');
  for (const dungeon of roguelikeDungeonsData) {
    await prisma.roguelikeDungeon.upsert({
      where: { dungeonId: dungeon.dungeonId },
      update: dungeon,
      create: dungeon,
    });
  }
  console.log(`已填充 ${roguelikeDungeonsData.length} 个秘境副本`);

  // 15. 填充秘境天赋
  console.log('填充秘境天赋...');
  for (const talent of roguelikeTalentsData) {
    await prisma.roguelikeTalent.upsert({
      where: { talentId: talent.talentId },
      update: talent,
      create: talent,
    });
  }
  console.log(`已填充 ${roguelikeTalentsData.length} 个秘境天赋`);

  // 16. 填充弟子派遣任务
  console.log('填充弟子派遣任务...');
  for (const expedition of expeditionTemplatesData) {
    await prisma.expeditionTemplate.upsert({
      where: { expeditionId: expedition.expeditionId },
      update: expedition,
      create: expedition,
    });
  }
  console.log(`已填充 ${expeditionTemplatesData.length} 个派遣任务`);

  console.log('游戏数据填充完成!');
}

main()
  .catch((e) => {
    console.error('填充数据时发生错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
