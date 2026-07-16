import { useMemo, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { initialDataSources, recentAccessTasks } from '../../mock/dataAccess'
import AccessOverview from './components/AccessOverview'
import CreateAccessDrawer from './components/CreateAccessDrawer'
import DataSourceDetailDrawer from './components/DataSourceDetailDrawer'
import DataSourceFilters from './components/DataSourceFilters'
import DataSourceTable from './components/DataSourceTable'
import RecentAccessTasks from './components/RecentAccessTasks'
import SourceTypeCards from './components/SourceTypeCards'
import './dataAccess.css'

const { Text, Title } = Typography
const initialFilters = { keyword: '', group: undefined, domain: undefined, status: undefined, region: undefined }

function DataAccess() {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [sources, setSources] = useState(initialDataSources)
  const [tasks, setTasks] = useState(recentAccessTasks)
  const [filters, setFilters] = useState(initialFilters)
  const [syncingIds, setSyncingIds] = useState(() => new Set())
  const [detailSource, setDetailSource] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [initialGroup, setInitialGroup] = useState('database')

  const filteredSources = useMemo(() => {
    const keyword = filters.keyword.trim().toLocaleLowerCase('zh-CN')
    return sources.filter((source) => {
      const searchable = [source.name, source.system, source.owner, source.region].join(' ').toLocaleLowerCase('zh-CN')
      return (!keyword || searchable.includes(keyword)) && (!filters.group || source.group === filters.group) && (!filters.domain || source.domain === filters.domain) && (!filters.status || source.status === filters.status) && (!filters.region || source.region === filters.region)
    })
  }, [filters, sources])

  const openCreate = (group = 'database') => { setInitialGroup(group); setCreateOpen(true) }
  const handleSync = (source) => {
    setSyncingIds((current) => new Set(current).add(source.id))
    setSources((current) => current.map((item) => item.id === source.id ? { ...item, status: 'syncing' } : item))
    setTimeout(() => {
      setSyncingIds((current) => { const next = new Set(current); next.delete(source.id); return next })
      setSources((current) => current.map((item) => item.id === source.id ? { ...item, status: 'normal', lastSync: '2026-07-15 10:28', volume: item.volume } : item))
      setTasks((current) => [{ id: `TASK-SYNC-${source.id}`, name: `${source.name}手动同步`, source: source.name, mode: '人工同步', startTime: '2026-07-15 10:28', duration: '8秒', volume: '128 MB', status: 'success', operator: '数据管理员' }, ...current])
      messageApi.success(`${source.name}同步成功，最近同步时间已更新`)
    }, 1200)
  }
  const handleToggle = (source) => {
    const enabling = source.status === 'disabled'
    setSources((current) => current.map((item) => item.id === source.id ? { ...item, status: enabling ? 'normal' : 'disabled' } : item))
    messageApi.success(enabling ? '数据源已启用，计划任务已恢复' : '数据源已停用，同步任务已暂停')
  }
  const handleCreated = (config) => {
    const newSource = { id: `DS-${String(sources.length + 1).padStart(3, '0')}`, name: config.name, group: config.group, type: config.type, system: '新建接入任务', domain: config.domain, region: config.region, syncMode: config.syncMode === 'full' ? '全量接入' : '增量接入', frequency: ({ manual: '手动', daily: '每天', weekly: '每周', monthly: '每月' })[config.frequency], lastSync: '2026-07-15 10:30', volume: config.profile.volume, status: 'normal', owner: '数据管理员', department: config.department, host: '已安全配置（敏感信息已隐藏）', schema: config.profile.objectName, records: config.profile.rowCount, fields: config.profile.fieldCount, error: '' }
    setSources((current) => [newSource, ...current])
    setTasks((current) => [{ id: `TASK-20260715-${String(current.length + 19).padStart(3, '0')}`, name: `${config.name}首次接入`, source: config.name, mode: config.syncMode === 'full' ? '人工全量' : '人工增量', startTime: '2026-07-15 10:30', duration: '4秒', volume: config.profile.volume, status: 'success', operator: '数据管理员' }, ...current])
  }

  return (
    <div className="data-access-page">
      {contextHolder}
      <div className="access-page-header"><div><Title level={2}>数据接入</Title><Text type="secondary">统一配置、执行和追踪华南区域多源异构数据接入任务。</Text></div><Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => openCreate()}>新建数据接入</Button></div>
      <AccessOverview />
      <SourceTypeCards onSelect={openCreate} />
      <Card className="access-table-card" title={<div><span>已接入数据源</span><Text type="secondary">集中监控连接、同步与运行状态</Text></div>} extra={<Text type="secondary">当前显示 {filteredSources.length} / {sources.length}</Text>}>
        <DataSourceFilters filters={filters} onChange={setFilters} onReset={() => setFilters(initialFilters)} />
        <DataSourceTable data={filteredSources} syncingIds={syncingIds} onDetail={setDetailSource} onSync={handleSync} onToggle={handleToggle} />
      </Card>
      <RecentAccessTasks tasks={tasks.slice(0, 6)} />
      <DataSourceDetailDrawer source={detailSource} open={Boolean(detailSource)} onClose={() => setDetailSource(null)} />
      <CreateAccessDrawer open={createOpen} initialGroup={initialGroup} onClose={() => setCreateOpen(false)} onCreated={handleCreated} onGoGovernance={() => navigate('/data-governance')} />
    </div>
  )
}

export default DataAccess
