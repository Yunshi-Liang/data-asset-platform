import { AuditOutlined, EyeOutlined } from '@ant-design/icons'
import { Table, Tag } from 'antd'
import TableIconButton from '../../../components/TableIconButton'

const colors = { 待审批:'processing', 已通过:'success', 已驳回:'error', 已转交:'default', '待补充材料':'warning' }
function PendingApprovals({ data, onApprove }) {
  const sorted = [...data].sort((a,b)=>(a.status==='待审批'?0:1)-(b.status==='待审批'?0:1))
  const columns = [['申请编号','id'],['申请人','applicant'],['所属部门','department'],['数据产品','productName'],['安全等级','securityLevel'],['申请方式','method'],['使用项目','project'],['使用期限','period'],['提交时间','submittedAt'],['等待时长','waiting'],['风险提示','risk']].map(([title,dataIndex])=>({title,dataIndex,width:dataIndex==='productName'?220:120,render:dataIndex==='risk'?(value)=><Tag color={value==='无明显风险'?'success':'warning'}>{value}</Tag>:dataIndex==='securityLevel'?(value)=><Tag color={value==='重要数据'?'orange':'blue'}>{value}</Tag>:undefined}))
  columns.push({title:'状态',dataIndex:'status',render:(value)=><Tag color={colors[value]}>{value}</Tag>},{title:'操作',fixed:'right',width:54,render:(_,record)=><div className="table-icon-actions"><TableIconButton label={record.status==='待审批'?'审批':'查看'} icon={record.status==='待审批'?<AuditOutlined />:<EyeOutlined />} onClick={()=>onApprove(record)} /></div>})
  return <Table rowKey="id" size="middle" scroll={{x:1560}} columns={columns} dataSource={sorted} pagination={{pageSize:6}} />
}
export default PendingApprovals
