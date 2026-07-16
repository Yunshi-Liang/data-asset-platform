import AssetDistribution from './components/AssetDistribution'
import HotAssets from './components/HotAssets'
import LatestNews from './components/LatestNews'
import QuickActions from './components/QuickActions'
import StatisticsCards from './components/StatisticsCards'
import './dashboard.css'

function Dashboard() {
  return (
    <div className="dashboard-page">
      <Card className="dashboard-summary-card">
        <div className="dashboard-title-block">
          <Typography.Title level={3}>数据资产概览</Typography.Title>
          <Typography.Text type="secondary">
            统一展示平台数据资产规模、运营情况及核心业务入口。
          </Typography.Text>
        </div>
        <StatisticsCards />
      </Card>

      <div className="dashboard-grid dashboard-overview-grid">
        <AssetDistribution />
        <LatestNews />
      </div>

      <div className="dashboard-grid dashboard-business-grid">
        <HotAssets />
        <QuickActions />
      </div>
    </div>
  )
}

export default Dashboard
import { Card, Typography } from 'antd'
