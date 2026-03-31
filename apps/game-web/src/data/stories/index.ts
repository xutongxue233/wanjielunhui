import type { StoryNode } from '../../types';
import { villageOrphanStory, fallenClanStory, reincarnationStory, getStoryNode as getPrologueNode } from './prologue';
import { chapter2Story, getChapter2Node } from './chapter2';
import { chapter3Story, getChapter3Node } from './chapter3';
import { chapter4Story, getChapter4Node } from './chapter4';
import { chapter5Story, getChapter5Node } from './chapter5';
import { chapter6Story, getChapter6Node } from './chapter6';
import { chapter7Story, getChapter7Node } from './chapter7';
import { chapter8Story, getChapter8Node } from './chapter8';
import { chapter9Story, getChapter9Node } from './chapter9';
import { STORY_CHAPTERS, getChapterById, getNextChapter, getUnlockedChapterIds, checkChapterUnlock } from './chapters';
import type { StoryChapter, ChapterReward } from './chapters';

// 导出所有剧情数据
export const storyData = {
  prologue: {
    village_orphan: villageOrphanStory,
    fallen_clan: fallenClanStory,
    reincarnation: reincarnationStory,
  },
  chapter_2: chapter2Story,
  chapter_3: chapter3Story,
  chapter_4: chapter4Story,
  chapter_5: chapter5Story,
  chapter_6: chapter6Story,
  chapter_7: chapter7Story,
  chapter_8: chapter8Story,
  chapter_9: chapter9Story,
};

// 统一的节点获取函数
export function getStoryNode(chapterId: string, nodeId: string, origin?: string): StoryNode | null {
  switch (chapterId) {
    case 'prologue':
      // 序章需要根据出身获取对应剧情
      return getPrologueNode(origin || 'village_orphan', nodeId);
    case 'chapter_2':
      return getChapter2Node(nodeId);
    case 'chapter_3':
      return getChapter3Node(nodeId);
    case 'chapter_4':
      return getChapter4Node(nodeId);
    case 'chapter_5':
      return getChapter5Node(nodeId);
    case 'chapter_6':
      return getChapter6Node(nodeId);
    case 'chapter_7':
      return getChapter7Node(nodeId);
    case 'chapter_8':
      return getChapter8Node(nodeId);
    case 'chapter_9':
      return getChapter9Node(nodeId);
    default:
      return null;
  }
}

// 获取章节的起始节点
export function getChapterStartNode(chapterId: string, origin?: string): StoryNode | null {
  const chapter = getChapterById(chapterId);
  if (!chapter) return null;
  return getStoryNode(chapterId, chapter.startNodeId, origin);
}

// 检查章节是否有剧情数据
export function hasChapterData(chapterId: string): boolean {
  switch (chapterId) {
    case 'prologue':
    case 'chapter_2':
    case 'chapter_3':
    case 'chapter_4':
    case 'chapter_5':
    case 'chapter_6':
    case 'chapter_7':
    case 'chapter_8':
    case 'chapter_9':
      return true;
    default:
      return false;
  }
}

// 获取章节总节点数
export function getChapterNodeCount(chapterId: string): number {
  switch (chapterId) {
    case 'prologue':
      // 序章按平均值计算
      return Math.round((Object.keys(villageOrphanStory).length +
        Object.keys(fallenClanStory).length +
        Object.keys(reincarnationStory).length) / 3);
    case 'chapter_2':
      return Object.keys(chapter2Story).length;
    case 'chapter_3':
      return Object.keys(chapter3Story).length;
    case 'chapter_4':
      return Object.keys(chapter4Story).length;
    case 'chapter_5':
      return Object.keys(chapter5Story).length;
    case 'chapter_6':
      return Object.keys(chapter6Story).length;
    case 'chapter_7':
      return Object.keys(chapter7Story).length;
    case 'chapter_8':
      return Object.keys(chapter8Story).length;
    case 'chapter_9':
      return Object.keys(chapter9Story).length;
    default:
      return 0;
  }
}

// 重新导出章节相关函数
export {
  STORY_CHAPTERS,
  getChapterById,
  getNextChapter,
  getUnlockedChapterIds,
  checkChapterUnlock,
};

// 重新导出类型
export type { StoryChapter, ChapterReward };

// 重新导出序章数据
export { villageOrphanStory, fallenClanStory, reincarnationStory };
export { chapter2Story };
export { chapter3Story };
export { chapter4Story };
export { chapter5Story };
export { chapter6Story };
export { chapter7Story };
export { chapter8Story };
export { chapter9Story };
