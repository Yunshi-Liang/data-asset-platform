import { EditOutlined, EyeOutlined, StopOutlined } from '@ant-design/icons'
import { Table, Tag } from 'antd'
import TableIconButton from '../../../components/TableIconButton'

const colors = { 草稿:'default', 审批中:'processing', 已通过:'success', 已驳回:'error', 已撤回:'default', 已过期:'warning' }

function MyApplications({ data, highlightId, onView, onWithdraw, onEdit }) {
  const actionColumns = (record) => {
    const processing = record.status === '审批中'
    const editable = ['已驳回', '已过期', '草稿', '已撤回'].includes(record.status)
    return <div className="table-icon-actions">
      <TableIconButton label="查看详情" icon={<EyeOutlined />} onClick={() => onView(record)} />
      <TableIconButton label="撤回申请" disabledReason={processing ? undefined : '仅审批中的申请可以撤回'} danger icon={<StopOutlined />} onClick={() => onWithdraw(record)} />
      <TableIconButton label="修改申请" disabledReason={editable ? undefined : '当前状态不可修改申请'} icon={<EditOutlined />} onClick={() => onEdit(record)} />
    </div>
  }
  const columns = [['申请编号','id'],['数据产品名称','productName'],['申请方式','method'],['使用项目','project'],['使用目的','purpose'],['提交时间','submittedAt'],['期望期限','period'],['当前节点','node']].map(([title,dataIndex]) => ({ title, dataIndex, width: dataIndex === 'productName' ? 220 : dataIndex === 'purpose' ? 220 : 130 }))
  columns.push({ title:'申请状态', dataIndex:'status', width:100, render:(value)=><Tag color={colors[value]}>{value}</Tag> }, { title:'操作', fixed:'right', width:106, render:(_,record)=>actionColumns(record) })
  return <Table rowKey="id" rowClassName={(record)=>record.id===highlightId?'application-row-highlight':''} size="middle" scroll={{x:1650}} columns={columns} dataSource={data} pagination={{pageSize:6}} />
}

export default MyApplications
