import type { StoryNode } from '../../types';

// 第六章：云隐秘境
// 主题：秘境远征、封印线索、主角真正接触镇界体系
export const chapter6Story: Record<string, StoryNode> = {
  ch6_start: {
    id: 'ch6_start',
    type: 'narration',
    content: '正道同盟仓促整军，青云宗上下昼夜不息地修缮阵法、调配灵石。大战余波尚未平息，云霄真人却在镇魔铜镜前发现了一道隐藏极深的古篆残纹。残纹与万魔归一阵的阵眼波动高度吻合，指向一个三百年未曾开启的名字：云隐秘境。',
    nextNodeId: 'ch6_strategy_meeting',
  },
  ch6_strategy_meeting: {
    id: 'ch6_strategy_meeting',
    type: 'dialogue',
    speaker: '青云宗掌门',
    content: '三百年前，先辈曾在云隐秘境中找到镇压天魔的关键器物。后来秘境关闭，入口被群山灵脉吞没。若暗影联盟已经布好大阵，我们就必须抢在他们之前取得那件器物，否则正道永远只能被动挨打。',
    nextNodeId: 'ch6_master_addition',
  },
  ch6_master_addition: {
    id: 'ch6_master_addition',
    type: 'dialogue',
    speaker: '云霄真人',
    content: '为师无法离开宗门太久，秘境之行只能由你领队。苏瑶熟悉阵法，刘青擅长符箓，另外还有天剑宗的两名弟子与你同行。此去不是单纯寻宝，而是与时间赛跑。你若迟一步，封印就会再松一分。',
    nextNodeId: 'ch6_origin_router',
  },

  ch6_origin_router: {
    id: 'ch6_origin_router',
    type: 'narration',
    content: '出发前夜，你独自站在后山风口，望着群峰间缓缓流动的云海。大战之后，你比任何时候都更清楚，自己已经无法再将修行视作一条只属于个人的道路。',
    nextNodeId: 'ch6_village_branch',
  },
  ch6_village_branch: {
    id: 'ch6_village_branch',
    type: 'narration',
    content: '你忽然想起青山村的炊烟、王伯粗糙却温暖的手掌、还有那些没能踏上修行之路的凡人。若封印崩塌，最先死去的往往不是高高在上的修士，而是这些根本无力反抗的普通人。你心中那份守护苍生的念头因此变得格外坚定。',
    nextNodeId: 'ch6_team_departure',
    fallbackNodeId: 'ch6_fallen_branch',
    conditions: [
      { type: 'flag', key: 'origin_village_orphan', operator: '==', value: true },
    ],
    effects: [
      { type: 'set_flag', target: 'ch6_common_people_resolve', value: true },
    ],
  },
  ch6_fallen_branch: {
    id: 'ch6_fallen_branch',
    type: 'narration',
    content: '你握紧那枚传承至今的家族玉佩。陈家因封印而灭，你一路修行本为复仇，如今却发现自己的血脉与镇界之事纠缠得比想象中更深。若秘境中真藏着先祖留下的线索，这一趟或许能补上你家族断裂的历史。',
    nextNodeId: 'ch6_team_departure',
    fallbackNodeId: 'ch6_reincarnation_branch',
    conditions: [
      { type: 'flag', key: 'origin_fallen_clan', operator: '==', value: true },
    ],
    effects: [
      { type: 'set_flag', target: 'ch6_clan_duty_awakened', value: true },
    ],
  },
  ch6_reincarnation_branch: {
    id: 'ch6_reincarnation_branch',
    type: 'narration',
    content: '当你运转神识时，识海深处那缕被封锁的前世记忆再次震颤。云隐秘境这个名字令你生出一种说不清的熟悉感，仿佛在极遥远的过去，你曾亲眼见过那里的天穹、河流与石碑。你隐约意识到，秘境之中等待你的并不只是器物，还有被你遗忘的旧因果。',
    nextNodeId: 'ch6_team_departure',
    effects: [
      { type: 'set_flag', target: 'ch6_past_life_resonance', value: true },
    ],
  },

  ch6_team_departure: {
    id: 'ch6_team_departure',
    type: 'dialogue',
    speaker: '苏瑶',
    content: '师弟，阵盘、符箓、灵药我都准备好了。刘青在山门外等我们，天剑宗的人也已经到了。掌门还特意批了宗门库存里最好的破禁砂。如果这次还打不开秘境，那就真只能硬闯了。',
    nextNodeId: 'ch6_travel_choice',
  },
  ch6_travel_choice: {
    id: 'ch6_travel_choice',
    type: 'choice',
    content: '远征队沿着古地图进入群山。面对第一段路线的选择，你决定采取什么方式推进？',
    choices: [
      {
        text: '穿越迷雾古林，优先隐蔽行踪，避免被暗影联盟提前发现',
        nextNodeId: 'ch6_route_forest',
        effects: [
          { type: 'set_flag', target: 'ch6_route_forest', value: true },
          { type: 'modify_attribute', target: 'luck', value: 3 },
        ],
      },
      {
        text: '直入废弃殿群，搜集古阵残片，尽量掌握更多秘境结构信息',
        nextNodeId: 'ch6_route_hall',
        effects: [
          { type: 'set_flag', target: 'ch6_route_hall', value: true },
          { type: 'modify_attribute', target: 'comprehension', value: 3 },
        ],
      },
      {
        text: '沿地脉灵井前进，以最快速度逼近入口，即便承担更大风险',
        nextNodeId: 'ch6_route_well',
        effects: [
          { type: 'set_flag', target: 'ch6_route_well', value: true },
          { type: 'modify_attribute', target: 'attack', value: 2 },
        ],
      },
    ],
  },
  ch6_route_forest: {
    id: 'ch6_route_forest',
    type: 'narration',
    content: '古林迷雾终年不散，树影与残魂交叠，方向感稍有不慎便会被彻底吞没。你让众人用神识彼此牵引，一路静默潜行。途中你看到几处刚被魔修踩断的枝叶，说明暗影联盟果然也在附近活动，但这条路线让你们成功避开了第一次正面碰撞。',
    nextNodeId: 'ch6_secret_entrance',
  },
  ch6_route_hall: {
    id: 'ch6_route_hall',
    type: 'narration',
    content: '废弃殿群残柱倾颓，墙上却仍留着极复杂的古阵纹。苏瑶一边辨认符号，一边兴奋得几乎忘了疲惫。你们在断裂石壁后找到半截刻着“镇界三枢”的玉简，虽然内容残缺，却足以证明云隐秘境曾是上古封印体系的一部分。',
    nextNodeId: 'ch6_secret_entrance',
    effects: [
      { type: 'set_flag', target: 'ch6_found_partial_jade_slip', value: true },
    ],
  },
  ch6_route_well: {
    id: 'ch6_route_well',
    type: 'narration',
    content: '你们借地脉灵井强行穿行山腹。那是一条极危险的近路，岩层间不时炸开细碎雷弧，稍有不慎就会坠入灵气乱流。好在你强行压住了所有异动，硬生生带着队伍顶着罡风冲出裂隙，比原计划提前了整整半日抵达秘境入口。',
    nextNodeId: 'ch6_secret_entrance',
    effects: [
      { type: 'set_flag', target: 'ch6_arrived_early', value: true },
    ],
  },

  ch6_secret_entrance: {
    id: 'ch6_secret_entrance',
    type: 'narration',
    content: '群山最深处，一座被藤蔓与古碑缠绕的石门缓缓浮现。石门中央嵌着三道环形凹槽，周围悬浮着细若游丝的银蓝雷纹。那不是普通禁制，更像某种识别“守界者”身份的古老机关。',
    nextNodeId: 'ch6_barrier_choice',
  },
  ch6_barrier_choice: {
    id: 'ch6_barrier_choice',
    type: 'choice',
    content: '面对石门禁制，你决定如何破局？',
    choices: [
      {
        text: '以灵力强行冲击，试探禁制承受上限',
        nextNodeId: 'ch6_force_break',
        effects: [
          { type: 'modify_attribute', target: 'attack', value: 2 },
          { type: 'set_flag', target: 'ch6_used_force', value: true },
        ],
      },
      {
        text: '由苏瑶推演阵纹，你负责以神识补完缺口',
        nextNodeId: 'ch6_pattern_read',
        effects: [
          { type: 'modify_attribute', target: 'comprehension', value: 2 },
          { type: 'set_flag', target: 'ch6_used_pattern', value: true },
        ],
      },
      {
        text: '尝试让识海中残留的镇魔铜镜气息与石门共鸣',
        nextNodeId: 'ch6_symbol_resonate',
        effects: [
          { type: 'modify_attribute', target: 'luck', value: 2 },
          { type: 'set_flag', target: 'ch6_used_resonance', value: true },
        ],
      },
    ],
  },
  ch6_force_break: {
    id: 'ch6_force_break',
    type: 'narration',
    content: '你一掌印在石门中央，元婴期灵力如长河倒灌。石门剧震，雷纹疯狂回流，险些将队伍反震出去。就在众人以为要失败时，刘青将数十张缓冲符同时贴上门框，硬生生把暴走的禁制压住了一瞬，石门这才轰然开启一线缝隙。',
    nextNodeId: 'ch6_first_battle_lead',
  },
  ch6_pattern_read: {
    id: 'ch6_pattern_read',
    type: 'narration',
    content: '苏瑶席地而坐，指尖一点点描摹古纹走势。你以神识将残缺线条补足，终于在千百道干扰中找出真正的阵心。随着最后一笔灵光落下，石门上三道凹槽依次亮起，像是在承认你们拥有接触秘境的资格。',
    nextNodeId: 'ch6_first_battle_lead',
  },
  ch6_symbol_resonate: {
    id: 'ch6_symbol_resonate',
    type: 'narration',
    content: '你将镇魔铜镜残留在经脉中的那一缕清辉缓缓牵出。石门雷纹与之接触的刹那，整片山谷都像被拉入了片刻的寂静。紧接着，一道古老而威严的气息自门后传来，仿佛有人在沉睡中认出了你，于是禁制自行退开了一部分。',
    nextNodeId: 'ch6_first_battle_lead',
    effects: [
      { type: 'set_flag', target: 'ch6_gate_recognized_you', value: true },
    ],
  },

  ch6_first_battle_lead: {
    id: 'ch6_first_battle_lead',
    type: 'narration',
    content: '石门开启后，一座布满破损星轨的前殿映入眼帘。还未等你们深入，两尊沉睡数百年的金甲傀儡便被闯入者气息惊醒，关节轰鸣，古老灵核随之亮起。显然，真正的试炼才刚刚开始。',
    nextNodeId: 'ch6_first_battle',
  },
  ch6_first_battle: {
    id: 'ch6_first_battle',
    type: 'battle',
    content: '云隐秘境的守阵傀儡苏醒，远征队必须闯过前殿试炼。',
    battleId: 'story_6_1',
    nextNodeId: 'ch6_after_guardians',
    effects: [
      { type: 'set_flag', target: 'ch6_cleared_outer_hall', value: true },
    ],
  },
  ch6_after_guardians: {
    id: 'ch6_after_guardians',
    type: 'narration',
    content: '傀儡倒地后，前殿地面缓缓浮现出一幅完整星图。苏瑶俯身辨认，惊觉这些星位并非用来导航，而是在记录三处封印锚点的灵力流向。你心头一震，终于确定天魔封印并不是单点镇压，而是由多处“镇界锚”共同维系。',
    nextNodeId: 'ch6_archive_discovery',
  },
  ch6_archive_discovery: {
    id: 'ch6_archive_discovery',
    type: 'narration',
    content: '你们沿着星图穿过回廊，在一间半塌的石室内找到堆满玉简的古档案库。大量记载因岁月侵蚀而模糊，但仍能辨认出“补天卷”“三枢”“界缝”这些关键词。远征队意识到，云隐秘境真正保存下来的不是宝物，而是一整套关于如何加固世界边界的知识。',
    nextNodeId: 'ch6_archive_choice',
  },
  ch6_archive_choice: {
    id: 'ch6_archive_choice',
    type: 'choice',
    content: '时间紧迫，你无法带走所有典籍。你决定优先处理哪一部分？',
    choices: [
      {
        text: '保护完整玉简，哪怕因此放慢推进速度',
        nextNodeId: 'ch6_preserve_texts',
        effects: [
          { type: 'set_flag', target: 'ch6_preserved_records', value: true },
          { type: 'modify_attribute', target: 'luck', value: 2 },
        ],
      },
      {
        text: '快速拓印核心内容，以效率优先',
        nextNodeId: 'ch6_take_rubbing',
        effects: [
          { type: 'set_flag', target: 'ch6_took_rubbings', value: true },
          { type: 'modify_attribute', target: 'attack', value: 2 },
        ],
      },
      {
        text: '趁众人整理资料时独自参悟一段核心阵文',
        nextNodeId: 'ch6_meditate_records',
        effects: [
          { type: 'set_flag', target: 'ch6_personal_enlightenment', value: true },
          { type: 'modify_attribute', target: 'comprehension', value: 4 },
        ],
      },
    ],
  },
  ch6_preserve_texts: {
    id: 'ch6_preserve_texts',
    type: 'narration',
    content: '你命众人先稳固石室，再一卷卷收拢尚可保存的玉简。虽然推进因此慢了不少，但也正因如此，你们在一块碎石后发现了被刻意封存的密匣，其中保存着一张几乎完整的秘境中枢图。',
    nextNodeId: 'ch6_core_chamber',
    effects: [
      { type: 'set_flag', target: 'ch6_found_core_map', value: true },
    ],
  },
  ch6_take_rubbing: {
    id: 'ch6_take_rubbing',
    type: 'narration',
    content: '你果断筛选出最关键的阵文，让刘青与天剑宗弟子联手拓印。符纸一张接一张被灵墨点亮，众人几乎是在与时间赛跑。虽然部分原件再无带走可能，但你们用最短时间构建出了一份足够实用的临时情报图谱。',
    nextNodeId: 'ch6_core_chamber',
  },
  ch6_meditate_records: {
    id: 'ch6_meditate_records',
    type: 'narration',
    content: '你坐在残破石灯之间，将神识沉入阵文深处。那些晦涩古语仿佛并不陌生，反而像是很久以前就被刻在你的识海中。短短片刻，你竟推演出三处封印锚之间的部分共振规律。等你再睁眼时，连苏瑶都用一种不可思议的目光望着你。',
    nextNodeId: 'ch6_core_chamber',
    effects: [
      { type: 'set_flag', target: 'ch6_understood_anchor_resonance', value: true },
    ],
  },

  ch6_core_chamber: {
    id: 'ch6_core_chamber',
    type: 'narration',
    content: '沿密匣星图继续前进，你们抵达秘境最深处的中枢殿。殿内没有金银珠玉，只有一座悬浮在半空中的青黑圆盘，以及环绕圆盘缓缓转动的三十六枚星钉。每一枚星钉都对应一条天地灵脉，而圆盘中央则铭刻着四个古字：镇界星盘。',
    nextNodeId: 'ch6_suyao_analysis',
  },
  ch6_suyao_analysis: {
    id: 'ch6_suyao_analysis',
    type: 'dialogue',
    speaker: '苏瑶',
    content: '这不是单纯的法宝，它更像是整个封印体系的“钥匙”。如果没有它，我们最多只能拖延万魔归一阵的启动；但若能带回完整星盘，就有机会重新校准三处锚点的灵脉，让封印恢复到可控状态。只是......星盘旁边还有一重更强的守护气息。',
    nextNodeId: 'ch6_second_battle_lead',
  },
  ch6_second_battle_lead: {
    id: 'ch6_second_battle_lead',
    type: 'narration',
    content: '话音刚落，中枢殿穹顶雷光大作。一尊比前殿傀儡庞大数倍的古代雷傀从星盘后方缓缓升起，周身缠绕紫电，身躯由不知名灵金打造，胸口处跳动着近似元婴修士神识波动的雷核。秘境显然要在此确认，你是否拥有触碰镇界星盘的资格。',
    nextNodeId: 'ch6_second_battle',
  },
  ch6_second_battle: {
    id: 'ch6_second_battle',
    type: 'battle',
    content: '镇界星盘的最终守护者被唤醒。若想带走星盘，你必须在雷海中取胜。',
    battleId: 'story_6_2',
    nextNodeId: 'ch6_star_disk_obtained',
    effects: [
      { type: 'set_flag', target: 'ch6_defeated_realm_guardian', value: true },
    ],
  },
  ch6_star_disk_obtained: {
    id: 'ch6_star_disk_obtained',
    type: 'narration',
    content: '雷傀轰然倒下，殿内狂躁的电芒一点点平息。你伸手触碰镇界星盘的瞬间，大量古老画面自星盘深处灌入脑海：三座镇界锚、一场席卷三界的古战、以及数位以自身大道为代价封住界缝的上古修士。你终于明白，所谓封印并非一座阵、一件器，而是一代又一代守界者不断接力的结果。',
    nextNodeId: 'ch6_true_clue',
    effects: [
      { type: 'set_flag', target: 'ch6_obtained_star_disk', value: true },
    ],
  },
  ch6_true_clue: {
    id: 'ch6_true_clue',
    type: 'narration',
    content: '星盘中央弹出一卷极薄的金页，其上记载着补天卷残篇：若三处镇界锚中任意两处失守，天魔就能借界缝投影降临。当前最危险的一处锚点，正位于北荒断桥外侧的古战场；而最后一处锚，则被安置在常人几乎无法抵达的天衡观星台。',
    nextNodeId: 'ch6_resolution_choice',
    effects: [
      { type: 'set_flag', target: 'ch6_knows_three_anchors', value: true },
      { type: 'modify_attribute', target: 'cultivation', value: 400 },
    ],
  },
  ch6_resolution_choice: {
    id: 'ch6_resolution_choice',
    type: 'choice',
    content: '带着镇界星盘与补天卷残篇，你对接下来的道路有了更明确的判断。',
    choices: [
      {
        text: '先冲击更高境界，只有足够强大才能扛住接下来的大劫',
        nextNodeId: 'ch6_resolve_power',
        effects: [
          { type: 'set_flag', target: 'ch6_focus_power', value: true },
          { type: 'modify_attribute', target: 'attack', value: 3 },
        ],
      },
      {
        text: '优先研究补天卷，从镇界锚本身找到破局方法',
        nextNodeId: 'ch6_resolve_seal',
        effects: [
          { type: 'set_flag', target: 'ch6_focus_seal', value: true },
          { type: 'modify_attribute', target: 'comprehension', value: 5 },
        ],
      },
      {
        text: '整合同盟资源，让所有门派围绕三处锚点重新布防',
        nextNodeId: 'ch6_resolve_alliance',
        effects: [
          { type: 'set_flag', target: 'ch6_focus_alliance', value: true },
          { type: 'modify_attribute', target: 'luck', value: 5 },
        ],
      },
    ],
  },
  ch6_resolve_power: {
    id: 'ch6_resolve_power',
    type: 'narration',
    content: '你比过去任何时候都更清楚，接下来将面对的敌人已经不是单一的魔修天才，而是能够撬动界缝、操控古阵、甚至引动天魔投影的存在。你决定回宗之后立刻闭关，借星盘之助冲击化神门槛，为大战做最现实的准备。',
    nextNodeId: 'ch6_chapter_end',
  },
  ch6_resolve_seal: {
    id: 'ch6_resolve_seal',
    type: 'narration',
    content: '你意识到，一味提升境界终究赶不上界缝扩张的速度。真正关键的，是掌握补天卷与镇界星盘的运转逻辑。回宗之后，你准备将所有时间投入推演之中，哪怕这条路比单纯修炼更枯燥、更艰难，也必须走下去。',
    nextNodeId: 'ch6_chapter_end',
  },
  ch6_resolve_alliance: {
    id: 'ch6_resolve_alliance',
    type: 'narration',
    content: '你终于明白，封印从来不是某一个人的职责，而是一个时代对另一个时代的托付。即便你能冲到更高境界，也无法独自看守所有锚点。带着这个念头，你决定主动站到同盟最前方，去把这场松散的联合真正捏成一只拳头。',
    nextNodeId: 'ch6_chapter_end',
  },
  ch6_chapter_end: {
    id: 'ch6_chapter_end',
    type: 'narration',
    content: '当你们带着镇界星盘返回青云宗时，整座山门第一次因为一件“不是武器”的器物而彻夜不眠。掌门、长老、同盟使者全部围在大殿中，听你复述秘境中看到的一切。直到这一刻，正道诸宗才真正意识到，他们对抗的从来不只是暗影联盟，而是一场早已越过门派恩怨、关乎三界存亡的漫长战争。而你，也在这场远征中正式从一名能战的修士，成长为能够看见全局的人。',
    effects: [
      { type: 'set_flag', target: 'chapter_6_completed', value: true },
      { type: 'set_flag', target: 'ch6_star_disk_returned', value: true },
      { type: 'modify_attribute', target: 'cultivation', value: 1000 },
    ],
  },
};

export function getChapter6Node(nodeId: string): StoryNode | null {
  return chapter6Story[nodeId] || null;
}
