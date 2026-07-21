import { EditOutlined, EyeOutlined, PauseCircleOutlined, PlayCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { Popconfirm, Table, Tag, Typography } from 'antd'
import TableIconButton from '../../../components/TableIconButton'
import { getDataSourceClassification } from '../../../mock/dataAccess'

const { Text } = Typography
const statusMeta = { normal: { color: 'success', text: '正常' }, syncing: { color: 'processing', text: '同步中' }, error: { color: 'error', text: '异常' }, disabled: { color: 'default', text: '已停用' } }

function DataSourceTable({ data, syncingIds, onDetail, onEdit, onSync, onToggle }) {
  const columns = [
    { title: '数据源名称', dataIndex: 'name', width: 230, fixed: 'left', render: (value, record) => <button className="source-name-button" onClick={() => onDetail(record)}>{value}<Text type="secondary">{record.id}</Text></button> },
    { title: '接入模式', key: 'accessMode', width: 100, render: (_, record) => getDataSourceClassification(record).accessModeName },
    { title: '数据源类型', key: 'sourceType', width: 130, render: (_, record) => <Tag color="blue">{getDataSourceClassification(record).sourceTypeName}</Tag> },
    { title: '数据格式', key: 'dataFormat', width: 110, render: (_, record) => getDataSourceClassification(record).dataFormat }, { title: '来源系统', dataIndex: 'system', width: 190, ellipsis: true },
    { title: '业务域', dataIndex: 'domain', width: 120 }, { title: '地区', dataIndex: 'region', width: 110 }, { title: '同步方式', dataIndex: 'syncMode', width: 100 },
    { title: '更新频率', dataIndex: 'frequency', width: 110 }, { title: '最近同步时间', dataIndex: 'lastSync', width: 160 }, { title: '接入数据量', dataIndex: 'volume', width: 100 },
    { title: '运行状态', dataIndex: 'status', width: 100, render: (value) => <Tag color={statusMeta[value].color}>{statusMeta[value].text}</Tag> }, { title: '负责人', dataIndex: 'owner', width: 80 },
    { title: '操作', key: 'action', width: 150, fixed: 'right', render: (_, record) => {
      const stopped = record.status === 'disabled'
      const syncing = syncingIds.has(record.id)
      return <div className="table-icon-actions">
        <TableIconButton label="详情" icon={<EyeOutlined />} onClick={() => onDetail(record)} />
        <TableIconButton label="编辑" icon={<EditOutlined />} onClick={() => onEdit(record)} />
        <TableIconButton label="同步" disabledReason={stopped ? '数据源已停用，不能同步' : undefined} loading={syncing} icon={<SyncOutlined spin={syncing} />} onClick={() => onSync(record)} />
        <Popconfirm title={stopped ? '确认启用该数据源？' : '确认停用该数据源？'} description={stopped ? '启用后将恢复计划同步。' : '停用后将暂停所有同步任务。'} onConfirm={() => onToggle(record)} okText="确认" cancelText="取消"><span><TableIconButton label={stopped ? '启用' : '停用'} icon={stopped ? <PlayCircleOutlined /> : <PauseCircleOutlined />} danger={!stopped} onClick={() => {}} /></span></Popconfirm>
      </div>
    } },
  ]
  return <Table rowKey="id" columns={columns} dataSource={data} scroll={{ x: 1840 }} pagination={{ pageSize: 6, showSizeChanger: false, showTotal: (total) => `共 ${total} 个数据源` }} />
}

export default DataSourceTable
