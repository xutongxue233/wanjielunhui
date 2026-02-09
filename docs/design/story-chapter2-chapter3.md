# 剧情系统扩展设计文档 - 第二章与第三章

## 概述

### 当前状态分析

**已完成的内容:**
1. **序章剧情** (`src/data/stories/prologue.ts`)
   - 山村孤儿开局 (`villageOrphanStory`) - 14个节点，完整
   - 家族余孤开局 (`fallenClanStory`) - 11个节点，完整
   - 转世重修开局 (`reincarnationStory`) - 12个节点，完整

2. **剧情系统架构**
   - `StoryPanel.tsx` - 剧情展示组件（打字效果、选择、历史）
   - `gameStore.ts` - 剧情状态管理（进度、flag、历史）
   - 类型定义完整：`StoryNode`, `StoryChoice`, `StoryEffect`, `StoryCondition`

3. **后端种子数据** (`server/prisma/seed/story-chapters.ts`)
   - 已规划10章剧情框架
   - 第一章、第二章节点结构已设计（但未与前端集成）

**缺失的内容:**
1. 前端只有序章剧情数据，没有后续章节
2. 序章完成后缺少章节过渡机制
3. 缺少剧情解锁条件系统
4. 缺少战斗节点的实际战斗集成

### 本次开发目标

开发第二章「拜入仙门」和第三章「外门历练」的完整剧情内容，并完善章节过渡系统。

- **功能目标**: 让玩家在序章完成后能继续体验主线剧情
- **目标用户**: 完成序章、达到炼气中期以上的玩家
- **优先级**: P0核心功能

---

## 数据模型

### 章节数据结构

```typescript
// 新增章节配置接口
interface StoryChapter {
  id: string;                     // 章节ID
  name: string;                   // 章节名称
  description: string;            // 章节描述
  order: number;                  // 章节顺序
  unlockConditions: StoryCondition[];  // 解锁条件
  startNodeId: string;            // 起始节点ID
  rewards: ChapterReward[];       // 完成奖励
}

interface ChapterReward {
  type: 'item' | 'cultivation' | 'attribute' | 'technique' | 'skill';
  target: string;
  value: number;
}
```

### 前端 State 扩展

```typescript
// gameStore.ts 扩展
interface StoryProgress {
  // 现有字段...
  availableChapters: string[];    // 已解锁的章节ID列表
  currentChapterProgress: number; // 当前章节进度百分比
}

// 新增方法
unlockChapter: (chapterId: string) => void;
checkChapterUnlock: (chapter: StoryChapter) => boolean;
grantChapterRewards: (rewards: ChapterReward[]) => void;
```

---

## 剧情内容设计

### 第二章：拜入仙门

**解锁条件:**
- 序章完成 (`prologue_completed === true`)
- 境界达到炼气中期 (`realm.level >= 2`)

**章节概要:**
独自修炼遇到瓶颈，听闻青云宗招收弟子，前往拜师。经历三关考核后成为外门弟子。

**剧情节点设计:**

```
节点流程图:

start
  |
  v
journey_begin --> meet_companion --> choice_companion
  |                                      |
  v                                      v
arrive_sect <------------------------ befriend / alone
  |
  v
test_intro --> test_1_spiritual --> test_2_heart --> choice_heart
  |                                                     |
  v                                                     v
test_3_battle -----> battle_node -----> victory --> initiation
  |                                        |
  v                                        v
                                      chapter_end
```

**关键节点详情:**

| 节点ID | 类型 | 内容概要 | 选择/效果 |
|--------|------|----------|-----------|
| ch2_start | narration | 修炼遇瓶颈，得知青云宗招弟子 | - |
| ch2_meet_companion | dialogue | 路遇刘青，热情搭话 | - |
| ch2_choice_companion | choice | 是否结伴同行 | 结伴+气运，独行+无羁无绊flag |
| ch2_arrive_sect | narration | 描述青云宗壮观景象 | - |
| ch2_test_1 | narration | 灵根测试通过 | - |
| ch2_test_2_choice | choice | 心境考验的应对方式 | 3选项影响属性和flag |
| ch2_test_3_battle | battle | 与考生对战 | 战斗胜利 |
| ch2_initiation | narration | 正式成为外门弟子 | 获得门派服装 |
| ch2_end | narration | 章节结束，展望未来 | chapter_2_completed flag |

**关键NPC:**
- 刘青 - 热情的同路人，可成为朋友
- 青云宗执事 - 考核主持者
- 对战考生 - boss级敌人

---

### 第三章：外门历练

**解锁条件:**
- 第二章完成 (`chapter_2_completed === true`)
- 境界达到炼气后期 (`realm.level >= 3`)

**章节概要:**
成为外门弟子后接受第一个任务：调查村庄失踪案。发现妖兽作祟，击杀妖兽，获得认可。

**剧情节点设计:**

```
节点流程图:

start
  |
  v
daily_life --> task_board --> choice_task
  |                              |
  v                              v
investigation <--- 调查任务 / 采药任务 / 巡逻任务
  |
  v
village_arrival --> meet_village_chief --> gather_clues
  |
  v
choice_approach --> track_monster / set_trap / wait_night
  |                        |
  v                        v
find_lair <--------------- (合流)
  |
  v
boss_battle --> victory --> return_sect --> chapter_end
```

**关键节点详情:**

| 节点ID | 类型 | 内容概要 | 选择/效果 |
|--------|------|----------|-----------|
| ch3_start | narration | 外门弟子日常描写 | - |
| ch3_task_board | narration | 任务堂领取任务 | - |
| ch3_choice_task | choice | 选择任务类型 | 主线调查/支线采药/支线巡逻 |
| ch3_investigation | narration | 前往出事村庄 | - |
| ch3_gather_clues | dialogue | 与村长交谈收集线索 | - |
| ch3_choice_approach | choice | 选择追踪方式 | 影响后续战斗难度和奖励 |
| ch3_boss_battle | battle | 击杀妖兽 | 战斗胜利 |
| ch3_return_sect | narration | 回宗复命获得奖励 | 贡献点+物品 |
| ch3_end | narration | 获得外门认可，期待内门 | chapter_3_completed flag |

**关键NPC:**
- 任务堂执事 - 发布任务
- 村长 - 提供线索
- 妖兽 - boss

---

## 技术实现方案

### 1. 文件结构

```
src/data/stories/
├── index.ts              # 统一导出
├── prologue.ts           # 序章（现有）
├── chapter2.ts           # 第二章：拜入仙门
├── chapter3.ts           # 第三章：外门历练
└── chapters.ts           # 章节配置（解锁条件、奖励）
```

### 2. 章节配置文件

```typescript
// src/data/stories/chapters.ts
export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'prologue',
    name: '序章：机缘初现',
    description: '你的修仙之路从这里开始...',
    order: 0,
    unlockConditions: [],
    startNodeId: 'start',
    rewards: [],
  },
  {
    id: 'chapter_2',
    name: '第二章：拜入仙门',
    description: '为了获得更好的修炼资源，你决定拜入青云宗。',
    order: 1,
    unlockConditions: [
      { type: 'flag', key: 'prologue_completed', operator: '==', value: true },
      { type: 'realm', key: 'level', operator: '>=', value: 2 },
    ],
    startNodeId: 'ch2_start',
    rewards: [
      { type: 'item', target: 'qingyun_pao', value: 1 },
      { type: 'cultivation', target: 'base', value: 100 },
    ],
  },
  {
    id: 'chapter_3',
    name: '第三章：外门历练',
    description: '作为外门弟子，你需要完成任务证明自己。',
    order: 2,
    unlockConditions: [
      { type: 'flag', key: 'chapter_2_completed', operator: '==', value: true },
      { type: 'realm', key: 'level', operator: '>=', value: 3 },
    ],
    startNodeId: 'ch3_start',
    rewards: [
      { type: 'item', target: 'juyuandan', value: 5 },
      { type: 'attribute', target: 'comprehension', value: 5 },
    ],
  },
];
```

### 3. StoryPanel 改造

需要添加：
- 章节选择界面（当序章完成后显示）
- 章节解锁条件检查
- 章节完成奖励发放
- 战斗节点与 CombatStore 的集成

### 4. 战斗节点集成

```typescript
// StoryPanel.tsx 中处理 battle 类型节点
if (currentNode.type === 'battle') {
  // 触发战斗
  useCombatStore.getState().startBattle({
    enemies: currentNode.enemyIds,
    onVictory: () => {
      // 发放战斗奖励
      // 继续下一节点
    },
    onDefeat: () => {
      // 可选：重试或游戏结束
    },
  });
}
```

---

## 交互流程

### 章节过渡流程

1. 玩家完成当前章节最后一个节点
2. 系统设置章节完成flag
3. 检查并解锁满足条件的新章节
4. 显示章节完成界面，展示奖励
5. 玩家返回主界面或选择进入下一章

### 剧情面板新交互

1. **章节列表入口**: 在剧情面板增加"章节"按钮
2. **章节选择**: 展示所有已解锁章节，可重新查看
3. **进度显示**: 显示当前章节进度百分比
4. **条件提示**: 未解锁章节显示解锁条件

---

## 边界情况

### 空数据处理
- 未解锁任何章节时显示引导
- 章节数据加载失败时显示错误提示

### 错误处理
- 节点ID不存在时的容错
- 战斗失败后的重试机制
- 存档与剧情进度不一致时的修复

### 并发处理
- 防止快速点击导致的重复节点跳转
- 打字效果中断时的状态清理

---

## 实现任务拆分

### 第一阶段：数据与结构

- [ ] 任务1: 创建章节配置文件 `chapters.ts`
- [ ] 任务2: 创建第二章剧情数据 `chapter2.ts`
- [ ] 任务3: 创建第三章剧情数据 `chapter3.ts`
- [ ] 任务4: 更新 `index.ts` 统一导出

### 第二阶段：状态管理

- [ ] 任务5: 扩展 `gameStore.ts` 添加章节管理方法
- [ ] 任务6: 实现章节解锁条件检查逻辑
- [ ] 任务7: 实现章节奖励发放逻辑

### 第三阶段：UI改造

- [ ] 任务8: 改造 `StoryPanel.tsx` 支持多章节
- [ ] 任务9: 添加章节选择界面
- [ ] 任务10: 添加章节完成界面

### 第四阶段：战斗集成

- [ ] 任务11: 实现战斗节点触发逻辑
- [ ] 任务12: 添加战斗结果回调处理
- [ ] 任务13: 添加战斗专用敌人数据

### 第五阶段：测试验证

- [ ] 任务14: 测试序章到第二章过渡
- [ ] 任务15: 测试第二章到第三章过渡
- [ ] 任务16: 测试所有分支选择
- [ ] 任务17: 测试战斗节点

---

## 剧情文案预览

### 第二章核心剧情

**ch2_start:**
> 独自修炼数月后，你发现进度越来越慢。功法的瓶颈、灵石的匮乏、修炼心得的缺失......种种问题困扰着你。某日，一位行脚商人告诉你，百里外有一座名为"青云宗"的修仙门派，每年都会招收新弟子。下一次招收就在半月之后。

**ch2_meet_liu (刘青):**
> "哟，又是一个去青云宗碰运气的？我叫刘青，家里世代都是凡人，听说今年青云宗扩招，这才豁出去想搏一个仙缘。你呢，看你气息内敛，莫非已经开始修炼了？"

**ch2_arrive_sect:**
> 青云宗坐落于青云峰之上，云雾缭绕间可见殿宇楼阁错落有致。青石阶梯蜿蜒而上，直入云霄。宗门山门前已经聚集了上千名怀揣仙途梦想的年轻人。一位穿着青色道袍的中年男子站在高台上，目光如电，扫视众人。

### 第三章核心剧情

**ch3_start:**
> 成为外门弟子已经一月有余。你住在外门弟子的群居山洞中，每日清晨领取杂役任务，午后听执事讲道，夜间修炼功法。虽然清苦，但比起独自摸索，进境已是快了许多。这一日，任务堂贴出了一个特殊任务......

**ch3_village_chief:**
> 老村长满脸愁容，叹息道："仙师明鉴，一月来已有五名村民失踪。起初我们以为是野兽所为，可搜遍山林也不见尸骨。直到三日前，有人看到一道黑影从刘家后院掠过......那身形，绝非凡兽！"

**ch3_boss_battle_intro:**
> 你循着妖气追踪至一处幽暗的山洞。洞口弥漫着浓重的血腥气息，隐约可闻洞深处传来的咀嚼声。你深吸一口气，催动体内灵力，踏入洞中。一双猩红的眼睛在黑暗中亮起——是一头已经化形的妖狼！

---

## 后续规划

完成第二、三章后，后续章节规划：

| 章节 | 名称 | 核心内容 | 对应境界 |
|------|------|----------|----------|
| 第四章 | 魔影初现 | 门派危机，揭露内奸 | 筑基 |
| 第五章 | 金丹之路 | 寻找结丹材料 | 筑基大圆满 |
| 第六章 | 秘府探险 | 上古遗迹探索 | 金丹 |
| 第七章 | 正魔之争 | 门派大战 | 金丹后期 |
| 第八章 | 元婴之劫 | 化婴历劫 | 元婴 |
| 第九章 | 因果轮回 | 解决过去恩怨 | 元婴 |
| 第十章 | 飞升之路 | 渡劫飞升 | 化神 |
