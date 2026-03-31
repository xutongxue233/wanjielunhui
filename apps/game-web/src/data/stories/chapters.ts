import type { StoryCondition } from '../../types';

// 章节奖励类型
export interface ChapterReward {
  type: 'item' | 'cultivation' | 'attribute' | 'technique' | 'skill';
  target: string;
  value: number;
}

// 章节配置
export interface StoryChapter {
  id: string;
  name: string;
  description: string;
  order: number;
  unlockConditions: StoryCondition[];
  startNodeId: string;
  rewards: ChapterReward[];
}

// 所有章节配置
export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'prologue',
    name: '序章：机缘初现',
    description: '机缘巧合之下，你获得了修仙功法，从此踏上了漫漫仙途。',
    order: 0,
    unlockConditions: [],
    startNodeId: 'start',
    rewards: [],
  },
  {
    id: 'chapter_2',
    name: '第二章：拜入仙门',
    description: '为了获得更好的修炼资源和指导，你决定拜入附近的修仙门派。',
    order: 1,
    unlockConditions: [
      { type: 'flag', key: 'prologue_completed', operator: '==', value: true },
      { type: 'realm', key: 'level', operator: '>=', value: 2 },
    ],
    startNodeId: 'ch2_start',
    rewards: [
      { type: 'item', target: 'qingyun_robe', value: 1 },
      { type: 'cultivation', target: 'base', value: 100 },
      { type: 'item', target: 'spirit_stone', value: 200 },
    ],
  },
  {
    id: 'chapter_3',
    name: '第三章：外门历练',
    description: '作为外门弟子，你需要完成各种任务来证明自己的价值。',
    order: 2,
    unlockConditions: [
      { type: 'flag', key: 'chapter_2_completed', operator: '==', value: true },
      { type: 'realm', key: 'level', operator: '>=', value: 3 },
    ],
    startNodeId: 'ch3_start',
    rewards: [
      { type: 'item', target: 'juyuan_pill', value: 10 },
      { type: 'item', target: 'qingfeng_sword', value: 1 },
      { type: 'attribute', target: 'comprehension', value: 5 },
    ],
  },
  {
    id: 'chapter_4',
    name: '第四章：魔影初现',
    description: '魔修入侵青云宗，你在师父云霄真人和师姐苏瑶的并肩作战中成长，与宿敌血影展开宿命之战。',
    order: 3,
    unlockConditions: [
      { type: 'flag', key: 'chapter_3_completed', operator: '==', value: true },
      { type: 'realm', key: 'level', operator: '>=', value: 9 },
    ],
    startNodeId: 'ch4_start',
    rewards: [
      { type: 'item', target: 'zhuji_pill', value: 2 },
      { type: 'item', target: 'spirit_stone', value: 500 },
      { type: 'cultivation', target: 'base', value: 500 },
    ],
  },
  {
    id: 'chapter_5',
    name: '第五章：风暴将至',
    description: '元婴初成，过往真相浮出水面。暗影联盟的阴谋远不止于此，域外天魔的封印岌岌可危。',
    order: 4,
    unlockConditions: [
      { type: 'flag', key: 'chapter_4_completed', operator: '==', value: true },
      { type: 'realm', key: 'level', operator: '>=', value: 13 },
    ],
    startNodeId: 'ch5_start',
    rewards: [
      { type: 'item', target: 'spirit_stone', value: 1000 },
      { type: 'cultivation', target: 'base', value: 800 },
      { type: 'attribute', target: 'comprehension', value: 10 },
    ],
  },
  {
    id: 'chapter_6',
    name: '第六章：云隐秘境',
    description: '你率远征队深入失落秘境，夺回镇界星盘与补天卷残篇，第一次真正看见封印体系的全貌。',
    order: 5,
    unlockConditions: [
      { type: 'flag', key: 'chapter_5_completed', operator: '==', value: true },
      { type: 'realm', key: 'level', operator: '>=', value: 14 },
    ],
    startNodeId: 'ch6_start',
    rewards: [
      { type: 'item', target: 'spirit_stone', value: 1800 },
      { type: 'cultivation', target: 'base', value: 1200 },
      { type: 'attribute', target: 'comprehension', value: 12 },
    ],
  },
  {
    id: 'chapter_7',
    name: '第七章：镇界之路',
    description: '三处镇界锚同时告急。你在北荒与观星台之间奔走斡旋，开始扛起真正属于守界者的责任。',
    order: 6,
    unlockConditions: [
      { type: 'flag', key: 'chapter_6_completed', operator: '==', value: true },
      { type: 'realm', key: 'level', operator: '>=', value: 15 },
    ],
    startNodeId: 'ch7_start',
    rewards: [
      { type: 'item', target: 'spirit_stone', value: 2600 },
      { type: 'cultivation', target: 'base', value: 2000 },
      { type: 'attribute', target: 'luck', value: 12 },
    ],
  },
  {
    id: 'chapter_8',
    name: '第八章：镜湖天关',
    description: '镜湖锚被逆界引强行扭向天关投影。你必须守住青云宗最后一道门锁，并第一次直面更高秩序的回响。',
    order: 7,
    unlockConditions: [
      { type: 'flag', key: 'chapter_7_completed', operator: '==', value: true },
      { type: 'realm', key: 'level', operator: '>=', value: 16 },
    ],
    startNodeId: 'ch8_start',
    rewards: [
      { type: 'item', target: 'spirit_stone', value: 3400 },
      { type: 'cultivation', target: 'base', value: 2800 },
      { type: 'attribute', target: 'comprehension', value: 14 },
    ],
  },
  {
    id: 'chapter_9',
    name: '第九章：天关残城',
    description: '钥印为你指向两界夹层中的残城法诏库。你第一次真正踏入旧秩序遗址，也第一次看见“开门规则”被篡改后的真相。',
    order: 8,
    unlockConditions: [
      { type: 'flag', key: 'chapter_8_completed', operator: '==', value: true },
      { type: 'realm', key: 'level', operator: '>=', value: 17 },
    ],
    startNodeId: 'ch9_start',
    rewards: [
      { type: 'item', target: 'spirit_stone', value: 4400 },
      { type: 'cultivation', target: 'base', value: 3600 },
      { type: 'attribute', target: 'comprehension', value: 16 },
    ],
  },
];

// 根据ID获取章节
export function getChapterById(chapterId: string): StoryChapter | null {
  return STORY_CHAPTERS.find(ch => ch.id === chapterId) || null;
}

// 获取下一章节
export function getNextChapter(currentChapterId: string): StoryChapter | null {
  const currentChapter = getChapterById(currentChapterId);
  if (!currentChapter) return null;
  return STORY_CHAPTERS.find(ch => ch.order === currentChapter.order + 1) || null;
}

// 获取所有已解锁章节ID
export function getUnlockedChapterIds(
  flags: Record<string, boolean | number | string>,
  realmLevel: number
): string[] {
  return STORY_CHAPTERS
    .filter(chapter => checkChapterUnlock(chapter, flags, realmLevel))
    .map(ch => ch.id);
}

// 检查章节是否解锁
export function checkChapterUnlock(
  chapter: StoryChapter,
  flags: Record<string, boolean | number | string>,
  realmLevel: number
): boolean {
  if (chapter.unlockConditions.length === 0) return true;

  return chapter.unlockConditions.every(condition => {
    switch (condition.type) {
      case 'flag':
        return evaluateCondition(flags[condition.key], condition.operator, condition.value);
      case 'realm':
        if (condition.key === 'level') {
          return evaluateCondition(realmLevel, condition.operator, condition.value);
        }
        return false;
      default:
        return false;
    }
  });
}

// 评估条件
function evaluateCondition(
  actual: unknown,
  operator: string,
  expected: string | number | boolean
): boolean {
  if (actual === undefined || actual === null) return false;

  switch (operator) {
    case '==':
      return actual === expected;
    case '!=':
      return actual !== expected;
    case '>':
      return Number(actual) > Number(expected);
    case '>=':
      return Number(actual) >= Number(expected);
    case '<':
      return Number(actual) < Number(expected);
    case '<=':
      return Number(actual) <= Number(expected);
    default:
      return false;
  }
}
