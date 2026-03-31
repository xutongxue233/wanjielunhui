import type { StoryNode } from '../../types';

// 第八章：镜湖天关
// 主题：镜湖守锚、界门初启、第一次正面接触“天关”体系
export const chapter8Story: Record<string, StoryNode> = {
  ch8_start: {
    id: 'ch8_start',
    type: 'narration',
    content: '镇界星盘带回青云宗后的第三夜，镜湖忽然在子时掀起通天水柱。整座后山灵脉像被人从地底扯住一般剧烈震颤，湖面不再映月，反而倒映出一片残破天穹与无数断裂宫阙。你尚未从北荒和观星台的鏖战中缓过气来，新的异变却已经毫不留情地逼到眼前。',
    nextNodeId: 'ch8_mirror_alarm',
  },
  ch8_mirror_alarm: {
    id: 'ch8_mirror_alarm',
    type: 'dialogue',
    speaker: '青云宗掌门',
    content: '镜湖锚出事了。暗影联盟没有从外面强攻，而是在我们回宗前就在湖底埋下了“逆界引”。如今三处锚点短暂闭合，反而给了这道逆阵足够清晰的坐标。一旦镜湖被改写，镇界星盘辛苦拉回的平衡就会反过来变成界门的门轴。',
    nextNodeId: 'ch8_star_revelation',
  },
  ch8_star_revelation: {
    id: 'ch8_star_revelation',
    type: 'narration',
    content: '你以镇界星盘照向镜湖，盘心三十六枚星钉同时轻颤。无数灵纹在识海中排布成一座巨大的门形结构，门后并不是完整的仙界，而是一条曾经用来联通三界、后被强行封死的“天关投影”。镜湖之所以能稳住最后一处锚点，正因为它本就是压在天关上的锁。',
    nextNodeId: 'ch8_strategy_choice',
  },
  ch8_strategy_choice: {
    id: 'ch8_strategy_choice',
    type: 'choice',
    content: '镜湖异变爆发后，宗门上下陷入短暂混乱。你决定先从哪一步着手？',
    choices: [
      {
        text: '优先疏散后山弟子与凡俗杂役，先把最脆弱的人撤出震荡区',
        nextNodeId: 'ch8_strategy_rear',
        effects: [
          { type: 'set_flag', target: 'ch8_secured_rear', value: true },
          { type: 'modify_attribute', target: 'luck', value: 3 },
        ],
      },
      {
        text: '立即带精锐下湖，争取在逆界引完全成型前拔掉阵眼',
        nextNodeId: 'ch8_strategy_assault',
        effects: [
          { type: 'set_flag', target: 'ch8_struck_first', value: true },
          { type: 'modify_attribute', target: 'attack', value: 3 },
        ],
      },
      {
        text: '先让各宗围湖布阵，再借镇界星盘同步校准镜湖脉络',
        nextNodeId: 'ch8_strategy_array',
        effects: [
          { type: 'set_flag', target: 'ch8_formed_lake_array', value: true },
          { type: 'modify_attribute', target: 'comprehension', value: 4 },
        ],
      },
    ],
  },
  ch8_strategy_rear: {
    id: 'ch8_strategy_rear',
    type: 'narration',
    content: '你先把最不起眼也最容易被忽视的人撤出了后山。许多外门弟子与杂役原本以为自己在这种大战里根本不重要，可正因为你第一时间让他们活着离开，青云宗后续的药材、符纸、灵石调配才没有在混乱中彻底断掉。镜湖未稳，但宗门的骨架还在。',
    nextNodeId: 'ch8_origin_router',
  },
  ch8_strategy_assault: {
    id: 'ch8_strategy_assault',
    type: 'narration',
    content: '你没有等掌门把所有命令说完，便带着苏瑶、刘青和一支精锐小队直扑镜湖。湖面雷鸣与水光交错，逆界引尚未完全张开，你们硬是在最危险的缝隙里抢出了半步先手。代价是后援还未到位，一旦湖底情况超出预期，你们就必须自己把局面扛住。',
    nextNodeId: 'ch8_origin_router',
  },
  ch8_strategy_array: {
    id: 'ch8_strategy_array',
    type: 'narration',
    content: '你将天剑宗、万法宗、青云宗的阵师与剑修全部拉到镜湖四周，以镇界星盘为中心重新画出三重临时锁阵。过程极其繁琐，但也正因此，你比任何人都更早看清了逆界引和镜湖地脉真正的咬合方式。等到众人准备完毕，镜湖已经不再只是一个战场，而像一盘正在被强行翻面的棋。',
    nextNodeId: 'ch8_origin_router',
  },

  ch8_origin_router: {
    id: 'ch8_origin_router',
    type: 'narration',
    content: '临下湖前，你在镜湖边缘短暂停步。水面被黑雾撕裂成一块块碎片，每一块都映着不同的影子，有些属于现在，有些却像来自更久远的过往。',
    nextNodeId: 'ch8_village_branch',
  },
  ch8_village_branch: {
    id: 'ch8_village_branch',
    type: 'narration',
    content: '碎裂水影里，你看见的是青山村的土路、冬日柴火和那些从不曾修行、却仍认真活着的人。你忽然明白，所谓守界，并不只是守住“修士的天下”，更是守住这些普通人明早还能照常起灶、生火、等待日出的资格。',
    nextNodeId: 'ch8_descent',
    fallbackNodeId: 'ch8_fallen_branch',
    conditions: [
      { type: 'flag', key: 'origin_village_orphan', operator: '==', value: true },
    ],
    effects: [
      { type: 'set_flag', target: 'ch8_remembered_common_lives', value: true },
    ],
  },
  ch8_fallen_branch: {
    id: 'ch8_fallen_branch',
    type: 'narration',
    content: '碎裂水影里，你看见的是陈家故宅、满地火痕，以及那些从未有人替你讲清的旧事。镜湖地脉与天关投影的纠缠，让你第一次强烈地意识到，自己家族当年的覆灭或许并非单纯卷入宗门仇怨，而是被更高层次的布局顺手碾过。你再一次提醒自己，这一仗不能只为眼前。',
    nextNodeId: 'ch8_descent',
    fallbackNodeId: 'ch8_reincarnation_branch',
    conditions: [
      { type: 'flag', key: 'origin_fallen_clan', operator: '==', value: true },
    ],
    effects: [
      { type: 'set_flag', target: 'ch8_clan_truth_pressure', value: true },
    ],
  },
  ch8_reincarnation_branch: {
    id: 'ch8_reincarnation_branch',
    type: 'narration',
    content: '碎裂水影里，你看见的不是今生，而是一段被强行切断的旧记忆。你站在某座更高更远的门阙前，手中同样捧着一枚与镇界星盘相似的器物。记忆只闪了一瞬，却足以让你确定，自己和“天关”之间绝不只是第一次相遇。镜湖并非终点，更像是有人故意留给你的回声。',
    nextNodeId: 'ch8_descent',
    effects: [
      { type: 'set_flag', target: 'ch8_past_life_gate_echo', value: true },
    ],
  },

  ch8_descent: {
    id: 'ch8_descent',
    type: 'narration',
    content: '你们借镇界星盘开辟出一条短暂稳定的下潜通道，直入镜湖湖底。越往下走，湖水越不像水，而更像层层叠叠的镜面与碎空。无数断裂灵纹漂浮在周围，偶尔还能看到被封死在湖底石壁中的古代法器残片。镜湖根本不是自然形成的灵湖，而是一座被伪装成山门景致的巨大镇压场。',
    nextNodeId: 'ch8_suyao_scene',
  },
  ch8_suyao_scene: {
    id: 'ch8_suyao_scene',
    type: 'dialogue',
    speaker: '苏瑶',
    content: '我以前总觉得观星台已经够古老、够惊人了，可和镜湖比起来，它更像是写在纸面的答案。这里才是真正被拿来“压住某样东西”的地方。师弟，如果湖底真是天关投影，那我们眼前看到的每一道裂纹，都可能是三界边界本身在流血。',
    nextNodeId: 'ch8_first_battle_lead',
  },
  ch8_first_battle_lead: {
    id: 'ch8_first_battle_lead',
    type: 'narration',
    content: '话音刚落，湖底裂开一道横贯数十丈的暗缝，一头半透明的虚空裂隙兽自其中猛然冲出。它的身躯像是由破碎空间硬拼而成，每一次摆尾都能扯出成片乱流，把原本还能勉强维持的湖底通道撕得摇摇欲坠。若不先斩掉这头裂隙兽，所有后续修补都会沦为空谈。',
    nextNodeId: 'ch8_first_battle',
  },
  ch8_first_battle: {
    id: 'ch8_first_battle',
    type: 'battle',
    content: '镜湖湖底的第一道裂隙彻底张开，你必须先压住虚空裂隙兽，才能接近逆界引核心。',
    battleId: 'story_8_1',
    nextNodeId: 'ch8_after_first_battle',
    effects: [
      { type: 'set_flag', target: 'ch8_cleared_rift_beast', value: true },
    ],
  },
  ch8_after_first_battle: {
    id: 'ch8_after_first_battle',
    type: 'narration',
    content: '裂隙兽在湖底炸散成大片暗银碎光，逆界引核心终于露出真貌。那不是某件单纯的魔器，而是一枚被强行钉入镜湖阵心的“逆钥”，它正把镇界锚与天关之间原本只允许单向封闭的联系，反过来扭成一条可供异界力量降落的通道。更糟的是，逆钥周围还悬着一道金色人形影像，像是在等待某个时刻彻底苏醒。',
    nextNodeId: 'ch8_truth_of_gate',
  },
  ch8_truth_of_gate: {
    id: 'ch8_truth_of_gate',
    type: 'dialogue',
    speaker: '云霄真人',
    content: '那不是幻象，是守在天关尽头的一道“守门意志”。镜湖之所以能压住界门，是因为上古守界者把一部分天关权柄也一起锁在这里。暗影联盟想做的，不只是让天魔提前降临，而是借逆界引把守门意志也一起拖到人间，让它替他们把这扇门彻底撞开。',
    nextNodeId: 'ch8_inner_choice',
  },
  ch8_inner_choice: {
    id: 'ch8_inner_choice',
    type: 'choice',
    content: '逆钥尚未完全落稳，你们还来得及决定用哪种方式逼近镜湖最深处。你选择？',
    choices: [
      {
        text: '直接截断逆钥与湖底灵脉的连接，用最快的方法打断它',
        nextNodeId: 'ch8_cut_reverse_seal',
        effects: [
          { type: 'set_flag', target: 'ch8_cut_reverse_seal', value: true },
          { type: 'modify_attribute', target: 'attack', value: 2 },
        ],
      },
      {
        text: '先把湖底三道锚环重新接上，让天关守门意志失去落点',
        nextNodeId: 'ch8_mend_anchor_rings',
        effects: [
          { type: 'set_flag', target: 'ch8_mended_anchor_rings', value: true },
          { type: 'modify_attribute', target: 'comprehension', value: 3 },
        ],
      },
      {
        text: '让同伴留在外围稳阵，你独自借星盘深入核心，争取最短路径',
        nextNodeId: 'ch8_enter_core_alone',
        effects: [
          { type: 'set_flag', target: 'ch8_entered_core_alone', value: true },
          { type: 'modify_attribute', target: 'luck', value: 3 },
        ],
      },
    ],
  },
  ch8_cut_reverse_seal: {
    id: 'ch8_cut_reverse_seal',
    type: 'narration',
    content: '你直接带人斩向逆钥。湖底顿时爆出成串乱流，像是无数条被惊醒的锁链同时抽动。虽然危险最大，但逆钥确实被你硬生生打偏了半寸。就是这半寸，为后续所有修补争出了极其宝贵的喘息时间。',
    nextNodeId: 'ch8_guardian_scene',
  },
  ch8_mend_anchor_rings: {
    id: 'ch8_mend_anchor_rings',
    type: 'narration',
    content: '你没有急着攻心，而是先把湖底三道早已错位的锚环一一校回。苏瑶和万法宗修士配合得几近疯狂，刘青则负责在每一处断口打上稳纹符。等第三道锚环勉强闭合时，整座镜湖终于不再继续往外崩，而守门意志也因此被迫推迟了降落。',
    nextNodeId: 'ch8_guardian_scene',
  },
  ch8_enter_core_alone: {
    id: 'ch8_enter_core_alone',
    type: 'narration',
    content: '你将外层阵势完全交给同伴，自己捧着镇界星盘独自深入湖底最暗处。四周不断传来天关投影的低鸣，像是在审视你，也像是在辨认你。你知道这样做几乎把所有风险都压在了自己身上，但若想抢在守门意志彻底落下前夺回主动，这已是最短的一条路。',
    nextNodeId: 'ch8_guardian_scene',
  },

  ch8_guardian_scene: {
    id: 'ch8_guardian_scene',
    type: 'narration',
    content: '镜湖最深处的金色人形终于完全凝实。那是一名披着残破仙铠、手持长剑的古老守卫，身后悬着半轮门阙投影，脚下则踩着逆钥碎光。他没有被魔气彻底污染，却也早已被错误的天关规则扭曲了判定：在他眼中，所有身处人间的修士，都是不该靠近这扇门的“越界者”。',
    nextNodeId: 'ch8_final_battle_lead',
  },
  ch8_final_battle_lead: {
    id: 'ch8_final_battle_lead',
    type: 'dialogue',
    speaker: '仙界守卫',
    content: '人间锚锁已偏，天关秩序失衡。按旧律，越界者当斩，门轴当重立。退去，或者随这片镜湖一同沉下去。你从他冰冷而机械的语气里听出一丝不属于敌意的悲哀，却也明白，此刻若不把他拦下，镜湖就会被这道守门意志亲手改写成真正的界门。',
    nextNodeId: 'ch8_final_battle',
  },
  ch8_final_battle: {
    id: 'ch8_final_battle',
    type: 'battle',
    content: '镜湖天关的守门意志被逆界引牵落人间。若不能击败他，最后一处镇界锚将反过来成为界门门轴。',
    battleId: 'story_8_2',
    nextNodeId: 'ch8_after_final_battle',
    effects: [
      { type: 'set_flag', target: 'ch8_won_mirror_lake_battle', value: true },
    ],
  },
  ch8_after_final_battle: {
    id: 'ch8_after_final_battle',
    type: 'narration',
    content: '仙界守卫在镜湖深处缓缓半跪，手中长剑寸寸化光。逆钥也随之崩裂，镜湖上空那扇几乎成形的门阙重新变得透明而遥远。临散去前，守卫最后看了你一眼，将一缕极细的金辉打入镇界星盘。那不是攻击，而更像是一道迟到太久的“钥印”。你忽然意识到，三界之外并非全是敌人，真正的问题在于门被谁先一步掌控。',
    nextNodeId: 'ch8_resolution_choice',
    effects: [
      { type: 'set_flag', target: 'ch8_received_gate_mark', value: true },
      { type: 'modify_attribute', target: 'cultivation', value: 900 },
    ],
  },
  ch8_resolution_choice: {
    id: 'ch8_resolution_choice',
    type: 'choice',
    content: '镜湖危机暂时解除，但你也因此看见了比“封印”更高一层的秩序。接下来，你决定把力量押在哪个方向上？',
    choices: [
      {
        text: '把钥印化为自己的锋刃，提前为真正的天关之战做准备',
        nextNodeId: 'ch8_resolution_skyblade',
        effects: [
          { type: 'set_flag', target: 'ch8_path_skyblade', value: true },
          { type: 'modify_attribute', target: 'attack', value: 4 },
        ],
      },
      {
        text: '把自己进一步绑进镇界体系，成为新一代守关者',
        nextNodeId: 'ch8_resolution_keeper',
        effects: [
          { type: 'set_flag', target: 'ch8_path_keeper', value: true },
          { type: 'modify_attribute', target: 'comprehension', value: 5 },
        ],
      },
      {
        text: '把仙界、宗门与人间三方利益都摆上台面，尝试搭起新的桥',
        nextNodeId: 'ch8_resolution_bridge',
        effects: [
          { type: 'set_flag', target: 'ch8_path_bridge', value: true },
          { type: 'modify_attribute', target: 'luck', value: 5 },
        ],
      },
    ],
  },
  ch8_resolution_skyblade: {
    id: 'ch8_resolution_skyblade',
    type: 'narration',
    content: '你决定把那缕钥印彻底炼进自身道途。既然界门迟早还会再开，那你就必须在它真正打开之前，把自己磨成足以斩断门后黑影的第一把剑。你不再满足于只是守住人间一隅，而是准备主动走向更高更危险的战场。',
    nextNodeId: 'ch8_chapter_end',
  },
  ch8_resolution_keeper: {
    id: 'ch8_resolution_keeper',
    type: 'narration',
    content: '你选择了更重的一条路。成为守关者，意味着今后每一次灵潮、每一道界缝波动，你都必须第一个听见、也第一个去扛。可当你真正站在镜湖深处看过那扇门之后，你便知道，总得有人把这份责任接到自己身上，而你已经没有退回“只做一名修士”的余地。',
    nextNodeId: 'ch8_chapter_end',
  },
  ch8_resolution_bridge: {
    id: 'ch8_resolution_bridge',
    type: 'narration',
    content: '你没有把镜湖之变只看成一次纯粹的战争，而是看见了另一种可能：如果天关并非只代表敌意，那么未来真正决定三界归属的，或许不仅是谁更强，也是谁更早建立起新的秩序与规则。你决定先把这条桥搭起来，哪怕它会同时被三边误解。',
    nextNodeId: 'ch8_chapter_end',
  },
  ch8_chapter_end: {
    id: 'ch8_chapter_end',
    type: 'narration',
    content: '镜湖重新恢复平静时，整片后山像是刚从一场噩梦里醒来。掌门命人封湖，万法宗开始重绘外层锁阵，天剑宗则主动留下一队精锐常驻青云宗。所有人都知道，这并不是危机结束，而是战争真正抬头望向更高处的开始。你握着被钥印重新校准的镇界星盘，第一次清楚地意识到：下一次打开的，不会只是某一处封印，而可能是整个三界通向更高秩序与更深灾厄的大门。',
    effects: [
      { type: 'set_flag', target: 'chapter_8_completed', value: true },
      { type: 'set_flag', target: 'ch8_mirror_anchor_stabilized', value: true },
      { type: 'set_flag', target: 'ch8_saw_sky_gate', value: true },
      { type: 'modify_attribute', target: 'cultivation', value: 2200 },
    ],
  },
};

export function getChapter8Node(nodeId: string): StoryNode | null {
  return chapter8Story[nodeId] || null;
}
