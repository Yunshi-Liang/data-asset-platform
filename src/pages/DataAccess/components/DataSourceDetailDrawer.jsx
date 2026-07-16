import { Alert, Descriptions, Drawer, Empty, Table, Tabs, Tag, Timeline } from 'antd'

const statusMeta = { normal: ['success', '正常'], syncing: ['processing', '同步中'], error: ['error', '异常'], disabled: ['default', '已停用'] }

function DataSourceDetailDrawer({ source, open, onClose }) {
  if (!source) return null
  const basicItems = [
    ['数据源编号', source.id], ['数据源名称', source.name], ['来源系统', source.system], ['所属业务域', source.domain],
    ['所属地区', source.region], ['数据源类型', source.type], ['运行状态', <Tag key="status" color={statusMeta[source.status][0]}>{statusMeta[source.status][1]}</Tag>],
    ['负责人', source.owner], ['责任部门', source.department],
  ].map(([label, children], index) => ({ key: index, label, children }))
  const connectionItems = [
    ['连接地址', source.host], ['对象 / Schema', source.schema], ['用户名', 'data_access_user'], ['密码', '••••••••••••'], ['连接方式', '专线内网 / TLS 加密'],
  ].map(([label, children], index) => ({ key: index, label, children }))
  const syncItems = [
    ['接入方式', source.syncMode], ['更新频率', source.frequency], ['最近同步', source.lastSync], ['累计数据量', source.volume], ['记录 / 文件数', source.records], ['字段数量', source.fields],
  ].map(([label, children], index) => ({ key: index, label, children }))
  const items = [
    { key: 'basic', label: '基本信息', children: <Descriptions bordered column={2} items={basicItems} /> },
    { key: 'connection', label: '连接与同步', children: <><Descriptions bordered column={2} items={connectionItems} /><Descriptions className="detail-block" bordered column={2} items={syncItems} /></> },
    { key: 'records', label: '执行记录', children: <Timeline items={[{ color: source.status === 'error' ? 'red' : 'green', children: `${source.lastSync} 最近一次同步${source.status === 'error' ? '失败' : '完成'}` }, { color: 'green', children: '2026-07-14 02:06 定时任务执行成功' }, { color: 'blue', children: '2026-07-13 15:20 配置由数据管理员更新' }]} /> },
    { key: 'schema', label: '结构概览', children: <Table size="small" pagination={false} columns={[{ title: '对象名称', dataIndex: 'object' }, { title: '类型', dataIndex: 'type' }, { title: '字段数', dataIndex: 'fields' }, { title: '数据量', dataIndex: 'volume' }]} dataSource={[{ key: 1, object: source.schema, type: source.type, fields: source.fields, volume: source.records }]} /> },
    { key: 'error', label: '异常信息', children: source.error ? <Alert type="error" showIcon message="数据源运行异常" description={source.error} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="当前无异常信息" /> },
  ]
  return <Drawer title="数据源详情" size="large" open={open} onClose={onClose} destroyOnHidden><Tabs items={items} /></Drawer>
}

export default DataSourceDetailDrawer
