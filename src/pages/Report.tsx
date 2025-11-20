import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Typography, Progress, Tag, Space, Row, Col, Statistic, Divider, Alert, message } from 'antd'
import { ArrowLeftOutlined, SafetyOutlined } from '@ant-design/icons'
import useTestStore from '@/stores/testStore'
import { determineRiskLevel, getRiskLevelColor, getRiskLevelDescription, generateRiskAnalysis } from '@/utils/scoring'
import './Report.css'

const { Title, Text, Paragraph } = Typography

const ReportPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentReport, clearCurrentTest } = useTestStore()
  const [riskAnalysis, setRiskAnalysis] = useState<{
    keyRisks: string[]
    behaviorPatterns: string[]
    suggestions: string[]
    relationshipAdvice: string[]
  }>({
    keyRisks: [],
    behaviorPatterns: [],
    suggestions: [],
    relationshipAdvice: []
  })
  useEffect(() => {
    if (!currentReport) {
      message.warning('没有找到测试报告，请先完成测试')
      navigate('/')
      return
    }

    // 生成风险分析
    const analysis = generateRiskAnalysis({
      overall: currentReport.scores.overall,
      dimensions: currentReport.scores.dimensions
    })
    setRiskAnalysis(analysis)
    
    // 报告页面成功加载后，只清除测试进度，保留报告
    const { clearCurrentTest, setCurrentReport } = useTestStore.getState()
    clearCurrentTest()
    // 重新设置当前报告，确保报告不被清除
    setCurrentReport(currentReport)
  }, [currentReport, navigate])

  if (!currentReport) {
    return null
  }

  const riskLevel = determineRiskLevel(currentReport.scores.overall)
  const riskColor = getRiskLevelColor(riskLevel)
  const riskDescription = getRiskLevelDescription(riskLevel)

  // 处理重新测试
  const handleRetest = () => {
    clearCurrentTest()
    navigate('/test')
  }





  // 渲染维度得分卡片
  const renderDimensionCard = (dimension: any) => (
    <Card key={dimension.name} className="dimension-card">
      <div className="dimension-header">
        <Text strong className="dimension-name">{dimension.name}</Text>
        <Tag color={getRiskLevelColor(determineRiskLevel(dimension.score))}>
          {dimension.score}分
        </Tag>
      </div>
      <Progress 
        percent={Math.round((dimension.score / 100) * 100)} 
        strokeColor={getRiskLevelColor(determineRiskLevel(dimension.score))}
        showInfo={false}
        className="dimension-progress"
      />
      <Text type="secondary" className="dimension-description">
        {dimension.description}
      </Text>
    </Card>
  )

  return (
    <div className="report-container">
      <div className="report-header">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')}
          className="back-button"
        >
          返回首页
        </Button>
        
        <Title level={1} className="report-title">
          风险评估报告
        </Title>
        
        {/* <div className="report-actions">
          <Button icon={<DownloadOutlined />} onClick={handleDownload}>
            下载报告
          </Button>
          <Button icon={<ShareAltOutlined />} onClick={handleShare}>
            分享
          </Button>
          <Dropdown menu={{ items: moreMenuItems }} placement="bottomRight">
            <Button icon={<MoreOutlined />}>
              更多
            </Button>
          </Dropdown>
        </div> */}
      </div>

      <div className="report-content">
        {/* 总体风险评估 */}
        <Card className="overall-risk-card">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={8}>
              <Statistic
                title="综合风险评分"
                value={currentReport.scores.overall}
                suffix="/ 100"
                valueStyle={{ color: riskColor, fontSize: '3rem' }}
              />
            </Col>
            
            <Col xs={24} md={16}>
              <div className="risk-level-section">
                <Tag color={riskColor} className="risk-level-tag">
                  <SafetyOutlined /> {riskLevel}
                </Tag>
                <Title level={3} style={{ color: riskColor, margin: '8px 0' }}>
                  {riskDescription}
                </Title>
                <Paragraph className="risk-summary">
                  基于对测试对象的分析，
                  在{currentReport.scores.dimensions ? Object.keys(currentReport.scores.dimensions).length : 4}个关键维度上的综合评估结果。
                </Paragraph>
              </div>
            </Col>
          </Row>
        </Card>

        {/* 风险分析详情 */}
        <Alert
          message="风险分析"
          description={
            <div>
              {riskAnalysis.keyRisks.length > 0 && (
                <div>
                  <Text strong>关键风险点：</Text>
                  <ul>
                    {riskAnalysis.keyRisks.map((risk, index) => (
                      <li key={index}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}
              {riskAnalysis.behaviorPatterns.length > 0 && (
                <div>
                  <Text strong>行为模式识别：</Text>
                  <ul>
                    {riskAnalysis.behaviorPatterns.map((pattern, index) => (
                      <li key={index}>{pattern}</li>
                    ))}
                  </ul>
                </div>
              )}
              {riskAnalysis.suggestions.length > 0 && (
                <div>
                  <Text strong>防范建议：</Text>
                  <ul>
                    {riskAnalysis.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
              {riskAnalysis.relationshipAdvice.length > 0 && (
                <div>
                  <Text strong>关系处理建议：</Text>
                  <ul>
                    {riskAnalysis.relationshipAdvice.map((advice, index) => (
                      <li key={index}>{advice}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          }
          type={riskLevel === '极高风险' || riskLevel === '高风险' ? 'error' : riskLevel === '中风险' ? 'warning' : 'info'}
          showIcon
          className="risk-analysis-alert"
        />

        <Divider />

        {/* 各维度详细得分 */}
        <Title level={2} className="dimensions-title">
          各维度详细分析
        </Title>
        
        <div className="dimensions-grid">
          {currentReport.scores.dimensions ? Object.entries(currentReport.scores.dimensions).map(([dimensionName, score]) => renderDimensionCard({
            name: dimensionName === 'appearance' ? '外在特征与社交展示' : 
                   dimensionName === 'economic' ? '经济行为与心理策略' : 
                   dimensionName === 'values' ? '价值观与社交圈' : 
                   '关系推进与目的',
            score: score,
            description: dimensionName === 'appearance' ? '评估对象的外在形象、社交表现和吸引力' : 
                        dimensionName === 'economic' ? '分析经济行为模式和心理策略使用情况' : 
                        dimensionName === 'values' ? '考察价值观体系和社交圈特征' : 
                        '评估关系推进方式和目的明确性'
          })) : null}
        </div>

        {/* 测试基本信息 */}
        <Card title="测试基本信息" className="info-card">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Text strong>对象昵称：</Text>
              <Text>{currentReport.subjectInfo.nickname || '未填写'}</Text>
            </Col>
            <Col xs={24} sm={12}>
              <Text strong>关系类型：</Text>
              <Text>{currentReport.subjectInfo.relation || '未填写'}</Text>
            </Col>
            <Col xs={24} sm={12}>
              <Text strong>认识时长：</Text>
              <Text>{currentReport.subjectInfo.knownDuration || '未填写'}</Text>
            </Col>
            <Col xs={24} sm={12}>
              <Text strong>认识途径：</Text>
              <Text>{currentReport.subjectInfo.meetMethod || '未填写'}</Text>
            </Col>
            <Col xs={24}>
              <Text strong>测试时间：</Text>
              <Text>{new Date(currentReport.createTime).toLocaleString()}</Text>
            </Col>
          </Row>
        </Card>

        {/* 行动建议 */}
        <Card title="行动建议" className="recommendation-card">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {riskLevel === '高风险' && (
              <Alert
                message="高风险预警"
                description="建议保持距离，避免经济往来，必要时寻求专业帮助"
                type="error"
                showIcon
              />
            )}
            {riskLevel === '中风险' && (
              <Alert
                message="谨慎观察"
                description="建议保持警惕，观察对方行为模式，避免重大经济决策"
                type="warning"
                showIcon
              />
            )}
            {riskLevel === '低风险' && (
              <Alert
                message="相对安全"
                description="当前关系相对健康，但仍需保持适度警惕"
                type="info"
                showIcon
              />
            )}
            {riskLevel === '无风险' && (
              <Alert
                message="安全状态"
                description="关系健康，可以正常交往"
                type="success"
                showIcon
              />
            )}
          </Space>
        </Card>

        {/* 重新测试按钮 */}
        <div className="action-buttons">
          <Button type="primary" size="large" onClick={handleRetest}>
            重新测试
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ReportPage