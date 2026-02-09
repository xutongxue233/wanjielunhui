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
      { type: 'item', target: 'qingyun_pao', value: 1 },
      { type: 'cultivation', target: 'base', value: 100 },
      { type: 'item', target: 'lingshi', value: 200 },
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
      { type: 'item', target: 'juyuandan', value: 10 },
      { type: 'item', target: 'qingfengjian', value: 1 },
      { type: 'attribute', target: 'comprehension', value: 5 },
    ],
  },
  {
    id: 'chapter_4',
    name: '第四章：魔影初现',
    description: '门派中接连发生诡异事件，一切似乎指向一个可怕的阴谋。',
    order: 3,
    unlockConditions: [
      { type: 'flag', key: 'chapter_3_completed', operator: '==', value: true },
      { type: 'realm', key: 'level', operator: '>=', value: 5 },
    ],
    startNodeId: 'ch4_start',
    rewards: [
      { type: 'item', target: 'zhujiwan', value: 2 },
      { type: 'item', target: 'lingshi', value: 500 },
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
