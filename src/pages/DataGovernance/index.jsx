import { useMemo, useState } from 'react'
import { Card, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { governanceTasks } from '../../mock/dataGovernance'
import GovernanceFilters from './components/GovernanceFilters'
import GovernanceOverview from './components/GovernanceOverview'
import GovernanceTaskTable from './components/GovernanceTaskTable'
import GovernanceWorkspaceDrawer from './components/GovernanceWorkspaceDrawer'
import './dataGovernance.css'

const { Text, Title } = Typography
const emptyFilters = { keyword: '', status: '', domain: '', region: '', type: '' }

function DataGovernance() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState(governanceTasks)
  const [filters, setFilters] = useState(emptyFilters)
  const [selectedTask, setSelectedTask] = useState(null)
  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const keyword = filters.keyword.trim().toLowerCase()
    return (!keyword || [task.name, task.object, task.source, task.owner, task.region].some((value) => value.toLowerCase().includes(keyword))) && (!filters.status || task.status === filters.status) && (!filters.domain || task.domain === filters.domain) && (!filters.region || task.region === filters.region) && (!filters.type || task.type === filters.type)
  }), [filters, tasks])
  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const completeTask = (id) => setTasks((items) => items.map((item) => item.id === id ? { ...item, status: 'completed', score: 97.8, updateTime: '2026-07-16 10:30' } : item))

  return <div className="data-governance-page"><div className="governance-heading"><div><Title level={2}>数据治理</Title><Text type="secondary">将接入的原始数据标准化、质量检查并完善为待编目数据资产。</Text></div></div><GovernanceOverview /><Card className="governance-task-card" title={<Space orientation="vertical" size={0}><span>治理任务</span><Text type="secondary">覆盖待治理、执行中和历史治理任务</Text></Space>} extra={<Text type="secondary">当前显示 {filteredTasks.length} / {tasks.length}</Text>}><GovernanceFilters filters={filters} onChange={updateFilter} onReset={() => setFilters(emptyFilters)} /><GovernanceTaskTable tasks={filteredTasks} onOpen={setSelectedTask} /></Card><GovernanceWorkspaceDrawer open={Boolean(selectedTask)} task={selectedTask} onClose={() => setSelectedTask(null)} onComplete={completeTask} onGoCatalog={() => navigate('/asset-catalog')} /></div>
}

export default DataGovernance
