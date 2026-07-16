import { EyeOutlined } from '@ant-design/icons'
import { Button, Card, Progress, Table, Tag } from 'antd'

const statusMeta = { success: ['success', '成功'], running: ['processing', '执行中'], failed: ['error', '失败'] }

function RecentAccessTasks({ tasks }) {
  const columns = [
    { title: '任务名称', dataIndex: 'name', width: 240 },
    { title: '数据源', dataIndex: 'source', width: 220 },
    { title: '执行方式', dataIndex: 'mode', width: 110 },
    { title: '开始时间', dataIndex: 'startTime', width: 160 },
    { title: '耗时', dataIndex: 'duration', width: 100, render: (value, record) => record.status === 'running' ? <Progress percent={68} size="small" status="active" /> : value },
    { title: '接入数据量', dataIndex: 'volume', width: 110 },
    { title: '状态', dataIndex: 'status', width: 90, render: (value) => <Tag color={statusMeta[value][0]}>{statusMeta[value][1]}</Tag> },
    { title: '操作人', dataIndex: 'operator', width: 100 },
    { title: '操作', key: 'action', width: 90, render: () => <Button type="link" size="small" icon={<EyeOutlined />}>日志</Button> },
  ]
  return <Card className="access-table-card" title="最近接入任务" extra={<Button type="link">查看全部</Button>}><Table rowKey="id" columns={columns} dataSource={tasks} pagination={false} scroll={{ x: 1220 }} /></Card>
}

export default RecentAccessTasks
