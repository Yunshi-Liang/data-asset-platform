import { Button, Space, Table, Tag } from 'antd'
const colors={草稿:'default',审批中:'processing',已通过:'success',已驳回:'error',已撤回:'default',已过期:'warning'}
function MyApplications({data,onView,onWithdraw,onReapply,onAccess}){
 const actions=r=><Space size={2}><Button type="link" onClick={()=>onView(r)}>{r.status==='审批中'?'查看进度':'查看详情'}</Button>{r.status==='审批中'&&<Button type="link" danger onClick={()=>onWithdraw(r)}>撤回申请</Button>}{['已驳回','已过期','已撤回','草稿'].includes(r.status)&&<Button type="link" onClick={()=>onReapply(r)}>{r.status==='已驳回'?'修改后重新提交':'重新申请'}</Button>}{r.status==='已通过'&&<Button type="link" onClick={()=>onAccess(r)}>{r.method==='API 调用'?'查看 API 凭证':r.method==='在线查看'?'在线查看':'下载数据'}</Button>}</Space>
 const columns=[['申请编号','id'],['数据产品名称','productName'],['申请方式','method'],['使用项目','project'],['使用目的','purpose'],['提交时间','submittedAt'],['期望期限','period'],['当前节点','node']].map(([title,dataIndex])=>({title,dataIndex,width:dataIndex==='productName'?220:dataIndex==='purpose'?220:130}));columns.push({title:'申请状态',dataIndex:'status',width:100,render:v=><Tag color={colors[v]}>{v}</Tag>},{title:'操作',fixed:'right',width:240,render:(_,r)=>actions(r)})
 return <Table rowKey="id" size="middle" scroll={{x:1700}} columns={columns} dataSource={data} pagination={{pageSize:6}}/>
}
export default MyApplications
