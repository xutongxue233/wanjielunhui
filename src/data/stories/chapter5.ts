import type { StoryNode } from '../../types';

// 第五章：元婴修炼与宗门危机
// 元婴期剧情，三种出身专属分支
export const chapter5Story: Record<string, StoryNode> = {
  // ==================== 开篇：元婴初成 ====================
  ch5_start: {
    id: 'ch5_start',
    type: 'narration',
    content: '自击退魔修入侵之后，你闭关苦修数载。在云霄真人的悉心指导和镇魔铜镜的灵气滋养下，你的金丹终于迎来了蜕变的契机。经过九九八十一日的闭关，你成功结出元婴，修为跃入全新的境界。',
    nextNodeId: 'ch5_yuanying_formed',
  },
  ch5_yuanying_formed: {
    id: 'ch5_yuanying_formed',
    type: 'narration',
    content: '元婴初成之际，你体内涌动着前所未有的力量。神识大幅扩展，方圆百里的风吹草动皆在感知之中。云霄真人罕见地露出了一丝欣慰的神情。',
    nextNodeId: 'ch5_master_teaching',
  },
  ch5_master_teaching: {
    id: 'ch5_master_teaching',
    type: 'dialogue',
    speaker: '云霄真人',
    content: '元婴初成，你已具备了独当一面的实力。但为师要告诫你，修为越高，面临的危险便越大。暗影联盟虎视眈眈，宗门内外暗流涌动。你要时刻保持警惕。',
    nextNodeId: 'ch5_su_yao_congrats',
  },
  ch5_su_yao_congrats: {
    id: 'ch5_su_yao_congrats',
    type: 'dialogue',
    speaker: '苏瑶',
    content: '恭喜师弟突破元婴！你才入门几年就有如此修为，实在了不起。师姐我可得加把劲了，不然就要被你超过了。对了，师弟，掌门说有要事找你，你赶紧去看看吧。',
    nextNodeId: 'ch5_sect_master_summon',
  },
  ch5_sect_master_summon: {
    id: 'ch5_sect_master_summon',
    type: 'dialogue',
    speaker: '青云宗掌门',
    content: '你来了。先坐下，有几件事要跟你说。第一，鉴于你的功绩和修为，宗门决定擢升你为核心弟子。第二......最近有一些异常情况，需要你去调查。',
    nextNodeId: 'ch5_sect_crisis',
  },
  ch5_sect_crisis: {
    id: 'ch5_sect_crisis',
    type: 'dialogue',
    speaker: '青云宗掌门',
    content: '近几月来，宗门附近的几个村镇频繁发生离奇命案。死者体内灵气被完全抽空，面容扭曲如受极刑。更令人不安的是，我们的探子传回消息，暗影联盟正在秘密集结。他们似乎在谋划一场更大的行动。',
    nextNodeId: 'ch5_origin_branch',
  },

  // ==================== 出身分支 ====================
  ch5_origin_branch: {
    id: 'ch5_origin_branch',
    type: 'narration',
    content: '你领命而去，决定先从附近的村镇开始调查。然而，就在你准备出发之际，一件意想不到的事情发生了。',
    nextNodeId: 'ch5_village_orphan_branch',
    conditions: [
      { type: 'flag', key: 'origin_village_orphan', operator: '==', value: true },
    ],
  },

  // --- 山村孤儿分支 ---
  ch5_village_orphan_branch: {
    id: 'ch5_village_orphan_branch',
    type: 'narration',
    content: '一名风尘仆仆的旅人带来了一个消息——你的故乡青山村，正在遭受一种奇怪的瘟疫侵袭。你心中一紧，当年王伯收养你的恩情犹在心头。你决定先回故乡看看。',
    nextNodeId: 'ch5_village_return',
  },
  ch5_village_return: {
    id: 'ch5_village_return',
    type: 'narration',
    content: '当你御剑飞回青山村时，眼前的景象让你倍感陌生。曾经宁静祥和的小村庄已大不相同——许多房屋翻新过了，村口立着一块"仙缘福地"的石碑，似乎是因为你成为修士之后，村子获得了一些庇荫。',
    nextNodeId: 'ch5_village_change',
  },
  ch5_village_change: {
    id: 'ch5_village_change',
    type: 'narration',
    content: '然而繁荣的表象之下，瘟疫正在蔓延。你以元婴期的神识探查，发现这并非普通瘟疫——患者体内残留着极淡的魔气。有人在暗中对村民下手！',
    nextNodeId: 'ch5_village_investigation',
    effects: [
      { type: 'set_flag', target: 'ch5_discovered_magic_plague', value: true },
    ],
  },
  ch5_village_investigation: {
    id: 'ch5_village_investigation',
    type: 'narration',
    content: '你走访村中幸存的老人，得知王伯已在两年前过世。你在王伯的坟前默立良久，暗暗发誓要查出真相，保护这个曾经养育你的地方。',
    nextNodeId: 'ch5_origin_converge',
    effects: [
      { type: 'set_flag', target: 'ch5_hometown_revisited', value: true },
    ],
  },

  // --- 家族余孤分支 ---
  ch5_fallen_clan_branch: {
    id: 'ch5_fallen_clan_branch',
    type: 'narration',
    content: '一封匿名信被送到了你的洞府。信上只有寥寥几个字：「陈家之仇，另有隐情。若想知道真相，月圆之夜，来落星崖。」字迹苍劲有力，绝非寻常之辈所书。',
    nextNodeId: 'ch5_clan_clue',
  },
  ch5_clan_clue: {
    id: 'ch5_clan_clue',
    type: 'choice',
    content: '这封匿名信可能是陷阱，但也可能是解开灭门之谜的线索。你如何决定？',
    choices: [
      {
        text: '亲自前往落星崖，查明真相',
        nextNodeId: 'ch5_go_to_cliff',
        effects: [
          { type: 'set_flag', target: 'ch5_went_to_cliff', value: true },
        ],
      },
      {
        text: '暗中设下埋伏，以防有诈',
        nextNodeId: 'ch5_set_trap',
        effects: [
          { type: 'set_flag', target: 'ch5_set_clan_trap', value: true },
        ],
      },
    ],
  },
  ch5_go_to_cliff: {
    id: 'ch5_go_to_cliff',
    type: 'narration',
    content: '月圆之夜，你独自来到落星崖。等候你的是一位年迈的老妇人，她曾是陈家的老仆。她颤抖着告诉你，当年灭门的幕后黑手并非王家——王家也是被人利用的棋子。真正的敌人，隐藏在更深的暗处。',
    nextNodeId: 'ch5_clan_truth',
  },
  ch5_set_trap: {
    id: 'ch5_set_trap',
    type: 'narration',
    content: '你在落星崖周围布下法阵，自己隐身暗处观察。来人果然是一位老妇人，看上去并无恶意。你现身后，她惊慌了片刻，随后含泪道出了一个惊天的秘密。',
    nextNodeId: 'ch5_clan_truth',
  },
  ch5_clan_truth: {
    id: 'ch5_clan_truth',
    type: 'narration',
    content: '原来，陈家世代守护着一件上古封印，而暗影联盟的前身正是觊觎这件封印之力的魔修组织。灭你全族只是为了破坏封印，而王家不过是他们收买的刀。你握紧了父亲留下的玉佩——真相，比想象中更加沉重。',
    nextNodeId: 'ch5_origin_converge',
    effects: [
      { type: 'set_flag', target: 'ch5_clan_truth_revealed', value: true },
      { type: 'set_flag', target: 'ch5_knows_seal', value: true },
    ],
  },

  // --- 转世重修分支 ---
  ch5_reincarnation_branch: {
    id: 'ch5_reincarnation_branch',
    type: 'narration',
    content: '元婴初成之夜，你做了一个无比清晰的梦。梦中，你站在九天之上，俯瞰苍生万物。一个熟悉又陌生的声音在脑海中回响：「终于......你的修为够了......记忆的封印，可以解除一部分了......」',
    nextNodeId: 'ch5_memory_awakening',
  },
  ch5_memory_awakening: {
    id: 'ch5_memory_awakening',
    type: 'narration',
    content: '刹那间，大量前世记忆如洪水般涌入脑海。你前世的名号是"天玄上仙"，曾是修仙界的巅峰强者之一。渡劫之时，你最信任的师弟暗中勾结域外天魔，在你雷劫最猛烈的时刻背后捅了一刀。',
    nextNodeId: 'ch5_memory_detail',
  },
  ch5_memory_detail: {
    id: 'ch5_memory_detail',
    type: 'narration',
    content: '记忆中，那个师弟的面容逐渐清晰——一双充满贪婪与野心的眼睛，与血影的眼神何其相似！你猛然惊醒，汗透重衫。前世的仇人，是否已经转世？暗影联盟的崛起，与你的前世是否有关联？',
    nextNodeId: 'ch5_origin_converge',
    effects: [
      { type: 'set_flag', target: 'ch5_past_life_awakened', value: true },
      { type: 'set_flag', target: 'ch5_knows_betrayer', value: true },
    ],
  },

  // ==================== 合流：调查暗影联盟 ====================
  ch5_origin_converge: {
    id: 'ch5_origin_converge',
    type: 'narration',
    content: '种种线索都指向同一个方向——暗影联盟正在酝酿一场比上次更大的阴谋。你将调查所得报告给掌门和师父，宗门上下顿时警觉起来。',
    nextNodeId: 'ch5_intel_meeting',
  },
  ch5_intel_meeting: {
    id: 'ch5_intel_meeting',
    type: 'dialogue',
    speaker: '云霄真人',
    content: '情况比我们预想的更加严峻。我收到了友盟天剑宗的飞剑传书，他们也遭到了魔修的骚扰。看来暗影联盟的目标不仅是我们一家，而是整个正道修仙界。',
    nextNodeId: 'ch5_alliance_plan',
  },
  ch5_alliance_plan: {
    id: 'ch5_alliance_plan',
    type: 'dialogue',
    speaker: '青云宗掌门',
    content: '各正道门派决定联合起来，组建正道同盟以对抗暗影联盟。三月后将在天剑宗召开同盟大会。在此之前，我们需要摸清暗影联盟的具体部署。这个任务，就交给你和苏瑶了。',
    nextNodeId: 'ch5_spy_mission',
  },
  ch5_spy_mission: {
    id: 'ch5_spy_mission',
    type: 'narration',
    content: '你和苏瑶乔装改扮，前往魔修活跃的边境地带打探情报。一路上，你们亲眼目睹了魔修肆虐的惨状——村庄被屠、灵脉被夺、修士被抓去炼制血丹......',
    nextNodeId: 'ch5_witness_atrocity',
  },
  ch5_witness_atrocity: {
    id: 'ch5_witness_atrocity',
    type: 'narration',
    content: '在一处荒废的小镇中，你们发现了一个被魔修遗弃的据点。里面堆满了各种邪修材料和残缺的法阵图纸。苏瑶仔细研究后，脸色骤变。',
    nextNodeId: 'ch5_su_yao_analysis',
  },
  ch5_su_yao_analysis: {
    id: 'ch5_su_yao_analysis',
    type: 'dialogue',
    speaker: '苏瑶',
    content: '师弟，这些法阵图纸......是"万魔归一阵"的组成部分！这是上古魔修用来召唤域外天魔的禁忌大阵。如果让他们布阵成功，整个修仙界都会面临灭顶之灾！',
    nextNodeId: 'ch5_react_choice',
  },
  ch5_react_choice: {
    id: 'ch5_react_choice',
    type: 'choice',
    content: '得知暗影联盟的真正目的后，你和苏瑶必须尽快做出决定。',
    choices: [
      {
        text: '立即返回宗门报信，联合正道力量应对',
        nextNodeId: 'ch5_return_report',
        effects: [
          { type: 'modify_attribute', target: 'luck', value: 5 },
          { type: 'set_flag', target: 'ch5_reported_early', value: true },
        ],
      },
      {
        text: '继续深入调查，找到法阵的核心位置',
        nextNodeId: 'ch5_deep_investigation',
        effects: [
          { type: 'modify_attribute', target: 'comprehension', value: 5 },
          { type: 'set_flag', target: 'ch5_found_core', value: true },
        ],
      },
      {
        text: '分头行动：苏瑶回去报信，你继续调查',
        nextNodeId: 'ch5_split_up',
        effects: [
          { type: 'modify_attribute', target: 'attack', value: 3 },
          { type: 'set_flag', target: 'ch5_split_action', value: true },
        ],
      },
    ],
  },

  // ==================== 调查路线 ====================
  ch5_return_report: {
    id: 'ch5_return_report',
    type: 'narration',
    content: '你们连夜赶回青云宗，将情报呈报掌门。掌门当即以飞剑传书通知各正道门派。同盟大会被提前召开，各方开始紧急备战。',
    nextNodeId: 'ch5_prepare_war',
  },
  ch5_deep_investigation: {
    id: 'ch5_deep_investigation',
    type: 'narration',
    content: '你和苏瑶继续深入魔修控制区域。凭借元婴期的修为和苏瑶精湛的隐匿术，你们避开了多处魔修巡逻，终于发现了法阵核心所在的位置——一座被黑雾笼罩的古老火山。',
    nextNodeId: 'ch5_prepare_war',
    effects: [
      { type: 'set_flag', target: 'ch5_knows_array_location', value: true },
    ],
  },
  ch5_split_up: {
    id: 'ch5_split_up',
    type: 'narration',
    content: '苏瑶虽然担心你的安全，但也知道这是最高效的方案。她留下几张通讯符箓后匆匆赶回宗门。你则独自潜入魔修腹地，冒着极大的风险收集了大量关键情报。',
    nextNodeId: 'ch5_solo_danger',
  },
  ch5_solo_danger: {
    id: 'ch5_solo_danger',
    type: 'narration',
    content: '独自行动时，你不慎被一队魔修巡逻发现。好在你的修为已今非昔比，凭借元婴期的实力强行突围。但这也暴露了你的行踪，你不得不加速撤离。',
    nextNodeId: 'ch5_prepare_war',
  },

  // ==================== 备战与内忧 ====================
  ch5_prepare_war: {
    id: 'ch5_prepare_war',
    type: 'narration',
    content: '正道同盟紧急集结。青云宗、天剑宗、万法宗、灵药谷等数十个门派齐聚一堂，共商对策。然而，就在备战的关键时刻，宗门内部出现了裂痕。',
    nextNodeId: 'ch5_internal_conflict',
  },
  ch5_internal_conflict: {
    id: 'ch5_internal_conflict',
    type: 'narration',
    content: '几名长老主张与暗影联盟谈判求和，认为正面交锋胜算不大。更有人暗中散布流言，说此次危机皆因宗门收容了"不祥之人"所致。你隐约感觉，宗门内部可能已有魔修的内应。',
    nextNodeId: 'ch5_traitor_suspicion',
  },
  ch5_traitor_suspicion: {
    id: 'ch5_traitor_suspicion',
    type: 'dialogue',
    speaker: '苏瑶',
    content: '师弟，我越来越觉得事情不对。赵长老最近行迹诡秘，而且他提出的"和谈方案"几乎就是让宗门自废武功。我怀疑......他可能被魔修收买了。',
    nextNodeId: 'ch5_investigate_traitor',
  },
  ch5_investigate_traitor: {
    id: 'ch5_investigate_traitor',
    type: 'choice',
    content: '宗门内出现了叛徒的嫌疑，你如何处理这个棘手的问题？',
    choices: [
      {
        text: '暗中跟踪赵长老，收集证据后再向掌门举报',
        nextNodeId: 'ch5_stalk_traitor',
        effects: [
          { type: 'set_flag', target: 'ch5_gathered_evidence', value: true },
        ],
      },
      {
        text: '直接向掌门和师父汇报怀疑，请他们定夺',
        nextNodeId: 'ch5_report_suspicion',
        effects: [
          { type: 'set_flag', target: 'ch5_trusted_authority', value: true },
        ],
      },
    ],
  },
  ch5_stalk_traitor: {
    id: 'ch5_stalk_traitor',
    type: 'narration',
    content: '你连续数日暗中监视赵长老。终于在一个深夜，你亲眼看到他偷偷离开宗门，在山下一处隐蔽的废墟中与一名魔修接头。你用传音符箓记录下了他们的对话，铁证如山。',
    nextNodeId: 'ch5_traitor_exposed',
  },
  ch5_report_suspicion: {
    id: 'ch5_report_suspicion',
    type: 'narration',
    content: '掌门和云霄真人听完你的汇报后神色凝重。师父亲自出手设下天罗地网，三日后便抓住了赵长老通敌的现行。',
    nextNodeId: 'ch5_traitor_exposed',
  },
  ch5_traitor_exposed: {
    id: 'ch5_traitor_exposed',
    type: 'narration',
    content: '赵长老的叛变被揭露，在审讯中他交代了更多内幕——暗影联盟计划在正道同盟大会召开时发动突袭，而他的任务就是在宗门内部制造混乱。这个情报至关重要，及时挽救了正道同盟免于被偷袭的厄运。',
    nextNodeId: 'ch5_xueying_return',
    effects: [
      { type: 'set_flag', target: 'ch5_traitor_caught', value: true },
    ],
  },

  // ==================== 血影再现 ====================
  ch5_xueying_return: {
    id: 'ch5_xueying_return',
    type: 'narration',
    content: '正道同盟提前做好了防御部署。当暗影联盟如期发动攻击时，遭到了正道修士的迎头痛击。但血影也出现在了战场上——这一次，他的修为已经突破到了元婴中期。',
    nextNodeId: 'ch5_xueying_encounter',
  },
  ch5_xueying_encounter: {
    id: 'ch5_xueying_encounter',
    type: 'dialogue',
    speaker: '血影',
    content: '又见面了，青云宗的小废物。上次让你逃了，这次可没有你师父来救你了。我听说你也突破元婴了？正好，让我看看你到底有几斤几两。',
    nextNodeId: 'ch5_xueying_battle',
  },
  ch5_xueying_battle: {
    id: 'ch5_xueying_battle',
    type: 'battle',
    content: '血影再次出现，这一次你不会再退缩。元婴对元婴，你要用实力证明自己！',
    battleId: 'story_5_1',
    nextNodeId: 'ch5_xueying_aftermath',
    effects: [
      { type: 'set_flag', target: 'ch5_fought_xueying', value: true },
    ],
  },
  ch5_xueying_aftermath: {
    id: 'ch5_xueying_aftermath',
    type: 'narration',
    content: '这一战，你与血影杀得天昏地暗。你的修为虽然略逊一筹，但凭借更扎实的功底和镇魔铜镜的加持，与他打了个旗鼓相当。血影显然没想到你进步如此之快，眼中的轻蔑逐渐被凝重取代。',
    nextNodeId: 'ch5_xueying_retreat_2',
  },
  ch5_xueying_retreat_2: {
    id: 'ch5_xueying_retreat_2',
    type: 'dialogue',
    speaker: '血影',
    content: '......你让我意外了。不过，这改变不了结局。万魔归一阵已经布置完毕，等天魔降临之日，你们正道修士统统都要死！到时候，我会亲手取你的项上人头。',
    nextNodeId: 'ch5_final_warning',
  },
  ch5_final_warning: {
    id: 'ch5_final_warning',
    type: 'narration',
    content: '血影说完便催动遁术离去。他的话让你心中一沉——万魔归一阵已经布置完毕？如果是真的，留给正道的时间已经不多了。',
    nextNodeId: 'ch5_boss_battle_lead',
  },

  // ==================== Boss战 ====================
  ch5_boss_battle_lead: {
    id: 'ch5_boss_battle_lead',
    type: 'narration',
    content: '正道同盟虽然击退了暗影联盟的正面攻击，但魔修的一支精锐部队趁乱潜入了青云宗后山，试图破坏镇魔铜镜。你和苏瑶赶到时，魔修的一名化神期高手正在强行破阵！',
    nextNodeId: 'ch5_boss_battle',
  },
  ch5_boss_battle: {
    id: 'ch5_boss_battle',
    type: 'battle',
    content: '魔修化神期强者正在破坏镇魔铜镜！你必须全力阻止他，哪怕以小敌大！',
    battleId: 'story_5_2',
    nextNodeId: 'ch5_boss_victory',
    effects: [
      { type: 'set_flag', target: 'ch5_defended_mirror', value: true },
    ],
  },
  ch5_boss_victory: {
    id: 'ch5_boss_victory',
    type: 'narration',
    content: '在苏瑶的辅助和师父留下的护身剑意的最后一击下，你们联手将魔修击退。镇魔铜镜安然无恙，但那名化神期魔修逃走了，临走前留下一句狠话——"大限将至"。',
    nextNodeId: 'ch5_aftermath',
  },

  // ==================== 章节收尾 ====================
  ch5_aftermath: {
    id: 'ch5_aftermath',
    type: 'narration',
    content: '大战之后，正道同盟取得了阶段性的胜利，但损失也极为惨重。数个小门派被灭，天剑宗掌门身受重伤，正道实力大幅削弱。而暗影联盟虽然退去，万魔归一阵的威胁却如悬在头顶的利剑。',
    nextNodeId: 'ch5_master_secret',
  },
  ch5_master_secret: {
    id: 'ch5_master_secret',
    type: 'dialogue',
    speaker: '云霄真人',
    content: '......有件事，为师一直没有告诉你。三百年前那场大战，青云宗之所以能取胜，并非仅靠镇魔铜镜。先辈们付出了极大的代价，封印了一位天魔。而暗影联盟要做的，就是解开那道封印。',
    nextNodeId: 'ch5_seal_truth',
  },
  ch5_seal_truth: {
    id: 'ch5_seal_truth',
    type: 'narration',
    content: '师父的话让你如遭雷击。封印、天魔、万魔归一阵......所有的线索终于串联了起来。暗影联盟的目标从来不只是几个修仙门派，他们要做的是释放被封印的域外天魔，让整个修仙界陷入浩劫。',
    nextNodeId: 'ch5_determination',
    effects: [
      { type: 'set_flag', target: 'ch5_knows_full_truth', value: true },
    ],
  },
  ch5_determination: {
    id: 'ch5_determination',
    type: 'choice',
    content: '面对如此严峻的局势，你在心中做出了一个决定。',
    choices: [
      {
        text: '我要尽快提升修为，在天魔降临之前达到化神期',
        nextNodeId: 'ch5_resolve_power',
        effects: [
          { type: 'modify_attribute', target: 'cultivation', value: 300 },
          { type: 'set_flag', target: 'ch5_pursue_power', value: true },
        ],
      },
      {
        text: '我要找到加固封印的方法，从根源上解决问题',
        nextNodeId: 'ch5_resolve_seal',
        effects: [
          { type: 'modify_attribute', target: 'comprehension', value: 8 },
          { type: 'set_flag', target: 'ch5_pursue_seal', value: true },
        ],
      },
      {
        text: '联合所有正道力量，众志成城，共同面对',
        nextNodeId: 'ch5_resolve_unity',
        effects: [
          { type: 'modify_attribute', target: 'luck', value: 8 },
          { type: 'set_flag', target: 'ch5_pursue_unity', value: true },
        ],
      },
    ],
  },
  ch5_resolve_power: {
    id: 'ch5_resolve_power',
    type: 'narration',
    content: '你深知，在绝对的力量面前，一切阴谋诡计都是枉然。你向师父请求最严苛的修炼指导，决心在最短的时间内突破化神。云霄真人沉默片刻后点了点头，眼中既有赞许，也有担忧。',
    nextNodeId: 'ch5_chapter_end',
  },
  ch5_resolve_seal: {
    id: 'ch5_resolve_seal',
    type: 'narration',
    content: '你钻入藏经阁，翻阅三百年前先辈留下的所有典籍，试图找到加固封印的方法。苏瑶也加入了研究，两人日以继夜地参悟上古阵法。这是一条更艰难的路，但如果成功，便能一劳永逸。',
    nextNodeId: 'ch5_chapter_end',
  },
  ch5_resolve_unity: {
    id: 'ch5_resolve_unity',
    type: 'narration',
    content: '你主动请缨担任正道同盟的联络使者，奔走于各大门派之间，协调战略、调配资源、化解矛盾。你相信，只要正道团结一心，就没有跨不过去的坎。',
    nextNodeId: 'ch5_chapter_end',
  },

  // ==================== 章节结尾 ====================
  ch5_chapter_end: {
    id: 'ch5_chapter_end',
    type: 'narration',
    content: '风暴将至，而你已不再是当年那个懵懂的少年。元婴境的修为给了你直面风暴的底气，一路上结识的师父、师姐、挚友给了你不孤独的勇气。前路虽然荆棘密布，但你的眼中没有退缩，只有坚定。修仙路上，最大的敌人从来不是魔修，而是自己内心的软弱。而你，已经战胜了它。',
    effects: [
      { type: 'set_flag', target: 'chapter_5_completed', value: true },
      { type: 'modify_attribute', target: 'cultivation', value: 800 },
      { type: 'set_flag', target: 'ch5_alliance_formed', value: true },
    ],
  },
};

// 获取第五章节点
export function getChapter5Node(nodeId: string): StoryNode | null {
  return chapter5Story[nodeId] || null;
}
