/**
 * 数据模块统一导出
 */

// 道具数据
export * from './items';

// 装备数据
export * from './equipment';

// 战斗数据 - 使用命名空间避免冲突
export * from './combat/index';
export { getChapterById as getCombatChapterById } from './combat/dungeons';

// 剧情数据 - 使用命名空间避免冲突
export { getStoryNode, STORY_CHAPTERS, checkChapterUnlock, getNextChapter, getUnlockedChapterIds } from './stories';
export { getChapterById as getStoryChapterById } from './stories/chapters';

// 境界数据
export * from './realms';

// 出身/灵根数据
export * from './origins';
