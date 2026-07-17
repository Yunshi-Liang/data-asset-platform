import { EyeOutlined, PlayCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { Progress, Table, Tag } from 'antd'
import TableIconButton from '../../../components/TableIconButton'

const statusMeta = { pending: ['default', '待治理'], running: ['processing', '治理中'], confirming: ['warning', '待确认'], completed: ['success', '已完成'], failed: ['error', '失败'] }
const submissionMeta = { unsubmitted: ['default', '未提交'], submitted: ['success', '已提交'], failed: ['error', '提交失败'], returned: ['error', '被退回'] }

function GovernanceTaskTable({ tasks, onOpen, onSubmitCatalog }) {
  const columns = [
    { title: '任务名称', dataIndex: 'name', width: 220, fixed: 'left' }, { title: '数据对象', dataIndex: 'object', width: 180 },
    { title: '来源数据源', dataIndex: 'source', width: 210 }, { title: '业务领域', dataIndex: 'domain', width: 120 }, { title: '地区', dataIndex: 'region', width: 110 },
    { title: '数据规模', dataIndex: 'volume', width: 160 }, { title: '当前质量', dataIndex: 'score', width: 130, render: (value) => <Progress percent={value} size="small" format={(score) => `${score}%`} /> },
    { title: '治理状态', dataIndex: 'status', width: 100, render: (value) => <Tag color={statusMeta[value][0]}>{statusMeta[value][1]}</Tag> },
    { title: '目录提交状态', dataIndex: 'catalogSubmission', width: 120, render: (value) => <Tag color={submissionMeta[value][0]}>{submissionMeta[value][1]}</Tag> },
    { title: '负责人', dataIndex: 'owner', width: 80 }, { title: '更新时间', dataIndex: 'updateTime', width: 150 },
    { title: '操作', key: 'action', width: 150, fixed: 'right', render: (_, record) => {
      const editable = ['pending', 'running', 'confirming', 'failed'].includes(record.status) || record.catalogSubmission === 'returned'
      const completed = record.status === 'completed'
      const submitReady = completed && ['unsubmitted', 'failed'].includes(record.catalogSubmission)
      const governanceLabel = record.status === 'pending' ? '开始治理' : record.status === 'failed' || record.catalogSubmission === 'returned' ? '重新治理' : record.status === 'completed' ? '治理已完成' : '继续治理'
      return <div className="table-icon-actions">
        <TableIconButton label={governanceLabel} disabledReason={editable ? undefined : '治理已完成'} icon={<PlayCircleOutlined />} onClick={() => onOpen(record)} />
        <TableIconButton label="查看结果" disabledReason={completed ? undefined : '治理尚未完成，暂无结果'} icon={<EyeOutlined />} onClick={() => onOpen(record)} />
        <TableIconButton label="提交资产目录" disabledReason={submitReady ? undefined : record.catalogSubmission === 'submitted' ? '已提交资产目录' : '当前任务尚未完成'} icon={<UploadOutlined />} onClick={() => onSubmitCatalog(record)} />
      </div>
    } },
  ]
  return <Table rowKey="id" columns={columns} dataSource={tasks} scroll={{ x: 1760 }} pagination={false} sticky />
}

export default GovernanceTaskTable
