import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import HomePage from './pages/Home'
import TestPage from './pages/Test'
import ReportPage from './pages/Report'
import './App.css'

const { Content } = Layout

function App() {
  return (
    <Router>
      <Layout className="app-layout">
        <Content>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/report" element={<ReportPage />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  )
}

export default App