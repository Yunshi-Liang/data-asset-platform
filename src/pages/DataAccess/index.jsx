import { useMemo, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { currentUser } from '../../mock/currentUser'
import { accessTaskRecords, initialDataSources } from '../../mock/dataAccess'
import AccessOverview from './components/AccessOverview'
import AccessTaskDetailDrawer from './components/AccessTaskDetailDrawer'
import CreateAccessDrawer from './components/CreateAccessDrawer'
import DataSourceDetailDrawer from './components/DataSourceDetailDrawer'
import DataSourceFilters from './components/DataSourceFilters'
import DataSourceTable from './components/DataSourceTable'
import EditDataSourceDrawer from './components/EditDataSourceDrawer'
import RecentAccessTasks from './components/RecentAccessTasks'
import SourceTypeCards from './components/SourceTypeCards'
import './dataAccess.css'

const { Text, Title } = Typography
const initialFilters = { keyword: '', group: undefined, domain: undefined, status: undefined, region: undefined }
const finishedSteps = ['建立连接', '读取数据', '校验数据结构', '采集元数据', '写入原始数据区', '完成任务'].map((name, index) => ({ name, time: `10:3${index}:0${index}`, detail: '执行完成', status: 'finish' }))

function DataAccess() {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [sources, setSources] = useState(initialDataSources)
  const [tasks, setTasks] = useState(accessTaskRecords)
  const [filters, setFilters] = useState(initialFilters)
  const [syncingIds, setSyncingIds] = useState(() => new Set())
  const [retryingIds, setRetryingIds] = useState(() => new Set())
  const [detailSource, setDetailSource] = useState(null)
  const [editSource, setEditSource] = useState(null)
  const [taskDetail, setTaskDetail] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [createEntry, setCreateEntry] = useState({ mode: 'general', presetGroup: undefined })

  const filteredSources = useMemo(() => {
    const keyword = filters.keyword.trim().toLocaleLowerCase('zh-CN')
    return sources.filter((source) => {
      const searchable = [source.name, source.system, source.owner, source.region].join(' ').toLocaleLowerCase('zh-CN')
      return (!keyword || searchable.includes(keyword)) && (!filters.group || source.group === filters.group) && (!filters.domain || source.domain === filters.domain) && (!filters.status || source.status === filters.status) && (!filters.region || source.region === filters.region)
    })
  }, [filters, sources])

  const openGeneralCreate = () => { setCreateEntry({ mode: 'general', presetGroup: undefined }); setCreateOpen(true) }
  const openPresetCreate = (presetGroup) => { setCreateEntry({ mode: 'preset', presetGroup }); setCreateOpen(true) }
  const makeTask = ({ id, name, source, triggerMode, processedVolume }) => ({
    id,
    name,
    source,
    triggerMode,
    startTime: '2026-07-16 10:30:00',
    endTime: '2026-07-16 10:30:08',
    duration: '8秒',
    processedVolume,
    added: '1,286',
    updated: '328',
    skipped: '6',
    failedCount: 0,
    status: 'success',
    operator: currentUser.name,
    steps: finishedSteps,
    logs: ['10:30:00 [INFO] 任务已启动', '10:30:03 [INFO] 元数据采集完成', '10:30:08 [INFO] 数据写入完成'],
    failureReason: '',
  })

  const handleSync = (source) => {
    setSyncingIds((current) => new Set(current).add(source.id))
    setSources((current) => current.map((item) => item.id === source.id ? { ...item, status: 'syncing' } : item))
    setTimeout(() => {
      setSyncingIds((current) => { const next = new Set(current); next.delete(source.id); return next })
      setSources((current) => current.map((item) => item.id === source.id ? { ...item, status: 'normal', lastSync: '2026-07-16 10:30' } : item))
      setTasks((current) => [makeTask({ id: `TASK-SYNC-${Date.now()}`, name: `${source.name}手动同步`, source: source.name, triggerMode: '人工触发', processedVolume: '128 MB' }), ...current])
      messageApi.success(`${source.name}同步成功，最近同步时间已更新`)
    }, 1000)
  }
  const handleToggle = (source) => {
    const enabling = source.status === 'disabled'
    setSources((current) => current.map((item) => item.id === source.id ? { ...item, status: enabling ? 'normal' : 'disabled' } : item))
    if (detailSource?.id === source.id) setDetailSource({ ...source, status: enabling ? 'normal' : 'disabled' })
    messageApi.success(enabling ? '数据源已启用，计划任务已恢复' : '数据源已停用，同步任务已暂停')
  }
  const handleCreated = (config) => {
    const newSource = { id: `DS-${String(sources.length + 1).padStart(3, '0')}`, name: config.name, group: config.group, type: config.type, system: '新建接入任务', domain: config.domain, region: config.region, syncMode: config.syncMode === 'full' ? '全量接入' : '增量接入', frequency: ({ manual: '手动', daily: '每天', weekly: '每周', monthly: '每月' })[config.frequency], executeTime: config.executeTime?.format?.('HH:mm') || '', lastSync: '2026-07-16 10:30', volume: config.profile.volume, status: 'normal', owner: currentUser.name, department: config.department, host: '已安全配置（敏感信息已隐藏）', schema: config.profile.objectName, records: config.profile.rowCount, fields: config.profile.fieldCount, autoMetadata: config.autoMetadata, autoQuality: config.autoQuality, autoClassify: config.autoClassify, error: '' }
    setSources((current) => [newSource, ...current])
    setTasks((current) => [makeTask({ id: `TASK-20260716-${String(current.length + 19).padStart(3, '0')}`, name: `${config.name}首次接入`, source: config.name, triggerMode: '人工触发', processedVolume: config.profile.volume }), ...current])
  }
  const handleSaveSource = (updated) => {
    setSources((current) => current.map((item) => item.id === updated.id ? updated : item))
    if (detailSource?.id === updated.id) setDetailSource(updated)
    setEditSource(null)
    messageApi.success('数据源配置已保存，列表和详情已同步更新')
  }
  const handleRetryTask = (task) => {
    setRetryingIds((current) => new Set(current).add(task.id))
    const runningTask = { ...task, status: 'running', endTime: '', duration: '执行中', failureReason: '', logs: [...task.logs, '10:40:00 [INFO] 人工重试已启动'] }
    setTasks((current) => current.map((item) => item.id === task.id ? runningTask : item))
    messageApi.info(`${task.id} 已开始重新执行`)
    setTimeout(() => {
      const successTask = { ...runningTask, status: 'success', endTime: '2026-07-16 10:40:08', duration: '8秒', failedCount: 0, steps: finishedSteps, logs: [...runningTask.logs, '10:40:08 [INFO] 重试执行成功'] }
      setTasks((current) => current.map((item) => item.id === task.id ? successTask : item))
      setTaskDetail((current) => current?.id === task.id ? successTask : current)
      setRetryingIds((current) => { const next = new Set(current); next.delete(task.id); return next })
      messageApi.success(`${task.id} 重新执行成功`)
    }, 1000)
  }

  return (
    <div className="data-access-page">
      {contextHolder}
      <div className="page-header access-page-header"><div className="page-header-copy"><Title className="page-header-title" level={2}>数据接入</Title><Text className="page-header-description">统一配置、执行和追踪华南区域多源异构数据接入任务。</Text></div><Button type="primary" size="large" icon={<PlusOutlined />} onClick={openGeneralCreate}>新建数据接入</Button></div>
      <AccessOverview />
      <SourceTypeCards onSelect={openPresetCreate} />
      <Card className="access-table-card" title={<div><span>已接入数据源</span><Text type="secondary">管理长期存在的数据源连接、同步策略与运行状态</Text></div>} extra={<Text type="secondary">当前显示 {filteredSources.length} / {sources.length}</Text>}>
        <DataSourceFilters filters={filters} onChange={setFilters} onReset={() => setFilters(initialFilters)} />
        <DataSourceTable data={filteredSources} syncingIds={syncingIds} onDetail={setDetailSource} onEdit={setEditSource} onSync={handleSync} onToggle={handleToggle} />
      </Card>
      <RecentAccessTasks tasks={tasks.slice(0, 6)} retryingIds={retryingIds} onDetail={setTaskDetail} onRetry={handleRetryTask} />
      <DataSourceDetailDrawer source={detailSource} open={Boolean(detailSource)} onClose={() => setDetailSource(null)} />
      <EditDataSourceDrawer source={editSource} open={Boolean(editSource)} onClose={() => setEditSource(null)} onSave={handleSaveSource} />
      <AccessTaskDetailDrawer task={taskDetail} open={Boolean(taskDetail)} retrying={taskDetail ? retryingIds.has(taskDetail.id) : false} onClose={() => setTaskDetail(null)} onRetry={handleRetryTask} />
      <CreateAccessDrawer open={createOpen} mode={createEntry.mode} presetGroup={createEntry.presetGroup} onClose={() => setCreateOpen(false)} onCreated={handleCreated} onGoGovernance={() => navigate('/data-governance')} />
    </div>
  )
}

export default DataAccess
