import { ApiOutlined, CloudServerOutlined, DatabaseOutlined, FileTextOutlined, FundProjectionScreenOutlined, GlobalOutlined } from '@ant-design/icons'
import { Card, Typography } from 'antd'
import { sourceTypeGroups } from '../../../mock/dataAccess'

const { Text } = Typography
const icons = { database: <DatabaseOutlined />, api: <ApiOutlined />, file: <FileTextOutlined />, gis: <GlobalOutlined />, design: <FundProjectionScreenOutlined />, realtime: <CloudServerOutlined /> }

function SourceTypeCards({ onSelect }) {
  return (
    <section className="access-section">
      <div className="access-section-heading"><div><h2>接入方式</h2><Text type="secondary">支持内部系统、外部接口与工程成果文件统一接入</Text></div></div>
      <div className="source-type-grid">
        {sourceTypeGroups.map((group) => (
          <Card key={group.key} hoverable className="source-type-card" onClick={() => onSelect(group.key)}>
            <div className="source-type-icon">{icons[group.icon]}</div>
            <div className="source-type-content"><Text strong>{group.title}</Text><Text type="secondary">{group.types.join(' · ')}</Text></div>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default SourceTypeCards
