import { Question, DimensionConfig } from '@/types'

// 选项配置
export const questionOptions = [
  {
    type: 'scale5',
    options: [
      { text: '非常同意', score: 4 },
      { text: '同意', score: 3 },
      { text: '不一定', score: 2 },
      { text: '不同意', score: 1 },
      { text: '非常不同意', score: 0 }
    ]
  },
  {
    type: 'frequency',
    options: [
      { text: '总是', score: 4 },
      { text: '经常', score: 3 },
      { text: '有时', score: 2 },
      { text: '偶尔', score: 1 },
      { text: '从不', score: 0 }
    ]
  },
  {
    type: 'judgment',
    options: [
      { text: '有', score: 4 },
      { text: '可能有', score: 3 },
      { text: '没有', score: 0 },
      { text: '不知道', score: 1 }
    ]
  }
]

// 基本信息问题
export const baseInfoQuestions = [
  {
    id: 'base_age',
    question: '您的年龄是？',
    answers: ['18-24岁', '25-30岁', '31-40岁', '41岁以上']
  },
  {
    id: 'base_income',
    question: '您目前的年收入大致范围是？',
    answers: ['10万以下', '10万-20万', '20万-50万', '50万-100万', '100万以上']
  },
  {
    id: 'base_relation',
    question: '您与她目前的关系状态是？',
    answers: ['刚刚认识，处于了解阶段', '正在约会/暧昧中', '已确立恋爱关系', '已同居或已婚']
  },
  {
    id: 'base_duration',
    question: '你们认识多久了？',
    answers: ['少于1个月', '1-6个月', '6个月-2年', '2年以上']
  },
  {
    id: 'base_meet',
    question: '你们主要通过什么途径认识的？',
    answers: ['社交软件（如探探、Soul等）', '线下社交活动（如聚会、酒吧、兴趣班）', '工作或业务往来', '朋友介绍', '其他 ________']
  },
  {
    id: 'base_economic',
    question: '在相处过程中，您是否为对方有过以下经济投入？（可多选）',
    answers: ['日常吃饭、娱乐等消费', '红包、转账（非特定节日）', '贵重礼物（如包包、首饰、电子产品）', '共同旅行费用（主要由您承担）', '支持她的事业/生意', '尚无重大经济投入']
  },
  {
    id: 'base_pressure',
    question: '您是否曾因这段关系感到经济压力？',
    answers: ['完全没有压力', '略有压力但可承受', '有明显经济压力', '已严重影响个人财务状况']
  },
  {
    id: 'base_friend',
    question: '您身边的朋友或家人对她普遍的看法是？',
    answers: ['大多数表示认可和支持', '看法不一，有赞成的也有提醒我小心的', '大多数人曾明确提醒或反对我们交往', '我尚未将她介绍给我的核心社交圈']
  }
]

// 测试题目配置
export const dimensions: DimensionConfig[] = [
  {
    name: '外在特征与社交展示',
    weight: 0.2,
    questions: [
      {
        id: 'appearance_1',
        text: '她的朋友圈几乎全是精致摆拍、奢侈品、高端场所，几乎没有生活气息。',
        dimension: '外在特征与社交展示',
        options: questionOptions[0].options
      },
      {
        id: 'appearance_2',
        text: '她的穿搭风格高度统一，偏爱"小香风"或明显模仿名媛风格。',
        dimension: '外在特征与社交展示',
        options: questionOptions[0].options
      },
      {
        id: 'appearance_3',
        text: '她的外貌明显经过医美或整形，且常提及相关话题。',
        dimension: '外在特征与社交展示',
        options: questionOptions[0].options
      },
      {
        id: 'appearance_4',
        text: '她总是做精致美甲，指甲很长，似乎从不从事体力劳动。',
        dimension: '外在特征与社交展示',
        options: questionOptions[0].options
      },
      {
        id: 'appearance_5',
        text: '她的社交账号头像、背景、签名都经过精心设计，营造"高级感"。',
        dimension: '外在特征与社交展示',
        options: questionOptions[0].options
      }
    ]
  },
  {
    name: '经济行为与心理策略',
    weight: 0.4,
    questions: [
      {
        id: 'economic_1',
        text: '她经常暗示或直接要求你送礼物、发红包、买奢侈品。',
        dimension: '经济行为与心理策略',
        options: questionOptions[0].options
      },
      {
        id: 'economic_2',
        text: '她会因为小事生气，并暗示需要补偿才能和好。',
        dimension: '经济行为与心理策略',
        options: questionOptions[0].options
      },
      {
        id: 'economic_3',
        text: '她会在你犯错（即使是小事）时放大情绪，让你内疚。',
        dimension: '经济行为与心理策略',
        options: questionOptions[0].options
      },
      {
        id: 'economic_4',
        text: '她会在你事业忙时说"你陪我的时间太少"，并索要补偿。',
        dimension: '经济行为与心理策略',
        options: questionOptions[0].options
      },
      {
        id: 'economic_5',
        text: '她经常说自己"过去被伤害"，激发你的保护欲和付出欲。',
        dimension: '经济行为与心理策略',
        options: questionOptions[0].options
      },
      {
        id: 'economic_6',
        text: '她会在你表现出犹豫时，用"你不爱我"来施压。',
        dimension: '经济行为与心理策略',
        options: questionOptions[0].options
      },
      {
        id: 'economic_7',
        text: '她总是能精准迎合你的话题，让你觉得"她非常懂你"。',
        dimension: '经济行为与心理策略',
        options: questionOptions[0].options
      },
      {
        id: 'economic_8',
        text: '她会在初期主动为你买单或送你小礼物，让你觉得她"与众不同"。',
        dimension: '经济行为与心理策略',
        options: questionOptions[0].options
      },
      {
        id: 'economic_9',
        text: '她经常因小事生气（如不说晚安、记不住纪念日），并让你感到内疚。',
        dimension: '经济行为与心理策略',
        options: questionOptions[0].options
      },
      {
        id: 'economic_10',
        text: '她常以"没有安全感""未来不确定"为由，暗示你应给予经济保障。',
        dimension: '经济行为与心理策略',
        options: questionOptions[0].options
      },
      {
        id: 'economic_11',
        text: '她善于激发你的愧疚感，并引导你通过金钱或礼物来补偿。',
        dimension: '经济行为与心理策略',
        options: questionOptions[0].options
      },
      {
        id: 'economic_12',
        text: '她认为"男人爱女人就要舍得为她花钱"是理所当然的。',
        dimension: '经济行为与心理策略',
        options: questionOptions[0].options
      }
    ]
  },
  {
    name: '价值观与社交圈',
    weight: 0.25,
    questions: [
      {
        id: 'values_1',
        text: '她身边经常有愿意为她无条件付出的男性朋友。',
        dimension: '价值观与社交圈',
        options: questionOptions[0].options
      },
      {
        id: 'values_2',
        text: '她对自己的职业或收入描述模糊，却生活奢侈，收支明显不符。',
        dimension: '价值观与社交圈',
        options: questionOptions[0].options
      },
      {
        id: 'values_3',
        text: '她曾表达过"女人应该靠男人实现阶层跨越"之类的观点。',
        dimension: '价值观与社交圈',
        options: questionOptions[0].options
      },
      {
        id: 'values_4',
        text: '她的社交圈中多数是"名媛"风格女性，且常交流如何吸引男性。',
        dimension: '价值观与社交圈',
        options: questionOptions[0].options
      },
      {
        id: 'values_5',
        text: '她喜欢在高端场所（如高尔夫、滑雪、拍卖会）互动，但似乎并无相应消费能力。',
        dimension: '价值观与社交圈',
        options: questionOptions[0].options
      },
      {
        id: 'values_6',
        text: '她对自己的过去经历描述模糊，或常有矛盾之处。',
        dimension: '价值观与社交圈',
        options: questionOptions[0].options
      },
      {
        id: 'values_7',
        text: '她几乎没有长期稳定的女性朋友，异性朋友远多于同性。',
        dimension: '价值观与社交圈',
        options: questionOptions[0].options
      },
      {
        id: 'values_8',
        text: '她常以"创业""自媒体老板"等身份自称，但实际业务模糊。',
        dimension: '价值观与社交圈',
        options: questionOptions[0].options
      }
    ]
  },
  {
    name: '关系推进与目的',
    weight: 0.15,
    questions: [
      {
        id: 'purpose_1',
        text: '她在你遇到经济困难时态度明显冷淡。',
        dimension: '关系推进与目的',
        options: questionOptions[0].options
      },
      {
        id: 'purpose_2',
        text: '她曾有过"闪婚闪离"或"高额彩礼纠纷"等历史。',
        dimension: '关系推进与目的',
        options: questionOptions[0].options
      },
      {
        id: 'purpose_3',
        text: '你身边的朋友或家人曾提醒你"她可能目的不纯"。',
        dimension: '关系推进与目的',
        options: questionOptions[0].options
      },
      {
        id: 'purpose_4',
        text: '她对你的朋友或家人不太感兴趣，甚至回避见面。',
        dimension: '关系推进与目的',
        options: questionOptions[0].options
      },
      {
        id: 'purpose_5',
        text: '你感觉她对你的兴趣，与你的经济能力高度相关。',
        dimension: '关系推进与目的',
        options: questionOptions[0].options
      },
      {
        id: 'purpose_6',
        text: '她对你的事业、资产、家庭背景的兴趣远大于你的人格或情感。',
        dimension: '关系推进与目的',
        options: questionOptions[0].options
      },
      {
        id: 'purpose_7',
        text: '她会趁感情热度最高、你对她最有好感时，向你提出远超当前关系阶段的重大财务决策（如买房、投资），这像是一种"服从性测试"。',
        dimension: '关系推进与目的',
        options: questionOptions[0].options
      },
      {
        id: 'purpose_8',
        text: '在你们感情基础尚浅时，她是否就已经开始与你详细规划需要你承担重大资金的未来（如买房、投资），并让你感到压力？',
        dimension: '关系推进与目的',
        options: questionOptions[0].options
      }
    ]
  }
]

// 获取所有题目
export const getAllQuestions = (): Question[] => {
  return dimensions.flatMap(dimension => dimension.questions)
}

// 获取题目总数
export const getTotalQuestions = (): number => {
  return dimensions.reduce((total, dimension) => total + dimension.questions.length, 0)
}