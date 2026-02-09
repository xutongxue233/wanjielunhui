# 游戏数据命令

你是游戏数据设计师，负责设计和配置游戏内的各类数据。

## 输入

- 数据类型（物品/功法/敌人/副本等）
- 设计要求
- 数值范围参考

## 数据类型

### 1. 物品 (Items)

位置：`src/data/items/`

```typescript
// 丹药
export const pill: Item = {
  id: 'pill-xxx',
  name: '回灵丹',
  type: 'consumable',
  subType: 'pill',
  rarity: 'rare',        // common | uncommon | rare | epic | legendary
  description: '服用后恢复灵力500点',
  icon: 'pill-huiling',
  effects: [
    { type: 'restore_mp', value: 500 }
  ],
  price: { buy: 100, sell: 50 },
  stackable: true,
  maxStack: 99
}

// 装备
export const equipment: Equipment = {
  id: 'weapon-xxx',
  name: '青锋剑',
  type: 'equipment',
  slot: 'weapon',
  rarity: 'epic',
  description: '青云门入门弟子佩剑',
  icon: 'sword-qingfeng',
  stats: {
    attack: 50,
    critRate: 0.05
  },
  requirements: {
    realm: 'zhuji',
    level: 20
  },
  setId: 'qingyun-set'
}
```

### 2. 功法 (Techniques)

位置：`src/data/techniques/`

```typescript
export const technique: Technique = {
  id: 'tech-xxx',
  name: '太乙真诀',
  type: 'cultivation',   // cultivation | combat | auxiliary
  grade: 'earth',        // mortal | earth | heaven | divine
  description: '太乙门镇派功法，修炼可大幅提升修为',
  effects: {
    cultivationSpeed: 1.5,    // 修炼速度倍率
    mpRegen: 10               // 灵力恢复
  },
  requirements: {
    realm: 'jindan',
    spiritualRoot: ['fire', 'earth']
  },
  stages: [
    { name: '入门', exp: 0, bonus: {} },
    { name: '小成', exp: 1000, bonus: { attack: 10 } },
    { name: '大成', exp: 5000, bonus: { attack: 30 } },
    { name: '圆满', exp: 20000, bonus: { attack: 60 } }
  ]
}
```

### 3. 敌人 (Enemies)

位置：`src/data/combat/enemies/`

```typescript
export const enemy: Enemy = {
  id: 'enemy-xxx',
  name: '噬魂魔',
  type: 'demon',
  level: 30,
  realm: 'jindan',
  stats: {
    hp: 5000,
    mp: 1000,
    attack: 150,
    defense: 80,
    speed: 60
  },
  skills: ['skill-soul-devour', 'skill-dark-claw'],
  ai: 'aggressive',      // aggressive | defensive | balanced
  drops: [
    { itemId: 'material-demon-core', rate: 0.3, count: [1, 2] },
    { itemId: 'gold', rate: 1, count: [100, 200] }
  ],
  exp: 500,
  description: '幽冥界的低阶魔物，以吞噬灵魂为生'
}
```

### 4. 副本 (Dungeons)

位置：`src/data/combat/dungeons/`

```typescript
export const dungeon: Dungeon = {
  id: 'dungeon-xxx',
  name: '幽冥古墓',
  type: 'instance',
  difficulty: 'hard',
  levelRange: [25, 35],
  realmRequirement: 'jindan',
  description: '传说中的上古修士墓地，危险与机遇并存',
  stages: [
    {
      id: 'stage-1',
      name: '墓道',
      enemies: ['enemy-skeleton', 'enemy-skeleton'],
      rewards: { exp: 200, gold: 50 }
    },
    {
      id: 'stage-2',
      name: '主墓室',
      enemies: ['enemy-tomb-guardian'],
      isBoss: true,
      rewards: { exp: 1000, items: ['item-ancient-manual'] }
    }
  ],
  firstClearRewards: {
    items: ['equipment-tomb-ring'],
    title: '古墓探险者'
  },
  dailyLimit: 3,
  cost: { stamina: 30 }
}
```

## 数值平衡原则

### 成长曲线
- 线性成长：基础属性
- 指数成长：战力/修为
- 递减收益：强化/升级

### 稀有度权重
| 稀有度 | 基础数值 | 掉率 |
|--------|----------|------|
| common | 1x | 60% |
| uncommon | 1.5x | 25% |
| rare | 2x | 10% |
| epic | 3x | 4% |
| legendary | 5x | 1% |

### 境界数值参考
| 境界 | 基础战力 | 推荐等级 |
|------|----------|----------|
| 练气 | 100 | 1-10 |
| 筑基 | 500 | 11-20 |
| 金丹 | 2000 | 21-40 |
| 元婴 | 8000 | 41-60 |

## 输出

1. 将数据写入对应文件
2. 更新索引文件（如 index.ts）
3. 确保类型正确

## 禁止事项

- 不创建数值失衡的数据
- 不复制已有 ID
- 不遗漏必填字段

## 退出条件

- 数据文件创建完成
- 类型检查通过
- 数值在合理范围
