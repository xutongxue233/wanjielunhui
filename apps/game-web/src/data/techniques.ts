import type { Technique } from '../types';

export const TECHNIQUES: Record<string, Technique> = {
  basic_qi_gathering: {
    id: 'basic_qi_gathering',
    name: '引气诀',
    description: '最基础的吐纳法门，可帮助修士更快感应天地灵气。',
    grade: 'mortal',
    element: 'neutral',
    cultivationBonus: 0.15,
    requirements: [],
    skills: ['basic_punch'],
    maxLevel: 10,
    currentLevel: 1,
  },
  clan_breathing_technique: {
    id: 'clan_breathing_technique',
    name: '玄门养气法',
    description: '世家祖传的养气心法，运转平稳，兼具护体与聚灵之效。',
    grade: 'yellow',
    element: 'metal',
    cultivationBonus: 0.22,
    requirements: [],
    skills: ['metal_sword_qi'],
    maxLevel: 12,
    currentLevel: 1,
  },
  forgotten_breathing_technique: {
    id: 'forgotten_breathing_technique',
    name: '残忆归元经',
    description: '前世残忆中留存的上乘呼吸法，能显著提升修炼效率。',
    grade: 'profound',
    element: 'wood',
    cultivationBonus: 0.3,
    requirements: [],
    skills: ['wood_thorns'],
    maxLevel: 15,
    currentLevel: 1,
  },
};

export function getTechniqueById(id: string): Technique | undefined {
  const technique = TECHNIQUES[id];
  return technique ? { ...technique } : undefined;
}
