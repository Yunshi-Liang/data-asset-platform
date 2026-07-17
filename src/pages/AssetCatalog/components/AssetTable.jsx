import { CloseCircleOutlined, EditOutlined, RollbackOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Progress, Table, Tag } from 'antd'
import TableIconButton from '../../../components/TableIconButton'
import { assetStatusMeta, canAssetAction } from '../../../mock/assetCatalog'

function reason(asset, action) {
  if (canAssetAction(asset.status, action)) return undefined
  const labels = { publish: '当前状态不可申请上架', cancelPublish: '当前资产没有待取消的上架申请', rollback: '仅治理异常资产可以退回' }
  return labels[action]
}

function AssetTable({ data, onView, onPublish, onCancelPublish, onRollback }) {
  const columns = [
    { title:'资产名称', dataIndex:'name', width:230, fixed:'left', render:(text,record)=><Button type="link" className="table-name" onClick={()=>onView(record)}>{text}</Button> },
    { title:'资产编码', dataIndex:'code', width:150 }, { title:'所属目录', dataIndex:'catalogName', width:180 }, { title:'数据形态', dataIndex:'dataType', width:110 },
    { title:'来源系统', dataIndex:'sourceSystem', width:180 }, { title:'地区', dataIndex:'region', width:100 }, { title:'数据规模', dataIndex:'size', width:110 },
    { title:'更新频率', dataIndex:'frequency', width:90 }, { title:'质量评分', dataIndex:'qualityScore', width:120, render:(value)=><Progress percent={value} size="small" status={value<80?'exception':'normal'} /> },
    { title:'安全等级', dataIndex:'securityLevel', width:95, render:(value)=><Tag color={value==='核心数据'?'red':value==='重要数据'?'orange':'blue'}>{value}</Tag> },
    { title:'状态', dataIndex:'status', width:110, render:(value)=><Tag color={assetStatusMeta[value]?.color || 'default'}>{value}</Tag> }, { title:'负责人', dataIndex:'owner', width:80 }, { title:'最近更新', dataIndex:'updatedAt', width:150 },
    { title:'操作', key:'action', fixed:'right', width:150, render:(_,asset)=><div className="table-icon-actions">
      <TableIconButton label="查看/编辑" icon={<EditOutlined />} onClick={()=>onView(asset)} />
      <TableIconButton label="申请上架" disabledReason={reason(asset,'publish')} icon={<UploadOutlined />} onClick={()=>onPublish(asset)} />
      <TableIconButton label="取消申请" disabledReason={reason(asset,'cancelPublish')} danger icon={<CloseCircleOutlined />} onClick={()=>onCancelPublish(asset)} />
      <TableIconButton label="退回" disabledReason={reason(asset,'rollback')} danger icon={<RollbackOutlined />} onClick={()=>onRollback(asset)} />
    </div> },
  ]
  return <Table rowKey="id" size="middle" sticky scroll={{x:1900}} columns={columns} dataSource={data} pagination={false} />
}
export default AssetTable
