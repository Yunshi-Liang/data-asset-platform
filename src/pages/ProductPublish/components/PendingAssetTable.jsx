import { EyeOutlined, RocketOutlined } from '@ant-design/icons'
import { Progress, Table, Tag } from 'antd'
import TableIconButton from '../../../components/TableIconButton'

function PendingAssetTable({ data, onStart, onView }) {
  const columns = [
    {title:'资产名称',dataIndex:'name',width:240},{title:'所属目录',dataIndex:'catalogName',width:230},
    {title:'质量评分',dataIndex:'qualityScore',width:120,render:(value)=><Progress percent={value} size="small" status={value<80?'exception':'normal'}/>},
    {title:'安全等级',dataIndex:'securityLevel',width:100,render:(value)=><Tag color={value==='核心数据'?'red':value==='重要数据'?'orange':'blue'}>{value}</Tag>},
    {title:'健康度',dataIndex:'health',width:90,render:(value)=>`${value} 分`},{title:'负责人',dataIndex:'owner',width:90},{title:'更新时间',dataIndex:'updatedAt',width:150},
    {title:'状态',dataIndex:'listingStatus',width:100,render:(value)=><Tag color="processing">{value}</Tag>},
    {title:'操作',fixed:'right',width:86,render:(_,record)=><div className="table-icon-actions"><TableIconButton label="开始上架" icon={<RocketOutlined />} onClick={()=>onStart(record)} /><TableIconButton label="详情" icon={<EyeOutlined />} onClick={()=>onView(record)} /></div>},
  ]
  return <Table rowKey="id" size="middle" scroll={{x:1330}} columns={columns} dataSource={data} pagination={{pageSize:5,showTotal:(total)=>`共 ${total} 项`}} />
}
export default PendingAssetTable
