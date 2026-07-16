import { Button, Empty, Progress, Space, Table, Tag } from 'antd'
function FavoriteProducts({data,onView,onApply,onRemove}){
 if(!data.length)return <Empty description="暂无收藏的数据产品"/>
 const columns=[{title:'产品名称',dataIndex:'name',width:240},{title:'产品编号',dataIndex:'code',width:190},{title:'业务领域',dataIndex:'category'},{title:'数据形态',dataIndex:'dataType'},{title:'所属地区',render:(_,r)=>`${r.province} · ${r.city}`},{title:'质量评分',dataIndex:'qualityScore',width:120,render:v=><Progress percent={v} size="small"/>},{title:'安全等级',dataIndex:'securityLevel',render:v=><Tag color={v==='重要数据'?'orange':'blue'}>{v}</Tag>},{title:'更新时间',dataIndex:'updatedAt',width:150},{title:'收藏时间',dataIndex:'favoriteAt',width:150},{title:'状态',dataIndex:'status',render:v=><Tag color="success">{v}</Tag>},{title:'操作',fixed:'right',width:210,render:(_,r)=><Space><Button type="link" onClick={()=>onView(r)}>查看详情</Button><Button type="link" onClick={()=>onApply(r)}>申请使用</Button><Button type="link" danger onClick={()=>onRemove(r)}>取消收藏</Button></Space>}]
 return <Table rowKey="id" size="middle" scroll={{x:1700}} columns={columns} dataSource={data} pagination={{pageSize:6}}/>
}
export default FavoriteProducts
