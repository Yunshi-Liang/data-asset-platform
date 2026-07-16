import { Descriptions, Drawer, Space, Steps, Tag, Typography } from 'antd'
import { applicationStepState } from '../../../mock/application'

function ApplicationProgressDrawer({ application, open, onClose }) {
  if (!application) return null
  const rejected = application.status === '已驳回'
  const passed = application.status === '已通过'
  const semanticState = rejected ? applicationStepState.rejected : passed ? applicationStepState.completed : applicationStepState.pending
  const step = (title, content, state) => ({ title, description: <Space><Tag color={state.color}>{state.label}</Tag><span>{content}</span></Space>, status: state.stepStatus })
  const steps = [
    step('提交申请', `${application.applicant} · ${application.submittedAt}`, applicationStepState.completed),
    step('部门负责人审批', '部门负责人 · 已处理', applicationStepState.completed),
    step('数据管理员审批', rejected ? `驳回原因：${application.opinion}` : passed ? `${application.applicant} · 已通过` : '等待数据管理员处理', semanticState),
    step('权限开通', passed ? '系统自动开通' : '等待处理', passed ? applicationStepState.completed : applicationStepState.pending),
    step('完成', passed ? '申请流程完成' : '等待处理', passed ? applicationStepState.completed : applicationStepState.pending),
  ]
  return <Drawer open={open} onClose={onClose} size={860} title="数据申请详情与进度"><Typography.Title level={4}>{application.productName}</Typography.Title><Tag color={semanticState.color}>{application.status}</Tag><Descriptions className="workbench-section" bordered column={2} items={[['申请编号',application.id],['申请人',application.applicant],['所属部门',application.department],['产品编号',application.productCode],['使用项目',application.project],['使用目的',application.purpose],['数据使用范围',application.scope || '限申请项目及所属部门使用'],['申请方式',application.method],['使用期限',application.period],['提交时间',application.submittedAt],['保密承诺',application.confidentiality]].map(([label,children],index) => ({ key:index,label,children,span:['使用目的','数据使用范围'].includes(label)?2:1 }))} /><Typography.Title className="workbench-section" level={5}>审批进度</Typography.Title><Steps orientation="vertical" items={steps} /></Drawer>
}

export default ApplicationProgressDrawer
