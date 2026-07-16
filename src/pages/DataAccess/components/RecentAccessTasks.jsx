import { FileSearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { Card, Progress, Table, Tag, Typography } from 'antd'
import TableIconButton from '../../../components/TableIconButton'

const statusMeta = { success: ['success', '成功'], running: ['processing', '执行中'], partial: ['warning', '部分成功'], failed: ['error', '失败'], cancelled: ['default', '已取消'] }

function RecentAccessTasks({ tasks, retryingIds, onDetail, onRetry }) {
  const columns = [
    { title: '任务编号', dataIndex: 'id', width: 180 }, { title: '任务名称', dataIndex: 'name', width: 230 }, { title: '关联数据源', dataIndex: 'source', width: 220 },
    { title: '触发方式', dataIndex: 'triggerMode', width: 110 }, { title: '开始时间', dataIndex: 'startTime', width: 160 },
    { title: '结束时间 / 耗时', width: 160, render: (_, record) => record.status === 'running' ? <Progress percent={68} size="small" status="active" /> : <span>{record.endTime}<br />{record.duration}</span> },
    { title: '处理数据量', dataIndex: 'processedVolume', width: 110 }, { title: '新增', dataIndex: 'added', width: 90 }, { title: '更新', dataIndex: 'updated', width: 90 },
    { title: '失败', dataIndex: 'failedCount', width: 80 }, { title: '状态', dataIndex: 'status', width: 100, render: (value) => <Tag color={(statusMeta[value] || statusMeta.cancelled)[0]}>{(statusMeta[value] || statusMeta.cancelled)[1]}</Tag> }, { title: '操作人', dataIndex: 'operator', width: 100 },
    { title: '操作', key: 'action', width: 86, fixed: 'right', render: (_, record) => {
      const retryable = ['failed', 'partial'].includes(record.status)
      return <div className="table-icon-actions"><TableIconButton label="日志" icon={<FileSearchOutlined />} onClick={() => onDetail(record)} /><TableIconButton label="重试" disabledReason={retryable ? undefined : '当前任务状态不可重试'} loading={retryingIds.has(record.id)} icon={<ReloadOutlined />} onClick={() => onRetry(record)} /></div>
    } },
  ]
  return <Card className="access-table-card section-table-card" title={<div><span>接入执行记录</span><Typography.Text type="secondary">追踪每一次任务实例的处理结果、日志与失败原因</Typography.Text></div>}><Table rowKey="id" columns={columns} dataSource={tasks} pagination={false} scroll={{ x: 1760 }} /></Card>
}

export default RecentAccessTasks
