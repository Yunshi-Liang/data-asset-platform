import {
  ApiOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  FileProtectOutlined,
  ProductOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { Statistic, Typography } from 'antd'
import { statistics } from '../../../mock/dashboard'

const { Text } = Typography

const statisticIcons = {
  database: DatabaseOutlined,
  assets: FileProtectOutlined,
  product: ProductOutlined,
  api: ApiOutlined,
  quality: SafetyCertificateOutlined,
  visits: BarChartOutlined,
}

function StatisticsCards() {
  return (
    <section className="statistics-grid" aria-label="核心统计指标">
      {statistics.map((item) => {
        const Icon = statisticIcons[item.icon]

        return (
          <div key={item.key} className="statistic-card">
            <div className="statistic-topline">
              <span
                className="statistic-icon"
                style={{ color: item.color, background: item.background }}
              >
                <Icon />
              </span>
              <Text className="statistic-title">{item.title}</Text>
            </div>
            <Statistic value={item.value} suffix={item.suffix} groupSeparator="," />
            <Text className="statistic-description">{item.description}</Text>
          </div>
        )
      })}
    </section>
  )
}

export default StatisticsCards
