import type { StoryNode } from '../../types';

// 第三章：外门历练
export const chapter3Story: Record<string, StoryNode> = {
  // ==================== 开篇：外门生活 ====================
  ch3_start: {
    id: 'ch3_start',
    type: 'narration',
    content: '成为外门弟子已经一月有余。你住在外门弟子的群居洞府中，每日清晨领取杂役任务，午后听执事讲道，夜间修炼功法。虽然清苦，但比起独自摸索，进境已是快了许多。',
    nextNodeId: 'ch3_daily_life',
  },
  ch3_daily_life: {
    id: 'ch3_daily_life',
    type: 'narration',
    content: '外门弟子的日子并不轻松。除了修炼，还要完成各种杂务——打扫殿堂、看守药田、搬运物资......但这一切都是值得的，因为完成任务可以获得宗门贡献点，兑换更好的修炼资源。',
    nextNodeId: 'ch3_task_board',
  },
  ch3_task_board: {
    id: 'ch3_task_board',
    type: 'narration',
    content: '这一日，你像往常一样来到任务堂领取任务。公示板上贴满了各种任务告示，有采药的、有护送的、也有剿灭妖兽的。其中一张红色告示特别醒目。',
    nextNodeId: 'ch3_special_task',
  },
  ch3_special_task: {
    id: 'ch3_special_task',
    type: 'narration',
    content: '红色告示上写着：「青山村村民连续失踪，疑有妖物作祟。需外门弟子前往调查，查明真相并解决问题。奖励：贡献点50，另有额外奖励。」',
    nextNodeId: 'ch3_task_officer',
  },
  ch3_task_officer: {
    id: 'ch3_task_officer',
    type: 'dialogue',
    speaker: '任务堂执事',
    content: '哦？你要接这个任务？这可是个麻烦事——已经有两批弟子去过了，都没查出什么名堂。不过贡献点确实给得多......你确定要接吗？',
    nextNodeId: 'ch3_accept_task',
  },
  ch3_accept_task: {
    id: 'ch3_accept_task',
    type: 'choice',
    content: '这个任务看起来有些棘手，但奖励丰厚。你的选择是？',
    choices: [
      {
        text: '接下任务，挑战才能让自己成长',
        nextNodeId: 'ch3_task_accepted',
        effects: [
          { type: 'set_flag', target: 'accepted_investigation', value: true },
        ],
      },
      {
        text: '先问问前两批弟子的情况再决定',
        nextNodeId: 'ch3_ask_info',
        effects: [
          { type: 'set_flag', target: 'cautious_approach', value: true },
        ],
      },
    ],
  },
  ch3_ask_info: {
    id: 'ch3_ask_info',
    type: 'dialogue',
    speaker: '任务堂执事',
    content: '前两批？第一批是三个炼气初期的弟子，去了三天，说是什么都没发现。第二批是一个炼气中期的，也是无功而返。但村民失踪的事仍在继续......要么是妖物太狡猾，要么......',
    nextNodeId: 'ch3_info_end',
  },
  ch3_info_end: {
    id: 'ch3_info_end',
    type: 'narration',
    content: '执事的话让你心生警觉。也许这件事比表面看起来更加复杂。但正因如此，你更想一探究竟。',
    nextNodeId: 'ch3_task_accepted',
  },
  ch3_task_accepted: {
    id: 'ch3_task_accepted',
    type: 'narration',
    content: '你在任务文书上签下自己的名字。执事递给你一份关于青山村的地图和简要情报。"小心行事。"他叮嘱道，"遇到危险就撤，别逞强。"',
    nextNodeId: 'ch3_journey_start',
    effects: [
      { type: 'set_flag', target: 'task_started', value: true },
    ],
  },

  // ==================== 前往青山村 ====================
  ch3_journey_start: {
    id: 'ch3_journey_start',
    type: 'narration',
    content: '青山村位于青云山脉的外围，距离宗门约有半日路程。你背着行囊，踏上了下山的小路。',
    nextNodeId: 'ch3_on_the_road',
  },
  ch3_on_the_road: {
    id: 'ch3_on_the_road',
    type: 'narration',
    content: '一路上，你回想着情报中的信息——失踪者共有六人，都是在夜间失踪，没有留下任何打斗痕迹。这说明凶手要么速度极快，要么......与受害者相识。',
    nextNodeId: 'ch3_arrive_village',
  },
  ch3_arrive_village: {
    id: 'ch3_arrive_village',
    type: 'narration',
    content: '日落时分，你抵达了青山村。村子不大，约有四五十户人家。此刻正值晚饭时间，却鲜见炊烟升起。村中弥漫着一股压抑的气氛。',
    nextNodeId: 'ch3_village_entrance',
  },
  ch3_village_entrance: {
    id: 'ch3_village_entrance',
    type: 'narration',
    content: '村口几个老人看到你的道袍，眼中闪过一丝希望。"又是青云宗的仙师？"一个老者上前问道，"这次......能救救我们吗？"',
    nextNodeId: 'ch3_meet_chief',
  },
  ch3_meet_chief: {
    id: 'ch3_meet_chief',
    type: 'dialogue',
    speaker: '村长',
    content: '仙师请进，老朽便是这青山村的村长。唉，一月来已有六人失踪，个个都是青壮年。再这样下去，我们这村子怕是要废了......',
    nextNodeId: 'ch3_chief_explain',
  },
  ch3_chief_explain: {
    id: 'ch3_chief_explain',
    type: 'dialogue',
    speaker: '村长',
    content: '失踪的都是夜间出门的人——有的是起夜，有的是听到动静出去查看。第二天就只剩下一摊血迹，人影都不见了。我们组织人手搜山，却什么也没找到。',
    nextNodeId: 'ch3_ask_details',
  },
  ch3_ask_details: {
    id: 'ch3_ask_details',
    type: 'choice',
    content: '你需要更多信息来判断情况。先问什么？',
    choices: [
      {
        text: '最近一次失踪是什么时候？在哪里？',
        nextNodeId: 'ch3_recent_case',
        effects: [
          { type: 'set_flag', target: 'asked_recent', value: true },
        ],
      },
      {
        text: '失踪者之间有什么共同点吗？',
        nextNodeId: 'ch3_common_point',
        effects: [
          { type: 'set_flag', target: 'asked_common', value: true },
        ],
      },
      {
        text: '村子周围有没有什么异常的地方？',
        nextNodeId: 'ch3_surroundings',
        effects: [
          { type: 'set_flag', target: 'asked_surroundings', value: true },
        ],
      },
    ],
  },
  ch3_recent_case: {
    id: 'ch3_recent_case',
    type: 'dialogue',
    speaker: '村长',
    content: '最近一次是三天前，李家的二小子。他半夜听到鸡叫，出去查看，就再也没回来。他家在村子东边，靠近山脚。我带仙师去看看？',
    nextNodeId: 'ch3_investigate',
  },
  ch3_common_point: {
    id: 'ch3_common_point',
    type: 'dialogue',
    speaker: '村长',
    content: '共同点？让我想想......都是青壮年，都是夜间失踪......对了，他们好像都住在村子东边，离山比较近的地方！',
    nextNodeId: 'ch3_investigate',
  },
  ch3_surroundings: {
    id: 'ch3_surroundings',
    type: 'dialogue',
    speaker: '村长',
    content: '异常的地方？村东边的山里，最近总能听到一些奇怪的叫声，像是野兽，又不太像。还有人说在夜里看到过红色的光芒......',
    nextNodeId: 'ch3_investigate',
  },

  // ==================== 调查 ====================
  ch3_investigate: {
    id: 'ch3_investigate',
    type: 'narration',
    content: '你决定先去最近一次失踪的现场看看。村长带你来到村东的一户人家，门口的血迹已经干涸发黑，空气中隐约还有一丝腥臭。',
    nextNodeId: 'ch3_examine_scene',
  },
  ch3_examine_scene: {
    id: 'ch3_examine_scene',
    type: 'narration',
    content: '你蹲下身仔细查看，发现血迹呈拖拽状，从门口一直延伸到篱笆缺口处。在泥地上，你发现了一些奇特的痕迹——像是兽爪，但比普通野兽大得多。',
    nextNodeId: 'ch3_discover_clue',
  },
  ch3_discover_clue: {
    id: 'ch3_discover_clue',
    type: 'narration',
    content: '你闭眼凝神，试图感应周围的气息。一丝微弱的妖气从山的方向传来——果然是妖物所为！而且这股妖气并不简单，已经达到了化形的边缘。',
    nextNodeId: 'ch3_plan_choice',
    effects: [
      { type: 'set_flag', target: 'detected_demon', value: true },
    ],
  },
  ch3_plan_choice: {
    id: 'ch3_plan_choice',
    type: 'choice',
    content: '你已经确定是妖物作祟，接下来如何行动？',
    choices: [
      {
        text: '趁夜色未深，立即追踪妖气进山',
        nextNodeId: 'ch3_track_immediately',
        effects: [
          { type: 'set_flag', target: 'approach_direct', value: true },
        ],
      },
      {
        text: '等到深夜，在村口设伏等妖物出现',
        nextNodeId: 'ch3_set_ambush',
        effects: [
          { type: 'set_flag', target: 'approach_ambush', value: true },
        ],
      },
      {
        text: '先休息养精蓄锐，明日白天进山搜索',
        nextNodeId: 'ch3_rest_first',
        effects: [
          { type: 'set_flag', target: 'approach_cautious', value: true },
        ],
      },
    ],
  },

  // ==================== 追踪路线 ====================
  ch3_track_immediately: {
    id: 'ch3_track_immediately',
    type: 'narration',
    content: '你决定趁妖物不备，主动出击。告别村长后，你循着妖气的方向进入山林。暮色中的山林阴森可怖，不时传来野兽的嚎叫。',
    nextNodeId: 'ch3_into_forest',
  },

  // ==================== 设伏路线 ====================
  ch3_set_ambush: {
    id: 'ch3_set_ambush',
    type: 'narration',
    content: '你决定以逸待劳。向村长借了些鸡血，在村口布置了简单的警戒法阵，然后藏身于一棵大树上，静静等待。',
    nextNodeId: 'ch3_ambush_wait',
  },
  ch3_ambush_wait: {
    id: 'ch3_ambush_wait',
    type: 'narration',
    content: '夜深了，村中一片寂静。子时刚过，你突然感应到一股妖气正在快速接近！你屏住呼吸，凝神等待......',
    nextNodeId: 'ch3_ambush_encounter',
  },
  ch3_ambush_encounter: {
    id: 'ch3_ambush_encounter',
    type: 'narration',
    content: '一道黑影如鬼魅般掠过村口，触动了你的警戒法阵！借着微弱的月光，你看清了那是一只体型巨大的妖狼，皮毛漆黑如墨，双眼泛着妖异的红光。',
    nextNodeId: 'ch3_ambush_attack',
  },
  ch3_ambush_attack: {
    id: 'ch3_ambush_attack',
    type: 'narration',
    content: '你从树上一跃而下，趁妖狼惊愕之际出手！然而妖狼的反应出乎意料的快，它发出一声怒吼，避开了你的致命一击，转身向山中逃去。',
    nextNodeId: 'ch3_chase',
  },
  ch3_chase: {
    id: 'ch3_chase',
    type: 'narration',
    content: '你岂能让它逃走？运起轻功紧追不舍。妖狼虽然受了伤，速度却依然惊人。你追了足足一炷香的时间，才看到它钻进了一处山洞。',
    nextNodeId: 'ch3_find_lair',
  },

  // ==================== 休息路线 ====================
  ch3_rest_first: {
    id: 'ch3_rest_first',
    type: 'narration',
    content: '你决定先保存体力。在村长家借宿一晚后，第二天一早便进山搜索。白天的山林没那么可怕，但寻找妖物的踪迹却更加困难。',
    nextNodeId: 'ch3_daytime_search',
  },
  ch3_daytime_search: {
    id: 'ch3_daytime_search',
    type: 'narration',
    content: '你花了大半天时间，终于在一处偏僻的山谷中发现了异常——地上散落着一些骨骸，有的已经风化，有的还很新鲜。这里，就是妖物的巢穴！',
    nextNodeId: 'ch3_find_lair',
  },

  // ==================== 发现巢穴 ====================
  ch3_into_forest: {
    id: 'ch3_into_forest',
    type: 'narration',
    content: '你在山林中穿行，妖气的踪迹时断时续。忽然，一阵腥风扑面而来，你循着气味望去，发现前方有一处隐蔽的山洞。',
    nextNodeId: 'ch3_find_lair',
  },
  ch3_find_lair: {
    id: 'ch3_find_lair',
    type: 'narration',
    content: '山洞入口不大，周围杂草丛生，显然是刻意掩饰过的。洞内传来阵阵血腥气息，还有......低沉的喘息声。妖物就在里面！',
    nextNodeId: 'ch3_enter_lair',
  },
  ch3_enter_lair: {
    id: 'ch3_enter_lair',
    type: 'narration',
    content: '你深吸一口气，催动体内灵力护体，然后踏入洞中。洞穴比想象中要深，越往里走，妖气越浓。在一处宽阔的洞室中，你终于看到了目标。',
    nextNodeId: 'ch3_face_demon',
  },
  ch3_face_demon: {
    id: 'ch3_face_demon',
    type: 'narration',
    content: '一只体型巨大的妖狼盘踞在洞室中央，皮毛漆黑如墨，双眼泛着妖异的红光。它的身旁散落着累累白骨——那些失踪村民的遗骸。',
    nextNodeId: 'ch3_demon_react',
  },
  ch3_demon_react: {
    id: 'ch3_demon_react',
    type: 'narration',
    content: '妖狼察觉到你的存在，猛然抬头。它的嘴角还挂着血迹，显然刚刚进食完毕。看到你，它不惊反喜，舔了舔嘴唇，发出一声低沉的嘶吼。',
    nextNodeId: 'ch3_demon_speak',
  },
  ch3_demon_speak: {
    id: 'ch3_demon_speak',
    type: 'dialogue',
    speaker: '妖狼',
    content: '嘿嘿......又有送上门的肉食。人类的修士，肉质最是鲜美，灵气也最充足......本座等你很久了！',
    nextNodeId: 'ch3_battle_start',
  },
  ch3_battle_start: {
    id: 'ch3_battle_start',
    type: 'narration',
    content: '妖狼话音未落，已化作一道黑影扑来！你早有防备，侧身避开的同时，一道剑气斩出。战斗，正式开始！',
    nextNodeId: 'ch3_boss_battle',
  },
  ch3_boss_battle: {
    id: 'ch3_boss_battle',
    type: 'battle',
    content: '黑煞妖狼露出了獠牙！这是一场生死之战，你必须全力以赴！',
    battleId: 'story_3_2',  // 关联妖狼王副本
    nextNodeId: 'ch3_battle_victory',
    effects: [
      { type: 'set_flag', target: 'battle_demon_wolf', value: true },
    ],
  },
  ch3_battle_victory: {
    id: 'ch3_battle_victory',
    type: 'narration',
    content: '激战过后，妖狼轰然倒地。它的身体逐渐失去生机，妖气消散，只留下一颗拳头大小的妖丹和一张完整的狼皮。',
    nextNodeId: 'ch3_collect_loot',
    effects: [
      { type: 'set_flag', target: 'demon_defeated', value: true },
    ],
  },
  ch3_collect_loot: {
    id: 'ch3_collect_loot',
    type: 'narration',
    content: '你收起妖丹和狼皮——这些都是珍贵的修炼材料，足以换取不少贡献点。随后，你在洞中仔细搜索，找到了一些村民的遗物，可以带回去交给他们的家人。',
    nextNodeId: 'ch3_return_village',
  },

  // ==================== 返回 ====================
  ch3_return_village: {
    id: 'ch3_return_village',
    type: 'narration',
    content: '你回到青山村，将好消息告诉了村长。得知妖物已除，村民们喜极而泣，纷纷前来道谢。虽然无法挽回逝者，但至少活着的人不用再担惊受怕。',
    nextNodeId: 'ch3_village_thanks',
  },
  ch3_village_thanks: {
    id: 'ch3_village_thanks',
    type: 'dialogue',
    speaker: '村长',
    content: '仙师大恩大德，我们全村人没齿难忘！这是村里凑的一点心意，请仙师务必收下。日后仙师若有需要，青山村上下定当全力相助！',
    nextNodeId: 'ch3_receive_village_reward',
  },
  ch3_receive_village_reward: {
    id: 'ch3_receive_village_reward',
    type: 'narration',
    content: '村民们送上了一些土特产和药材，虽然不是什么珍贵之物，却是他们最真挚的谢意。你收下礼物，告别村民，启程返回青云宗。',
    nextNodeId: 'ch3_return_sect',
    effects: [
      { type: 'set_flag', target: 'village_grateful', value: true },
    ],
  },
  ch3_return_sect: {
    id: 'ch3_return_sect',
    type: 'narration',
    content: '回到宗门后，你向任务堂提交了任务完成报告和妖物的妖丹作为证明。执事验看后，脸上露出惊讶之色。',
    nextNodeId: 'ch3_task_complete',
  },
  ch3_task_complete: {
    id: 'ch3_task_complete',
    type: 'dialogue',
    speaker: '任务堂执事',
    content: '好小子，还真让你办成了！这妖狼至少是二阶妖兽，你一个炼气期的弟子能将其斩杀，实属不易。除了原定的50贡献点，我再给你加20点作为额外奖励！',
    nextNodeId: 'ch3_reward',
  },
  ch3_reward: {
    id: 'ch3_reward',
    type: 'narration',
    content: '你领取了贡献点和奖励，心中颇为满足。这次任务不仅提升了你的实战经验，还让你在外门弟子中小有名气。',
    nextNodeId: 'ch3_recognition',
    effects: [
      { type: 'modify_attribute', target: 'luck', value: 5 },
    ],
  },
  ch3_recognition: {
    id: 'ch3_recognition',
    type: 'narration',
    content: '回洞府的路上，不少弟子投来敬佩的目光。独自斩杀二阶妖兽，这份战绩即便在外门弟子中也是罕见的。你的名字，开始在外门中流传。',
    nextNodeId: 'ch3_chapter_end',
  },
  ch3_chapter_end: {
    id: 'ch3_chapter_end',
    type: 'narration',
    content: '这次历练让你深刻体会到：纸上得来终觉浅，绝知此事要躬行。修炼不仅是闭门苦修，更要在实战中磨砺自身。你暗下决心，日后要接下更多、更难的任务，在历练中不断成长！',
    effects: [
      { type: 'set_flag', target: 'chapter_3_completed', value: true },
    ],
  },
};

// 获取第三章节点
export function getChapter3Node(nodeId: string): StoryNode | null {
  return chapter3Story[nodeId] || null;
}
