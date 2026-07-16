import { Button, Progress, Space, Table, Tag } from 'antd'
import { assetStatusMeta, canAssetAction } from '../../../mock/assetCatalog'

function AssetTable({ data, onView, onPublish, onToggle, onCancelPublish, onRollback }) {
  const columns = [
    { title:'资产名称', dataIndex:'name', width:230, fixed:'left', render:(text,record)=><Button type="link" className="table-name" onClick={()=>onView(record)}>{text}</Button> },
    { title:'资产编码', dataIndex:'code', width:150 }, { title:'所属目录', dataIndex:'catalogName', width:180 },
    { title:'数据形态', dataIndex:'dataType', width:110 }, { title:'来源系统', dataIndex:'sourceSystem', width:180 },
    { title:'地区', dataIndex:'region', width:100 }, { title:'数据规模', dataIndex:'size', width:110 }, { title:'更新频率', dataIndex:'frequency', width:90 },
    { title:'质量评分', dataIndex:'qualityScore', width:120, render:(value)=><Progress percent={value} size="small" status={value<80?'exception':'normal'} /> },
    { title:'安全等级', dataIndex:'securityLevel', width:95, render:(v)=><Tag color={v==='核心数据'?'red':v==='重要数据'?'orange':'blue'}>{v}</Tag> },
    { title:'状态', dataIndex:'status', width:110, render:(v)=><Tag color={assetStatusMeta[v]?.color || 'default'}>{v}</Tag> },
    { title:'负责人', dataIndex:'owner', width:80 }, { title:'最近更新', dataIndex:'updatedAt', width:150 },
    { title:'操作', key:'action', fixed:'right', width:250, render:(_,asset)=><Space size={0} wrap><Button type="link" onClick={()=>onView(asset)}>查看/编辑详情</Button>{canAssetAction(asset.status,'publish')&&<Button type="link" onClick={()=>onPublish(asset)}>申请上架</Button>}{canAssetAction(asset.status,'disable')&&<Button type="link" danger onClick={()=>onToggle(asset)}>停用</Button>}{canAssetAction(asset.status,'enable')&&<Button type="link" onClick={()=>onToggle(asset)}>启用</Button>}{canAssetAction(asset.status,'cancelPublish')&&<Button type="link" danger onClick={()=>onCancelPublish(asset)}>取消申请</Button>}{canAssetAction(asset.status,'rollback')&&<Button type="link" danger onClick={()=>onRollback(asset)}>回退数据治理</Button>}</Space> },
  ]
  return <Table rowKey="id" size="middle" scroll={{x:1930}} columns={columns} dataSource={data} pagination={{pageSize:8,showTotal:(total)=>`共 ${total} 条资产`}} />
}
export default AssetTable
