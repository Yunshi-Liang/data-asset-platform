import { ClockCircleOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import { useLocation } from 'react-router-dom'
import { getRouteMeta } from '../router/config'

const { Paragraph, Title } = Typography

function PagePlaceholder() {
  const { pathname } = useLocation()
  const { title, description } = getRouteMeta(pathname)

  return (
    <section className="page-panel">
      <div className="page-heading">
        <Title level={2}>{title}</Title>
        <Paragraph>{description}</Paragraph>
      </div>
      <div className="placeholder-area">
        <ClockCircleOutlined className="placeholder-icon" />
        <span>该功能将在后续任务中开发</span>
      </div>
    </section>
  )
}

export default PagePlaceholder
