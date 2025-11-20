import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TestReport, BaseInfoAnswers, QuestionAnswers, RiskLevel } from '@/types'
import { dimensions } from '@/data/questions'
import { saveSecureReport, getSecureReports, deleteSecureReport, clearAllSecureData } from '@/utils/encryption'

interface TestState {
  // 测试码状态
  validatedCode: string | null
  setValidatedCode: (code: string) => void
  clearValidatedCode: () => void
  
  // 当前测试状态
  currentTestId: string | null
  currentStep: 'baseInfo' | 'questions' | 'report'
  baseInfoAnswers: BaseInfoAnswers
  questionAnswers: QuestionAnswers
  currentQuestionIndex: number
  
  // 当前报告（用于显示）
  currentReport: TestReport | null
  
  // 测试报告（本地存储）
  reports: TestReport[]
  
  // 操作方法
  startNewTest: () => void
  setBaseInfoAnswer: (questionId: string, answer: any) => void
  setQuestionAnswer: (questionId: string, score: number) => void
  nextQuestion: () => void
  prevQuestion: () => void
  generateReport: () => TestReport
  saveReport: (report: TestReport) => boolean
  deleteReport: (reportId: string) => void
  clearCurrentTest: () => void
  setCurrentReport: (report: TestReport | null) => void
  
  // 安全存储操作
  loadSecureReports: () => void
  clearAllSecureData: () => void
  
  // 计算得分
  calculateScores: () => {
    overall: number
    riskLevel: RiskLevel
    dimensions: {
      appearance: number
      economic: number
      values: number
      purpose: number
    }
  }
}

const useTestStore = create<TestState>()(
  persist(
    (set, get) => ({
      // 初始状态
      validatedCode: null,
      currentTestId: null,
      currentStep: 'baseInfo',
      baseInfoAnswers: {},
      questionAnswers: {},
      currentQuestionIndex: 0,
      currentReport: null,
      reports: [],

      // 测试码操作
      setValidatedCode: (code: string) => {
        set({ validatedCode: code })
      },

      clearValidatedCode: () => {
        set({ validatedCode: null })
      },

      // 开始新测试
      startNewTest: () => {
        const testId = `test_${Date.now()}`
        set({
          currentTestId: testId,
          currentStep: 'baseInfo',
          baseInfoAnswers: {},
          questionAnswers: {},
          currentQuestionIndex: 0
        })
      },

      // 设置基本信息答案
      setBaseInfoAnswer: (questionId: string, answer: any) => {
        const { baseInfoAnswers } = get()
        set({
          baseInfoAnswers: {
            ...baseInfoAnswers,
            [questionId]: answer
          }
        })
      },

      // 设置题目答案
      setQuestionAnswer: (questionId: string, score: number) => {
        const { questionAnswers } = get()
        set({
          questionAnswers: {
            ...questionAnswers,
            [questionId]: score
          }
        })
      },

      // 题目导航
      nextQuestion: () => {
        const { currentQuestionIndex } = get()
        const nextIndex = currentQuestionIndex + 1
        
        // 检查是否还有题目（动态获取题目总数）
        import('@/data/questions').then(({ getAllQuestions }) => {
          const questions = getAllQuestions()
          
          if (nextIndex < questions.length) {
            set({ currentQuestionIndex: nextIndex })
          } else {
            // 所有题目完成，生成报告
            set({ currentStep: 'report' })
          }
        })
      },

      prevQuestion: () => {
        const { currentQuestionIndex } = get()
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 })
        }
      },

      // 计算得分
      calculateScores: () => {
        const { questionAnswers } = get()
        
        // 初始化维度得分
        const dimensionScores: Record<string, { total: number; count: number }> = {}
        
        // 计算每个维度的得分
        dimensions.forEach(dimension => {
          dimensionScores[dimension.name] = { total: 0, count: 0 }
          
          dimension.questions.forEach(question => {
            const score = questionAnswers[question.id] || 0
            dimensionScores[dimension.name].total += score
            dimensionScores[dimension.name].count++
          })
        })
        
        // 计算维度得分（0-100分）
        const appearanceScore = (dimensionScores['外在特征与社交展示'].total / (dimensionScores['外在特征与社交展示'].count * 4)) * 100
        const economicScore = (dimensionScores['经济行为与心理策略'].total / (dimensionScores['经济行为与心理策略'].count * 4)) * 100
        const valuesScore = (dimensionScores['价值观与社交圈'].total / (dimensionScores['价值观与社交圈'].count * 4)) * 100
        const purposeScore = (dimensionScores['关系推进与目的'].total / (dimensionScores['关系推进与目的'].count * 4)) * 100
        
        // 计算综合得分
        const overallScore = 
          appearanceScore * 0.2 + 
          economicScore * 0.4 + 
          valuesScore * 0.25 + 
          purposeScore * 0.15
        
        // 确定风险等级
        let riskLevel: RiskLevel = '低风险'
        if (overallScore >= 81) riskLevel = '极高风险'
        else if (overallScore >= 61) riskLevel = '高风险'
        else if (overallScore >= 31) riskLevel = '中风险'
        
        return {
          overall: Math.round(overallScore),
          riskLevel,
          dimensions: {
            appearance: Math.round(appearanceScore),
            economic: Math.round(economicScore),
            values: Math.round(valuesScore),
            purpose: Math.round(purposeScore)
          }
        }
      },

      // 生成报告
      generateReport: () => {
        const { currentTestId, baseInfoAnswers, questionAnswers } = get()
        const scores = get().calculateScores()
        
        const report: TestReport = {
          id: currentTestId!,
          reportName: `测试报告_${new Date().toLocaleString()}`,
          createTime: new Date(),
          updateTime: new Date(),
          
          subjectInfo: {
            // nickname: '未填写', // 目前没有专门的昵称收集字段
            relation: baseInfoAnswers.relation || '未填写',
            knownDuration: baseInfoAnswers.knownDuration || '未填写',
            meetMethod: baseInfoAnswers.meetMethod || '未填写'
          },
          
          scores: {
            overall: scores.overall,
            riskLevel: scores.riskLevel,
            dimensions: scores.dimensions
          },
          
          baseInfo: baseInfoAnswers,
          answers: questionAnswers,
          
          analysis: {
            keyRisks: [],
            behaviorPatterns: [],
            suggestions: [],
            relationshipAdvice: []
          }
        }
        
        // 生成分析内容（简化版）
        if (scores.overall >= 60) {
          report.analysis.keyRisks.push('经济行为风险较高，存在明显的索取行为模式')
          report.analysis.suggestions.push('建议保持经济边界，避免大额资金投入')
        }
        
        return report
      },

      // 保存报告
      saveReport: (report: TestReport) => {
        try {
          const { reports } = get()
          const existingIndex = reports.findIndex(r => r.id === report.id)
          
          if (existingIndex >= 0) {
            // 更新现有报告
            const updatedReports = [...reports]
            updatedReports[existingIndex] = report
            set({ 
              reports: updatedReports,
              currentReport: report 
            })
          } else {
            // 添加新报告
            set({ 
              reports: [...reports, report],
              currentReport: report 
            })
          }
          
          // 同时保存到安全存储
          saveSecureReport(report)
          return true
        } catch (error) {
          console.error('保存报告失败:', error)
          return false
        }
      },

      // 删除报告
      deleteReport: (reportId: string) => {
        const { reports } = get()
        const filteredReports = reports.filter(r => r.id !== reportId)
        set({ 
          reports: filteredReports,
          currentReport: filteredReports.length > 0 ? filteredReports[0] : null 
        })
        
        // 同时从安全存储中删除
        deleteSecureReport(reportId)
      },

      // 清除当前测试
      clearCurrentTest: () => {
        set({
          currentTestId: null,
          currentStep: 'baseInfo',
          baseInfoAnswers: {},
          questionAnswers: {},
          currentQuestionIndex: 0,
          currentReport: null
        })
      },

      // 加载安全存储的报告
      loadSecureReports: () => {
        const secureReports = getSecureReports()
        set({ reports: secureReports })
      },

      // 清除所有安全数据
      clearAllSecureData: () => {
        clearAllSecureData()
        set({
          validatedCode: null,
          reports: [],
          currentReport: null
        })
      },

      // 设置当前报告
      setCurrentReport: (report: TestReport | null) => {
        set({ currentReport: report })
      }
    }),
    {
      name: 'test-storage',
      partialize: (state) => ({
        validatedCode: state.validatedCode,
        currentTestId: state.currentTestId,
        currentStep: state.currentStep,
        baseInfoAnswers: state.baseInfoAnswers,
        questionAnswers: state.questionAnswers,
        currentQuestionIndex: state.currentQuestionIndex,
        reports: state.reports,
        currentReport: state.currentReport
      })
    }
  )
)

export default useTestStore