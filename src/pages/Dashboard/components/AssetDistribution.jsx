import { Typography } from 'antd'
import { assetDistribution } from '../../../mock/dashboard'
import SectionCard from './SectionCard'

const { Text } = Typography

function AssetDistribution() {
  return (
    <SectionCard title="数据资产分布" description="按业务域统计已编目资产数量">
      <div className="distribution-list">
        {assetDistribution.map((item) => (
          <div className="distribution-item" key={item.name}>
            <div className="distribution-label">
              <Text className="distribution-name">{item.name}</Text>
              <Text className="distribution-examples">{item.examples}</Text>
            </div>
            <div className="distribution-track">
              <span
                className="distribution-bar"
                style={{ width: `${item.percent}%` }}
              />
            </div>
            <Text className="distribution-value">{item.value}</Text>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export default AssetDistribution
