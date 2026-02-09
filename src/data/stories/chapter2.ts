import type { StoryNode } from '../../types';

// 第二章：拜入仙门
// 通用剧情，不区分出身
export const chapter2Story: Record<string, StoryNode> = {
  // ==================== 开篇 ====================
  ch2_start: {
    id: 'ch2_start',
    type: 'narration',
    content: '独自修炼数月后，你发现进度越来越慢。功法的瓶颈、灵石的匮乏、修炼心得的缺失......种种问题困扰着你。',
    nextNodeId: 'ch2_hear_news',
  },
  ch2_hear_news: {
    id: 'ch2_hear_news',
    type: 'narration',
    content: '某日，一位行脚商人告诉你，百里外有一座名为"青云宗"的修仙门派，每年都会招收新弟子。下一次招收就在半月之后。',
    nextNodeId: 'ch2_decision',
  },
  ch2_decision: {
    id: 'ch2_decision',
    type: 'narration',
    content: '你思索良久，终于下定决心——要想在修仙路上走得更远，必须寻找更好的修炼环境和指导。青云宗，正是一个绝佳的机会。',
    nextNodeId: 'ch2_journey_start',
  },

  // ==================== 路途 ====================
  ch2_journey_start: {
    id: 'ch2_journey_start',
    type: 'narration',
    content: '你收拾行囊，踏上了前往青云宗的旅程。一路上，你看到了许多同样怀揣着仙途梦想的年轻人，有的结伴而行，有的独自赶路。',
    nextNodeId: 'ch2_meet_liu',
  },
  ch2_meet_liu: {
    id: 'ch2_meet_liu',
    type: 'dialogue',
    speaker: '刘青',
    content: '哟，兄台也是去青云宗碰运气的？我叫刘青，家里世代都是凡人，听说今年青云宗扩招，这才豁出去想搏一个仙缘。你呢，看你气息内敛，莫非已经开始修炼了？',
    nextNodeId: 'ch2_choice_liu',
  },
  ch2_choice_liu: {
    id: 'ch2_choice_liu',
    type: 'choice',
    content: '刘青似乎是个热情开朗的人，你要如何回应？',
    choices: [
      {
        text: '如实相告，与他结伴同行',
        nextNodeId: 'ch2_befriend_liu',
        effects: [
          { type: 'set_flag', target: 'liu_friend', value: true },
          { type: 'modify_attribute', target: 'luck', value: 3 },
        ],
      },
      {
        text: '随意敷衍，独行更自在',
        nextNodeId: 'ch2_alone_journey',
        effects: [
          { type: 'set_flag', target: 'lone_wolf', value: true },
        ],
      },
    ],
  },
  ch2_befriend_liu: {
    id: 'ch2_befriend_liu',
    type: 'narration',
    content: '你与刘青相谈甚欢，决定结伴而行。一路上，刘青虽然没有修为，但见多识广，告诉了你许多关于青云宗的情报——三关考核的大致内容、往年的通过率、甚至是哪些执事比较好说话。',
    nextNodeId: 'ch2_liu_gift',
  },
  ch2_liu_gift: {
    id: 'ch2_liu_gift',
    type: 'dialogue',
    speaker: '刘青',
    content: '对了，这是我爷爷留下的护身符，说是能带来好运。你修为比我强，入门希望更大，这个给你吧，希望能帮上忙！',
    nextNodeId: 'ch2_arrive_sect',
    effects: [
      { type: 'set_flag', target: 'has_liu_amulet', value: true },
    ],
  },
  ch2_alone_journey: {
    id: 'ch2_alone_journey',
    type: 'narration',
    content: '你婉拒了刘青的好意，独自前行。修仙之路本就是一条孤独的道路，太多牵绊反而是累赘。刘青有些失望，但也没有强求，挥手道别后便去寻找其他同路人了。',
    nextNodeId: 'ch2_arrive_sect',
  },

  // ==================== 抵达青云宗 ====================
  ch2_arrive_sect: {
    id: 'ch2_arrive_sect',
    type: 'narration',
    content: '青云宗坐落于青云峰之上，云雾缭绕间可见殿宇楼阁错落有致。青石阶梯蜿蜒而上，直入云霄。宗门山门前已经聚集了上千名怀揣仙途梦想的年轻人。',
    nextNodeId: 'ch2_sect_gate',
  },
  ch2_sect_gate: {
    id: 'ch2_sect_gate',
    type: 'narration',
    content: '山门两侧矗立着两座巨大的石像，似人似兽，威严肃穆。门楣上悬挂着一块匾额，上书"青云宗"三个大字，笔力遒劲，隐隐有剑意流转。',
    nextNodeId: 'ch2_test_intro',
  },
  ch2_test_intro: {
    id: 'ch2_test_intro',
    type: 'dialogue',
    speaker: '青云宗执事',
    content: '肃静！本座是青云宗外门执事张元。今日招收弟子考核分为三关：第一关测试灵根资质，第二关考验心性定力，第三关是实战比试。三关皆通过者，方可入我青云宗！',
    nextNodeId: 'ch2_test_warning',
  },
  ch2_test_warning: {
    id: 'ch2_test_warning',
    type: 'dialogue',
    speaker: '张元执事',
    content: '丑话说在前头——考核中若有人作弊舞弊，或伤及考官性命者，不仅取消入门资格，还将受到青云宗的追杀！尔等可都听清楚了？',
    nextNodeId: 'ch2_test_1_start',
  },

  // ==================== 第一关：灵根测试 ====================
  ch2_test_1_start: {
    id: 'ch2_test_1_start',
    type: 'narration',
    content: '第一关：灵根测试。考生们依次上前，将手放在一块晶莹剔透的测灵石上。测灵石会根据灵根资质散发不同颜色的光芒。',
    nextNodeId: 'ch2_test_1_wait',
  },
  ch2_test_1_wait: {
    id: 'ch2_test_1_wait',
    type: 'narration',
    content: '轮到你之前，已有数十人被测试。有的人让测灵石发出微弱的白光，有的人则是淡淡的青色或红色。也有不少人连白光都引不出来，垂头丧气地离开了。',
    nextNodeId: 'ch2_test_1_your_turn',
  },
  ch2_test_1_your_turn: {
    id: 'ch2_test_1_your_turn',
    type: 'narration',
    content: '终于轮到你。你深吸一口气，将手掌贴上测灵石。一股温热的气息从掌心传来，测灵石逐渐亮起——光芒稳定而柔和，显示出你不俗的灵根资质。',
    nextNodeId: 'ch2_test_1_result',
  },
  ch2_test_1_result: {
    id: 'ch2_test_1_result',
    type: 'dialogue',
    speaker: '张元执事',
    content: '嗯，灵根中等偏上，资质尚可。第一关，通过！',
    nextNodeId: 'ch2_test_1_pass',
    effects: [
      { type: 'set_flag', target: 'test_1_passed', value: true },
    ],
  },
  ch2_test_1_pass: {
    id: 'ch2_test_1_pass',
    type: 'narration',
    content: '你松了口气，退到一旁等候第二关。放眼望去，第一关的淘汰率约有三成，不少资质平平者只能黯然离去。',
    nextNodeId: 'ch2_test_2_start',
  },

  // ==================== 第二关：心境考验 ====================
  ch2_test_2_start: {
    id: 'ch2_test_2_start',
    type: 'narration',
    content: '第二关：心境考验。通过第一关的考生被分成数组，依次进入一座古老的石殿。传闻殿内布置着一座幻阵，会根据每个人的内心制造幻境。',
    nextNodeId: 'ch2_test_2_enter',
  },
  ch2_test_2_enter: {
    id: 'ch2_test_2_enter',
    type: 'narration',
    content: '你踏入石殿，眼前突然天旋地转。当视野恢复清明时，你发现自己置身于一片陌生的场景中——这里是......你记忆中最渴望的地方。',
    nextNodeId: 'ch2_test_2_illusion',
  },
  ch2_test_2_illusion: {
    id: 'ch2_test_2_illusion',
    type: 'narration',
    content: '幻境中，你看到了自己最渴望得到的东西：可能是至高的权力、绝世的功法、亡故的亲人、或是某个难以企及的梦想。一切都那么真实，触手可及。',
    nextNodeId: 'ch2_test_2_temptation',
  },
  ch2_test_2_temptation: {
    id: 'ch2_test_2_temptation',
    type: 'narration',
    content: '与此同时，你内心深处的恐惧也开始浮现——失败的噩梦、死亡的阴影、被背叛的痛苦......它们化作实质，逼迫着你。',
    nextNodeId: 'ch2_test_2_choice',
  },
  ch2_test_2_choice: {
    id: 'ch2_test_2_choice',
    type: 'choice',
    content: '面对幻境中的诱惑与恐惧，你选择如何应对？',
    choices: [
      {
        text: '闭目凝神，以不变应万变，静待幻境消散',
        nextNodeId: 'ch2_test_2_calm',
        effects: [
          { type: 'modify_attribute', target: 'comprehension', value: 5 },
          { type: 'set_flag', target: 'heart_calm', value: true },
        ],
      },
      {
        text: '直面恐惧，与心魔正面交锋',
        nextNodeId: 'ch2_test_2_brave',
        effects: [
          { type: 'modify_attribute', target: 'attack', value: 5 },
          { type: 'set_flag', target: 'heart_brave', value: true },
        ],
      },
      {
        text: '承认欲望的存在，但明确告诉自己这只是幻象',
        nextNodeId: 'ch2_test_2_honest',
        effects: [
          { type: 'modify_attribute', target: 'luck', value: 5 },
          { type: 'set_flag', target: 'heart_honest', value: true },
        ],
      },
    ],
  },
  ch2_test_2_calm: {
    id: 'ch2_test_2_calm',
    type: 'narration',
    content: '你盘膝而坐，闭目调息，将心神收敛至丹田。外界的诱惑与恐惧如潮水般冲击，却始终无法动摇你分毫。渐渐地，幻境开始崩塌......',
    nextNodeId: 'ch2_test_2_pass',
  },
  ch2_test_2_brave: {
    id: 'ch2_test_2_brave',
    type: 'narration',
    content: '你睁开眼，直视那些恐惧的化身。"来吧！"你大喝一声，与心魔展开激烈的搏斗。虽然过程艰难，但你最终战胜了内心的阴暗面，幻境随之崩塌......',
    nextNodeId: 'ch2_test_2_pass',
  },
  ch2_test_2_honest: {
    id: 'ch2_test_2_honest',
    type: 'narration',
    content: '"我承认，我渴望这些。"你平静地说，"但我知道这只是幻象。真正的力量和幸福，需要自己去争取。"话音落下，幻境如镜子般碎裂......',
    nextNodeId: 'ch2_test_2_pass',
  },
  ch2_test_2_pass: {
    id: 'ch2_test_2_pass',
    type: 'narration',
    content: '你睁开眼，发现自己已经站在石殿之外。一位考官走过来，在你的名牌上画了一个勾。第二关，通过。',
    nextNodeId: 'ch2_test_2_result',
    effects: [
      { type: 'set_flag', target: 'test_2_passed', value: true },
    ],
  },
  ch2_test_2_result: {
    id: 'ch2_test_2_result',
    type: 'narration',
    content: '第二关的淘汰率更高，近半数人在幻境中迷失，被抬出石殿时仍神志不清。修仙之路，心性与资质同样重要。',
    nextNodeId: 'ch2_test_3_start',
  },

  // ==================== 第三关：实战比试 ====================
  ch2_test_3_start: {
    id: 'ch2_test_3_start',
    type: 'narration',
    content: '第三关：实战比试。通过前两关的考生被带到一处演武场。场地中央划分出多个比试擂台，考官开始随机配对。',
    nextNodeId: 'ch2_test_3_intro',
  },
  ch2_test_3_intro: {
    id: 'ch2_test_3_intro',
    type: 'dialogue',
    speaker: '张元执事',
    content: '第三关比的是实战能力。规则很简单——打倒对手即可。可以使用武器和法术，但不得伤及对手性命。本座会在场边监督，若有人下死手......后果自负！',
    nextNodeId: 'ch2_test_3_match',
  },
  ch2_test_3_match: {
    id: 'ch2_test_3_match',
    type: 'narration',
    content: '你被分配到三号擂台。你的对手是一个身材魁梧的青年，虎背熊腰，一看就是力量型的修者。他冷笑着活动了一下筋骨，目光中满是轻蔑。',
    nextNodeId: 'ch2_test_3_opponent',
  },
  ch2_test_3_opponent: {
    id: 'ch2_test_3_opponent',
    type: 'dialogue',
    speaker: '魁梧青年',
    content: '小子，劝你直接认输，省得待会儿被打得太惨。我王大力练的是外门硬功，一拳下去，铁石都得碎！',
    nextNodeId: 'ch2_test_3_choice',
  },
  ch2_test_3_choice: {
    id: 'ch2_test_3_choice',
    type: 'choice',
    content: '面对对手的挑衅，你如何回应？',
    choices: [
      {
        text: '不与他废话，直接进入战斗状态',
        nextNodeId: 'ch2_test_3_battle',
      },
      {
        text: '冷笑回应："那就让我看看你的本事。"',
        nextNodeId: 'ch2_test_3_taunt',
        effects: [
          { type: 'set_flag', target: 'taunted_opponent', value: true },
        ],
      },
    ],
  },
  ch2_test_3_taunt: {
    id: 'ch2_test_3_taunt',
    type: 'narration',
    content: '王大力被你的态度激怒，脸色涨红，怒喝一声率先冲了上来。愤怒让他的攻击更加凶猛，但也更加鲁莽。',
    nextNodeId: 'ch2_test_3_battle',
  },
  ch2_test_3_battle: {
    id: 'ch2_test_3_battle',
    type: 'battle',
    content: '比试开始！王大力挥拳冲来，你必须击败他才能通过第三关！',
    battleId: 'story_2_1',  // 关联青云考核副本
    nextNodeId: 'ch2_test_3_victory',
    effects: [
      { type: 'set_flag', target: 'battle_wang_dali', value: true },
    ],
  },
  ch2_test_3_victory: {
    id: 'ch2_test_3_victory',
    type: 'narration',
    content: '经过一番激战，你成功击败了王大力。他重重摔在地上，挣扎了几下却爬不起来，只能恨恨地瞪着你。',
    nextNodeId: 'ch2_test_3_result',
    effects: [
      { type: 'set_flag', target: 'test_3_passed', value: true },
    ],
  },
  ch2_test_3_result: {
    id: 'ch2_test_3_result',
    type: 'dialogue',
    speaker: '张元执事',
    content: '三号擂台，胜者确定！身法灵活，出手果断，不错。第三关，通过！',
    nextNodeId: 'ch2_all_test_pass',
  },

  // ==================== 入门 ====================
  ch2_all_test_pass: {
    id: 'ch2_all_test_pass',
    type: 'narration',
    content: '三关皆通过！你与其他成功者被带到宗门大殿前的广场上。最终通过考核的人数约有两百人，不到最初人数的两成。',
    nextNodeId: 'ch2_initiation_ceremony',
  },
  ch2_initiation_ceremony: {
    id: 'ch2_initiation_ceremony',
    type: 'narration',
    content: '大殿之上，一位白发老者端坐在首位，正是青云宗的掌门。他目光扫过众人，威压之下，所有新弟子都不敢喧哗。',
    nextNodeId: 'ch2_sect_master_speech',
  },
  ch2_sect_master_speech: {
    id: 'ch2_sect_master_speech',
    type: 'dialogue',
    speaker: '青云宗掌门',
    content: '诸位能通过考核，说明你们具备修仙的资质与心性。从今日起，你们便是青云宗的外门弟子。修仙路漫漫，望尔等勤加修炼，早日有所成就。',
    nextNodeId: 'ch2_receive_items',
  },
  ch2_receive_items: {
    id: 'ch2_receive_items',
    type: 'narration',
    content: '仪式结束后，你领取了外门弟子的标准配置：一件青云道袍、一枚弟子令牌、以及一月份的修炼资源。',
    nextNodeId: 'ch2_liu_ending',
  },
  ch2_liu_ending: {
    id: 'ch2_liu_ending',
    type: 'narration',
    content: '你环顾四周，寻找刘青的身影。可惜，他似乎没能通过考核。也许是灵根不足，也许是心境考验失败。修仙之路，终究是残酷的。',
    nextNodeId: 'ch2_chapter_end',
  },
  ch2_chapter_end: {
    id: 'ch2_chapter_end',
    type: 'narration',
    content: '夜幕降临，你站在分配给你的洞府门口，眺望着山下的万家灯火。从今日起，你就是青云宗的一员了。修仙之路，才刚刚开始......',
    effects: [
      { type: 'set_flag', target: 'chapter_2_completed', value: true },
    ],
  },
};

// 获取第二章节点
export function getChapter2Node(nodeId: string): StoryNode | null {
  return chapter2Story[nodeId] || null;
}
