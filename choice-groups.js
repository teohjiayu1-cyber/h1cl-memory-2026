// Every listed word is an option in the corresponding uploaded cloze word bank.
// Prefer words with the same grammatical role before filling remaining choices.
const choiceGroups = {
  '2023 ACJC': { verb:'追求 衡量 炫耀 妒忌 逼迫 计量 渴望', noun:'心灵 欲望', adjective:'富足', idiom:'多姿多彩 称心如意 事与愿违' },
  '2023 ASRJC': { verb:'威胁 遁形 削弱 警惕 失效 反击 劫持', noun:'创伤', adjective:'猖獗', idiom:'层出不穷 固若金汤 络绎不绝 心如坚石' },
  '2023 CJC': { verb:'意味 担忧 刷新', noun:'新低 管道 挑战 愉悦 关键', idiom:'流连忘返 熟能生巧' },
  '2023 DHS': { verb:'滥用 危害 涉及 分类 依赖 输出 防止 影响 侵害', noun:'争议 共识 意识', adjective:'日益严重 每况愈下' },
  '2023 EJC': { verb:'掌握 倡导', noun:'需求', adjective:'明媚 悠闲 宽阔 便捷 新颖', idiom:'锦上添花 丰富多彩' },
  '2023 JPJC': { verb:'理解 克服 牺牲', noun:'成就 核心 创意', adjective:'优越 高超', idiom:'发奋图强 墨守成规 标新立异' },
  '2023 SAJC': { verb:'萎缩 延误 聘请 冲击 紧缩 袭击', noun:'津贴 平衡 奖励', idiom:'不遗余力 节节攀升 疲于奔命' },
  '2023 TMJC': { verb:'反映 缓解 推动 纾解 反应', noun:'模式 模型', adjective:'稀缺 务实 多元 灵活 宜居', idiom:'四通八达 川流不息' },
  '2024 ACJC': { verb:'保留 观察 容纳 注入 探索 推广 观赏 接纳 推敲', noun:'设施', adjective:'齐全 悠久', idiom:'别具一格 身临其境 脱颖而出' },
  '2024 CJC': { verb:'表扬 拟定 倾听 携手 建立 表达 模拟', noun:'信任 优点', adjective:'固定 沮丧 优异', idiom:'设身处地 身临其境' },
  '2024 ASRJC': { verb:'延伸 商榷 回馈 塑造 体会 斟酌 思考', noun:'意义 视野 精华', adjective:'艰巨', idiom:'循循善诱 恻隐之心 雄心壮志 滔滔不绝' },
  '2024 DHS': { verb:'激增 申请 考察 干扰 检查', noun:'措施 反感 目光 名义 秘密', adjective:'密切 敏感', idiom:'大相径庭 无独有偶' },
  '2024 NJC': { verb:'显示 反思', noun:'数码 常态 数据 状况 根源', idiom:'至关重要 果不其然 习以为常' },
  '2024 NYJC': { verb:'折磨 降低 考虑', noun:'任务 负担', adjective:'可贵 严峻', idiom:'防患未然 于事无补 受益匪浅' },
  '2024 RI': { verb:'给予 吸引', noun:'步伐 伤痛 句点 感触 感情', adjective:'平静 蹒跚 短暂 散漫', idiom:'颠沛流离 光阴似箭' },
  '2024 TJC': { verb:'聘用 剥夺 纾缓', noun:'焦虑感 反应 紧迫感 保障', idiom:'必不可少 异口同声', other:'攀比' },
  '2025 TMJC': { verb:'忽视 排斥 避免 激发', noun:'裨益', adjective:'温馨 难免 枯燥 刻意', idiom:'心知肚明 一朝一夕 弹指之间 胸有成竹' },
  '2025 SAJC': { verb:'改善 符合 承载 满足 注入', noun:'便利 凝聚力 地位', adjective:'欣慰', idiom:'后继无人 代代相传 源源不断' },
  '2025 VJC': { verb:'打发 沉浸 吸引 隐藏 导致 下降 自律 打扰 沉没 收藏', adjective:'低落 焦虑', idiom:'爱不释手 津津有味 匪夷所思' },
  '2025 NYJC': { verb:'巩固 标志 强调 煽动 渗透 灌输 契合', noun:'隔阂 观念 反响 默契', idiom:'因时制宜 变幻莫测 见风使舵 锲而不舍' },
  '2025 JPJC': { verb:'忽略 倾向 推卸 停留 锻炼 调整 落实 启发 充实', adjective:'丰富', idiom:'有求必应 纸上谈兵 胡言乱语' }
};

// Selected unused options from the original 15-word banks, with meanings for recall feedback.
const extraOptionLines = `
2023|ACJC|计量|jì liàng|按数量计算|quantify
2023|ACJC|渴望|kě wàng|迫切希望得到|long for
2023|ACJC|事与愿违|shì yǔ yuàn wéi|事情与希望相反|contrary to wishes
2023|ASRJC|络绎不绝|luò yì bù jué|人或车接连不断|come in a steady stream
2023|ASRJC|心如坚石|xīn rú jiān shí|内心像石头般坚定|firm as stone
2023|DHS|意识|yì shí|对事物的认识|awareness
2023|DHS|侵害|qīn hài|侵犯并造成损害|infringe and harm
2023|DHS|每况愈下|měi kuàng yù xià|情况越来越差|grow worse
2023|JPJC|标新立异|biāo xīn lì yì|刻意提出新奇主张|seek novelty
2023|SAJC|紧缩|jǐn suō|缩小或减少|contract
2023|SAJC|奖励|jiǎng lì|给予奖赏|reward
2023|TMJC|纾解|shū jiě|缓和压力或困难|relieve
2023|TMJC|反应|fǎn yìng|受到刺激后的表现|response
2023|TMJC|模型|mó xíng|按事物形状做的样本|model replica
2023|TMJC|川流不息|chuān liú bù xī|人车往来不停|continuous stream
2024|ACJC|观赏|guān shǎng|观看并欣赏|view and enjoy
2024|ACJC|接纳|jiē nà|接受并容许加入|accept
2024|ACJC|身临其境|shēn lín qí jìng|仿佛亲自到那个地方|feel present there
2024|CJC|表达|biǎo dá|把想法说出来|express
2024|CJC|模拟|mó nǐ|模仿真实情况|simulate
2024|CJC|身临其境|shēn lín qí jìng|仿佛亲自到那个地方|feel present there
2024|ASRJC|斟酌|zhēn zhuó|仔细考虑是否妥当|weigh carefully
2024|ASRJC|思考|sī kǎo|认真想问题|think
2024|ASRJC|雄心壮志|xióng xīn zhuàng zhì|远大的抱负|great ambition
2024|ASRJC|滔滔不绝|tāo tāo bù jué|说话接连不断|talk without stopping
2024|DHS|检查|jiǎn chá|仔细查看有无问题|check
2024|DHS|敏感|mǐn gǎn|对变化反应很快|sensitive
2024|DHS|无独有偶|wú dú yǒu ǒu|相似事情不只一件|not an isolated case
2024|RI|感情|gǎn qíng|对人或事物的情绪|feelings
2024|RI|短暂|duǎn zàn|持续时间很短|brief
2024|RI|光阴似箭|guāng yīn sì jiàn|时间过得很快|time flies
2024|TJC|紧迫感|jǐn pò gǎn|觉得时间紧急的压力|sense of urgency
2024|TJC|保障|bǎo zhàng|保护或保证的作用|assurance
2024|TJC|必不可少|bì bù kě shǎo|一定不能缺少|essential
2024|TJC|攀比|pān bǐ|互相比较并争高低|compete by comparison
2025|TMJC|弹指之间|tán zhǐ zhī jiān|时间极短|in an instant
2025|TMJC|胸有成竹|xiōng yǒu chéng zhú|做事前已有周全打算|well prepared
2025|SAJC|注入|zhù rù|把新的力量加入|inject
2025|VJC|打扰|dǎ rǎo|干扰别人的活动|disturb
2025|VJC|沉没|chén mò|沉到水底|sink
2025|VJC|收藏|shōu cáng|收集并保存|collect and keep
2025|VJC|津津有味|jīn jīn yǒu wèi|很有兴致地享受|with great interest
2025|NYJC|灌输|guàn shū|把思想强加给别人|instil
2025|NYJC|契合|qì hé|彼此符合|match closely
2025|NYJC|默契|mò qì|彼此无需说便能配合|tacit understanding
2025|NYJC|见风使舵|jiàn fēng shǐ duò|看形势改变立场|change tack opportunistically
2025|JPJC|启发|qǐ fā|引导产生新的想法|inspire
2025|JPJC|胡言乱语|hú yán luàn yǔ|毫无根据地乱说|talk nonsense
`.trim().split('\n');
const extraOptions = extraOptionLines.map(line=>{
  const [year,school,term,pinyin,meaning,gloss]=line.split('|');
  return {year,school,term,pinyin,meaning,gloss};
});

// Closely related or contrasting original options receive priority over generic same-class choices.
const closeSets = {
  '2023 ACJC': ['追求 渴望 欲望','衡量 计量','多姿多彩 称心如意 事与愿违'],
  '2023 ASRJC': ['层出不穷 络绎不绝','固若金汤 心如坚石','威胁 创伤 劫持'],
  '2023 DHS': ['危害 侵害 影响','日益严重 每况愈下','意识 共识'],
  '2023 JPJC': ['墨守成规 标新立异','发奋图强 克服'],
  '2023 SAJC': ['萎缩 紧缩','津贴 奖励','节节攀升 冲击'],
  '2023 TMJC': ['缓解 纾解','反映 反应','模式 模型','四通八达 川流不息'],
  '2024 ACJC': ['观察 观赏','容纳 接纳','别具一格 身临其境','保留 注入'],
  '2024 CJC': ['表扬 表达','拟定 模拟','设身处地 身临其境'],
  '2024 ASRJC': ['商榷 斟酌 思考','雄心壮志 恻隐之心','意义 视野'],
  '2024 DHS': ['考察 检查','密切 敏感','大相径庭 无独有偶'],
  '2024 RI': ['感触 感情 伤痛','平静 短暂','颠沛流离 光阴似箭'],
  '2024 TJC': ['焦虑感 紧迫感','反应 保障','聘用 剥夺 纾缓'],
  '2025 TMJC': ['一朝一夕 弹指之间','心知肚明 胸有成竹','忽视 排斥 避免'],
  '2025 SAJC': ['符合 满足','改善 注入','后继无人 代代相传'],
  '2025 VJC': ['沉浸 沉没','隐藏 收藏','打发 打扰','爱不释手 津津有味'],
  '2025 NYJC': ['契合 默契','因时制宜 见风使舵','灌输 渗透','反响 观念'],
  '2025 JPJC': ['纸上谈兵 胡言乱语','忽略 倾向','锻炼 启发']
};

// Short adjacent passages retain the original context when close options compete.
// Where two source blanks use close words, the neighbouring solved sentence
// shows the distinct collocation while the tested blank remains unanswered.
const passageOverrides = {
  '2023 ACJC 5':'每个人对快乐的定义不同。有些人只____物质生活，他们要拥有大房子和名车，才会快乐。另一些人则重视心灵上的快乐。',
  '2023 ACJC 7':'有些人追求物质生活，另一些人重视心灵上的快乐。不论你以物质或精神作为____快乐的标准，快乐都需要自己寻找。',
  '2023 ACJC 14':'拥有很多之后，有人仍想得到更多，反而难以称心如意。因此，我们应尽量减少过多的____和要求，学会知足。',
  '2024 ACJC 7':'旧双层巴士被改装成教室。它的第二层改为可____二十名学生的小课室，供学生上课；车上还增添了桌子、插座和屏幕。',
  '2025 SAJC 7':'政府将改造小贩中心的基础设施，以应对气候变化。这些项目会配合组屋区发展，确保小贩中心____现代需求和民众期望。旧中心已无法满足现代人的需求。',
  '2025 SAJC 9':'小贩中心自1960年代起就承担“国民食堂”的功能。政府计划翻新设施，使它符合现代需求；老旧的中心已无法____现代人的需求。',
  '2023 DHS 8':'塑料垃圾会随海水漂到千里外的海滩。海中生物吞下塑料垃圾，最终进入食物链，____海洋生物和人类的健康。人们因此必须减少使用塑料袋。',
  '2023 SAJC 5':'新加坡的居民整体生育率多年来持续下降。低生育率加剧人口老龄化，也导致劳动力市场____，使经济发展失去活力。',
  '2023 SAJC 7':'政府鼓励年轻夫妇成家育儿。除了申请预购组屋享有优先权，他们购买转售组屋时也可获得更高的____；政府还发放婴儿花红。',
  '2023 TMJC 6':'共享汽车能满足社会变迁中的不同需求，尤其是____私人汽车对城市造成的各种负担。新加坡土地稀缺，提高汽车使用率更值得鼓励。',
  '2024 ASRJC 7':'有人认为海外社区服务能延伸道德教育；也有人指出它加重家长的经济负担和学生的压力，实际成效有待____。',
  '2025 JPJC 13':'现实世界比理论复杂。计划只有经过不断____和优化，才可能解决问题。青少年应把想法落实为行动，而不是只停留在讨论中。',
  '2024 TJC 5':'家长重视教育，也担心孩子落后。补习中心宣传补习效果，在家长群中制造____，刺激补习需求。广告后来还用“少了备考的紧迫感”来吸引家长。'
};
const answerReasons = {
  '2023 ACJC 5':'The possessions describe an active pursuit.',
  '2023 ACJC 7':'The contrast supplies a standard for judging happiness.',
  '2023 ACJC 14':'Wanting ever more contrasts with being content.',
  '2024 ACJC 7':'A classroom needs physical capacity for twenty students.',
  '2025 SAJC 7':'The later sentence uses satisfy for unmet needs.',
  '2025 SAJC 9':'The earlier sentence uses meet for design requirements.',
  '2023 DHS 8':'Harm pairs with health; infringe often concerns rights.',
  '2023 SAJC 5':'Falling births shrink the available workforce.',
  '2023 SAJC 7':'Housing assistance refers to a subsidy.',
  '2023 TMJC 6':'The citywide burden needs easing.',
  '2024 ASRJC 7':'Opposing views invite discussion of actual results.',
  '2025 JPJC 13':'The next sentence reserves implementation for action.',
  '2024 TJC 5':'The later advertisement separately mentions urgency.'
};
