import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, FieldTimeOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { Card, Statistic } from 'antd'
import { governanceOverview } from '../../../mock/dataGovernance'

const icons = { pending: <ClockCircleOutlined />, running: <FieldTimeOutlined />, completed: <CheckCircleOutlined />, issues: <ExclamationCircleOutlined />, score: <SafetyCertificateOutlined /> }

function GovernanceOverview() {
  return <div className="governance-overview">{governanceOverview.map((item) => <Card key={item.key} className={`governance-stat ${item.tone}`}><Statistic title={item.label} value={item.value} suffix={item.suffix} precision={item.precision} prefix={icons[item.key]} /></Card>)}</div>
}

export default GovernanceOverview
