import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Steps, Form, Radio, Checkbox, Space, Typography, Progress, message } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import useTestStore from '@/stores/testStore'
import { baseInfoQuestions, dimensions, getAllQuestions } from '@/data/questions'
import './Test.css'

const { Title, Text } = Typography
const { Step } = Steps

const TestPage: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const {
    baseInfoAnswers,
    questionAnswers,
    currentQuestionIndex,
    startNewTest,
    setBaseInfoAnswer,
    setQuestionAnswer,
    nextQuestion,
    prevQuestion,
    generateReport,
    saveReport
  } = useTestStore()

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentBaseInfoIndex, setCurrentBaseInfoIndex] = useState(0)
  const allQuestions = getAllQuestions()

  // 初始化测试 - 页面加载时恢复测试进度
  useEffect(() => {
    const { currentTestId, currentStep, baseInfoAnswers } = useTestStore.getState()
    
    if (!currentTestId) {
      // 没有进行中的测试，开始新测试
      startNewTest()
      setCurrentStepIndex(0) // 重置到基本信息阶段
      setCurrentBaseInfoIndex(0) // 重置基本信息索引
    } else {
      // 有进行中的测试，恢复进度
      if (currentStep === 'baseInfo') {
        setCurrentStepIndex(0)
        // 恢复基本信息进度：根据已填写的题目数量确定当前索引
        const answeredCount = Object.keys(baseInfoAnswers).length
        setCurrentBaseInfoIndex(Math.min(answeredCount, baseInfoQuestions.length - 1))
      } else if (currentStep === 'questions') {
        setCurrentStepIndex(1)
      } else if (currentStep === 'report') {
        // 如果测试已完成，跳转到报告页面
        navigate('/report')
      }
    }
  }, [startNewTest, navigate])

  // 监听store状态变化，确保UI与store状态同步
  useEffect(() => {
    const { currentStep, baseInfoAnswers } = useTestStore.getState()
    
    // 同步步骤状态
    if (currentStep === 'baseInfo') {
      setCurrentStepIndex(0)
      const answeredCount = Object.keys(baseInfoAnswers).length
      setCurrentBaseInfoIndex(Math.min(answeredCount, baseInfoQuestions.length - 1))
    } else if (currentStep === 'questions') {
      setCurrentStepIndex(1)
    }
    
    // 监听store变化，确保状态同步
    const unsubscribe = useTestStore.subscribe((state) => {
      if (state.currentStep !== currentStep) {
        if (state.currentStep === 'baseInfo') {
          setCurrentStepIndex(0)
          const answeredCount = Object.keys(state.baseInfoAnswers).length
          setCurrentBaseInfoIndex(Math.min(answeredCount, baseInfoQuestions.length - 1))
        } else if (state.currentStep === 'questions') {
          setCurrentStepIndex(1)
        }
      }
    })
    
    return unsubscribe
  }, [])

  // 处理基本信息提交
  const handleBaseInfoSubmit = (values: any) => {
    const questionId = baseInfoQuestions[currentBaseInfoIndex].id
    setBaseInfoAnswer(questionId, values[questionId])
    
    if (currentBaseInfoIndex < baseInfoQuestions.length - 1) {
      setCurrentBaseInfoIndex(currentBaseInfoIndex + 1)
      form.resetFields()
    } else {
      setCurrentStepIndex(1) // 进入主测试阶段
    }
  }

  // 处理题目答案选择
  const handleQuestionAnswer = async (score: number) => {
    const currentQuestion = allQuestions[currentQuestionIndex]
    setQuestionAnswer(currentQuestion.id, score)
    
    // 自动进入下一题
    setTimeout(async () => {
      // 获取最新的currentQuestionIndex值
      const latestIndex = useTestStore.getState().currentQuestionIndex
      if (latestIndex < allQuestions.length - 1) {
        nextQuestion()
      } else {
        // 所有题目完成，生成报告
        const report = generateReport()
        const saveSuccess = await saveReport(report)
        if (saveSuccess) {
          message.success('测试完成！报告已安全保存')
          navigate('/report')
        } else {
          message.error('报告保存失败，请重试')
        }
      }
    }, 300)
  }

  // 渲染基本信息表单
  const renderBaseInfoForm = () => {
    const currentQuestion = baseInfoQuestions[currentBaseInfoIndex]
    const isMultipleChoice = currentQuestion.id === 'base_economic'

    return (
      <Card className="test-card">
        <div className="progress-section">
          <Text type="secondary">
            基本信息 ({currentBaseInfoIndex + 1}/{baseInfoQuestions.length})
          </Text>
          <Progress 
            percent={Math.round(((currentBaseInfoIndex + 1) / baseInfoQuestions.length) * 100)} 
            size="small" 
            showInfo={false}
          />
        </div>

        <Title level={3} className="question-title">
          {currentQuestion.question}
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleBaseInfoSubmit}
          initialValues={baseInfoAnswers}
        >
          <Form.Item name={currentQuestion.id}>
            {isMultipleChoice ? (
              <Checkbox.Group style={{ width: '100%' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {currentQuestion.answers.map((answer, index) => (
                    <Checkbox key={index} value={answer}>
                      {answer}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            ) : (
              <Radio.Group style={{ width: '100%' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {currentQuestion.answers.map((answer, index) => (
                    <Radio key={index} value={answer}>
                      {answer}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            )}
          </Form.Item>

          <div className="navigation-buttons">
            <Button 
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                if (currentBaseInfoIndex > 0) {
                  setCurrentBaseInfoIndex(currentBaseInfoIndex - 1)
                  form.resetFields()
                }
              }}
              disabled={currentBaseInfoIndex === 0}
            >
              上一题
            </Button>
            
            <Button 
              type="primary" 
              htmlType="submit"
              icon={currentBaseInfoIndex < baseInfoQuestions.length - 1 ? <ArrowRightOutlined /> : undefined}
            >
              {currentBaseInfoIndex < baseInfoQuestions.length - 1 ? '下一题' : '开始主测试'}
            </Button>
          </div>
        </Form>
      </Card>
    )
  }

  // 渲染主测试题目
  const renderQuestion = () => {
    const currentQuestion = allQuestions[currentQuestionIndex]
    const currentDimension = dimensions.find(d => 
      d.questions.some(q => q.id === currentQuestion.id)
    )

    return (
      <Card className="test-card">
        <div className="progress-section">
          <Text type="secondary">
            题目 ({currentQuestionIndex + 1}/{allQuestions.length}) - {currentDimension?.name}
          </Text>
          <Progress 
            percent={Math.round(((currentQuestionIndex + 1) / allQuestions.length) * 100)} 
            size="small" 
            showInfo={false}
          />
        </div>

        <Title level={3} className="question-title">
          {currentQuestion.text}
        </Title>

        <div className="options-grid">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              type={questionAnswers[currentQuestion.id] === option.score ? 'primary' : 'default'}
              className="option-button"
              onClick={() => handleQuestionAnswer(option.score)}
              size="large"
            >
              {option.text}
            </Button>
          ))}
        </div>

        <div className="navigation-buttons">
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            上一题
          </Button>
          
          <Text type="secondary">
            选择答案后自动进入下一题
          </Text>
        </div>
      </Card>
    )
  }

  // 根据当前步骤渲染内容
  const renderContent = () => {
    if (currentStepIndex === 0) {
      return renderBaseInfoForm()
    } else {
      return renderQuestion()
    }
  }

  return (
    <div className="test-container">
      <div className="test-header">
        <Title level={2} className="test-title">
          捞女识别测试
        </Title>
        
        <Steps current={currentStepIndex} className="test-steps">
          <Step title="基本信息" description="收集关系背景信息" />
          <Step title="主测试" description="30个专业评估题目" />
          <Step title="生成报告" description="获取风险评估结果" />
        </Steps>
      </div>

      <div className="test-content">
        {renderContent()}
      </div>
    </div>
  )
}

export default TestPage