import {
  ApiOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  ProductOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
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
  workbench: UserOutlined,
}

function QuickAction({ action, className = '' }) {
  const navigate = useNavigate()
  const Icon = actionIcons[action.icon]
  return (
    <button type="button" className={`quick-action ${className}`} onClick={() => navigate(action.path)}>
      <span className="quick-action-icon"><Icon /></span>
      <Text>{action.title}</Text>
    </button>
  )
}

function QuickActions() {
  const navigate = useNavigate()
  const coreActions = quickActions.filter(({ key }) => ['portal', 'workbench'].includes(key))
  const flowActions = quickActions.filter(({ key }) => ['access', 'governance', 'catalog', 'product'].includes(key))

  return (
    <SectionCard title="核心入口与建设链路" description="使用门户与工作台，或进入数据资产建设流程">
      <div className="core-action-grid">
        {coreActions.map((action) => <QuickAction key={action.key} action={action} />)}
      </div>
      <div className="construction-flow-title">数据资产建设流程</div>
      <div className="construction-flow-grid">
        {flowActions.map((action, index) => {
          const Icon = actionIcons[action.icon]
          return (
            <button type="button" className={`construction-flow-step step-${index + 1}`} key={action.key} onClick={() => navigate(action.path)}>
              <span className="flow-step-number">{index + 1}</span>
              <span className="flow-step-icon"><Icon /></span>
              <Text>{action.title}</Text>
            </button>
          )
        })}
      </div>
    </SectionCard>
  )
}

export default QuickActions
