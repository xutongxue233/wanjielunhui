import type { Origin, OriginType, SpiritualRoot, Element } from '../types';

// 开局背景配置
export const ORIGINS: Record<OriginType, Origin> = {
  village_orphan: {
    type: 'village_orphan',
    name: '山村孤儿',
    description: '你自幼父母双亡，被山村中的老猎户收养。一日在山中采药时，偶然发现一处隐秘山洞，得到一本残缺的修仙功法，从此踏上了修仙之路。',
    startingBonus: {
      attributes: {
        luck: 15,
        comprehension: 10,
      },
      items: [
        { itemId: 'broken_technique_manual', quantity: 1 },
        { itemId: 'spirit_stone', quantity: 10 },
        { itemId: 'healing_pill_low', quantity: 5 },
      ],
      techniques: ['basic_qi_gathering'],
    },
    startingStory: 'story_village_orphan_start',
  },

  fallen_clan: {
    type: 'fallen_clan',
    name: '家族余孤',
    description: '你本是修仙世家的嫡系子弟，却因家族遭逢大难而流落凡间。父亲临终前将家传功法和一枚神秘玉佩交给了你，嘱咐你有朝一日重振家族荣光。',
    startingBonus: {
      attributes: {
        comprehension: 20,
        karma: 10,
      },
      items: [
        { itemId: 'clan_technique_manual', quantity: 1 },
        { itemId: 'mysterious_jade_pendant', quantity: 1 },
        { itemId: 'spirit_stone', quantity: 50 },
        { itemId: 'healing_pill_medium', quantity: 3 },
      ],
      techniques: ['clan_breathing_technique'],
      spiritualRootBonus: 10,
    },
    startingStory: 'story_fallen_clan_start',
  },

  reincarnation: {
    type: 'reincarnation',
    name: '转世重修',
    description: '你前世是一位修为通天的大能，却在渡劫时遭人暗算而陨落。凭借着一丝残魂转世重生，虽然前世记忆被封印，但骨子里的道韵犹存，修炼起来事半功倍。',
    startingBonus: {
      attributes: {
        comprehension: 20,
        cultivationSpeed: 0.3,
      },
      items: [
        { itemId: 'sealed_memory_fragment', quantity: 1 },
        { itemId: 'spirit_stone', quantity: 20 },
        { itemId: 'reincarnation_pill', quantity: 1 },
      ],
      techniques: ['forgotten_breathing_technique'],
      spiritualRootBonus: 20,
    },
    startingStory: 'story_reincarnation_start',
  },
};

// 灵根品质名称
export const SPIRITUAL_ROOT_QUALITY_NAMES = {
  mortal: '凡俗',
  ordinary: '普通',
  excellent: '优秀',
  heavenly: '天灵根',
  chaos: '混沌灵根',
};

// 灵根品质修炼加成
export const SPIRITUAL_ROOT_QUALITY_BONUS = {
  mortal: 0,
  ordinary: 0.1,
  excellent: 0.3,
  heavenly: 0.6,
  chaos: 1.0,
};

// 五行名称
export const ELEMENT_NAMES: Record<Element, string> = {
  metal: '金',
  wood: '木',
  water: '水',
  fire: '火',
  earth: '土',
};

// 五行相生
export const ELEMENT_GENERATES: Record<Element, Element> = {
  metal: 'water',
  water: 'wood',
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
};

// 五行相克
export const ELEMENT_OVERCOMES: Record<Element, Element> = {
  metal: 'wood',
  wood: 'earth',
  earth: 'water',
  water: 'fire',
  fire: 'metal',
};

// 特殊灵根
export const SPECIAL_SPIRITUAL_ROOTS: Record<string, {
  name: string;
  elements: Element[];
  bonus: number;
  description: string;
}> = {
  ice: {
    name: '冰灵根',
    elements: ['water'],
    bonus: 0.4,
    description: '水之极致，寒冰之体。',
  },
  thunder: {
    name: '雷灵根',
    elements: ['metal', 'wood'],
    bonus: 0.5,
    description: '金木交融，引动天雷。',
  },
  wind: {
    name: '风灵根',
    elements: ['wood'],
    bonus: 0.4,
    description: '木之灵动，御风而行。',
  },
  yin_yang: {
    name: '阴阳灵根',
    elements: ['water', 'fire'],
    bonus: 0.8,
    description: '水火相济，阴阳调和。',
  },
  void: {
    name: '虚空灵根',
    elements: [],
    bonus: 1.0,
    description: '无中生有，虚空造化。极其罕见的特殊灵根。',
  },
};

// 随机生成灵根
export function generateSpiritualRoot(qualityBonus: number = 0): SpiritualRoot {
  const random = Math.random() + qualityBonus / 100;

  let quality: SpiritualRoot['quality'];
  if (random > 0.99) {
    quality = 'chaos';
  } else if (random > 0.9) {
    quality = 'heavenly';
  } else if (random > 0.6) {
    quality = 'excellent';
  } else if (random > 0.3) {
    quality = 'ordinary';
  } else {
    quality = 'mortal';
  }

  // 随机元素数量 (1-5)
  const elementCount = quality === 'chaos' ? 5 :
    quality === 'heavenly' ? 1 :
    Math.min(5, Math.floor(Math.random() * 3) + 1);

  const allElements: Element[] = ['metal', 'wood', 'water', 'fire', 'earth'];
  const elements: Element[] = [];

  for (let i = 0; i < elementCount; i++) {
    const available = allElements.filter(e => !elements.includes(e));
    if (available.length === 0) break;
    const randomIndex = Math.floor(Math.random() * available.length);
    elements.push(available[randomIndex]);
  }

  // 纯度根据品质生成
  const basePurity = {
    mortal: 10,
    ordinary: 30,
    excellent: 50,
    heavenly: 80,
    chaos: 95,
  };
  const purity = Math.min(100, basePurity[quality] + Math.floor(Math.random() * 20));

  // 检查是否为特殊灵根
  let special: string | undefined;
  if (quality === 'heavenly' || quality === 'chaos') {
    for (const [key, config] of Object.entries(SPECIAL_SPIRITUAL_ROOTS)) {
      if (config.elements.length === elements.length &&
          config.elements.every(e => elements.includes(e))) {
        if (Math.random() > 0.7) {
          special = key;
          break;
        }
      }
    }
  }

  return { elements, quality, purity, special };
}

// 获取灵根显示名称
export function getSpiritualRootName(root: SpiritualRoot): string {
  if (root.special && SPECIAL_SPIRITUAL_ROOTS[root.special]) {
    return SPECIAL_SPIRITUAL_ROOTS[root.special].name;
  }

  const elementNames = root.elements.map(e => ELEMENT_NAMES[e]).join('');
  const qualityName = SPIRITUAL_ROOT_QUALITY_NAMES[root.quality];

  if (root.elements.length === 1) {
    return `${elementNames}系${qualityName}单灵根`;
  } else if (root.elements.length === 2) {
    return `${elementNames}${qualityName}双灵根`;
  } else if (root.elements.length === 3) {
    return `${elementNames}${qualityName}三灵根`;
  } else if (root.elements.length === 4) {
    return `${elementNames}${qualityName}四灵根`;
  } else {
    return `${qualityName}五行全灵根`;
  }
}

// 计算灵根修炼加成
export function getSpiritualRootBonus(root: SpiritualRoot): number {
  let bonus = SPIRITUAL_ROOT_QUALITY_BONUS[root.quality];

  // 灵根数量惩罚（杂灵根修炼慢）
  if (root.elements.length > 1 && root.quality !== 'chaos') {
    bonus -= (root.elements.length - 1) * 0.1;
  }

  // 特殊灵根加成
  if (root.special && SPECIAL_SPIRITUAL_ROOTS[root.special]) {
    bonus += SPECIAL_SPIRITUAL_ROOTS[root.special].bonus;
  }

  // 纯度加成
  bonus += (root.purity / 100) * 0.2;

  return Math.max(0, bonus);
}
