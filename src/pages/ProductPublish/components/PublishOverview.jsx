import { Card, Col, Row, Statistic } from 'antd'

function PublishOverview({ pendingCount, listedCount }) {
  const items = [
    { key: 'pending', label: '待上架资产', value: pendingCount, color: '#1677ff' },
    { key: 'listed', label: '已上架产品', value: listedCount, color: '#52c41a' },
  ]
  return <Row gutter={14}>{items.map((item) => <Col span={12} key={item.key}><Card className="publish-stat"><Statistic title={item.label} value={item.value} valueStyle={{ color: item.color }} /></Card></Col>)}</Row>
}

export default PublishOverview
