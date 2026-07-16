import { CheckOutlined, ClockCircleOutlined, CloseOutlined } from '@ant-design/icons'
import { Descriptions, Drawer, Space, Tag, Typography } from 'antd'
import { applicationStepState } from '../../../mock/application'

const iconByState = { completed: <CheckOutlined />, rejected: <CloseOutlined />, pending: <ClockCircleOutlined /> }

function ProgressFlow({ items }) {
  return <div className="application-progress-flow">{items.map((item, index) => <div className={`application-progress-node is-${item.state}`} key={item.title}>
    <div className="application-progress-rail"><span className="application-progress-icon">{iconByState[item.state]}</span>{index < items.length - 1 && <span className="application-progress-line" />}</div>
    <div className="application-progress-content"><Typography.Text strong>{item.title}</Typography.Text><Space size={8} wrap><Tag color={applicationStepState[item.state].color}>{applicationStepState[item.state].label}</Tag><Typography.Text type="secondary">{item.content}</Typography.Text></Space></div>
  </div>)}</div>
}

function ApplicationProgressDrawer({ application, open, onClose }) {
  if (!application) return null
  const rejected = application.status === '已驳回'
  const passed = application.status === '已通过'
  const currentState = rejected ? 'rejected' : passed ? 'completed' : 'pending'
  const steps = [
    { title:'提交申请', content:`${application.applicant} · ${application.submittedAt}`, state:'completed' },
    { title:'部门负责人审批', content:'部门负责人 · 已处理', state:'completed' },
    { title:'数据管理员审批', content:rejected?`驳回原因：${application.opinion}`:passed?`${application.applicant} · 已通过`:'等待数据管理员处理', state:currentState },
    { title:'权限开通', content:passed?'系统自动开通':'等待处理', state:passed?'completed':'pending' },
    { title:'完成', content:passed?'申请流程完成':'等待处理', state:passed?'completed':'pending' },
  ]
  const semanticState = applicationStepState[currentState]
  return <Drawer open={open} onClose={onClose} size={860} title="数据申请详情与进度"><Typography.Title level={4}>{application.productName}</Typography.Title><Tag color={semanticState.color}>{application.status}</Tag><Descriptions className="workbench-section" bordered column={2} items={[['申请编号',application.id],['申请人',application.applicant],['所属部门',application.department],['产品编号',application.productCode],['使用项目',application.project],['使用目的',application.purpose],['数据使用范围',application.scope || '限申请项目及所属部门使用'],['申请方式',application.method],['使用期限',application.period],['提交时间',application.submittedAt],['保密承诺',application.confidentiality]].map(([label,children],index) => ({ key:index,label,children,span:['使用目的','数据使用范围'].includes(label)?2:1 }))} /><Typography.Title className="workbench-section" level={5}>审批进度</Typography.Title><ProgressFlow items={steps} /></Drawer>
}

export default ApplicationProgressDrawer
