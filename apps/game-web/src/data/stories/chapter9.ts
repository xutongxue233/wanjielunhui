import type { StoryNode } from '../../types';

// 第九章：天关残城
// 主题：钥印开门、残城法诏、第一次真正踏入三界夹层的旧秩序遗址
export const chapter9Story: Record<string, StoryNode> = {
  ch9_start: {
    id: 'ch9_start',
    type: 'narration',
    content: '镜湖封湖后的第七日，镇界星盘中的那缕钥印终于不再只是微光。每到子夜，它都会在盘心勾勒出一截残缺城墙、一条悬在虚空中的石阶，以及一扇从未真正开启、却始终在等待某人校准的门。你很快意识到，镜湖之战夺回来的并不只是“钥印”，而是一条通往更深层旧秩序遗址的坐标。',
    nextNodeId: 'ch9_council_call',
  },
  ch9_council_call: {
    id: 'ch9_council_call',
    type: 'dialogue',
    speaker: '青云宗掌门',
    content: '我们把各宗长老召到一起推演了三夜。钥印指向的地方不在凡间，也不在完整仙界，而在两界之间的一处夹层残城。若那地方真保存着旧日天关的法诏与门律，那我们接下来面对的，就不只是守门意志，而是整套“谁有资格开门”的规则本身。',
    nextNodeId: 'ch9_gate_mark_truth',
  },
  ch9_gate_mark_truth: {
    id: 'ch9_gate_mark_truth',
    type: 'narration',
    content: '苏瑶、刘青与万法宗阵师联手校准星盘后，残城轮廓终于清晰起来。那是一座建在断裂天轨上的前哨古城，上半截仍悬在界外，下半截却被某种强行坠落的力量撕回了人间边缘。更关键的是，残城正中央矗立着一座“法诏库”。暗影联盟若比你们更早进入那里，他们就有机会拿到真正意义上的开门令。',
    nextNodeId: 'ch9_route_choice',
  },
  ch9_route_choice: {
    id: 'ch9_route_choice',
    type: 'choice',
    content: '第一次远征夹层残城，容错极低。你决定如何布置这支队伍？',
    choices: [
      {
        text: '让天剑宗与青云宗精锐顶在前面，先用最快速度夺下落脚点',
        nextNodeId: 'ch9_route_blade',
        effects: [
          { type: 'set_flag', target: 'ch9_route_blade', value: true },
          { type: 'modify_attribute', target: 'attack', value: 3 },
        ],
      },
      {
        text: '把万法宗阵师和镇界星盘护在中央，优先保证法阵与退路',
        nextNodeId: 'ch9_route_keeper',
        effects: [
          { type: 'set_flag', target: 'ch9_route_keeper', value: true },
          { type: 'modify_attribute', target: 'comprehension', value: 4 },
        ],
      },
      {
        text: '带上各宗使者与记录弟子，准备和残城里可能残存的意志正面交涉',
        nextNodeId: 'ch9_route_bridge',
        effects: [
          { type: 'set_flag', target: 'ch9_route_bridge', value: true },
          { type: 'modify_attribute', target: 'luck', value: 4 },
        ],
      },
    ],
  },
  ch9_route_blade: {
    id: 'ch9_route_blade',
    type: 'narration',
    content: '你把最锋利的力量摆在了最前面。界门后的秩序究竟如何，终究要先有人踏进去、扛住第一轮反噬。你不确定这是不是最稳妥的办法，但若开门这一步一定得有人先走，那个人多半只能是你。',
    nextNodeId: 'ch9_path_router',
  },
  ch9_route_keeper: {
    id: 'ch9_route_keeper',
    type: 'narration',
    content: '你先考虑的不是“打进去”，而是“怎么活着回来”。夹层残城本就站在崩裂边缘，若没有稳定锚点和退路，再强的修士也可能在法则乱流里被直接切碎。你把队伍重新排成了一个能进、也能守的形状。',
    nextNodeId: 'ch9_path_router',
  },
  ch9_route_bridge: {
    id: 'ch9_route_bridge',
    type: 'narration',
    content: '你不愿把残城视作单纯的战场。若那里真的还残留着旧日守关体系的一部分，那么这支队伍带进去的，就不能只有刀和阵，也要有足够完整的“说法”。也许会被嘲笑天真，但你依旧决定给那座残城一个回答的机会。',
    nextNodeId: 'ch9_path_router',
  },

  ch9_path_router: {
    id: 'ch9_path_router',
    type: 'narration',
    content: '临行前，镜湖里的钥印再次微微一震。那道光不是在催促你，反倒像是在确认：你究竟准备以什么身份去推开下一扇门。',
    nextNodeId: 'ch9_skyblade_echo',
  },
  ch9_skyblade_echo: {
    id: 'ch9_skyblade_echo',
    type: 'narration',
    content: '你想起自己在镜湖深处做出的选择。若钥印注定要变成锋刃，那残城便是磨锋之地。你不是去朝圣，也不是去朝见更高存在，而是去确认那扇门之后究竟还有没有值得人间信服的秩序。',
    nextNodeId: 'ch9_cross_threshold',
    fallbackNodeId: 'ch9_keeper_echo',
    conditions: [
      { type: 'flag', key: 'ch8_path_skyblade', operator: '==', value: true },
    ],
  },
  ch9_keeper_echo: {
    id: 'ch9_keeper_echo',
    type: 'narration',
    content: '你想起自己在镜湖深处做出的选择。若你真的已经是下一代守关者，那这一步就不再是“探索”，而是接岗。残城里无论残留着多少旧法、多少偏执，你都必须先进去，把那套秩序掰回一个不会压死凡间的方向。',
    nextNodeId: 'ch9_cross_threshold',
    fallbackNodeId: 'ch9_bridge_echo',
    conditions: [
      { type: 'flag', key: 'ch8_path_keeper', operator: '==', value: true },
    ],
  },
  ch9_bridge_echo: {
    id: 'ch9_bridge_echo',
    type: 'narration',
    content: '你想起自己在镜湖深处做出的选择。若未来真正决定三界归属的不是单纯强弱，而是谁先建立起新的规则，那么残城就是第一张谈判桌。你未必会被欢迎，但至少不能让它只剩一方的声音。',
    nextNodeId: 'ch9_cross_threshold',
  },

  ch9_cross_threshold: {
    id: 'ch9_cross_threshold',
    type: 'narration',
    content: '镇界星盘与钥印重合的瞬间，一扇比镜湖门影更凝实的狭长界门在后山禁地缓缓展开。你率众穿门而入，脚下立刻传来失重般的眩晕。再睁眼时，众人已经站在一条断裂石阶尽头，前方是一整座悬在幽暗夹层里的残城。上空没有日月，只有无数像法则裂缝一般时明时灭的金线。',
    nextNodeId: 'ch9_ruined_city',
  },
  ch9_ruined_city: {
    id: 'ch9_ruined_city',
    type: 'narration',
    content: '残城比你想象中更像一座真正生活过的城。街巷、殿宇、廊桥都还在，只是全被某次大规模法则崩塌拦腰斩断。许多楼阁外仍挂着褪色法牌，牌上写着你只能勉强辨认的旧天关官署之名。这里不是单纯的军事前哨，而像是一整套秩序曾经运转过的地方。',
    nextNodeId: 'ch9_patrol_warning',
  },
  ch9_patrol_warning: {
    id: 'ch9_patrol_warning',
    type: 'dialogue',
    speaker: '苏瑶',
    content: '小心，有东西在看我们。不是单纯魔物，更像是还在执行旧命令的巡狩者。它们的灵压不稳，像被残城规则撑着没彻底散掉。一旦让它们先一步把“外来者入侵”的警讯送去法诏库，我们后面就很难抢到先手了。',
    nextNodeId: 'ch9_first_battle_lead',
  },
  ch9_first_battle_lead: {
    id: 'ch9_first_battle_lead',
    type: 'narration',
    content: '城门阴影里，一名披着破裂仙袍的巡狩者缓缓抬头。它的面容几乎已经被残城风化，只剩眼底还亮着冰冷执念。你刚迈出一步，对方背后的废墙就同时亮起数十道旧律铭文，像是在宣告：任何未经许可踏入残城者，皆视同越界。',
    nextNodeId: 'ch9_first_battle',
  },
  ch9_first_battle: {
    id: 'ch9_first_battle',
    type: 'battle',
    content: '残城巡狩者已经锁定了这支远征队。若不能先击溃它，整座残城都会被你们的到来惊醒。',
    battleId: 'story_9_1',
    nextNodeId: 'ch9_after_first_battle',
    effects: [
      { type: 'set_flag', target: 'ch9_cleared_city_patrol', value: true },
    ],
  },
  ch9_after_first_battle: {
    id: 'ch9_after_first_battle',
    type: 'narration',
    content: '巡狩者在破碎石街上轰然崩散，身体里飘出一缕被压缩得极薄的仙纹残片。刘青迅速用符纸把它封起，万法宗阵师则从周围废墙上剥离出一串失真记录：法诏库确实还在运转，但它正在用一套极其僵硬的旧标准，重新筛选谁能被视为“合格开门者”。',
    nextNodeId: 'ch9_archive_hall',
  },
  ch9_archive_hall: {
    id: 'ch9_archive_hall',
    type: 'narration',
    content: '你们顺着记录残片的牵引，来到一座半埋在空间断层里的长殿。殿门上仍写着“法诏库”三个古字，只是最后一笔已被黑痕腐蚀得几乎看不清。殿内卷宗和玉简铺满四壁，许多都还保持着被匆忙翻阅后的凌乱状态，仿佛当年有人在撤离前还试图把某道最关键的命令找出来。',
    nextNodeId: 'ch9_archive_choice',
  },
  ch9_archive_choice: {
    id: 'ch9_archive_choice',
    type: 'choice',
    content: '法诏库还没完全封死，你们能抢到一小段时间。你决定先处理哪件事？',
    choices: [
      {
        text: '优先夺下法诏碎页，先把最关键的“开门条件”攥在手里',
        nextNodeId: 'ch9_claim_edict',
        effects: [
          { type: 'set_flag', target: 'ch9_claimed_edict_first', value: true },
          { type: 'modify_attribute', target: 'attack', value: 2 },
        ],
      },
      {
        text: '先救下仍在维持殿内阵纹的一道残存守库意志',
        nextNodeId: 'ch9_rescue_curator',
        effects: [
          { type: 'set_flag', target: 'ch9_rescued_curator', value: true },
          { type: 'modify_attribute', target: 'comprehension', value: 3 },
        ],
      },
      {
        text: '先稳住退路和殿外锚点，避免法诏库把你们整队困死在夹层里',
        nextNodeId: 'ch9_secure_retreat',
        effects: [
          { type: 'set_flag', target: 'ch9_secured_retreat', value: true },
          { type: 'modify_attribute', target: 'luck', value: 3 },
        ],
      },
    ],
  },
  ch9_claim_edict: {
    id: 'ch9_claim_edict',
    type: 'narration',
    content: '你最先抓住的是法诏碎页。玉简入手的瞬间，一串极其冰冷的判定规则直接冲入识海：开门者、见证者、代偿者、执律者，四者缺一不可。你意识到天关之门之所以危险，不是因为它太容易开，而是因为旧秩序要求有人为每一次开门负全责。',
    nextNodeId: 'ch9_hidden_edict',
  },
  ch9_rescue_curator: {
    id: 'ch9_rescue_curator',
    type: 'narration',
    content: '你先救下了那道几乎快散尽的守库意志。对方甚至已经不再像一个完整的人，只剩下记录、筛选、保管法诏的本能。可正因为它还记得流程，它也低声告诉你：法诏库缺失的并不是普通卷宗，而是一道足以决定“谁有资格代天开门”的总令。',
    nextNodeId: 'ch9_hidden_edict',
  },
  ch9_secure_retreat: {
    id: 'ch9_secure_retreat',
    type: 'narration',
    content: '你没有急着碰那些最诱人的法诏，而是先把殿外退路稳住。阵纹一接回，整座长殿的乱流明显收敛下来。也正是在这片短暂安静里，你听见殿最深处传来断断续续的旧录回放：当年撤离这里的人，不是来不及带走法诏，而像是故意把其中某道最关键的命令藏到了更深处。',
    nextNodeId: 'ch9_hidden_edict',
  },

  ch9_hidden_edict: {
    id: 'ch9_hidden_edict',
    type: 'dialogue',
    speaker: '残存守库意志',
    content: '总令缺失。执律者名单被人为改写。原应封存之门，转入“非常开门序列”。后续所有越界判定，皆已失准。警告：有人在旧日撤离之前，先一步动过法诏库的核心卷宗。',
    nextNodeId: 'ch9_shadow_truth',
  },
  ch9_shadow_truth: {
    id: 'ch9_shadow_truth',
    type: 'narration',
    content: '这段提示让所有人都沉默了一瞬。暗影联盟想要的也许从来不只是“破门”，而是借一份被改写过的总令，把未来每一次开门都导向他们准备好的方向。你们在镜湖面对的只是牵落守门意志的表象，而残城里真正暴露出来的，是更早、更高层的一次制度级篡改。',
    nextNodeId: 'ch9_final_approach',
  },
  ch9_final_approach: {
    id: 'ch9_final_approach',
    type: 'narration',
    content: '法诏库最深处的黑痕忽然成片亮起，一道比巡狩者更完整、更冷硬的身影自长阶尽头走出。它不再只是遵令巡查的残城守卫，而像是专门为执行“错误总令”而被唤醒的裁定者。四周所有卷宗同时翻页，像有整座残城在为它提供判定依据。',
    nextNodeId: 'ch9_final_dialogue',
  },
  ch9_final_dialogue: {
    id: 'ch9_final_dialogue',
    type: 'dialogue',
    speaker: '天道执行者',
    content: '残城法诏库，进入非常序列。未经承认的人间开门者，视同盗令。未经备案的守界体系，视同僭越。你们既已踏入此地，就需以失格者之身，承担被旧律抹除的后果。它的声音不像有情绪，更像一条直接写进法则里的审判。可你也因此更确定：真正失格的，也许根本不是人间。',
    nextNodeId: 'ch9_final_battle',
  },
  ch9_final_battle: {
    id: 'ch9_final_battle',
    type: 'battle',
    content: '天道执行者已经接管法诏库的裁定权。若不能击败它，你们就无法带着钥印与记录活着离开残城。',
    battleId: 'story_9_2',
    nextNodeId: 'ch9_after_final_battle',
    effects: [
      { type: 'set_flag', target: 'ch9_defeated_dao_enforcer', value: true },
    ],
  },
  ch9_after_final_battle: {
    id: 'ch9_after_final_battle',
    type: 'narration',
    content: '天道执行者在法诏库中央缓缓碎裂，周围卷宗也不再继续自动翻页。残存守库意志借着这一瞬清明，把一枚残缺印鉴和数段核心记录同时压进镇界星盘。那不是完整开门令，却足以证明一件事：旧天关体系在崩塌前，确实已经有人篡改过“谁能开门、谁该负责、谁该被献祭”的底层规则。',
    nextNodeId: 'ch9_resolution_choice',
    effects: [
      { type: 'set_flag', target: 'ch9_obtained_edict_fragment', value: true },
      { type: 'modify_attribute', target: 'cultivation', value: 1200 },
    ],
  },
  ch9_resolution_choice: {
    id: 'ch9_resolution_choice',
    type: 'choice',
    content: '你们带回的不只是一段战利品，而是能左右未来开门权的关键证据。离开残城前，你决定把下一步重点押在哪个方向？',
    choices: [
      {
        text: '继续追查被改写的总令，抢在暗影联盟之前找到真正的执律链',
        nextNodeId: 'ch9_resolution_hunt',
        effects: [
          { type: 'set_flag', target: 'ch9_path_hunt_edict', value: true },
          { type: 'modify_attribute', target: 'attack', value: 4 },
        ],
      },
      {
        text: '先补完人间自己的守界规则，避免以后每次开门都被旧律卡住',
        nextNodeId: 'ch9_resolution_reforge',
        effects: [
          { type: 'set_flag', target: 'ch9_path_reforge_order', value: true },
          { type: 'modify_attribute', target: 'comprehension', value: 5 },
        ],
      },
      {
        text: '把残城记录公开给各宗与人间势力，让“开门责任”不再由少数人独自背负',
        nextNodeId: 'ch9_resolution_public',
        effects: [
          { type: 'set_flag', target: 'ch9_path_public_covenant', value: true },
          { type: 'modify_attribute', target: 'luck', value: 5 },
        ],
      },
    ],
  },
  ch9_resolution_hunt: {
    id: 'ch9_resolution_hunt',
    type: 'narration',
    content: '你决定顺着残缺印鉴继续追下去。既然总令被改写过，那真正的敌人就未必只在门外，也可能早已藏进了“管门”的那套体系里。你把残城坐标重新标记进星盘，准备将下一次远征直接推到更深处。',
    nextNodeId: 'ch9_chapter_end',
  },
  ch9_resolution_reforge: {
    id: 'ch9_resolution_reforge',
    type: 'narration',
    content: '你决定先从人间自身的规则开始补。若旧律已经失真，那人间就不能永远被动等待它来裁定是非。你准备把残城带回来的记录拆开重学，重新搭出一套不再以“牺牲谁”为前提的守界秩序。',
    nextNodeId: 'ch9_chapter_end',
  },
  ch9_resolution_public: {
    id: 'ch9_resolution_public',
    type: 'narration',
    content: '你决定让这份记录不只掌握在少数人手里。若开门的代价注定沉重，那么是否开门、由谁承担、为了什么而承担，就不该继续是一纸秘令里的单向决定。你准备把这份残城真相摆上台面，让更多人参与下一轮选择。',
    nextNodeId: 'ch9_chapter_end',
  },
  ch9_chapter_end: {
    id: 'ch9_chapter_end',
    type: 'narration',
    content: '当远征队带着残缺印鉴退回人间时，镜湖上空第一次没有再出现失控门影，而是短暂浮现出一整圈更清晰的天关轮廓。你知道，这不是战争缓和，而是视野终于被抬高了一层。镜湖守住了门，残城告诉了你谁改了门律，而下一次真正要面对的，恐怕就是那只改写总令、试图决定所有人命运的手。',
    effects: [
      { type: 'set_flag', target: 'chapter_9_completed', value: true },
      { type: 'set_flag', target: 'ch9_explored_gate_city', value: true },
      { type: 'set_flag', target: 'ch9_learned_edict_tampering', value: true },
      { type: 'modify_attribute', target: 'cultivation', value: 2800 },
    ],
  },
};

export function getChapter9Node(nodeId: string): StoryNode | null {
  return chapter9Story[nodeId] || null;
}
