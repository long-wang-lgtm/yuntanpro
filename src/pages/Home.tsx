import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, message, Space, Typography, Row, Col, Modal, FloatButton, List, Tag } from 'antd'
import { KeyOutlined, PlayCircleOutlined, FileTextOutlined, HistoryOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons'
import useTestStore from '@/stores/testStore'
import { validateTestCode } from '@/utils/validation'
import { determineRiskLevel, getRiskLevelColor } from '@/utils/scoring'
import './Home.css'

const { Title, Paragraph, Text } = Typography

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { validatedCode, setValidatedCode, loadSecureReports } = useTestStore()
  const [testCode, setTestCode] = useState('')
  const [validating, setValidating] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [historyReports, setHistoryReports] = useState<any[]>([])

  // 处理测试码验证
  const handleValidateCode = async () => {
    if (!testCode.trim()) {
      message.warning('请输入测试码')
      return
    }

    setValidating(true)
    try {
      const isValid = await validateTestCode(testCode)
      if (isValid) {
        setValidatedCode(testCode)
        message.success('验证成功！可以开始测试')
        navigate('/test')
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : '测试码不存在，请联系客服！')
    } finally {
      setValidating(false)
    }
  }



  // 加载历史报告
  useEffect(() => {
    const loadHistory = async () => {
      await loadSecureReports()
      // 直接从store获取最新的reports
      const { reports: latestReports } = useTestStore.getState()
      setHistoryReports(latestReports)
    }
    
    // 只在组件挂载时加载一次
    loadHistory()
  }, [])

  // 如果已经验证过且有进行中的测试，直接跳转到测试页面
  React.useEffect(() => {
    if (validatedCode) {
      const { currentTestId, currentStep } = useTestStore.getState()
      
      // 如果有进行中的测试且测试未完成，跳转到测试页面
      if (currentTestId && currentStep !== 'report') {
        navigate('/test')
      }
      // 如果没有进行中的测试或测试已完成，保持在首页让用户选择开始新测试
    }
  }, [validatedCode])

  // 查看历史报告
  const handleViewHistory = () => {
    if (historyReports.length === 0) {
      message.info('暂无历史报告')
      return
    }
    setShowReportModal(true)
  }

  // 查看报告详情
  const handleViewReport = (report: any) => {
    const { setCurrentReport } = useTestStore.getState()
    setCurrentReport(report)
    setShowReportModal(false)
    navigate('/report')
  }

  // 删除报告
  const handleDeleteReport = (report: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除"${report.reportName}"报告吗？此操作不可恢复。`,
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          const { deleteReport } = useTestStore.getState()
          deleteReport(report.id)
          message.success('报告删除成功')
          
          // 重新加载历史报告
          const { reports: latestReports } = useTestStore.getState()
          setHistoryReports(latestReports)
        } catch (error) {
          message.error('删除失败，请重试')
        }
      }
    })
  }

  return (
    <div className="home-container">
      <div className="home-background">
        <div className="home-content">
          {/* 主标题区域 */}
          <Row justify="center" style={{ marginBottom: 10 }}>
            <Col xs={24} md={20} lg={16}>
              <div className="hero-section">
                <Title level={1} className="main-title">
                  捞女指数计算器
                </Title>
                <Title level={3} className="subtitle">
                  科学评估，保护你的情感和财务安全
                </Title>
                <Paragraph className="description">
                  基于心理学评估模型，通过33个精心设计的测试题目，
                  帮助男性用户准确识别身边的女性朋友是否为"捞女"，
                  提供精准的风险评估和关系分析。
                </Paragraph>
              </div>
            </Col>
          </Row>

          {/* 测试流程简介 */}
          <Row justify="center" style={{ marginBottom: 10 }}>
            <Col xs={24} md={20} lg={16}>
              <div className="process-section">
                <Title level={2} className="section-title">测试流程</Title>
                <Row gutter={[24, 24]} justify="space-around">
                  <Col xs={24} sm={6}>
                    <div className="process-step">
                      <div className="step-number">1</div>
                      <Text strong>输入测试码</Text>
                      <Paragraph>验证身份，开始测试</Paragraph>
                    </div>
                  </Col>
                  <Col xs={24} sm={6}>
                    <div className="process-step">
                      <div className="step-number">2</div>
                      <Text strong>基本信息收集</Text>
                      <Paragraph>了解关系背景</Paragraph>
                    </div>
                  </Col>
                  <Col xs={24} sm={6}>
                    <div className="process-step">
                      <div className="step-number">3</div>
                      <Text strong>30题专业测试</Text>
                      <Paragraph>全面评估风险</Paragraph>
                    </div>
                  </Col>
                  <Col xs={24} sm={6}>
                    <div className="process-step">
                      <div className="step-number">4</div>
                      <Text strong>生成详细报告</Text>
                      <Paragraph>获取专业建议</Paragraph>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          {/* 开始测试按钮 */}
          <Row justify="center" style={{ marginBottom: 10 }}>
            <Col xs={24} sm={12} md={8} style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={() => setShowCodeModal(true)}
                style={{ padding: '12px 48px', fontSize: '18px' }}
              >
                开始测试
              </Button>
            </Col>
          </Row>

          {/* 特性说明 */}
          <Row justify="center" style={{ marginTop: 20 }}>
            <Col xs={24} md={20} lg={16}>
              <div className="features-section">
                <Title level={2} className="section-title">产品特性</Title>
                <Row gutter={[24, 24]}>
                  <Col xs={24} sm={8}>
                    <div className="feature-item">
                      <div className="feature-icon">🔒</div>
                      <Text strong>隐私保护</Text>
                      <Paragraph>所有数据本地存储，保护用户隐私安全</Paragraph>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div className="feature-item">
                      <div className="feature-icon">📊</div>
                      <Text strong>科学评估</Text>
                      <Paragraph>基于心理学模型，提供精准风险评估</Paragraph>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div className="feature-item">
                      <div className="feature-icon">💡</div>
                      <Text strong>专业建议</Text>
                      <Paragraph>针对不同风险等级提供具体防范建议</Paragraph>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* 报告管理浮窗 */}
      <FloatButton.Group
        shape="circle"
        style={{ right: 24, bottom: 24 }}
        icon={<FileTextOutlined />}
      >
        <FloatButton
          icon={<HistoryOutlined />}
          tooltip="查看历史报告"
          onClick={handleViewHistory}
          badge={{ count: historyReports.length, overflowCount: 99 }}
        />
      </FloatButton.Group>

      {/* 历史报告模态框 */}
      <Modal
        title={
          <Space>
            <HistoryOutlined />
            <span>历史报告 ({historyReports.length})</span>
          </Space>
        }
        open={showReportModal}
        onCancel={() => setShowReportModal(false)}
        footer={null}
        width={600}
      >
        {historyReports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <FileTextOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
            <p style={{ color: '#999' }}>暂无历史报告</p>
          </div>
        ) : (
          <List
            dataSource={historyReports}
            renderItem={(report) => (
              <List.Item
                actions={[
                  <Button 
                    type="link" 
                    onClick={() => handleViewReport(report)}
                    icon={<FileTextOutlined />}
                  >
                    查看详情
                  </Button>,
                  <Button 
                    type="link" 
                    danger
                    onClick={() => handleDeleteReport(report)}
                    icon={<DeleteOutlined />}
                  >
                    删除
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                  title={
                    <Space>
                      <span>测试报告</span>
                      <Tag color={getRiskLevelColor(determineRiskLevel(report.scores.overall))}>
                        {determineRiskLevel(report.scores.overall)}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <Text type="secondary">
                        综合评分: {report.scores.overall.toFixed(1)}分
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(report.createdAt).toLocaleString('zh-CN')}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Modal>

      {/* 测试码输入模态框 */}
      <Modal
        title={
          <div style={{ textAlign: 'center', width: '100%' }}>
            <Space>
              <KeyOutlined />
              <span>请输入授权码</span>
            </Space>
          </div>
        }
        open={showCodeModal}
        onCancel={() => setShowCodeModal(false)}
        footer={null}
        width={400}
        centered
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Input
            size="large"
            placeholder="请输入8位授权码"
            value={testCode}
            onChange={(e) => setTestCode(e.target.value)}
            onPressEnter={handleValidateCode}
            prefix={<KeyOutlined />}
            maxLength={8}
            style={{ marginBottom: '0px' }}
          />
          
          <div style={{ marginBottom: '24px' }}>
            <Text strong style={{ display: 'block', marginBottom: '12px' }}>
              获取授权码
            </Text>
            <div style={{ fontSize: '14px', color: '#595959', marginBottom: '12px' }}>
              测试授权码可以在以下平台获取:
            </div>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Button
                type="text"
                onClick={() => {
                  window.open('https://2.taobao.com', '_blank');
                }}
                block
                className="xianyu-button"
                style={{ 
                  fontSize: '16px',
                  padding: '10px'
                }}
              >
                闲鱼店铺
              </Button>
              {/* <Button
                type="primary"
                onClick={() => {
                  window.open('https://www.xiaohongshu.com', '_blank');
                }}
                block
                style={{ 
                  backgroundColor: '#ff0036', 
                  borderColor: '#ff0036',
                  fontSize: '16px',
                  padding: '10px'
                }}
              >
                小红书店铺
              </Button> */}
            </Space>
          </div>
          
          <div style={{ fontSize: '14px', color: '#8c8c8c', marginBottom: '24px' }}>
            <Text strong style={{ display: 'block', marginBottom: '8px', color: '#595959' }}>
              <CheckCircleOutlined style={{ fontSize: '16px', marginRight: '4px' }} />
              温馨提示:
            </Text>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li style={{ marginBottom: '4px' }}>授权码购买后立即可用，一码一测</li>
              <li style={{ marginBottom: '4px' }}>测试结果保存在本地，可随时查看</li>
            </ul>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="default"
              onClick={() => setShowCodeModal(false)}
              style={{ flex: 1, marginRight: '8px' }}
            >
              取消
            </Button>
            <Button
              type="primary"
              loading={validating}
              onClick={handleValidateCode}
              style={{ flex: 2 }}
            >
              开始测试
            </Button>
          </div>
        </Space>
      </Modal>
    </div>
  )
}

export default HomePage