// 测试对象信息
export interface TestSubject {
  id: string
  nickname?: string
  createTime: Date
  relation: string
  riskLevel?: RiskLevel
  lastUpdate: Date
}

// 风险等级
export type RiskLevel = '无风险' | '低风险' | '中风险' | '高风险' | '极高风险'

// 基本信息答案
export interface BaseInfoAnswers {
  age?: string
  income?: string
  relation?: string
  knownDuration?: string
  meetMethod?: string
  economicInput?: string[]
  economicPressure?: string
  friendOpinion?: string
}

// 测试题目答案
export interface QuestionAnswers {
  [key: string]: number // 题目ID -> 得分
}

// 维度得分
export interface DimensionScores {
  appearance: number // 外在特征得分
  economic: number   // 经济行为得分
  values: number     // 价值观得分
  purpose: number    // 关系目的得分
}

// 测试报告
export interface TestReport {
  id: string
  reportName: string
  createTime: Date
  updateTime: Date
  
  subjectInfo: {
    nickname?: string
    relation: string
    knownDuration: string
    meetMethod: string
  }
  
  scores: {
    overall: number
    riskLevel: RiskLevel
    dimensions: DimensionScores
  }
  
  baseInfo: BaseInfoAnswers
  answers: QuestionAnswers
  
  analysis: {
    keyRisks: string[]
    behaviorPatterns: string[]
    suggestions: string[]
    relationshipAdvice: string[]
  }
}

// 题目数据
export interface Question {
  id: string
  text: string
  dimension: string
  options: QuestionOption[]
}

export interface QuestionOption {
  text: string
  score: number
}

// 维度配置
export interface DimensionConfig {
  name: string
  weight: number
  questions: Question[]
}