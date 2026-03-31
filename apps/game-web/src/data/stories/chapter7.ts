import type { StoryNode } from '../../types';

// 第七章：镇界之路
// 主题：三处锚点、同盟整合、界缝全面失衡前的最后布防
export const chapter7Story: Record<string, StoryNode> = {
  ch7_start: {
    id: 'ch7_start',
    type: 'narration',
    content: '镇界星盘带回宗门后的第七日，正道同盟再次在青云宗召开大会。只是这一次，大殿内不再是争论与试探，而是一种压得人难以呼吸的沉重。所有人都明白，云隐秘境带出的情报已经把局势从“可能有变”推到了“随时会崩”。',
    nextNodeId: 'ch7_council',
  },
  ch7_council: {
    id: 'ch7_council',
    type: 'dialogue',
    speaker: '青云宗掌门',
    content: '根据镇界星盘与补天卷的推演，三处镇界锚分别位于北荒断桥、天衡观星台以及青云宗后山的镜湖地脉。镜湖锚仍在我们掌控中，但北荒方向的灵压在持续下坠，天衡观星台更是已经彻底失去联络。我们必须同时修锚、稳军心、截断暗影联盟的推进。',
    nextNodeId: 'ch7_alliance_tension',
  },
  ch7_alliance_tension: {
    id: 'ch7_alliance_tension',
    type: 'narration',
    content: '同盟大会仍旧不乏分歧。天剑宗主张主力直扑北荒，先斩暗影联盟前锋；灵药谷认为应优先保住镜湖地脉，确保青云宗这座根基不失；万法宗则坚持先夺回天衡观星台，否则再多兵力也只是盲目投入。三方各执一词，会议一度陷入僵持。',
    nextNodeId: 'ch7_opening_choice',
  },
  ch7_opening_choice: {
    id: 'ch7_opening_choice',
    type: 'choice',
    content: '面对几乎要失控的同盟争论，你决定如何发言？',
    choices: [
      {
        text: '直接指出北荒最危险，先打掉最锋利的刀口',
        nextNodeId: 'ch7_hardline_speech',
        effects: [
          { type: 'set_flag', target: 'ch7_backed_frontline', value: true },
          { type: 'modify_attribute', target: 'attack', value: 2 },
        ],
      },
      {
        text: '先安抚各宗情绪，再按轻重缓急逐项分配任务',
        nextNodeId: 'ch7_calm_speech',
        effects: [
          { type: 'set_flag', target: 'ch7_balanced_allies', value: true },
          { type: 'modify_attribute', target: 'luck', value: 3 },
        ],
      },
      {
        text: '以补天卷的推演结果为依据，逼大家接受同一套方案',
        nextNodeId: 'ch7_text_speech',
        effects: [
          { type: 'set_flag', target: 'ch7_ruled_by_reason', value: true },
          { type: 'modify_attribute', target: 'comprehension', value: 3 },
        ],
      },
    ],
  },
  ch7_hardline_speech: {
    id: 'ch7_hardline_speech',
    type: 'narration',
    content: '你将镇界星盘拍在桌案中央，毫不客气地指出北荒断桥一旦失守，暗影联盟便能借古战场尸气和界缝共振，将天魔投影提前拉入现世。大殿一片死寂，激进的发言反而让不少主战派冷静下来，开始认真听你后面的部署。',
    nextNodeId: 'ch7_strategy_fixed',
  },
  ch7_calm_speech: {
    id: 'ch7_calm_speech',
    type: 'narration',
    content: '你没有立刻站队，而是将三处锚点的利害关系一层层拆开：镜湖不能失，因为那是青云宗根基；天衡观星台不能放，因为那是观测界缝变化的唯一高点；北荒更不能崩，因为那是正面承压最重的前线。你用平稳而清晰的逻辑，让每一个宗门都看到自己在这张网中的位置。',
    nextNodeId: 'ch7_strategy_fixed',
  },
  ch7_text_speech: {
    id: 'ch7_text_speech',
    type: 'narration',
    content: '你直接展开补天卷残篇与星盘推演结果，逐段解释灵脉坍缩与界缝扩大的必然关系。那些原本只相信自家祖训的老辈修士，在看到推演中不断逼近的临界值后，脸色一个比一个难看。争吵终于停下，取而代之的是一种不得不合作的现实。',
    nextNodeId: 'ch7_strategy_fixed',
  },
  ch7_strategy_fixed: {
    id: 'ch7_strategy_fixed',
    type: 'dialogue',
    speaker: '云霄真人',
    content: '既然方案已定，那就按你提出的“三线并举”来。镜湖由我和掌门镇守，天衡观星台交给万法宗与苏瑶协同，你率同盟先锋去北荒断桥稳住第一道锚。若北荒成功，后续一切还有可为；若北荒失守，整个同盟都得准备和天魔提前见面。',
    nextNodeId: 'ch7_departure',
  },
  ch7_departure: {
    id: 'ch7_departure',
    type: 'narration',
    content: '北荒风雪千里，古战场残旗如林。你带着天剑宗、灵药谷、青云宗混编而成的先锋队奔赴断桥。一路上，越来越多零散修士加入队伍，有人是为了宗门、有的是为家乡，也有人只是单纯不想在天魔降临时连反抗的资格都没有。',
    nextNodeId: 'ch7_route_choice',
  },
  ch7_route_choice: {
    id: 'ch7_route_choice',
    type: 'choice',
    content: '抵达北荒外围后，你需要决定先锋队的推进方式。',
    choices: [
      {
        text: '稳扎稳打，边清剿魔修斥候边推进，保证后续援军线路畅通',
        nextNodeId: 'ch7_route_steady',
        effects: [
          { type: 'set_flag', target: 'ch7_route_steady', value: true },
          { type: 'modify_attribute', target: 'luck', value: 2 },
        ],
      },
      {
        text: '只保留精锐，趁夜突袭断桥主阵，争抢先手',
        nextNodeId: 'ch7_route_assault',
        effects: [
          { type: 'set_flag', target: 'ch7_route_assault', value: true },
          { type: 'modify_attribute', target: 'attack', value: 3 },
        ],
      },
      {
        text: '借星盘推演风向和灵流，绕过正面战场直扑锚点本体',
        nextNodeId: 'ch7_route_insight',
        effects: [
          { type: 'set_flag', target: 'ch7_route_insight', value: true },
          { type: 'modify_attribute', target: 'comprehension', value: 3 },
        ],
      },
    ],
  },
  ch7_route_steady: {
    id: 'ch7_route_steady',
    type: 'narration',
    content: '你选择一步一步清扫前线。虽然速度最慢，但沿途潜伏的魔修据点被连根拔起，后续援军与物资得以顺利进入北荒。先锋队每前进一步，身后就多一分可以稳住战局的底气。',
    nextNodeId: 'ch7_bridge_arrival',
  },
  ch7_route_assault: {
    id: 'ch7_route_assault',
    type: 'narration',
    content: '你将大部分人马留在外围佯攻，只带一支精锐夜袭断桥。雪夜中，剑光与符火一闪而灭，整个先锋队像刀锋一样撕开了魔修最薄弱的一层巡防。代价是退路极窄，一旦失手便只能死战到底。',
    nextNodeId: 'ch7_bridge_arrival',
  },
  ch7_route_insight: {
    id: 'ch7_route_insight',
    type: 'narration',
    content: '你将镇界星盘固定在掌心，反复推演北荒灵流的偏移。最终，队伍沿着一条极少有人知晓的裂谷绕行，避开了绝大多数明哨。当天色微明时，你们已经站在断桥阴影下，而魔修主力还未完全察觉你们的方位。',
    nextNodeId: 'ch7_bridge_arrival',
  },

  ch7_bridge_arrival: {
    id: 'ch7_bridge_arrival',
    type: 'narration',
    content: '北荒断桥横亘在古战场中央，桥下不是河，而是终年翻涌的灰黑尸煞。桥身尽头插着九面血旗，正以某种固定节奏抽取周围的亡煞气息，不断腐蚀镇界锚的防护层。你一眼就看出，那九面血旗便是魔修用来撕开锚点的楔子。',
    nextNodeId: 'ch7_first_battle_lead',
  },
  ch7_first_battle_lead: {
    id: 'ch7_first_battle_lead',
    type: 'narration',
    content: '就在你准备下令拔旗时，一名身披赤甲的修罗大将自血雾中缓步而出，背后跟着一队浑身煞气翻涌的魔兵。他手中长戟重重一顿，断桥两侧顿时浮现出层层战纹。魔修显然早已料到正道会来夺桥，只是没想到会来得这么快。',
    nextNodeId: 'ch7_first_battle',
  },
  ch7_first_battle: {
    id: 'ch7_first_battle',
    type: 'battle',
    content: '北荒断桥之战打响。你必须斩断魔修大将的压制，才能接近第一处镇界锚。',
    battleId: 'story_7_1',
    nextNodeId: 'ch7_after_bridge_battle',
    effects: [
      { type: 'set_flag', target: 'ch7_won_bridge_battle', value: true },
    ],
  },
  ch7_after_bridge_battle: {
    id: 'ch7_after_bridge_battle',
    type: 'narration',
    content: '修罗大将倒下后，先锋队顺势拔掉了三面血旗，断桥附近的灵压终于回升少许。可你也在战场边缘发现一串异常干净的脚印，那并非冲锋魔兵留下的痕迹，而更像是有人趁乱往锚点深处潜行。你意识到，暗影联盟真正的谋手或许根本不在正面。',
    nextNodeId: 'ch7_traitor_choice',
  },
  ch7_traitor_choice: {
    id: 'ch7_traitor_choice',
    type: 'choice',
    content: '前线仍在交战，你必须在极短时间内决定下一步动作。',
    choices: [
      {
        text: '亲自追查潜行者，绝不能让对方先一步触及锚点核心',
        nextNodeId: 'ch7_pursue_shadow',
        effects: [
          { type: 'set_flag', target: 'ch7_pursued_shadow', value: true },
          { type: 'modify_attribute', target: 'attack', value: 2 },
        ],
      },
      {
        text: '先稳住断桥阵地，让先锋队接手追击，自己留在锚点外围布防',
        nextNodeId: 'ch7_secure_anchor',
        effects: [
          { type: 'set_flag', target: 'ch7_secured_anchor', value: true },
          { type: 'modify_attribute', target: 'luck', value: 2 },
        ],
      },
      {
        text: '让天剑宗追击，你根据星盘继续推演潜行者真正目标',
        nextNodeId: 'ch7_star_inference',
        effects: [
          { type: 'set_flag', target: 'ch7_used_star_inference', value: true },
          { type: 'modify_attribute', target: 'comprehension', value: 4 },
        ],
      },
    ],
  },
  ch7_pursue_shadow: {
    id: 'ch7_pursue_shadow',
    type: 'narration',
    content: '你沿着脚印孤身深入断桥腹地，在一处半塌祭坛后截住了那名潜行者。对方是披着正道服饰的魔修暗桩，专门负责在大战时潜入锚点核心引爆血纹。你虽然没能从他口中逼出太多情报，但成功从其身上搜出一枚通往天衡观星台的密钥残片。',
    nextNodeId: 'ch7_intel_gain',
    effects: [
      { type: 'set_flag', target: 'ch7_found_observatory_key', value: true },
    ],
  },
  ch7_secure_anchor: {
    id: 'ch7_secure_anchor',
    type: 'narration',
    content: '你强压下追击欲望，亲自坐镇断桥核心，以镇界星盘重新校准锚点波动。虽然因此放走了潜行者，但断桥锚的坍缩速度被当场拉了回来。数十名同盟修士因此免于在后续灵爆中殒命，先锋队士气也被重新稳住。',
    nextNodeId: 'ch7_intel_gain',
    effects: [
      { type: 'set_flag', target: 'ch7_anchor_stabilized_early', value: true },
    ],
  },
  ch7_star_inference: {
    id: 'ch7_star_inference',
    type: 'narration',
    content: '你没有盲追，而是借星盘推演尸煞流向与血旗残余脉络。很快你便发现，潜行者的真正任务不是破坏断桥，而是拖住你们，让暗影联盟有时间突袭天衡观星台。你当即传讯苏瑶改换布置，万法宗因此险之又险地避开了一次伏杀。',
    nextNodeId: 'ch7_intel_gain',
    effects: [
      { type: 'set_flag', target: 'ch7_warned_observatory', value: true },
    ],
  },

  ch7_intel_gain: {
    id: 'ch7_intel_gain',
    type: 'narration',
    content: '北荒局势稍稳后，你收到了来自苏瑶的紧急回讯。她与万法宗已经抵达天衡观星台，却发现整座观星台被古老星砂阵包裹，外层似乎还夹杂着来自暗影联盟的逆阵手段。更糟的是，镜湖方向也开始出现不正常的魔气回潮，三处锚点正在以肉眼可见的速度相互牵连。',
    nextNodeId: 'ch7_observatory_scene',
  },
  ch7_observatory_scene: {
    id: 'ch7_observatory_scene',
    type: 'narration',
    content: '你立刻带队转向天衡观星台。那里悬于万丈绝壁之上，石阶残破，满天星砂如逆流瀑布般倒卷。观星台中央立着一座巨大的青铜浑仪，本该负责监测界缝涨落，如今却被一层诡异黑雾缠住，像是整片天穹都在被人扭曲。',
    nextNodeId: 'ch7_companion_scene',
  },
  ch7_companion_scene: {
    id: 'ch7_companion_scene',
    type: 'dialogue',
    speaker: '苏瑶',
    content: '你总算到了。再晚一点，浑仪就要被他们彻底改写了。师弟，我以前总觉得阵法是解决一切问题的钥匙，可走到今天才发现，真正困难的从来不是算式，而是当你明知道结果可能还是会失败时，是否还敢继续往前推。幸好，这一路不是我一个人。',
    nextNodeId: 'ch7_trust_choice',
  },
  ch7_trust_choice: {
    id: 'ch7_trust_choice',
    type: 'choice',
    content: '面对观星台的紊乱局面，你决定把最后这步棋押在什么上？',
    choices: [
      {
        text: '押在自己的修为与判断上，强行压制黑雾中枢',
        nextNodeId: 'ch7_trust_self',
        effects: [
          { type: 'set_flag', target: 'ch7_trust_self', value: true },
          { type: 'modify_attribute', target: 'attack', value: 2 },
        ],
      },
      {
        text: '押在同伴协作上，让所有人按照分工同时出手',
        nextNodeId: 'ch7_trust_allies',
        effects: [
          { type: 'set_flag', target: 'ch7_trust_allies', value: true },
          { type: 'modify_attribute', target: 'luck', value: 3 },
        ],
      },
      {
        text: '押在补天卷与星盘的推演上，以最稳妥的方式拆阵',
        nextNodeId: 'ch7_trust_text',
        effects: [
          { type: 'set_flag', target: 'ch7_trust_text', value: true },
          { type: 'modify_attribute', target: 'comprehension', value: 4 },
        ],
      },
    ],
  },
  ch7_trust_self: {
    id: 'ch7_trust_self',
    type: 'narration',
    content: '你独自踏入黑雾最浓处，以自身灵力强行压向浑仪中枢。那一刻，观星台上空的星砂像是被某种暴虐意志猛地拽紧，几乎要把你的神识整个扯碎。可你最终还是稳住了第一道裂口，也给所有人争来了重新布置的时间。',
    nextNodeId: 'ch7_anchor_two_stable',
  },
  ch7_trust_allies: {
    id: 'ch7_trust_allies',
    type: 'narration',
    content: '你没有再一个人硬顶，而是让苏瑶、刘青、万法宗长老和天剑宗剑修同时站到各自阵眼上。数股灵力像河流一样汇入观星台，彼此之间没有谁完全压过谁，却稳稳撑起了整座浑仪。那一瞬间，你第一次真正看见了同盟该有的样子。',
    nextNodeId: 'ch7_anchor_two_stable',
    effects: [
      { type: 'set_flag', target: 'ch7_alliance_trust_deepened', value: true },
    ],
  },
  ch7_trust_text: {
    id: 'ch7_trust_text',
    type: 'narration',
    content: '你将补天卷残篇逐句拆开，用镇界星盘反复校准每一条灵纹。过程缓慢得近乎煎熬，但每修正一次星轨，观星台的黑雾就退去一层。最终，当最后一道偏移被纠正后，青铜浑仪重新指向正确的天穹方位，整个观星台都发出一声久违的清鸣。',
    nextNodeId: 'ch7_anchor_two_stable',
    effects: [
      { type: 'set_flag', target: 'ch7_repaired_observatory_precisely', value: true },
    ],
  },

  ch7_anchor_two_stable: {
    id: 'ch7_anchor_two_stable',
    type: 'narration',
    content: '天衡观星台暂时稳住，但你们从浑仪中看到的未来并不乐观：镜湖地脉已经被暗影联盟暗中布下“逆界引”，若不尽快截断，三处锚点仍会在下一次灵潮到来时同时失衡。而就在众人准备回援镜湖时，观星台下方的断空裂隙突然被一股极强的魔压撕开。',
    nextNodeId: 'ch7_final_battle_lead',
  },
  ch7_final_battle_lead: {
    id: 'ch7_final_battle_lead',
    type: 'narration',
    content: '裂隙深处，一名披着九幽战甲的魔将缓缓升空，身后拖着成串锁链般的黑焰。他并非普通先锋，而是专门负责在锚点失衡时接管界缝的镇域级魔将。对方显然已经盯上观星台许久，如今不过是觉得时机已到，决定亲手把这座高台从天穹上拽下来。',
    nextNodeId: 'ch7_final_battle',
  },
  ch7_final_battle: {
    id: 'ch7_final_battle',
    type: 'battle',
    content: '观星台决战爆发。若这一战失败，天衡锚将彻底失守。',
    battleId: 'story_7_2',
    nextNodeId: 'ch7_after_final_battle',
    effects: [
      { type: 'set_flag', target: 'ch7_won_observatory_battle', value: true },
    ],
  },
  ch7_after_final_battle: {
    id: 'ch7_after_final_battle',
    type: 'narration',
    content: '魔将坠入裂隙之后，观星台四周仍旧剧烈震颤。你没有沉浸在短暂胜利中，而是第一时间将镇界星盘嵌入浑仪核心。随着星盘、补天卷与观星台重新接轨，一道横贯三地的巨大灵纹终于在你识海中完整亮起。你清楚地看到：真正的总决战，已不是“会不会来”，而是“何时爆发”。',
    nextNodeId: 'ch7_path_choice',
    effects: [
      { type: 'modify_attribute', target: 'cultivation', value: 600 },
    ],
  },
  ch7_path_choice: {
    id: 'ch7_path_choice',
    type: 'choice',
    content: '面对即将到来的终局，你为自己也为同盟选定了下一步方向。',
    choices: [
      {
        text: '以镇界星盘为引，借三处锚点的回流灵力冲击化神',
        nextNodeId: 'ch7_path_power',
        effects: [
          { type: 'set_flag', target: 'ch7_path_power', value: true },
          { type: 'modify_attribute', target: 'attack', value: 3 },
        ],
      },
      {
        text: '主动成为镇界体系的“守盘者”，把生死押在封印之上',
        nextNodeId: 'ch7_path_keeper',
        effects: [
          { type: 'set_flag', target: 'ch7_path_keeper', value: true },
          { type: 'modify_attribute', target: 'comprehension', value: 5 },
        ],
      },
      {
        text: '把自己彻底放进同盟中枢，作为连接各宗的主心骨',
        nextNodeId: 'ch7_path_unity',
        effects: [
          { type: 'set_flag', target: 'ch7_path_unity', value: true },
          { type: 'modify_attribute', target: 'luck', value: 5 },
        ],
      },
    ],
  },
  ch7_path_power: {
    id: 'ch7_path_power',
    type: 'narration',
    content: '你决定把一切能调用的力量都压向自身境界。因为你比任何人都清楚，当真正的天魔投影落下时，若没有足够强的人顶在最前面，再精妙的布局也会像纸一样被撕开。你愿意做那把最先出鞘的刀。',
    nextNodeId: 'ch7_chapter_end',
  },
  ch7_path_keeper: {
    id: 'ch7_path_keeper',
    type: 'narration',
    content: '你选择了更沉重也更孤独的方向。成为守盘者，意味着今后很长时间里，你都必须与镇界星盘绑定，成为封印体系的一部分。可你并不畏惧，因为你终于明白，真正值得被铭记的从来不是个人威名，而是有人在大厦将倾之前把肩膀顶了上去。',
    nextNodeId: 'ch7_chapter_end',
  },
  ch7_path_unity: {
    id: 'ch7_path_unity',
    type: 'narration',
    content: '你没有再把自己仅仅视作一名战力，而是主动承担起协调各宗、重构布防、分配资源与安抚人心的责任。你知道，这条路未必最耀眼，却能让更多人活到真正决战来临的那一刻。而那，或许比任何一场个人胜利都重要。',
    nextNodeId: 'ch7_chapter_end',
  },
  ch7_chapter_end: {
    id: 'ch7_chapter_end',
    type: 'narration',
    content: '北荒断桥与天衡观星台相继稳住之后，三处镇界锚终于形成了暂时闭合的守势。青云宗后山的镜湖也在掌门与云霄真人的拼死镇守下勉强撑住。天下并未因此太平，反而像是暴雨落下前短暂的停风时刻。可与你初入仙途时相比，如今的你已经拥有了更强的剑、更深的眼界，也拥有了一群愿意在终局之前与你并肩而立的人。下一次灵潮到来时，真正决定三界命运的战争，便将彻底展开。',
    effects: [
      { type: 'set_flag', target: 'chapter_7_completed', value: true },
      { type: 'set_flag', target: 'ch7_three_anchors_connected', value: true },
      { type: 'modify_attribute', target: 'cultivation', value: 1600 },
    ],
  },
};

export function getChapter7Node(nodeId: string): StoryNode | null {
  return chapter7Story[nodeId] || null;
}
