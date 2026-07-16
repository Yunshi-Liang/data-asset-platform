import { useEffect, useRef, useState } from 'react'
import { CheckCircleFilled, FileDoneOutlined, PlayCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { Alert, App, Button, Card, Checkbox, Col, Descriptions, Drawer, Input, Progress, Radio, Result, Row, Select, Space, Statistic, Steps, Switch, Table, Tag, Typography } from 'antd'
import { catalogDomainOptions, catalogTree, getCatalogPath } from '../../../mock/assetCatalog'
import { governanceExecutionStages, metadataFields, qualityDimensions, rulesByType } from '../../../mock/dataGovernance'

const { Text, Title } = Typography
const stepTitles = ['标准化处理', '数据质量检查', '元数据完善', '分类分级与标签', '治理确认']
const severityColors = { 高: 'error', 中: 'warning', 低: 'blue' }
const statusColors = { 待处理: 'default', 已接受建议: 'success', 已忽略: 'default', 待人工复核: 'processing' }

function StandardizationRules({ task, enabledRules, onChange }) {
  const rules = rulesByType[task.type] || rulesByType['结构化数据']
  return <section><Alert type="info" showIcon title={`已根据“${task.type}”推荐 ${rules.length} 项标准化规则`} /><div className="rule-grid">{rules.map((rule) => <Card size="small" key={rule}><div className="rule-item"><span>{rule}</span><Switch checked={enabledRules.includes(rule)} onChange={(checked) => onChange(checked ? [...enabledRules, rule] : enabledRules.filter((item) => item !== rule))} /></div></Card>)}</div></section>
}

function QualityAssessment({ issues, onChange }) {
  const { message, modal } = App.useApp()
  const contextHolder = null
  const pending = issues.some((issue) => issue.status === '待处理')
  const updateAll = (mode) => {
    if (mode === 'accept') {
      onChange(issues.map((issue) => ({ ...issue, status: issue.severity === '高' ? '待人工复核' : '已接受建议' })))
      message.info('可自动处理问题已全部接受，2 个高严重程度问题保留待人工复核')
    } else if (mode === 'review') {
      onChange(issues.map((issue) => ({ ...issue, status: '待人工复核' })))
      message.success('全部问题已转为待人工复核')
    } else {
      const apply = () => { onChange(issues.map((issue) => ({ ...issue, status: '已忽略' }))); message.success('全部问题已忽略并记录例外') }
      if (issues.some((issue) => issue.severity === '高')) modal.confirm({ title: '确认忽略全部问题？', content: '其中包含高严重程度问题。忽略后将作为治理例外记录，可能影响资产健康度。', okText: '确认忽略', okButtonProps: { danger: true }, onOk: apply })
      else apply()
    }
  }
  const setOne = (id, status) => { onChange(issues.map((issue) => issue.id === id ? { ...issue, status } : issue)); message.success(`问题已标记为“${status}”`) }
  const columns = [
    { title: '问题类型', dataIndex: 'type', width: 90 }, { title: '所在字段', dataIndex: 'field', width: 150 },
    { title: '问题描述', dataIndex: 'description', width: 220 }, { title: '影响记录', dataIndex: 'count', width: 90 },
    { title: '严重程度', dataIndex: 'severity', width: 90, render: (value) => <Tag color={severityColors[value]}>{value}</Tag> },
    { title: '推荐处理方式', dataIndex: 'suggestion', width: 220 },
    { title: '状态', dataIndex: 'status', width: 110, render: (value) => <Tag color={statusColors[value]}>{value}</Tag> },
    { title: '操作', key: 'action', width: 250, render: (_, record) => <Space size={0}><Button type="link" size="small" onClick={() => setOne(record.id, '已接受建议')}>接受建议</Button><Button type="link" size="small" onClick={() => setOne(record.id, '待人工复核')}>人工复核</Button><Button type="link" size="small" onClick={() => setOne(record.id, '已忽略')}>忽略</Button></Space> },
  ]
  const counts = issues.reduce((result, issue) => ({ ...result, [issue.status]: (result[issue.status] || 0) + 1 }), {})
  return <section>{contextHolder}<div className="quality-grid">{qualityDimensions.map((item) => <Card size="small" key={item.key}><Progress type="circle" size={72} percent={item.score} /><div><strong>{item.name}</strong><Text type="secondary">{item.issues} 个问题 · {item.status}</Text></div></Card>)}</div><div className="section-heading"><div><Title level={5}>质量问题与处理建议</Title><Text type="secondary">待处理 {counts['待处理'] || 0} · 待复核 {counts['待人工复核'] || 0} · 已处理/忽略 {(counts['已接受建议'] || 0) + (counts['已忽略'] || 0)}</Text></div><Space><Button disabled={!pending} onClick={() => updateAll('accept')}>全部接受</Button><Button disabled={!pending} onClick={() => updateAll('review')}>全部复核</Button><Button danger disabled={!pending} onClick={() => updateAll('ignore')}>全部忽略</Button></Space></div><Table rowKey="id" size="small" columns={columns} dataSource={issues} pagination={false} scroll={{ x: 1220 }} /></section>
}

function MetadataEditor({ task, metadata, onChange }) {
  const columns = [{ title: '字段名称', dataIndex: 'key' }, { title: '中文名称', dataIndex: 'name' }, { title: '类型', dataIndex: 'type' }, { title: '可为空', dataIndex: 'nullable' }, { title: '示例值', dataIndex: 'example' }]
  return <section className="governance-section-stack"><Card size="small" title="技术元数据" extra={<Text type="secondary">自动采集结果</Text>}><Descriptions bordered column={3} items={[{ key: 1, label: '表名或文件名', children: task.object }, { key: 2, label: '数据规模', children: task.volume }, { key: 3, label: '更新时间', children: task.updateTime }]} /><Table className="metadata-table" rowKey="key" size="small" columns={columns} dataSource={metadataFields} pagination={false} /></Card><Card title="业务元数据" extra={<Text type="secondary">请确认治理后的业务定义与责任信息</Text>}><div className="metadata-groups"><div><Title level={5}>业务定义</Title><Row gutter={[16, 4]}><Col span={12}><label>中文名称</label><Input value={metadata.chineseName} onChange={(event) => onChange({ ...metadata, chineseName: event.target.value })} /></Col><Col span={24}><label>业务含义</label><Input.TextArea rows={3} value={metadata.meaning} onChange={(event) => onChange({ ...metadata, meaning: event.target.value })} /></Col></Row></div><div><Title level={5}>责任信息</Title><Row gutter={[16, 4]}><Col span={12}><label>数据责任部门</label><Input value={metadata.department} onChange={(event) => onChange({ ...metadata, department: event.target.value })} /></Col><Col span={12}><label>数据负责人</label><Input value={metadata.owner} onChange={(event) => onChange({ ...metadata, owner: event.target.value })} /></Col></Row></div><div><Title level={5}>更新与使用</Title><Row gutter={[16, 4]}><Col span={8}><label>更新周期</label><Select value={metadata.frequency} className="full-width" options={['实时', '每天', '每周', '每月'].map((value) => ({ value, label: value }))} onChange={(frequency) => onChange({ ...metadata, frequency })} /></Col><Col span={16}><label>使用场景</label><Input value={metadata.scenario} onChange={(event) => onChange({ ...metadata, scenario: event.target.value })} /></Col></Row></div></div></Card></section>
}

function ClassificationPanel({ classification, onChange }) {
  const tagOptions = ['输电线路', 'GIS', '高程数据', '工程设计', '华南地区', '高频使用', '高价值数据', '外部数据', '三维模型']
  const domain = catalogTree.find((item) => item.key === classification.domainKey)
  const second = domain?.children?.find((item) => item.key === classification.secondKey)
  const changeDomain = (domainKey) => onChange({ ...classification, domainKey, secondKey: '', catalogKey: '' })
  const changeSecond = (secondKey) => onChange({ ...classification, secondKey, catalogKey: '' })
  return <section className="governance-section-stack"><Alert type="success" showIcon title="已结合字段语义、来源系统和使用场景生成分类分级建议" /><Card title="目录分类" extra={<Text type="secondary">与数据资产目录共用同一套三级分类</Text>}><Row gutter={[16, 4]}><Col span={8}><label>一级业务域</label><Select value={classification.domainKey || undefined} className="full-width" options={catalogDomainOptions} onChange={changeDomain} /></Col><Col span={8}><label>二级分类</label><Select value={classification.secondKey || undefined} className="full-width" options={(domain?.children || []).map((item) => ({ value: item.key, label: item.title }))} onChange={changeSecond} /></Col><Col span={8}><label>三级分类节点</label><Select value={classification.catalogKey || undefined} className="full-width" options={(second?.children || []).map((item) => ({ value: item.key, label: item.title }))} onChange={(catalogKey) => onChange({ ...classification, catalogKey })} /></Col></Row>{classification.catalogKey && <Alert className="classification-path" type="info" message={`推荐目录路径：${getCatalogPath(classification.catalogKey)}`} />}</Card><Row gutter={16}><Col span={12}><Card title="数据属性" className="classification-card"><label>数据形态</label><Select value={classification.form} className="full-width" options={['结构化数据', '文档资料', 'GIS 数据', '三维模型', 'API 服务'].map((value) => ({ value, label: value }))} onChange={(form) => onChange({ ...classification, form })} /><label>生命周期阶段</label><Select value={classification.lifecycle} className="full-width" options={['勘测', '设计', '建设', '知识沉淀'].map((value) => ({ value, label: value }))} onChange={(lifecycle) => onChange({ ...classification, lifecycle })} /></Card></Col><Col span={12}><Card title="安全等级" className="classification-card"><Radio.Group value={classification.security} options={['一般数据', '重要数据', '核心数据']} onChange={(event) => onChange({ ...classification, security: event.target.value })} />{classification.security === '核心数据' && <Alert className="security-alert" type="error" showIcon title="核心数据仅限授权范围内使用，不允许直接在数据产品门户公开上架。" />}</Card></Col></Row><Card title="业务标签" extra={<Text type="secondary">标签独立于三级目录分类</Text>}><Checkbox.Group className="governance-tag-options" value={classification.tags} options={tagOptions} onChange={(tags) => onChange({ ...classification, tags })} /></Card></section>
}

function GovernanceWorkspaceDrawer({ open, task, draft, onDraftChange, onClose, onSaveExit, onComplete, onSubmitCatalog, onGoCatalog }) {
  const { message, modal } = App.useApp()
  const [executionIndex, setExecutionIndex] = useState(-1)
  const timerRef = useRef(null)
  useEffect(() => () => clearInterval(timerRef.current), [])
  if (!task || !draft) return null
  const { phase, currentStep, enabledRules, issues, metadata, classification } = draft
  const update = (patch) => onDraftChange(patch)
  const resolvedCount = issues.filter((item) => ['已接受建议', '已忽略'].includes(item.status)).reduce((sum, item) => sum + item.count, 0)
  const reviewCount = issues.filter((item) => item.status === '待人工复核').reduce((sum, item) => sum + item.count, 0)
  const startExecution = () => {
    update({ phase: 'executing' }); setExecutionIndex(0)
    let index = 0
    timerRef.current = setInterval(() => { index += 1; if (index >= governanceExecutionStages.length) { clearInterval(timerRef.current); setExecutionIndex(governanceExecutionStages.length); update({ phase: 'workspace', currentStep: 0 }); message.success('自动治理执行完成，请逐步确认规则、问题处理和分类分级结果') } else setExecutionIndex(index) }, 450)
  }
  const next = () => {
    if (currentStep === 0 && !enabledRules.length) return message.warning('请至少启用一项标准化规则')
    if (currentStep === 1 && issues.some((issue) => issue.severity === '高' && issue.status === '待处理')) return message.warning('仍有高严重程度问题未确认，请接受建议、转人工复核或忽略后继续')
    if (currentStep === 2 && (!metadata.chineseName.trim() || !metadata.meaning.trim() || !metadata.department.trim())) return message.warning('请完善中文名称、业务含义和责任部门')
    if (currentStep === 3 && !classification.catalogKey) return message.warning('请完成一级、二级和三级目录分类')
    update({ currentStep: Math.min(4, currentStep + 1) })
  }
  const resultItems = [{ key: 1, label: '治理状态', children: <Tag color="success">已完成</Tag> }, { key: 2, label: '原始记录数', children: task.records.toLocaleString() }, { key: 3, label: '有效记录数', children: (task.records - reviewCount).toLocaleString() }, { key: 4, label: '修复记录数', children: `${resolvedCount} 条` }, { key: 5, label: '待人工复核数', children: `${reviewCount} 条` }, { key: 6, label: '治理前评分', children: `${task.score}%` }, { key: 7, label: '治理后评分', children: '97.8%' }, { key: 8, label: '补充元数据', children: '18 项' }, { key: 9, label: '生成标签', children: `${classification.tags.length} 个` }, { key: 10, label: '推荐目录路径', children: getCatalogPath(classification.catalogKey) }, { key: 11, label: '推荐安全等级', children: classification.security }]
  const panels = [
    <StandardizationRules key="rules" task={task} enabledRules={enabledRules} onChange={(value) => update({ enabledRules: value })} />,
    <QualityAssessment key="quality" issues={issues} onChange={(value) => update({ issues: value })} />,
    <MetadataEditor key="metadata" task={task} metadata={metadata} onChange={(value) => update({ metadata: value })} />,
    <ClassificationPanel key="classification" classification={classification} onChange={(value) => update({ classification: value })} />,
    <div key="confirm"><Row gutter={16} className="comparison-grid"><Col span={6}><Card><Statistic title="治理前评分" value={task.score} suffix="%" /></Card></Col><Col span={6}><Card><Statistic title="治理后评分" value={97.8} suffix="%" /></Card></Col><Col span={6}><Card><Statistic title="修复问题" value={resolvedCount} suffix="条" /></Card></Col><Col span={6}><Card><Statistic title="待人工复核" value={reviewCount} suffix="条" /></Card></Col></Row><Descriptions bordered column={2} items={[{ key: 1, label: '补充元数据', children: '18 项' }, { key: 2, label: '生成标签', children: `${classification.tags.length} 个` }, { key: 3, label: '推荐目录位置', children: getCatalogPath(classification.catalogKey) }, { key: 4, label: '安全等级', children: classification.security }]} /></div>,
  ]
  const overview = <Descriptions bordered size="small" column={4} items={[{ key: 1, label: '数据名称', children: task.object }, { key: 2, label: '来源数据源', children: task.source }, { key: 3, label: '数据类型', children: task.type }, { key: 4, label: '业务领域', children: task.domain }, { key: 5, label: '所属地区', children: task.region }, { key: 6, label: '数据规模', children: task.volume }, { key: 7, label: '字段数量', children: `${task.fields} 个` }, { key: 8, label: '最近接入', children: task.accessTime }, { key: 9, label: '当前质量', children: `${task.score}%` }, { key: 10, label: '推荐分类', children: getCatalogPath(classification.catalogKey) }, { key: 11, label: '安全等级', children: <Tag color={task.security === '重要数据' ? 'orange' : 'blue'}>{task.security}</Tag> }]} />

  return <Drawer title={task.name} size="large" open={open} onClose={onClose} destroyOnHidden={false}><div className="workspace-overview">{overview}</div>{phase === 'ready' && <div className="governance-ready"><SafetyCertificateOutlined /><Title level={3}>治理规则已就绪</Title><Text type="secondary">已识别 {task.fields} 个字段，并推荐 {enabledRules.length} 项标准化规则。确认规则后启动自动治理。</Text><StandardizationRules task={task} enabledRules={enabledRules} onChange={(value) => update({ enabledRules: value })} /><Space><Button onClick={onSaveExit}>保存并退出</Button><Button type="primary" size="large" icon={<PlayCircleOutlined />} onClick={startExecution}>启动治理</Button></Space></div>}{phase === 'executing' && <div className="governance-execution"><Title level={4}>正在执行数据治理</Title><Progress percent={Math.round((executionIndex / governanceExecutionStages.length) * 100)} status="active" /><Steps orientation="vertical" current={executionIndex} items={governanceExecutionStages.map((title, index) => ({ title, description: index < executionIndex ? '已完成' : index === executionIndex ? '执行中' : '等待执行', status: index < executionIndex ? 'finish' : index === executionIndex ? 'process' : 'wait' }))} /></div>}{phase === 'workspace' && <div className="governance-workspace"><Steps current={currentStep} items={stepTitles.map((title) => ({ title }))} /><div className="governance-step-panel">{panels[currentStep]}</div><div className="governance-step-actions"><Button onClick={onSaveExit}>保存并退出</Button><Space>{currentStep > 0 && <Button onClick={() => update({ currentStep: currentStep - 1 })}>上一步</Button>}{currentStep < 4 ? <Button type="primary" onClick={next}>下一步</Button> : <Button type="primary" icon={<CheckCircleFilled />} onClick={onComplete}>确认完成治理</Button>}</Space></div></div>}{phase === 'completed' && <Result status="success" title="数据治理已完成" subTitle={task.catalogSubmission === 'submitted' ? `治理成果已提交，资产编号：${task.assetCode}` : '数据已达到待编目要求，可提交至数据资产目录。'} extra={<Space wrap><Button icon={<FileDoneOutlined />} onClick={() => modal.info({ title: '数据治理报告', width: 620, content: <Descriptions bordered column={1} items={resultItems} /> })}>查看治理报告</Button>{task.catalogSubmission !== 'submitted' && <Button type="primary" onClick={onSubmitCatalog}>提交至资产目录</Button>}{task.catalogSubmission === 'submitted' && <Button type="primary" onClick={onGoCatalog}>前往数据资产目录</Button>}<Button onClick={onClose}>返回任务列表</Button></Space>}><Descriptions bordered column={2} items={resultItems} /></Result>}</Drawer>
}

export default GovernanceWorkspaceDrawer
