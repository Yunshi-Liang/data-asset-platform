import { Card, Col, Row, Statistic } from 'antd'
import { publishOverview } from '../../../mock/productPublish'
function PublishOverview(){return <Row gutter={14}>{publishOverview.map(item=><Col span={6} key={item.key}><Card className="publish-stat"><Statistic title={item.label} value={item.value} valueStyle={{color:item.color}} /></Card></Col>)}</Row>}
export default PublishOverview
