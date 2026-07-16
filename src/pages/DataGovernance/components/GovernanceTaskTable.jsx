import { Button, Progress, Space, Table, Tag } from 'antd'

const statusMeta = { pending: ['default', '待治理'], running: ['processing', '治理中'], confirming: ['warning', '待确认'], completed: ['success', '已完成'], failed: ['error', '失败'] }
const submissionMeta = { unsubmitted: ['default', '未提交'], submitted: ['success', '已提交'], failed: ['error', '提交失败'] }

function GovernanceTaskTable({ tasks, onOpen, onSubmitCatalog, onViewAsset }) {
  const columns = [
    { title: '任务名称', dataIndex: 'name', width: 220, fixed: 'left' },
    { title: '数据对象', dataIndex: 'object', width: 180 }, { title: '来源数据源', dataIndex: 'source', width: 210 },
    { title: '业务领域', dataIndex: 'domain', width: 120 }, { title: '地区', dataIndex: 'region', width: 110 },
    { title: '数据规模', dataIndex: 'volume', width: 160 },
    { title: '当前质量', dataIndex: 'score', width: 130, render: (value) => <Progress percent={value} size="small" format={(score) => `${score}%`} /> },
    { title: '治理状态', dataIndex: 'status', width: 100, render: (value) => <Tag color={statusMeta[value][0]}>{statusMeta[value][1]}</Tag> },
    { title: '目录提交状态', dataIndex: 'catalogSubmission', width: 120, render: (value) => <Tag color={submissionMeta[value][0]}>{submissionMeta[value][1]}</Tag> },
    { title: '负责人', dataIndex: 'owner', width: 80 }, { title: '更新时间', dataIndex: 'updateTime', width: 150 },
    { title: '操作', key: 'action', width: 210, fixed: 'right', render: (_, record) => <Space size={0} wrap><Button type="link" onClick={() => onOpen(record)}>{record.status === 'pending' || record.status === 'failed' ? '开始治理' : record.status === 'completed' ? '查看结果' : '继续处理'}</Button>{record.status === 'completed' && record.catalogSubmission === 'unsubmitted' && <Button type="link" onClick={() => onSubmitCatalog(record)}>提交资产目录</Button>}{record.catalogSubmission === 'failed' && <Button type="link" onClick={() => onSubmitCatalog(record)}>重新提交</Button>}{record.catalogSubmission === 'submitted' && <Button type="link" onClick={() => onViewAsset(record)}>查看资产</Button>}</Space> },
  ]
  return <Table rowKey="id" columns={columns} dataSource={tasks} scroll={{ x: 1780 }} pagination={false} sticky />
}

export default GovernanceTaskTable
