import { useEffect, useMemo, useState } from 'react'
import { App, Card, Space, Typography } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { ASSET_STATUS, getCatalogPath } from '../../mock/assetCatalog'
import { createGovernanceDraft, governanceTasks } from '../../mock/dataGovernance'
import { registerSubmittedAsset } from '../../utils/catalogSession'
import GovernanceFilters from './components/GovernanceFilters'
import GovernanceOverview from './components/GovernanceOverview'
import GovernanceTaskTable from './components/GovernanceTaskTable'
import GovernanceWorkspaceDrawer from './components/GovernanceWorkspaceDrawer'
import './dataGovernance.css'

const { Text, Title } = Typography
const emptyFilters = { keyword: '', status: '', domain: '', region: '', type: '' }

function DataGovernance() {
  const navigate = useNavigate()
  const location = useLocation()
  const { message, modal } = App.useApp()
  const modalContextHolder = null
  const [tasks, setTasks] = useState(governanceTasks)
  const [drafts, setDrafts] = useState(() => Object.fromEntries(governanceTasks.map((task) => [task.id, createGovernanceDraft(task)])))
  const [filters, setFilters] = useState(emptyFilters)
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null
  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const keyword = filters.keyword.trim().toLowerCase()
    return (!keyword || [task.name, task.object, task.source, task.owner, task.region].some((value) => value.toLowerCase().includes(keyword))) && (!filters.status || task.status === filters.status) && (!filters.domain || task.domain === filters.domain) && (!filters.region || task.region === filters.region) && (!filters.type || task.type === filters.type)
  }), [filters, tasks])

  useEffect(() => {
    const taskId = new URLSearchParams(location.search).get('taskId')
    if (taskId && tasks.some((task) => task.id === taskId)) setSelectedTaskId(taskId)
  }, [location.search, tasks])

  const updateDraft = (id, patch) => setDrafts((current) => ({ ...current, [id]: { ...current[id], ...patch } }))
  const saveAndExit = (id) => {
    const draft = drafts[id]
    const status = draft.currentStep >= 4 ? 'confirming' : 'running'
    setTasks((items) => items.map((item) => item.id === id ? { ...item, status, updateTime: '2026-07-16 14:20' } : item))
    setSelectedTaskId(null)
    message.success(status === 'confirming' ? '进度已保存，任务进入待确认状态' : '治理进度已保存')
  }
  const completeTask = (id) => {
    updateDraft(id, { phase: 'completed', currentStep: 4 })
    setTasks((items) => items.map((item) => item.id === id ? { ...item, status: 'completed', score: 97.8, updateTime: '2026-07-16 14:30' } : item))
    message.success('治理任务已完成，成果可提交至数据资产目录')
  }
  const submitCatalog = (task) => {
    if (task.status !== 'completed' || task.catalogSubmission === 'submitted') return
    modal.confirm({
      title: '提交至数据资产目录',
      content: `确认将“${task.name}”的治理成果提交至 ${getCatalogPath(task.catalogKey)}？提交成功后资产将自动启用。`,
      okText: '确认提交', cancelText: '取消',
      onOk: () => {
        const draft = drafts[task.id]
        const assetCode = task.assetCode || `DA-${task.region.includes('广西') ? 'GX' : task.region.includes('海南') ? 'HN' : 'GD'}-2026-${String(Date.now()).slice(-3)}`
        const blocking = draft.issues.some((issue) => issue.severity === '高' && !['已接受建议', '已忽略'].includes(issue.status))
        registerSubmittedAsset({
          id: assetCode, code: assetCode, governanceTaskId: task.id, name: task.name.replace('治理', '').replace('标准化', '').trim(),
          catalogKey: task.catalogKey, domain: getCatalogPath(task.catalogKey).split(' / ')[0], dataType: draft.classification.form,
          region: task.region, source: task.source, sourceSystem: task.source, qualityScore: 97.8, securityLevel: draft.classification.security,
          status: blocking ? ASSET_STATUS.governanceError : ASSET_STATUS.pendingPublish, tags: draft.classification.tags,
          size: task.volume, frequency: draft.metadata.frequency, owner: task.owner, department: draft.metadata.department,
          updatedAt: '2026-07-16 14:35', description: draft.metadata.meaning, records: task.records.toLocaleString(), fields: task.fields,
          createdAt: '2026-07-16', lifecycle: draft.classification.lifecycle, scenarios: draft.metadata.scenario, contact: '020-8888****',
          health: blocking ? 72 : 94, valueLevel: '高价值', usage: { views: 0, favorites: 0, applications: 0, downloads: 0, apiCalls: 0, products: 0 },
          unresolvedIssues: blocking ? draft.issues.filter((issue) => issue.status === '待人工复核').length : 0, metadataComplete: true, favorite: false,
        })
        setTasks((items) => items.map((item) => item.id === task.id ? { ...item, catalogSubmission: 'submitted', assetCode } : item))
        message.success(`已提交资产目录，资产编号：${assetCode}`)
      },
    })
  }

  return <div className="data-governance-page">{modalContextHolder}<div className="governance-heading"><div><Title level={2}>数据治理</Title><Text type="secondary">将接入的原始数据标准化、质量检查并完善为待编目数据资产。</Text></div></div><GovernanceOverview /><Card className="governance-task-card" title={<Space orientation="vertical" size={0}><span>治理任务</span><Text type="secondary">覆盖待治理、执行中和历史治理任务</Text></Space>} extra={<Text type="secondary">当前显示 {filteredTasks.length} / {tasks.length}</Text>}><GovernanceFilters filters={filters} onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))} onReset={() => setFilters(emptyFilters)} /><GovernanceTaskTable tasks={filteredTasks} onOpen={(task) => setSelectedTaskId(task.id)} onSubmitCatalog={submitCatalog} onViewAsset={(task) => navigate(`/asset-catalog?assetId=${task.assetCode}`)} /></Card><GovernanceWorkspaceDrawer open={Boolean(selectedTask)} task={selectedTask} draft={selectedTask ? drafts[selectedTask.id] : null} onDraftChange={(patch) => updateDraft(selectedTask.id, patch)} onClose={() => setSelectedTaskId(null)} onSaveExit={() => saveAndExit(selectedTask.id)} onComplete={() => completeTask(selectedTask.id)} onSubmitCatalog={() => submitCatalog(selectedTask)} onGoCatalog={() => navigate(`/asset-catalog${selectedTask?.assetCode ? `?assetId=${selectedTask.assetCode}` : ''}`)} /></div>
}

export default DataGovernance
