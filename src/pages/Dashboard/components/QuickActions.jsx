import {
  ApiOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  ProductOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Button, Steps, Typography } from 'antd'
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
  workbench: UserOutlined,
}

function QuickActions() {
  const navigate = useNavigate()

  return (
    <SectionCard title="核心入口与建设链路" description="使用门户与工作台，或按顺序进入资产建设流程">
      <div className="core-action-grid">
        {quickActions.filter((action) => ['portal', 'workbench'].includes(action.key)).map((action) => {
          const Icon = actionIcons[action.icon]

          return (
            <button
              type="button"
              className={action.key === 'portal' ? 'quick-action is-primary' : 'quick-action'}
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
      <div className="construction-flow-title">数据资产建设流程</div>
      <Steps
        responsive={false}
        items={quickActions.filter((action) => ['access', 'governance', 'catalog', 'product'].includes(action.key)).map((action) => ({
          title: (
            <Button type="link" onClick={() => navigate(action.path)}>
              {action.title}
            </Button>
          ),
        }))}
      />
    </SectionCard>
  )
}

export default QuickActions
