import { CheckCircleOutlined, DatabaseOutlined, ExclamationCircleOutlined, FieldTimeOutlined, HddOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'
import { accessOverview } from '../../../mock/dataAccess'

const icons = { sources: <DatabaseOutlined />, normal: <CheckCircleOutlined />, error: <ExclamationCircleOutlined />, tasks: <FieldTimeOutlined />, volume: <HddOutlined /> }

function AccessOverview() {
  return (
    <Row gutter={[14, 14]} className="access-overview">
      {accessOverview.map((item) => (
        <Col flex="1 1 180px" key={item.key}>
          <Card className={`access-stat-card tone-${item.tone}`}>
            <Statistic title={item.label} value={item.value} precision={item.precision} suffix={item.suffix} prefix={icons[item.key]} />
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default AccessOverview
