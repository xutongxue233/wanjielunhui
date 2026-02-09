// 主种子文件 - 初始化游戏数据
import { PrismaClient } from '@prisma/client';
import { storyChaptersData, allChapterNodes } from './story-chapters';
import { questTemplatesData } from './quests';
import { itemTemplatesData } from './items';
import { equipmentTemplatesData } from './equipments';

const prisma = new PrismaClient();

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
    // 先获取章节ID
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
