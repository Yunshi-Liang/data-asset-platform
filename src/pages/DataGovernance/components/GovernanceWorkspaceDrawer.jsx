import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircleFilled, FileDoneOutlined, PlayCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Checkbox, Col, Descriptions, Drawer, Input, Modal, Progress, Radio, Result, Row, Select, Space, Statistic, Steps, Switch, Table, Tabs, Tag, Typography, message } from 'antd'
import { businessDomains, governanceExecutionStages, initialQualityIssues, metadataFields, qualityDimensions, rulesByType } from '../../../mock/dataGovernance'

const { Text, Title } = Typography
const severityColors = { 高: 'error', 中: 'warning', 低: 'blue' }
const statusColors = { 待处理: 'default', 已处理: 'success', 已忽略: 'default', 人工复核: 'processing' }

function StandardizationRules({ task, enabledRules, onChange }) {
  const rules = rulesByType[task.type] || rulesByType['结构化数据']
  return <div><Alert type="info" showIcon title={`已根据“${task.type}”推荐 ${rules.length} 项标准化规则`} /><div className="rule-grid">{rules.map((rule) => <Card size="small" key={rule}><div className="rule-item"><span>{rule}</span><Switch checked={enabledRules.includes(rule)} onChange={(checked) => onChange(checked ? [...enabledRules, rule] : enabledRules.filter((item) => item !== rule))} /></div></Card>)}</div></div>
}

function QualityAssessment({ issues, onIssueAction }) {
  const issueColumns = [
    { title: '问题类型', dataIndex: 'type', width: 90 }, { title: '所在字段', dataIndex: 'field', width: 150 },
    { title: '问题描述', dataIndex: 'description', width: 220 }, { title: '影响记录', dataIndex: 'count', width: 90 },
    { title: '严重程度', dataIndex: 'severity', width: 90, render: (value) => <Tag color={severityColors[value]}>{value}</Tag> },
    { title: '推荐处理方式', dataIndex: 'suggestion', width: 220 },
    { title: '状态', dataIndex: 'status', width: 100, render: (value) => <Tag color={statusColors[value]}>{value}</Tag> },
    { title: '操作', key: 'action', width: 230, render: (_, record) => <Space size={0}><Button type="link" size="small" onClick={() => onIssueAction(record.id, '已处理')}>接受建议</Button><Button type="link" size="small" onClick={() => onIssueAction(record.id, '人工复核')}>人工复核</Button><Button type="link" size="small" onClick={() => onIssueAction(record.id, '已忽略')}>忽略</Button></Space> },
  ]
  return <div><div className="quality-grid">{qualityDimensions.map((item) => <Card size="small" key={item.key}><Progress type="circle" size={72} percent={item.score} /><div><strong>{item.name}</strong><Text type="secondary">{item.issues} 个问题 · {item.status}</Text></div></Card>)}</div><Title level={5}>质量问题与处理建议</Title><Table rowKey="id" size="small" columns={issueColumns} dataSource={issues} pagination={false} scroll={{ x: 1180 }} /></div>
}

function MetadataEditor({ task, metadata, onChange }) {
  const columns = [{ title: '字段名称', dataIndex: 'key' }, { title: '中文名称', dataIndex: 'name' }, { title: '类型', dataIndex: 'type' }, { title: '可为空', dataIndex: 'nullable' }, { title: '示例值', dataIndex: 'example' }]
  return <div><Descriptions bordered column={3} items={[{ key: 1, label: '表名或文件名', children: task.object }, { key: 2, label: '数据规模', children: task.volume }, { key: 3, label: '更新时间', children: task.updateTime }]} /><Title level={5}>技术元数据</Title><Table rowKey="key" size="small" columns={columns} dataSource={metadataFields} pagination={false} /><Title level={5}>业务元数据</Title><Row gutter={16}><Col span={12}><label>中文名称</label><Input value={metadata.chineseName} onChange={(event) => onChange({ ...metadata, chineseName: event.target.value })} /></Col><Col span={12}><label>数据责任部门</label><Input value={metadata.department} onChange={(event) => onChange({ ...metadata, department: event.target.value })} /></Col><Col span={24}><label>业务含义</label><Input.TextArea rows={3} value={metadata.meaning} onChange={(event) => onChange({ ...metadata, meaning: event.target.value })} /></Col><Col span={12}><label>数据负责人</label><Input value={task.owner} disabled /></Col><Col span={12}><label>更新周期</label><Select value={metadata.frequency} className="full-width" options={['实时', '每天', '每周', '每月'].map((value) => ({ value, label: value }))} onChange={(frequency) => onChange({ ...metadata, frequency })} /></Col></Row></div>
}

function ClassificationPanel({ classification, onChange }) {
  const tagOptions = ['输电线路', 'GIS', '高程数据', '工程设计', '华南地区', '高频使用', '高价值数据', '外部数据', '三维模型']
  return <div><Alert type="success" showIcon title="已结合字段语义、来源系统和使用场景生成分类分级建议" /><Row gutter={16}><Col span={12}><label>推荐一级业务域</label><Select value={classification.domain} className="full-width" options={businessDomains.map((value) => ({ value, label: value }))} onChange={(domain) => onChange({ ...classification, domain })} /></Col><Col span={12}><label>推荐二级分类</label><Input value={classification.category} onChange={(event) => onChange({ ...classification, category: event.target.value })} /></Col><Col span={12}><label>数据形态</label><Select value={classification.form} className="full-width" options={['结构化数据', '文档资料', 'GIS 数据', '三维模型', 'API 服务'].map((value) => ({ value, label: value }))} onChange={(form) => onChange({ ...classification, form })} /></Col><Col span={12}><label>生命周期阶段</label><Select value={classification.lifecycle} className="full-width" options={['勘测', '设计', '建设', '知识沉淀'].map((value) => ({ value, label: value }))} onChange={(lifecycle) => onChange({ ...classification, lifecycle })} /></Col><Col span={24}><label>推荐安全等级</label><Radio.Group value={classification.security} options={['一般数据', '重要数据', '核心数据']} onChange={(event) => onChange({ ...classification, security: event.target.value })} /></Col><Col span={24}><label>推荐业务标签</label><Checkbox.Group value={classification.tags} options={tagOptions} onChange={(tags) => onChange({ ...classification, tags })} /></Col></Row>{classification.security === '核心数据' && <Alert className="security-alert" type="error" showIcon title="核心数据仅限授权范围内使用，不允许直接在数据资产门户公开上架。" />}</div>
}

function GovernanceWorkspaceDrawer({ open, task, onClose, onComplete, onGoCatalog }) {
  const [messageApi, messageContextHolder] = message.useMessage()
  const [modalApi, modalContextHolder] = Modal.useModal()
  const contextHolder = <>{messageContextHolder}{modalContextHolder}</>
  const [phase, setPhase] = useState('ready')
  const [executionIndex, setExecutionIndex] = useState(-1)
  const [activeTab, setActiveTab] = useState('rules')
  const [issues, setIssues] = useState(initialQualityIssues)
  const [enabledRules, setEnabledRules] = useState([])
  const [metadata, setMetadata] = useState({ chineseName: '', meaning: '', department: '', frequency: '每天' })
  const [classification, setClassification] = useState({ domain: '电气设计数据', category: '输电线路设计', form: 'GIS 数据', lifecycle: '设计', security: '重要数据', tags: ['输电线路', 'GIS', '工程设计', '华南地区', '高价值数据'] })
  const [assetCode, setAssetCode] = useState('')
  const timerRef = useRef(null)

  useEffect(() => () => clearInterval(timerRef.current), [])
  useEffect(() => {
    if (!open || !task) return
    setPhase(task.status === 'completed' ? 'completed' : 'ready')
    setExecutionIndex(-1); setActiveTab('rules'); setIssues(initialQualityIssues); setAssetCode('')
    setEnabledRules(rulesByType[task.type] || rulesByType['结构化数据'])
    setMetadata({ chineseName: task.name.replace('治理', '').replace('标准化', ''), meaning: `${task.source}接入形成的${task.domain}数据，用于华南地区电力工程设计与分析。`, department: task.department, frequency: task.type === '实时数据' ? '实时' : '每天' })
    setClassification({ domain: task.domain, category: task.category.split(' / ')[1], form: task.type === 'API 数据' ? 'API 服务' : task.type, lifecycle: task.domain === '勘测数据' ? '勘测' : '设计', security: task.security, tags: task.type === 'GIS 数据' ? ['GIS', '工程设计', '华南地区', '高价值数据'] : ['华南地区', '高频使用'] })
  }, [open, task])

  const startExecution = () => {
    setPhase('executing'); setExecutionIndex(0)
    let index = 0
    timerRef.current = setInterval(() => { index += 1; if (index >= governanceExecutionStages.length) { clearInterval(timerRef.current); setExecutionIndex(governanceExecutionStages.length); setPhase('workspace'); setActiveTab('quality'); messageApi.success('自动治理执行完成，请确认问题处理和分类分级结果') } else setExecutionIndex(index) }, 550)
  }
  const issueAction = (id, status) => { setIssues((items) => items.map((item) => item.id === id ? { ...item, status } : item)); messageApi.success(`问题已标记为“${status}”`) }
  const finishGovernance = () => { setPhase('completed'); onComplete(task.id); messageApi.success('治理任务已完成，成果可提交至数据资产目录') }
  const submitCatalog = () => modalApi.confirm({ title: '提交至数据资产目录', content: '确认将治理成果、元数据、分类分级与质量报告提交至资产目录？', okText: '确认提交', cancelText: '取消', onOk: () => { const code = `DA-GD-2026-${String(Date.now()).slice(-3)}`; setAssetCode(code); onComplete(task.id); messageApi.success(`提交成功，资产编号：${code}`) } })
  const report = () => modalApi.info({ title: '数据治理报告', width: 620, content: <Descriptions bordered column={1} items={[{ key: 1, label: '任务', children: task.name }, { key: 2, label: '质量评分', children: `${task.score}% → 97.8%` }, { key: 3, label: '问题处理', children: '自动修复 27 条，保留人工复核 4 条' }, { key: 4, label: '治理结论', children: '数据结构、元数据和分类分级已达到待编目要求' }]} /> })

  const resolvedCount = issues.filter((item) => item.status === '已处理' || item.status === '已忽略').reduce((sum, item) => sum + item.count, 0)
  const resultItems = useMemo(() => [{ key: 1, label: '治理状态', children: <Tag color="success">已完成</Tag> }, { key: 2, label: '原始记录数', children: task?.records?.toLocaleString() }, { key: 3, label: '有效记录数', children: task ? (task.records - 4).toLocaleString() : '' }, { key: 4, label: '修复记录数', children: `${Math.max(resolvedCount, 27)} 条` }, { key: 5, label: '待人工复核数', children: '4 条' }, { key: 6, label: '治理前评分', children: `${task?.score}%` }, { key: 7, label: '治理后评分', children: '97.8%' }, { key: 8, label: '补充元数据', children: '18 项' }, { key: 9, label: '生成标签', children: `${classification.tags.length} 个` }, { key: 10, label: '推荐目录路径', children: `${classification.domain} / ${classification.category}` }, { key: 11, label: '推荐安全等级', children: classification.security }], [classification, resolvedCount, task])
  if (!task) return null

  const overview = <Descriptions bordered size="small" column={4} items={[{ key: 1, label: '数据名称', children: task.object }, { key: 2, label: '来源数据源', children: task.source }, { key: 3, label: '数据类型', children: task.type }, { key: 4, label: '业务领域', children: task.domain }, { key: 5, label: '所属地区', children: task.region }, { key: 6, label: '数据规模', children: task.volume }, { key: 7, label: '字段数量', children: `${task.fields} 个` }, { key: 8, label: '最近接入', children: task.accessTime }, { key: 9, label: '当前质量', children: `${task.score}%` }, { key: 10, label: '推荐分类', children: task.category }, { key: 11, label: '安全等级', children: <Tag color={task.security === '重要数据' ? 'orange' : 'blue'}>{task.security}</Tag> }]} />
  const tabItems = [
    { key: 'rules', label: '1 标准化处理', children: <StandardizationRules task={task} enabledRules={enabledRules} onChange={setEnabledRules} /> },
    { key: 'quality', label: '2 质量检查', children: <QualityAssessment issues={issues} onIssueAction={issueAction} /> },
    { key: 'metadata', label: '3 元数据完善', children: <MetadataEditor task={task} metadata={metadata} onChange={setMetadata} /> },
    { key: 'classification', label: '4 分类分级与标签', children: <ClassificationPanel classification={classification} onChange={setClassification} /> },
    { key: 'confirm', label: '5 治理确认', children: <div><Row gutter={16} className="comparison-grid"><Col span={6}><Card><Statistic title="治理前评分" value={task.score} suffix="%" /></Card></Col><Col span={6}><Card><Statistic title="治理后评分" value={97.8} suffix="%" /></Card></Col><Col span={6}><Card><Statistic title="修复问题" value={Math.max(resolvedCount, 27)} suffix="条" /></Card></Col><Col span={6}><Card><Statistic title="待人工复核" value={4} suffix="条" /></Card></Col></Row><Descriptions bordered column={2} items={[{ key: 1, label: '补充元数据', children: '18 项' }, { key: 2, label: '生成标签', children: `${classification.tags.length} 个` }, { key: 3, label: '推荐目录位置', children: `${classification.domain} / ${classification.category}` }, { key: 4, label: '安全等级', children: classification.security }]} /><Button className="finish-button" type="primary" icon={<CheckCircleFilled />} onClick={finishGovernance}>确认完成治理</Button></div> },
  ]

  return <Drawer title={task.name} size="large" open={open} onClose={onClose} destroyOnHidden>{contextHolder}<div className="workspace-overview">{overview}</div>{phase === 'ready' && <div className="governance-ready"><SafetyCertificateOutlined /><Title level={3}>治理规则已就绪</Title><Text type="secondary">已识别 {task.fields} 个字段，并推荐 {enabledRules.length} 项标准化规则。可先检查规则，也可直接启动自动治理。</Text><StandardizationRules task={task} enabledRules={enabledRules} onChange={setEnabledRules} /><Button type="primary" size="large" icon={<PlayCircleOutlined />} onClick={startExecution}>启动治理</Button></div>}{phase === 'executing' && <div className="governance-execution"><Title level={4}>正在执行数据治理</Title><Progress percent={Math.round((executionIndex / governanceExecutionStages.length) * 100)} status="active" /><Steps orientation="vertical" current={executionIndex} items={governanceExecutionStages.map((title, index) => ({ title, content: index < executionIndex ? '已完成' : index === executionIndex ? '执行中' : '等待执行', status: index < executionIndex ? 'finish' : index === executionIndex ? 'process' : 'wait' }))} /></div>}{phase === 'workspace' && <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />}{phase === 'completed' && <Result status="success" title="数据治理已完成" subTitle={assetCode ? `治理成果已提交，资产编号：${assetCode}` : '数据已达到待编目要求，可提交至数据资产目录。'} extra={<Space wrap><Button icon={<FileDoneOutlined />} onClick={report}>查看治理报告</Button>{!assetCode && <Button type="primary" onClick={submitCatalog}>提交至资产目录</Button>}{assetCode && <Button type="primary" onClick={onGoCatalog}>前往数据资产目录</Button>}<Button onClick={onClose}>返回任务列表</Button></Space>}><Descriptions bordered column={2} items={resultItems} /></Result>}</Drawer>
}

export default GovernanceWorkspaceDrawer
