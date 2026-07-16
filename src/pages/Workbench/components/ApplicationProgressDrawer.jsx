import { Descriptions, Drawer, Steps, Tag, Typography } from 'antd'
import { currentUser } from '../../../mock/currentUser'
const colors={审批中:'processing',已通过:'success',已驳回:'error',已撤回:'default',已过期:'warning',草稿:'default'}
function ApplicationProgressDrawer({application,open,onClose}){
 if(!application)return null
 const rejected=application.status==='已驳回',passed=application.status==='已通过'
 const steps=[{title:'提交申请',content:`${currentUser.name} · ${application.submittedAt}`,status:'finish'},{title:'部门负责人审批',content:'部门负责人 · 已通过',status:'finish'},{title:'数据管理员审批',content:rejected?`已驳回：${application.opinion}`:passed?`${currentUser.name} · 已通过`:`${currentUser.name} · 审批中`,status:rejected?'error':passed?'finish':'process'},{title:'权限开通',content:passed?'系统自动开通 · 已完成':'等待处理',status:passed?'finish':'wait'},{title:'完成',content:passed?'申请流程完成':'等待处理',status:passed?'finish':'wait'}]
 return <Drawer open={open} onClose={onClose} size={860} title="数据申请详情与进度"><Typography.Title level={4}>{application.productName}</Typography.Title><Tag color={colors[application.status]}>{application.status}</Tag><Descriptions className="workbench-section" bordered column={2} items={[['申请编号',application.id],['申请人',currentUser.name],['所属部门',application.department],['产品编号',application.productCode],['使用项目',application.project],['使用目的',application.purpose],['申请方式',application.method],['使用期限',application.period],['提交时间',application.submittedAt],['保密承诺',application.confidentiality]].map(([label,children],i)=>({key:i,label,children}))}/><Typography.Title className="workbench-section" level={5}>审批进度</Typography.Title><Steps orientation="vertical" items={steps}/></Drawer>
}
export default ApplicationProgressDrawer
