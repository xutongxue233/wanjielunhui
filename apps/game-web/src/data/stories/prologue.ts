import type { StoryNode } from '../../types';

// 山村孤儿开局剧情
export const villageOrphanStory: Record<string, StoryNode> = {
  start: {
    id: 'start',
    type: 'narration',
    content: '青山村，一个坐落于青云山脉脚下的偏僻小村。这里远离修仙界的纷争，村民们世代以耕种和采药为生。',
    nextNodeId: 'orphan_intro',
  },
  orphan_intro: {
    id: 'orphan_intro',
    type: 'narration',
    content: '你自幼父母双亡，被村中的老猎户王伯收养。十六年来，你跟随王伯学习打猎采药，虽然生活清贫，却也平静安乐。',
    nextNodeId: 'daily_life',
  },
  daily_life: {
    id: 'daily_life',
    type: 'narration',
    content: '这一日，你如往常一样进山采药。深秋的山林层林尽染，药草的清香弥漫在空气中。',
    nextNodeId: 'discover_cave',
  },
  discover_cave: {
    id: 'discover_cave',
    type: 'narration',
    content: '当你攀上一处陡峭的山崖寻找一株珍贵的灵芝时，脚下的岩石突然崩塌。你顺着山坡滚落，跌入了一个隐蔽的山洞中。',
    nextNodeId: 'cave_inside',
  },
  cave_inside: {
    id: 'cave_inside',
    type: 'narration',
    content: '洞内一片漆黑，你摸索着站起身来，发现自己竟然毫发无伤。借着洞口透入的微光，你看到洞壁上刻满了奇怪的符文。',
    nextNodeId: 'find_manual',
  },
  find_manual: {
    id: 'find_manual',
    type: 'narration',
    content: '在洞穴深处，一具白骨盘坐在石台之上。白骨前方，一本泛黄的古书静静躺着，书页上的字迹依稀可辨——《太初引气诀》。',
    nextNodeId: 'choice_take_manual',
  },
  choice_take_manual: {
    id: 'choice_take_manual',
    type: 'choice',
    content: '这本古书似乎记载着某种奇异的修炼之法。你要如何处置？',
    choices: [
      {
        text: '恭敬地取走古书，向白骨行礼致谢',
        nextNodeId: 'take_respectfully',
        effects: [
          { type: 'modify_attribute', target: 'luck', value: 5 },
          { type: 'set_flag', target: 'respectful_to_predecessor', value: true },
        ],
      },
      {
        text: '直接拿走古书，这是你的机缘',
        nextNodeId: 'take_directly',
        effects: [
          { type: 'modify_attribute', target: 'karma', value: 5 },
        ],
      },
      {
        text: '感觉不安，决定离开这个诡异的洞穴',
        nextNodeId: 'leave_cave',
      },
    ],
  },
  take_respectfully: {
    id: 'take_respectfully',
    type: 'narration',
    content: '你郑重地向白骨三鞠躬，心中默念感谢之语。就在你拿起古书的瞬间，一道温和的光芒从白骨中飞出，没入你的眉心。',
    nextNodeId: 'receive_blessing',
  },
  receive_blessing: {
    id: 'receive_blessing',
    type: 'narration',
    content: '刹那间，无数修炼的画面在你脑海中闪过。虽然转瞬即逝，但那种玄妙的感觉却深深烙印在你心中。这是前辈留下的一丝感悟！',
    nextNodeId: 'leave_cave_with_manual',
    effects: [
      { type: 'modify_attribute', target: 'comprehension', value: 10 },
    ],
  },
  take_directly: {
    id: 'take_directly',
    type: 'narration',
    content: '你毫不犹豫地拿起古书。白骨似乎轻轻颤动了一下，但很快又恢复了平静。或许只是你的错觉。',
    nextNodeId: 'leave_cave_with_manual',
  },
  leave_cave: {
    id: 'leave_cave',
    type: 'narration',
    content: '你转身向洞口走去。然而就在此时，洞口突然坍塌，将你困在了洞中。看来，这份机缘你不得不接受了。',
    nextNodeId: 'forced_take_manual',
  },
  forced_take_manual: {
    id: 'forced_take_manual',
    type: 'narration',
    content: '被困洞中的你别无选择，只能翻开那本古书。借着从缝隙中透入的微光，你开始研读其中记载的修炼之法。',
    nextNodeId: 'start_cultivation',
  },
  leave_cave_with_manual: {
    id: 'leave_cave_with_manual',
    type: 'narration',
    content: '你将古书小心收好，循着来路离开了山洞。夕阳西下，山村的炊烟已经升起。你的心中却翻涌着难以言喻的激动——这或许就是传说中的修仙功法！',
    nextNodeId: 'return_home',
  },
  return_home: {
    id: 'return_home',
    type: 'narration',
    content: '回到家中，你谎称今日无所收获。入夜后，你躲在房中，就着油灯的微光，开始研读那本《太初引气诀》。',
    nextNodeId: 'start_cultivation',
  },
  start_cultivation: {
    id: 'start_cultivation',
    type: 'narration',
    content: '功法开篇便写道：「修仙之道，先引气入体。凡人肉体凡胎，需以特殊法门沟通天地灵气，方能踏上仙途......」',
    nextNodeId: 'first_meditation',
  },
  first_meditation: {
    id: 'first_meditation',
    type: 'narration',
    content: '你按照功法所述，盘膝而坐，调整呼吸，尝试感应传说中的「灵气」。起初什么也感觉不到，但当你静心凝神之际，似乎有一丝若有若无的气息在体内流转。',
    nextNodeId: 'feel_spiritual_root',
  },
  feel_spiritual_root: {
    id: 'feel_spiritual_root',
    type: 'narration',
    content: '这一丝气息虽然微弱，却让你浑身舒泰。功法上说，这便是灵根初显的征兆。看来你并非毫无修仙资质！',
    nextNodeId: 'chapter_end',
  },
  chapter_end: {
    id: 'chapter_end',
    type: 'narration',
    content: '从这一夜起，你白天照常劳作，夜间则秘密修炼。你的修仙之路，就此开始......',
    effects: [
      { type: 'set_flag', target: 'prologue_completed', value: true },
    ],
  },
};

// 家族余孤开局剧情
export const fallenClanStory: Record<string, StoryNode> = {
  start: {
    id: 'start',
    type: 'narration',
    content: '月黑风高的夜晚，火光映红了半边天空。曾经辉煌的陈家大宅，此刻已陷入一片火海之中。',
    nextNodeId: 'clan_attack',
  },
  clan_attack: {
    id: 'clan_attack',
    type: 'narration',
    content: '「杀！一个不留！」黑衣人的厉喝声中，惨叫此起彼伏。陈家三百余口，今夜怕是难逃灭门之祸。',
    nextNodeId: 'father_sacrifice',
  },
  father_sacrifice: {
    id: 'father_sacrifice',
    type: 'narration',
    content: '「孩子，快走！」你的父亲将一枚玉佩和一本古籍塞入你手中，眼中满是决绝，「记住，是王家！王家害了我们全族！」',
    nextNodeId: 'escape',
  },
  escape: {
    id: 'escape',
    type: 'narration',
    content: '父亲一掌将你推入密道，随即转身迎向了涌来的敌人。密道深处，你听到父亲最后的怒吼与敌人的惨叫交织在一起。',
    nextNodeId: 'escape_tunnel',
  },
  escape_tunnel: {
    id: 'escape_tunnel',
    type: 'narration',
    content: '你在黑暗中狂奔，泪水模糊了视线。不知过了多久，你终于从一处山林中钻出。回望来路，只见陈家所在的方向，冲天火光渐渐暗淡。',
    nextNodeId: 'survival',
  },
  survival: {
    id: 'survival',
    type: 'narration',
    content: '你在荒野中流浪了数日，饥寒交迫之下，终于晕倒在一个偏僻的村庄外。一位好心的老农将你救回家中。',
    nextNodeId: 'recovery',
  },
  recovery: {
    id: 'recovery',
    type: 'narration',
    content: '养伤期间，你翻开父亲留下的古籍——《陈家吐纳心法》。这是陈家代代相传的修炼功法，如今只剩你这一脉单传。',
    nextNodeId: 'vow_revenge',
  },
  vow_revenge: {
    id: 'vow_revenge',
    type: 'choice',
    content: '你握紧父亲留下的玉佩，心中立下誓言。',
    choices: [
      {
        text: '我定要修成大道，为陈家报仇雪恨！',
        nextNodeId: 'revenge_path',
        effects: [
          { type: 'modify_attribute', target: 'karma', value: 10 },
          { type: 'set_flag', target: 'revenge_vow', value: true },
        ],
      },
      {
        text: '我要变强，强到没有人能再伤害我',
        nextNodeId: 'power_path',
        effects: [
          { type: 'modify_attribute', target: 'comprehension', value: 5 },
          { type: 'set_flag', target: 'power_seeking', value: true },
        ],
      },
      {
        text: '我要查明真相，或许事情没有那么简单',
        nextNodeId: 'truth_path',
        effects: [
          { type: 'modify_attribute', target: 'luck', value: 5 },
          { type: 'set_flag', target: 'seeking_truth', value: true },
        ],
      },
    ],
  },
  revenge_path: {
    id: 'revenge_path',
    type: 'narration',
    content: '仇恨在你心中燃烧，成为驱使你前进的动力。你开始日夜不停地修炼，誓要早日踏入修仙界，让王家血债血偿！',
    nextNodeId: 'chapter_end',
  },
  power_path: {
    id: 'power_path',
    type: 'narration',
    content: '弱肉强食，这个世界的法则如此残酷。你深吸一口气，决心追求力量的巅峰，再也不受人欺凌。',
    nextNodeId: 'chapter_end',
  },
  truth_path: {
    id: 'truth_path',
    type: 'narration',
    content: '你仔细回忆那晚的情景，父亲临终前的眼神中似乎不只有仇恨，还有一丝困惑。或许，事情的真相远比你所知的更加复杂。',
    nextNodeId: 'chapter_end',
  },
  chapter_end: {
    id: 'chapter_end',
    type: 'narration',
    content: '无论选择什么道路，你首先要做的都是变强。你翻开家传功法，开始了艰苦的修炼......',
    effects: [
      { type: 'set_flag', target: 'prologue_completed', value: true },
    ],
  },
};

// 转世重修开局剧情
export const reincarnationStory: Record<string, StoryNode> = {
  start: {
    id: 'start',
    type: 'narration',
    content: '混沌虚空中，一缕残魂飘荡。这是一位曾经震动三界的大能，在渡劫时遭人暗算，形神俱灭，只余一丝真灵不灭。',
    nextNodeId: 'reincarnation',
  },
  reincarnation: {
    id: 'reincarnation',
    type: 'narration',
    content: '不知过了多少岁月，这一缕真灵终于寻到了转世的契机。在轮回的牵引下，你降生于一个普通的凡人家庭。',
    nextNodeId: 'childhood',
  },
  childhood: {
    id: 'childhood',
    type: 'narration',
    content: '你的童年平淡无奇，只是偶尔会做一些奇怪的梦——梦中有仙山楼阁、有呼风唤雨的神通、有......一双充满杀意的眼睛。',
    nextNodeId: 'awakening',
  },
  awakening: {
    id: 'awakening',
    type: 'narration',
    content: '十六岁生日那天，你在睡梦中突然感到一阵剧烈的头痛。脑海深处，无数碎片化的记忆如潮水般涌来——你想起了！你并非凡人！',
    nextNodeId: 'memory_fragments',
  },
  memory_fragments: {
    id: 'memory_fragments',
    type: 'narration',
    content: '然而记忆并不完整，你只知道自己前世是一位修为通天的强者，在渡最后一道天劫时被人暗算......暗算你的人是谁？你为什么要渡劫？这一切都笼罩在迷雾之中。',
    nextNodeId: 'inherited_knowledge',
  },
  inherited_knowledge: {
    id: 'inherited_knowledge',
    type: 'narration',
    content: '虽然前世记忆残缺，但修炼的感悟却深刻在灵魂之中。当你尝试引气入体时，发现一切都如此自然，仿佛只是在唤醒沉睡的本能。',
    nextNodeId: 'choice_attitude',
  },
  choice_attitude: {
    id: 'choice_attitude',
    type: 'choice',
    content: '面对这破碎的前世记忆，你决定......',
    choices: [
      {
        text: '追寻前世真相，找出暗算我之人',
        nextNodeId: 'seek_past',
        effects: [
          { type: 'set_flag', target: 'seeking_past', value: true },
          { type: 'modify_attribute', target: 'karma', value: 5 },
        ],
      },
      {
        text: '既已转世，便从头开始，不问前尘',
        nextNodeId: 'new_life',
        effects: [
          { type: 'set_flag', target: 'new_beginning', value: true },
          { type: 'modify_attribute', target: 'luck', value: 10 },
        ],
      },
      {
        text: '慢慢恢复记忆，看命运如何安排',
        nextNodeId: 'follow_fate',
        effects: [
          { type: 'set_flag', target: 'follow_fate', value: true },
          { type: 'modify_attribute', target: 'comprehension', value: 5 },
        ],
      },
    ],
  },
  seek_past: {
    id: 'seek_past',
    type: 'narration',
    content: '前世之仇，此生必报！你暗暗发誓，一定要恢复全部记忆，找到那个暗算你的仇人。但首先，你需要重新修炼，恢复实力。',
    nextNodeId: 'chapter_end',
  },
  new_life: {
    id: 'new_life',
    type: 'narration',
    content: '过去的已经过去，既然上天给了你重来的机会，何必执着于前尘往事？你决定以全新的心态，重走修仙之路。',
    nextNodeId: 'chapter_end',
  },
  follow_fate: {
    id: 'follow_fate',
    type: 'narration',
    content: '冥冥中自有天意，既然记忆会逐渐恢复，那就顺其自然吧。你相信，该知道的终究会知道，该面对的终究要面对。',
    nextNodeId: 'chapter_end',
  },
  chapter_end: {
    id: 'chapter_end',
    type: 'narration',
    content: '凭借着前世的修炼感悟，你的修炼速度远超常人。然而你知道，这只是漫漫仙途的开始......',
    effects: [
      { type: 'set_flag', target: 'prologue_completed', value: true },
    ],
  },
};

// 导出所有剧情
export const storyChapters = {
  village_orphan: villageOrphanStory,
  fallen_clan: fallenClanStory,
  reincarnation: reincarnationStory,
};

// 获取剧情节点
export function getStoryNode(origin: string, nodeId: string): StoryNode | null {
  const chapter = storyChapters[origin as keyof typeof storyChapters];
  if (!chapter) return null;
  return chapter[nodeId] || null;
}
