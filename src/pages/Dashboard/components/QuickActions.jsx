import {
  ApiOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  ProductOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { quickActions } from '../../../mock/dashboard'
import SectionCard from './SectionCard'

const { Text } = Typography

const actionIcons = {
  api: ApiOutlined,
  governance: SafetyCertificateOutlined,
  catalog: DatabaseOutlined,
  product: ProductOutlined,
  portal: AppstoreOutlined,
}

function QuickActions() {
  const navigate = useNavigate()

  return (
    <SectionCard title="快捷入口" description="快速进入常用数据资产管理功能">
      <div className="quick-actions-grid">
        {quickActions.map((action) => {
          const Icon = actionIcons[action.icon]

          return (
            <button
              type="button"
              className="quick-action"
              key={action.key}
              onClick={() => navigate(action.path)}
            >
              <span className="quick-action-icon">
                <Icon />
              </span>
              <Text>{action.title}</Text>
            </button>
          )
        })}
      </div>
    </SectionCard>
  )
}

export default QuickActions
