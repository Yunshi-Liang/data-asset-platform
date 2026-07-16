import { EditOutlined, PauseCircleOutlined, PlayCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd'

const { Text } = Typography
const statusMeta = {
  normal: { color: 'success', text: '正常' }, syncing: { color: 'processing', text: '同步中' },
  error: { color: 'error', text: '异常' }, disabled: { color: 'default', text: '已停用' },
}

function DataSourceTable({ data, syncingIds, onDetail, onSync, onToggle }) {
  const columns = [
    { title: '数据源名称', dataIndex: 'name', width: 230, fixed: 'left', render: (value, record) => <button className="source-name-button" onClick={() => onDetail(record)}>{value}<Text type="secondary">{record.id}</Text></button> },
    { title: '类型', dataIndex: 'type', width: 110, render: (value) => <Tag color="blue">{value}</Tag> },
    { title: '来源系统', dataIndex: 'system', width: 190, ellipsis: true },
    { title: '业务域', dataIndex: 'domain', width: 120 },
    { title: '地区', dataIndex: 'region', width: 110 },
    { title: '同步方式', dataIndex: 'syncMode', width: 100 },
    { title: '更新频率', dataIndex: 'frequency', width: 110 },
    { title: '最近同步时间', dataIndex: 'lastSync', width: 160 },
    { title: '接入数据量', dataIndex: 'volume', width: 100 },
    { title: '运行状态', dataIndex: 'status', width: 100, render: (value) => <Tag color={statusMeta[value].color}>{statusMeta[value].text}</Tag> },
    { title: '负责人', dataIndex: 'owner', width: 80 },
    {
      title: '操作', key: 'action', width: 220, fixed: 'right',
      render: (_, record) => (
        <Space size={4}>
          <Button type="link" size="small" onClick={() => onDetail(record)}>查看详情</Button>
          <Button type="link" size="small" icon={<SyncOutlined spin={syncingIds.has(record.id)} />} loading={syncingIds.has(record.id)} disabled={record.status === 'disabled'} onClick={() => onSync(record)}>立即同步</Button>
          <Button type="text" size="small" icon={<EditOutlined />} aria-label={`编辑${record.name}`} onClick={() => onDetail(record)} />
          <Popconfirm title={record.status === 'disabled' ? '确认启用该数据源？' : '确认停用该数据源？'} description={record.status === 'disabled' ? '启用后将恢复计划同步。' : '停用后将暂停所有同步任务。'} onConfirm={() => onToggle(record)} okText="确认" cancelText="取消">
            <Button type="text" size="small" icon={record.status === 'disabled' ? <PlayCircleOutlined /> : <PauseCircleOutlined />} aria-label={`${record.status === 'disabled' ? '启用' : '停用'}${record.name}`} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return <Table rowKey="id" columns={columns} dataSource={data} scroll={{ x: 1680 }} pagination={{ pageSize: 6, showSizeChanger: false, showTotal: (total) => `共 ${total} 个数据源` }} />
}

export default DataSourceTable
