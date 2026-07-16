import { CheckCircleFilled } from '@ant-design/icons'
import { Timeline, Typography } from 'antd'
import { latestNews } from '../../../mock/dashboard'
import SectionCard from './SectionCard'

const { Text } = Typography

function LatestNews() {
  const timelineItems = latestNews.map((item) => ({
    icon: <CheckCircleFilled style={{ color: item.color }} />,
    content: (
      <div className="news-item">
        <Text className="news-date">{item.date}</Text>
        <Text strong className="news-title">
          {item.title}
        </Text>
        <Text className="news-description">{item.description}</Text>
      </div>
    ),
  }))

  return (
    <SectionCard title="最新动态" description="平台近期数据运营动态">
      <Timeline className="news-timeline" items={timelineItems} />
    </SectionCard>
  )
}

export default LatestNews
