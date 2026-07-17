import { Alert, Button, Descriptions, Drawer, Space, Tag, Timeline, Typography } from 'antd'

const statusMeta = {
  success: ['success', '成功'],
  running: ['processing', '执行中'],
  partial: ['warning', '部分成功'],
  failed: ['error', '失败'],
  cancelled: ['default', '已取消'],
}

function AccessTaskDetailDrawer({ task, open, retrying, onClose, onRetry }) {
  if (!task) return null
  const [color, text] = statusMeta[task.status] || statusMeta.cancelled
  const items = [
    ['任务编号', task.id], ['关联数据源', task.source], ['触发方式', task.triggerMode],
    ['开始时间', task.startTime], ['结束时间', task.endTime || '—'], ['执行耗时', task.duration],
    ['处理数据量', task.processedVolume], ['新增记录', task.added], ['更新记录', task.updated],
    ['跳过记录', task.skipped], ['失败记录', task.failedCount], ['执行状态', <Tag key="status" color={color}>{text}</Tag>],
  ].map(([label, children], index) => ({ key: index, label, children }))
  return (
    <Drawer title="接入任务执行详情" size="large" open={open} onClose={onClose} destroyOnHidden>
      <Descriptions bordered column={2} items={items} />
      <Typography.Title level={5} className="task-detail-title">执行步骤</Typography.Title>
      <Timeline items={(task.steps || []).map((step) => ({ color: step.status === 'error' ? 'red' : step.status === 'wait' ? 'gray' : 'green', children: <><Typography.Text strong>{step.name}</Typography.Text><br /><Typography.Text type="secondary">{step.time || '等待执行'} · {step.detail}</Typography.Text></> }))} />
      <Typography.Title level={5} className="task-detail-title">执行日志摘要</Typography.Title>
      <div className="task-log-panel">{(task.logs || []).map((log) => <div key={log}>{log}</div>)}</div>
      {task.failureReason && <Alert className="task-failure-alert" showIcon type="error" title="失败原因" description={task.failureReason} />}
      {['failed', 'partial'].includes(task.status) && <Space className="task-retry-action"><Button type="primary" loading={retrying} onClick={() => onRetry(task)}>重试</Button><Typography.Text type="secondary">重试只创建新的执行状态，不修改数据源连接配置。</Typography.Text></Space>}
    </Drawer>
  )
}

export default AccessTaskDetailDrawer
