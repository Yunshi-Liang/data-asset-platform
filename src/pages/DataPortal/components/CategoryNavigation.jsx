import {
  BankOutlined,
  BookOutlined,
  CompassOutlined,
  DeploymentUnitOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import { Typography } from 'antd'
import { categoryOptions } from '../../../mock/portalData'

const { Text } = Typography

const categoryIcons = {
  技经数据: BankOutlined,
  勘测数据: CompassOutlined,
  电气设计数据: DeploymentUnitOutlined,
  工程数据: ToolOutlined,
  标准知识库: BookOutlined,
}

function CategoryNavigation({ value, productCounts, onChange }) {
  return (
    <section className="category-navigation" aria-label="业务分类快捷筛选">
      {categoryOptions.map((category) => {
        const Icon = categoryIcons[category.value]
        const active = value === category.value

        return (
          <button
            type="button"
            className={`category-entry${active ? ' is-active' : ''}`}
            key={category.value}
            onClick={() => onChange(category.value)}
          >
            <span className="category-entry-icon">
              <Icon />
            </span>
            <span className="category-entry-content">
              <Text strong>{category.value}</Text>
              <Text>{category.description}</Text>
            </span>
            <span className="category-count">{productCounts[category.value] || 0}</span>
          </button>
        )
      })}
    </section>
  )
}

export default CategoryNavigation
