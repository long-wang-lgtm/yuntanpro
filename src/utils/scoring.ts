import { QuestionAnswers, RiskLevel } from '@/types'
import { dimensions } from '@/data/questions'

// 计算单个维度得分
export const calculateDimensionScore = (
  answers: QuestionAnswers,
  dimensionName: string
): number => {
  const dimension = dimensions.find(d => d.name === dimensionName)
  if (!dimension) return 0
  
  let totalScore = 0
  let maxPossibleScore = 0
  
  dimension.questions.forEach(question => {
    const answerScore = answers[question.id] || 0
    totalScore += answerScore
    maxPossibleScore += 4 // 每个题目最高4分
  })
  
  if (maxPossibleScore === 0) return 0
  
  // 转换为0-100分
  return Math.round((totalScore / maxPossibleScore) * 100)
}

// 计算综合得分
export const calculateOverallScore = (answers: QuestionAnswers): number => {
  const appearanceScore = calculateDimensionScore(answers, '外在特征与社交展示')
  const economicScore = calculateDimensionScore(answers, '经济行为与心理策略')
  const valuesScore = calculateDimensionScore(answers, '价值观与社交圈')
  const purposeScore = calculateDimensionScore(answers, '关系推进与目的')
  
  // 加权计算综合得分
  const overallScore = 
    appearanceScore * 0.2 + 
    economicScore * 0.4 + 
    valuesScore * 0.25 + 
    purposeScore * 0.15
  
  return Math.round(overallScore)
}

// 确定风险等级
export const determineRiskLevel = (score: number): RiskLevel => {
  if (score >= 81) return '极高风险'
  if (score >= 61) return '高风险'
  if (score >= 31) return '中风险'
  return '低风险'
}

// 生成风险分析
export const generateRiskAnalysis = (scores: {
  overall: number
  dimensions: {
    appearance: number
    economic: number
    values: number
    purpose: number
  }
}): {
  keyRisks: string[]
  behaviorPatterns: string[]
  suggestions: string[]
  relationshipAdvice: string[]
} => {
  const { overall, dimensions } = scores
  const analysis = {
    keyRisks: [] as string[],
    behaviorPatterns: [] as string[],
    suggestions: [] as string[],
    relationshipAdvice: [] as string[]
  }
  
  // 基于综合得分生成分析
  if (overall >= 80) {
    analysis.keyRisks.push('风险极高，存在明显的捞女行为模式')
    analysis.suggestions.push('建议立即停止经济投入，重新评估关系')
    analysis.relationshipAdvice.push('考虑结束关系，避免更大损失')
  } else if (overall >= 60) {
    analysis.keyRisks.push('高风险，存在较多捞女特征')
    analysis.suggestions.push('建议设置明确的经济边界')
    analysis.relationshipAdvice.push('保持警惕，观察后续行为')
  } else if (overall >= 30) {
    analysis.keyRisks.push('中等风险，存在一些值得关注的信号')
    analysis.suggestions.push('建议保持观察，注意经济投入')
    analysis.relationshipAdvice.push('可以继续交往，但需保持理性')
  } else {
    analysis.keyRisks.push('风险较低，关系相对健康')
    analysis.suggestions.push('建议继续保持良好沟通')
    analysis.relationshipAdvice.push('可以正常发展关系')
  }
  
  // 基于维度得分生成具体分析
  if (dimensions.economic >= 70) {
    analysis.behaviorPatterns.push('经济索取行为明显，经常要求礼物或红包')
  }
  
  if (dimensions.values >= 60) {
    analysis.behaviorPatterns.push('价值观存在偏差，可能过于注重物质条件')
  }
  
  if (dimensions.purpose >= 50) {
    analysis.behaviorPatterns.push('关系目的性较强，可能更关注经济条件')
  }
  
  return analysis
}

// 获取风险等级颜色
export const getRiskLevelColor = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case '低风险':
      return '#52c41a'
    case '中风险':
      return '#faad14'
    case '高风险':
      return '#fa8c16'
    case '极高风险':
      return '#f5222d'
    default:
      return '#52c41a'
  }
}

// 获取风险等级描述
export const getRiskLevelDescription = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case '低风险':
      return '关系相对健康，建议保持观察'
    case '中风险':
      return '存在一定风险，建议谨慎对待'
    case '高风险':
      return '风险较高，建议加强防范'
    case '极高风险':
      return '风险极高，建议立即采取措施'
    default:
      return '关系相对健康，建议保持观察'
  }
}