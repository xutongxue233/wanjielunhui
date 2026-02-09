import type { StoryNode } from '../../types';

// 第四章：魔影初现
// 金丹期剧情，魔修入侵主线
export const chapter4Story: Record<string, StoryNode> = {
  // ==================== 开篇：宗门异变 ====================
  ch4_start: {
    id: 'ch4_start',
    type: 'narration',
    content: '自完成外门历练以来，你的修为突飞猛进，已成功凝结金丹，晋升为内门弟子。青云宗上下对你寄予厚望，掌门更是亲自指派云霄真人作为你的师父。',
    nextNodeId: 'ch4_master_intro',
  },
  ch4_master_intro: {
    id: 'ch4_master_intro',
    type: 'dialogue',
    speaker: '云霄真人',
    content: '你便是新晋的内门弟子？嗯，根骨资质倒是不差。不过，金丹初成便沾沾自喜的话，修仙路上你走不了太远。从今日起，每日卯时到我这里报到，误一次，罚你面壁三日。',
    nextNodeId: 'ch4_master_impression',
  },
  ch4_master_impression: {
    id: 'ch4_master_impression',
    type: 'narration',
    content: '云霄真人面容清癯，目光如炬，言语间不怒自威。虽然话语严厉，但你注意到他在你转身离去时微微点了点头——这位师父，看来并非表面那般冷漠。',
    nextNodeId: 'ch4_su_yao_intro',
  },
  ch4_su_yao_intro: {
    id: 'ch4_su_yao_intro',
    type: 'dialogue',
    speaker: '苏瑶',
    content: '师弟你好，我叫苏瑶，是师父的大弟子。师父他嘴上刻薄，心里其实很关心弟子。你别被他吓到了。来，我带你去看看内门的修炼场所吧。',
    nextNodeId: 'ch4_su_yao_guide',
  },
  ch4_su_yao_guide: {
    id: 'ch4_su_yao_guide',
    type: 'narration',
    content: '苏瑶温婉聪慧，修为已至金丹后期，在内门弟子中颇有声望。她耐心地带你熟悉内门各处，从藏经阁到炼药坊，从演武场到灵脉洞府，事无巨细地为你讲解。',
    nextNodeId: 'ch4_daily_training',
  },
  ch4_daily_training: {
    id: 'ch4_daily_training',
    type: 'narration',
    content: '接下来的日子，你在云霄真人的严格教导下刻苦修炼。师父虽然严厉，但传授的功法与心得都极为精辟。苏瑶也时常在修炼上给你指点，你的金丹日益凝实。',
    nextNodeId: 'ch4_ominous_sign',
  },

  // ==================== 魔气初显 ====================
  ch4_ominous_sign: {
    id: 'ch4_ominous_sign',
    type: 'narration',
    content: '然而，平静的日子并没有持续太久。这一日清晨，你正在灵脉洞府中修炼，忽然感到一股诡异的气息从地底涌来——阴冷、腐朽、充满了破坏的欲望。这是......魔气！',
    nextNodeId: 'ch4_alert',
  },
  ch4_alert: {
    id: 'ch4_alert',
    type: 'narration',
    content: '警钟大鸣！你冲出洞府，只见天边乌云翻滚，一道道黑色的光柱从青云山脉外围冲天而起。宗门弟子纷纷涌出，面带惊惶。',
    nextNodeId: 'ch4_master_warning',
  },
  ch4_master_warning: {
    id: 'ch4_master_warning',
    type: 'dialogue',
    speaker: '云霄真人',
    content: '是魔修！所有弟子听令，立即启动宗门护山大阵！金丹以上弟子随我去前山迎敌，其余人留守后山保护灵脉！不得擅离职守！',
    nextNodeId: 'ch4_su_yao_worry',
  },
  ch4_su_yao_worry: {
    id: 'ch4_su_yao_worry',
    type: 'dialogue',
    speaker: '苏瑶',
    content: '师弟，情况不妙。我从藏经阁的古籍中看到过记载，魔修上一次大规模入侵还是在三百年前......那一次，青云宗损失惨重。我们要小心。',
    nextNodeId: 'ch4_prepare_battle',
  },
  ch4_prepare_battle: {
    id: 'ch4_prepare_battle',
    type: 'choice',
    content: '魔修来袭，你该如何准备？',
    choices: [
      {
        text: '立即服用丹药强化状态，冲到前线迎战',
        nextNodeId: 'ch4_rush_frontline',
        effects: [
          { type: 'modify_attribute', target: 'attack', value: 5 },
          { type: 'set_flag', target: 'ch4_rushed_front', value: true },
        ],
      },
      {
        text: '先去藏经阁取辟邪法诀，做好万全准备',
        nextNodeId: 'ch4_get_scripture',
        effects: [
          { type: 'modify_attribute', target: 'comprehension', value: 5 },
          { type: 'set_flag', target: 'ch4_prepared', value: true },
        ],
      },
      {
        text: '与苏瑶一起制定策略，协同作战',
        nextNodeId: 'ch4_plan_with_su',
        effects: [
          { type: 'modify_attribute', target: 'luck', value: 3 },
          { type: 'set_flag', target: 'ch4_teamed_su', value: true },
        ],
      },
    ],
  },

  // ==================== 准备路线 ====================
  ch4_rush_frontline: {
    id: 'ch4_rush_frontline',
    type: 'narration',
    content: '你来不及多想，吞下一枚聚元丹催动灵力，便向前山飞去。半路上，你已经能看到魔修的身影——数十名黑袍修士正在猛攻护山大阵，阵法光幕不断闪烁。',
    nextNodeId: 'ch4_frontline_scene',
  },
  ch4_get_scripture: {
    id: 'ch4_get_scripture',
    type: 'narration',
    content: '你飞速赶到藏经阁，在一位长老的指点下取出了一卷《伏魔心经》。虽然来不及完全参悟，但其中记载的几个辟邪手印让你对抗魔气时能更加从容。',
    nextNodeId: 'ch4_frontline_scene',
    effects: [
      { type: 'set_flag', target: 'has_fumo_scripture', value: true },
    ],
  },
  ch4_plan_with_su: {
    id: 'ch4_plan_with_su',
    type: 'dialogue',
    speaker: '苏瑶',
    content: '师弟，我有一个想法。魔修主力攻打前山，后山的灵脉防守必然空虚。如果他们的目的不是攻城，而是灵脉......我们应该分兵防守后山！',
    nextNodeId: 'ch4_su_plan_result',
  },
  ch4_su_plan_result: {
    id: 'ch4_su_plan_result',
    type: 'narration',
    content: '你和苏瑶将猜测告知云霄真人。师父沉吟片刻，当即调派了一队精锐前往后山加强防守，又让你和苏瑶前往前线探察敌情。这一决定，后来被证明挽救了宗门的命脉。',
    nextNodeId: 'ch4_frontline_scene',
    effects: [
      { type: 'set_flag', target: 'defended_lingmai', value: true },
    ],
  },

  // ==================== 前线战斗 ====================
  ch4_frontline_scene: {
    id: 'ch4_frontline_scene',
    type: 'narration',
    content: '前山，战况激烈。青云宗的弟子们与魔修展开了殊死搏斗。法术交击的爆鸣声震耳欲聋，灵光与魔气在空中碰撞，宛如末日降临。',
    nextNodeId: 'ch4_encounter_demons',
  },
  ch4_encounter_demons: {
    id: 'ch4_encounter_demons',
    type: 'narration',
    content: '一群魔修突破了外围防线，直扑内门方向。他们修为不弱，身上散发着浓重的血腥气息，显然是以血祭邪法提升了战力。',
    nextNodeId: 'ch4_first_battle',
  },
  ch4_first_battle: {
    id: 'ch4_first_battle',
    type: 'battle',
    content: '三名魔修弟子拦住了你的去路，手中法器泛着血红的光芒。战斗，不可避免！',
    battleId: 'story_4_1',
    nextNodeId: 'ch4_after_first_battle',
    effects: [
      { type: 'set_flag', target: 'battle_demon_group', value: true },
    ],
  },
  ch4_after_first_battle: {
    id: 'ch4_after_first_battle',
    type: 'narration',
    content: '你击退了这批魔修，但战斗消耗不小。正当你调息恢复之际，一道凌厉的剑气无声无息地向你后心刺来！',
    nextNodeId: 'ch4_amulet_check',
  },

  // ==================== 护身符分支 ====================
  ch4_amulet_check: {
    id: 'ch4_amulet_check',
    type: 'narration',
    content: '那道剑气来势极快，你根本来不及反应——',
    nextNodeId: 'ch4_amulet_save',
    conditions: [
      { type: 'flag', key: 'has_liu_amulet', operator: '==', value: true },
    ],
  },
  ch4_amulet_save: {
    id: 'ch4_amulet_save',
    type: 'narration',
    content: '千钧一发之际，怀中刘青送的护身符突然爆发出一道金光，硬生生挡下了这致命一击！护身符碎裂为齑粉，但你得以保住性命。刘青的好意，在这生死关头救了你一命。',
    nextNodeId: 'ch4_xueying_appear',
    effects: [
      { type: 'set_flag', target: 'amulet_saved_life', value: true },
      { type: 'set_flag', target: 'has_liu_amulet', value: false },
    ],
  },
  ch4_no_amulet: {
    id: 'ch4_no_amulet',
    type: 'narration',
    content: '那道剑气切入你的后肩，鲜血飞溅。剧痛让你瞬间清醒，你咬牙翻滚避开，堪堪躲过了第二击。伤口处传来一股侵入骨髓的寒意——这是魔修的蚀骨剑气！',
    nextNodeId: 'ch4_xueying_appear',
    effects: [
      { type: 'modify_attribute', target: 'hp', value: -50 },
    ],
  },

  // ==================== 血影登场 ====================
  ch4_xueying_appear: {
    id: 'ch4_xueying_appear',
    type: 'narration',
    content: '你转身看向偷袭者——那是一个面容阴鸷的青年，一身血红色的袍服在风中猎猎作响。他手中握着一柄漆黑如墨的长剑，剑身上隐隐流转着血色纹路。',
    nextNodeId: 'ch4_xueying_dialogue',
  },
  ch4_xueying_dialogue: {
    id: 'ch4_xueying_dialogue',
    type: 'dialogue',
    speaker: '血影',
    content: '居然挡下了我的偷袭？有点意思。我叫血影，血煞宗宗主座下首徒。你这样的废物，在我面前不过是待宰的羔羊。',
    nextNodeId: 'ch4_xueying_provoke',
  },
  ch4_xueying_provoke: {
    id: 'ch4_xueying_provoke',
    type: 'narration',
    content: '血影的修为深不可测，至少在金丹后期以上。他身上的杀气浓烈得近乎实质，显然是在尸山血海中杀出来的魔修。与他正面交锋，你没有胜算。',
    nextNodeId: 'ch4_xueying_choice',
  },
  ch4_xueying_choice: {
    id: 'ch4_xueying_choice',
    type: 'choice',
    content: '面对远超自己修为的血影，你如何应对？',
    choices: [
      {
        text: '明知不敌，但绝不退缩，拖住他争取时间',
        nextNodeId: 'ch4_face_xueying_brave',
        conditions: [
          { type: 'flag', key: 'heart_brave', operator: '==', value: true },
        ],
        effects: [
          { type: 'modify_attribute', target: 'attack', value: 3 },
          { type: 'set_flag', target: 'ch4_faced_xueying', value: true },
        ],
      },
      {
        text: '保持冷静，寻找破绽，伺机而动',
        nextNodeId: 'ch4_face_xueying_calm',
        conditions: [
          { type: 'flag', key: 'heart_calm', operator: '==', value: true },
        ],
        effects: [
          { type: 'modify_attribute', target: 'comprehension', value: 3 },
          { type: 'set_flag', target: 'ch4_analyzed_xueying', value: true },
        ],
      },
      {
        text: '坦诚自己的劣势，但表明守护宗门的决心',
        nextNodeId: 'ch4_face_xueying_honest',
        conditions: [
          { type: 'flag', key: 'heart_honest', operator: '==', value: true },
        ],
        effects: [
          { type: 'modify_attribute', target: 'luck', value: 3 },
          { type: 'set_flag', target: 'ch4_resolved_xueying', value: true },
        ],
      },
      {
        text: '全力施展最强一击，搏命一战',
        nextNodeId: 'ch4_face_xueying_fight',
        effects: [
          { type: 'set_flag', target: 'ch4_fought_xueying', value: true },
        ],
      },
    ],
  },

  // ==================== 面对血影分支 ====================
  ch4_face_xueying_brave: {
    id: 'ch4_face_xueying_brave',
    type: 'narration',
    content: '你握紧手中的剑，朝血影冲去。明知差距悬殊，但你的眼中没有丝毫畏惧。这份勇气让血影微微一愣——他见惯了在他面前瑟瑟发抖的对手，却很少遇到如此不要命的人。',
    nextNodeId: 'ch4_xueying_clash',
  },
  ch4_face_xueying_calm: {
    id: 'ch4_face_xueying_calm',
    type: 'narration',
    content: '你深吸一口气，将心神沉入丹田。血影的修为虽高，但他方才偷袭不成显然有些急躁。你开始观察他的步法和剑势，试图在汹涌的杀意中找到一丝裂隙。',
    nextNodeId: 'ch4_xueying_clash',
  },
  ch4_face_xueying_honest: {
    id: 'ch4_face_xueying_honest',
    type: 'dialogue',
    speaker: '你',
    content: '我的修为确实不如你。但青云宗是我的家，我的师父、师姐、同门都在这里。就算拼上性命，我也不会让你们得逞。',
    nextNodeId: 'ch4_xueying_clash',
  },
  ch4_face_xueying_fight: {
    id: 'ch4_face_xueying_fight',
    type: 'narration',
    content: '你将全部灵力灌注剑中，施展出修炼以来最强的一式剑法。剑光如虹，直取血影面门。血影眼中闪过一丝讶异，随即冷笑着抬手格挡。',
    nextNodeId: 'ch4_xueying_clash',
  },

  ch4_xueying_clash: {
    id: 'ch4_xueying_clash',
    type: 'narration',
    content: '你与血影短暂交手数合。他的实力远在你之上，每一剑都带着足以致命的力道。你节节败退，身上多处受伤，但始终没有倒下。',
    nextNodeId: 'ch4_liu_check',
  },

  // ==================== 刘青支援分支 ====================
  ch4_liu_check: {
    id: 'ch4_liu_check',
    type: 'narration',
    content: '就在你即将支撑不住的时候——',
    nextNodeId: 'ch4_liu_arrives',
    conditions: [
      { type: 'flag', key: 'liu_friend', operator: '==', value: true },
    ],
  },
  ch4_liu_arrives: {
    id: 'ch4_liu_arrives',
    type: 'narration',
    content: '一道凌厉的符箓从侧面飞来，划破了血影的袖袍！你震惊地转头——竟然是刘青！他穿着外门弟子的道袍，手中握着一叠符箓，虽然修为低微，却义无反顾地冲了上来。',
    nextNodeId: 'ch4_liu_dialogue',
  },
  ch4_liu_dialogue: {
    id: 'ch4_liu_dialogue',
    type: 'dialogue',
    speaker: '刘青',
    content: '兄弟，你没事吧！我后来也通过了补考进了宗门。今天魔修打过来，我怎么可能缩在后面！就算修为低，多一个人多一份力！',
    nextNodeId: 'ch4_liu_distraction',
  },
  ch4_liu_distraction: {
    id: 'ch4_liu_distraction',
    type: 'narration',
    content: '刘青的突然出现分散了血影的注意力，给了你喘息的机会。虽然刘青的实力远不足以威胁血影，但他的勇气和义气让你心中涌起一股暖流。',
    nextNodeId: 'ch4_master_rescue',
  },
  ch4_no_liu: {
    id: 'ch4_no_liu',
    type: 'narration',
    content: '你咬紧牙关，灵力近乎枯竭。血影慢悠悠地走来，似乎在享受猎物临死前的挣扎。就在他举剑准备给你最后一击的时候——',
    nextNodeId: 'ch4_master_rescue',
  },

  // ==================== 师父救援 ====================
  ch4_master_rescue: {
    id: 'ch4_master_rescue',
    type: 'narration',
    content: '一道耀眼的剑光从天而降，势如奔雷！血影脸色大变，急忙后撤。剑光在他方才站立的地方炸开，留下一道深达数丈的裂痕。',
    nextNodeId: 'ch4_master_arrives',
  },
  ch4_master_arrives: {
    id: 'ch4_master_arrives',
    type: 'dialogue',
    speaker: '云霄真人',
    content: '区区魔修晚辈，也敢在我青云宗撒野！',
    nextNodeId: 'ch4_master_vs_xueying',
  },
  ch4_master_vs_xueying: {
    id: 'ch4_master_vs_xueying',
    type: 'narration',
    content: '云霄真人剑指血影，元婴期的修为全力爆发，气势如山岳倾覆。血影面色铁青，他虽然狂妄，却也知道自己不是元婴期修士的对手。',
    nextNodeId: 'ch4_xueying_retreat',
  },
  ch4_xueying_retreat: {
    id: 'ch4_xueying_retreat',
    type: 'dialogue',
    speaker: '血影',
    content: '哼，今日算你们走运。不过，这只是开始。我师父说过，青云宗的灭亡只是时间问题。下次见面，你们一个也跑不了。',
    nextNodeId: 'ch4_xueying_escape',
  },
  ch4_xueying_escape: {
    id: 'ch4_xueying_escape',
    type: 'narration',
    content: '血影催动一枚血色遁符，化作一道血光消失在天际。云霄真人追出数里未能追上，只得返回。魔修的突袭虽然被击退，但青云宗也付出了不小的代价。',
    nextNodeId: 'ch4_aftermath',
  },

  // ==================== 战后余波 ====================
  ch4_aftermath: {
    id: 'ch4_aftermath',
    type: 'narration',
    content: '战斗结束后，青云宗一片狼藉。数十名弟子受伤，两位外门执事殉道。但万幸的是，宗门根基未被动摇。掌门召集所有长老和内门弟子，在大殿中紧急议事。',
    nextNodeId: 'ch4_sect_meeting',
  },
  ch4_sect_meeting: {
    id: 'ch4_sect_meeting',
    type: 'dialogue',
    speaker: '青云宗掌门',
    content: '此次魔修来袭绝非偶然。据抓获的魔修口供，血煞宗已与其他数个魔修门派结盟，组成了所谓的"暗影联盟"。他们的目的是夺取各大正道门派的灵脉，以修炼一种邪功。',
    nextNodeId: 'ch4_master_analysis',
  },
  ch4_master_analysis: {
    id: 'ch4_master_analysis',
    type: 'dialogue',
    speaker: '云霄真人',
    content: '掌门师兄，弟子在战斗中发现魔修使用了一种特殊的阵法来压制我们的护山大阵。如果不找到应对之法，下一次攻击我们恐怕挡不住。',
    nextNodeId: 'ch4_su_yao_discovery',
  },
  ch4_su_yao_discovery: {
    id: 'ch4_su_yao_discovery',
    type: 'dialogue',
    speaker: '苏瑶',
    content: '掌门，弟子在藏经阁中查阅到，三百年前的那次魔修入侵，先辈们曾在云隐秘境中找到过一件克制魔功的法宝。如果我们能找到那件法宝......',
    nextNodeId: 'ch4_mission_choice',
  },
  ch4_mission_choice: {
    id: 'ch4_mission_choice',
    type: 'choice',
    content: '掌门决定派人前往云隐秘境寻找法宝。你主动请缨时，有不同的理由。',
    choices: [
      {
        text: '我与血影有未了之仇，必须变得更强来保护宗门',
        nextNodeId: 'ch4_volunteer_revenge',
        effects: [
          { type: 'modify_attribute', target: 'attack', value: 3 },
          { type: 'set_flag', target: 'ch4_motive_revenge', value: true },
        ],
      },
      {
        text: '作为弟子理应为宗门分忧，这是我的责任',
        nextNodeId: 'ch4_volunteer_duty',
        effects: [
          { type: 'modify_attribute', target: 'luck', value: 3 },
          { type: 'set_flag', target: 'ch4_motive_duty', value: true },
        ],
      },
    ],
  },

  ch4_volunteer_revenge: {
    id: 'ch4_volunteer_revenge',
    type: 'narration',
    content: '你心中燃烧着战意。血影的嘲讽和羞辱你铭记于心，下一次见面，你绝不会再如此狼狈。掌门看到你眼中的决意，微微颔首。',
    nextNodeId: 'ch4_secret_realm_prep',
  },
  ch4_volunteer_duty: {
    id: 'ch4_volunteer_duty',
    type: 'narration',
    content: '你的话语平实而坚定。云霄真人看了你一眼，嘴角微不可察地上扬了一下。掌门赞许地点头，将搜寻法宝的任务交给了你和苏瑶。',
    nextNodeId: 'ch4_secret_realm_prep',
  },

  // ==================== 秘境探索 ====================
  ch4_secret_realm_prep: {
    id: 'ch4_secret_realm_prep',
    type: 'dialogue',
    speaker: '云霄真人',
    content: '此去云隐秘境，危险重重。为师将一道护身剑意封入你的丹田，危急时刻可助你一臂之力。切记，保全自身为上，不要逞强。',
    nextNodeId: 'ch4_master_gift',
    effects: [
      { type: 'set_flag', target: 'has_master_sword_intent', value: true },
      { type: 'modify_attribute', target: 'defense', value: 10 },
    ],
  },
  ch4_master_gift: {
    id: 'ch4_master_gift',
    type: 'narration',
    content: '师父说完，伸指在你眉心一点，一道精纯的剑意没入你的识海。那是云霄真人毕生剑道修为的结晶，虽只有一击之力，却足以在危急时刻救你性命。你的眼眶微微湿润。',
    nextNodeId: 'ch4_enter_realm',
  },
  ch4_enter_realm: {
    id: 'ch4_enter_realm',
    type: 'narration',
    content: '你和苏瑶一同前往云隐秘境的入口。秘境位于青云山脉深处的一处绝壁之后，需要特殊的令牌才能开启。当你们踏入秘境时，眼前豁然开朗——这是一片被时间遗忘的天地。',
    nextNodeId: 'ch4_realm_scene',
  },
  ch4_realm_scene: {
    id: 'ch4_realm_scene',
    type: 'narration',
    content: '秘境中灵气充沛，草木茂盛，远处可见一座古朴的大殿矗立在山巅。然而秘境中也弥漫着一丝诡异的气息，似乎有什么东西在暗处窥伺。',
    nextNodeId: 'ch4_realm_encounter',
  },
  ch4_realm_encounter: {
    id: 'ch4_realm_encounter',
    type: 'narration',
    content: '你和苏瑶向大殿方向行进。半途中，前方突然响起一阵尖锐的啸声，数道黑影从林中窜出——竟然是魔修！血影的人已经先一步到了！',
    nextNodeId: 'ch4_realm_battle',
  },
  ch4_realm_battle: {
    id: 'ch4_realm_battle',
    type: 'battle',
    content: '魔修潜入了秘境！一名实力强横的魔修长老拦在你面前，身后的弟子正向大殿方向突进。你必须尽快击败他！',
    battleId: 'story_4_2',
    nextNodeId: 'ch4_realm_victory',
    effects: [
      { type: 'set_flag', target: 'battle_demon_elder', value: true },
    ],
  },
  ch4_realm_victory: {
    id: 'ch4_realm_victory',
    type: 'narration',
    content: '在苏瑶的配合下，你终于击败了魔修长老。这场战斗让你的金丹更加凝实，隐隐有突破的迹象。苏瑶帮你包扎了伤口，两人继续向大殿进发。',
    nextNodeId: 'ch4_find_treasure',
  },
  ch4_find_treasure: {
    id: 'ch4_find_treasure',
    type: 'narration',
    content: '大殿之中，你们找到了先辈留下的宝物——一面镇魔铜镜。铜镜古朴无华，但其中蕴含的正道之力足以克制任何魔功。这正是宗门抵御魔修入侵的关键！',
    nextNodeId: 'ch4_su_yao_moment',
    effects: [
      { type: 'set_flag', target: 'found_zhenmo_mirror', value: true },
    ],
  },

  // ==================== 师姐互动 ====================
  ch4_su_yao_moment: {
    id: 'ch4_su_yao_moment',
    type: 'dialogue',
    speaker: '苏瑶',
    content: '师弟，今天辛苦你了。说实话，你今天的表现让我很意外。入门不过一年，就能与金丹后期的魔修过招......师父收你为徒，果然没有看走眼。',
    nextNodeId: 'ch4_return_sect',
  },
  ch4_return_sect: {
    id: 'ch4_return_sect',
    type: 'narration',
    content: '你们带着镇魔铜镜返回青云宗。掌门大喜过望，立即命阵法长老将铜镜融入护山大阵之中。有了这件法宝，宗门的防御力大幅提升，足以抵挡魔修的下一波攻势。',
    nextNodeId: 'ch4_master_praise',
  },
  ch4_master_praise: {
    id: 'ch4_master_praise',
    type: 'dialogue',
    speaker: '云霄真人',
    content: '......做得不错。',
    nextNodeId: 'ch4_master_praise_2',
  },
  ch4_master_praise_2: {
    id: 'ch4_master_praise_2',
    type: 'narration',
    content: '从师父口中听到这四个字，比获得任何奖赏都让你开心。你知道，这位严厉的长辈从不轻易夸奖弟子。苏瑶在旁边偷偷冲你竖起了大拇指。',
    nextNodeId: 'ch4_chapter_end',
  },

  // ==================== 章节结尾 ====================
  ch4_chapter_end: {
    id: 'ch4_chapter_end',
    type: 'narration',
    content: '魔修的第一波攻势被击退，但你知道这只是暴风雨前的宁静。血影临走时的威胁绝非虚言，暗影联盟的野心远不止于此。你必须尽快提升修为，为即将到来的大战做好准备。师父的期望、师姐的信任、同门的安危......这一切，都是你前行的动力。',
    effects: [
      { type: 'set_flag', target: 'chapter_4_completed', value: true },
      { type: 'modify_attribute', target: 'cultivation', value: 500 },
      { type: 'set_flag', target: 'met_xueying', value: true },
      { type: 'set_flag', target: 'met_yunxiao', value: true },
      { type: 'set_flag', target: 'met_suyao', value: true },
    ],
  },
};

// 获取第四章节点
export function getChapter4Node(nodeId: string): StoryNode | null {
  return chapter4Story[nodeId] || null;
}
