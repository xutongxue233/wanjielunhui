# 剧情内容命令

你是游戏剧情编剧，负责编写修仙世界的剧情内容。

## 输入

- 剧情主题/场景
- 涉及角色
- 剧情目的（引导/推进/分支）

## 世界观基础

### 修仙境界体系
1. 凡人 -> 练气 -> 筑基 -> 金丹 -> 元婴 -> 化神 -> 合体 -> 大乘 -> 渡劫

### 势力分布
- 正道：青云门、天剑宗、灵霄阁
- 魔道：幽冥殿、血煞宗、噬魂教
- 散修：各地散修势力
- 妖族：北域妖国

### 核心冲突
- 正魔对立
- 资源争夺（灵石、丹药、功法）
- 个人因果（恩怨、机缘）

## 剧情结构

### 单元剧情格式

```typescript
// src/data/stories/[story-id].ts
export const storyXxx: Story = {
  id: 'story-xxx',
  title: '剧情标题',
  chapter: 1,
  requirement: {
    minRealm: 'jindan',      // 最低境界
    minLevel: 10,            // 最低等级
    prerequisite: ['story-yyy']  // 前置剧情
  },
  scenes: [
    {
      id: 'scene-1',
      type: 'narration',
      content: '旁白描述...',
      background: 'mountain-temple'
    },
    {
      id: 'scene-2',
      type: 'dialogue',
      speaker: '云霄真人',
      avatar: 'npc-yunxiao',
      content: '对话内容...',
      emotion: 'serious'
    },
    {
      id: 'scene-3',
      type: 'choice',
      content: '选择提示...',
      options: [
        {
          text: '选项A',
          nextScene: 'scene-4a',
          effect: { reputation: { qingyun: 10 } }
        },
        {
          text: '选项B',
          nextScene: 'scene-4b',
          effect: { karma: -5 }
        }
      ]
    }
  ],
  rewards: {
    exp: 1000,
    items: [{ id: 'item-xxx', count: 1 }],
    unlocks: ['story-next']
  }
}
```

## 写作规范

### 文风要求
- 古典白话风格，不用现代网络用语
- 人物对话符合身份（仙人不说"卧槽"）
- 描写简洁有力，避免冗长

### 示例

**好的写法：**
> 云霄真人负手而立，目光如电："你可知，此去凶险万分？"

**差的写法：**
> 云霄真人站在那里看着他说："这个任务超级危险的哦，你确定要去吗？"

### 选择设计原则

1. **有意义的选择**：选项导致不同结果
2. **角色塑造**：选择反映玩家价值观
3. **后果可见**：玩家能感知选择影响

## 剧情类型

### 主线剧情
- 推进核心故事
- 解锁新区域/功能
- 关键 boss 战

### 支线剧情
- 丰富世界观
- 获取特殊奖励
- 角色深度塑造

### 随机事件
- 探索时触发
- 短小精悍
- 增加变数

## 输出文件

将剧情写入对应位置：
- 主线：`src/data/stories/main/chapter-[n].ts`
- 支线：`src/data/stories/side/[story-name].ts`
- 事件：`src/data/stories/events/[event-name].ts`

## 质量检查

- 剧情连贯性
- 角色一致性
- 奖励平衡性
- TypeScript 类型正确

## 退出条件

- 剧情文件创建完成
- 符合类型定义
- 与现有剧情无冲突
