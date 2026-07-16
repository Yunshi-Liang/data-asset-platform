import { Button, Progress, Space, Table, Tag } from 'antd'

const statusColors = { 草稿:'default', 待确认:'processing', 已发布:'success', 已停用:'default', 治理异常:'error' }
function AssetTable({ data, onView, onEdit, onPublish, onToggle }) {
  const columns = [
    { title:'资产名称', dataIndex:'name', width:230, fixed:'left', render:(text,record)=><Button type="link" className="table-name" onClick={()=>onView(record)}>{text}</Button> },
    { title:'资产编码', dataIndex:'code', width:150 }, { title:'所属目录', dataIndex:'catalogName', width:150 },
    { title:'数据形态', dataIndex:'dataType', width:110 }, { title:'来源系统', dataIndex:'sourceSystem', width:180 },
    { title:'地区', dataIndex:'region', width:100 }, { title:'数据规模', dataIndex:'size', width:100 }, { title:'更新频率', dataIndex:'frequency', width:90 },
    { title:'质量评分', dataIndex:'qualityScore', width:120, render:(value)=><Progress percent={value} size="small" status={value<80?'exception':'normal'} /> },
    { title:'安全等级', dataIndex:'securityLevel', width:95, render:(v)=><Tag color={v==='核心数据'?'red':v==='重要数据'?'orange':'blue'}>{v}</Tag> },
    { title:'状态', dataIndex:'status', width:90, render:(v)=><Tag color={statusColors[v]}>{v}</Tag> },
    { title:'负责人', dataIndex:'owner', width:80 }, { title:'最近更新', dataIndex:'updatedAt', width:150 },
    { title:'操作', key:'action', fixed:'right', width:220, render:(_,r)=><Space size={2} wrap><Button type="link" onClick={()=>onView(r)}>查看画像</Button><Button type="link" onClick={()=>onEdit(r)}>编辑</Button><Button type="link" onClick={()=>onPublish(r)}>申请上架</Button><Button type="link" danger={r.status!=='已停用'} onClick={()=>onToggle(r)}>{r.status==='已停用'?'启用':'停用'}</Button></Space> },
  ]
  return <Table rowKey="id" size="middle" scroll={{x:1900}} columns={columns} dataSource={data} pagination={{pageSize:8,showTotal:(total)=>`共 ${total} 条资产`}} />
}
export default AssetTable
