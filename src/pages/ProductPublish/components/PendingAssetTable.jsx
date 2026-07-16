import { Button, Progress, Space, Table, Tag } from 'antd'
function PendingAssetTable({data,onStart,onView}){
 const columns=[{title:'资产名称',dataIndex:'name',width:240},{title:'所属目录',dataIndex:'catalogName',width:230},{title:'质量评分',dataIndex:'qualityScore',width:120,render:v=><Progress percent={v} size="small" status={v<80?'exception':'normal'}/>},{title:'安全等级',dataIndex:'securityLevel',width:100,render:v=><Tag color={v==='核心数据'?'red':v==='重要数据'?'orange':'blue'}>{v}</Tag>},{title:'健康度',dataIndex:'health',width:90,render:v=>`${v} 分`},{title:'负责人',dataIndex:'owner',width:90},{title:'更新时间',dataIndex:'updatedAt',width:150},{title:'状态',dataIndex:'listingStatus',width:100,render:v=><Tag color="processing">{v}</Tag>},{title:'操作',fixed:'right',width:150,render:(_,r)=><Space><Button type="link" onClick={()=>onStart(r)}>开始上架</Button><Button type="link" onClick={()=>onView(r)}>详情</Button></Space>}]
 return <Table rowKey="id" size="middle" scroll={{x:1400}} columns={columns} dataSource={data} pagination={{pageSize:5,showTotal:t=>`共 ${t} 项`}} />
}
export default PendingAssetTable
