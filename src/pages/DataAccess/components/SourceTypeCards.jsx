import { ApiOutlined, CloudServerOutlined, DatabaseOutlined, FileTextOutlined, FundProjectionScreenOutlined, GlobalOutlined } from '@ant-design/icons'
import { Card, Typography } from 'antd'
import { accessModes, sourceTypeGroups } from '../../../mock/dataAccess'

const { Text } = Typography
const icons = { database: <DatabaseOutlined />, api: <ApiOutlined />, file: <FileTextOutlined />, gis: <GlobalOutlined />, design: <FundProjectionScreenOutlined />, realtime: <CloudServerOutlined /> }

function SourceTypeCards({ onSelect }) {
  return (
    <section className="access-section">
      <div className="access-section-heading"><div><h2>接入模式</h2><Text type="secondary">按接入模式选择数据源类型，再配置具体数据格式或连接协议</Text></div></div>
      <div className="access-mode-groups">
        {accessModes.map((mode) => {
          const sourceTypes = sourceTypeGroups.filter((item) => item.accessMode === mode.key)
          return <div className="access-mode-group" key={mode.key}>
            <div className="access-mode-heading"><Text strong>{mode.title}</Text><Text type="secondary">{mode.description}</Text></div>
            <div className={`source-type-grid source-type-grid-${sourceTypes.length}`}>
              {sourceTypes.map((group) => (
                <Card key={group.key} hoverable className="source-type-card" onClick={() => onSelect(group.key)}>
                  <div className="source-type-icon">{icons[group.icon]}</div>
                  <div className="source-type-content"><Text strong>{group.title}</Text><Text type="secondary">{group.types.join(' · ')}</Text></div>
                </Card>
              ))}
            </div>
          </div>
        })}
      </div>
    </section>
  )
}

export default SourceTypeCards
