import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircleFilled, CloudUploadOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Col, Descriptions, Divider, Drawer, Form, Input, InputNumber, Progress, Radio, Result, Row, Select, Space, Spin, Steps, Switch, Table, Tag, TimePicker, Typography, Upload, message } from 'antd'
import { businessDomains, executionStages, previewProfiles, regions, sourceTypeGroups } from '../../../mock/dataAccess'

const { Text, Title } = Typography
const { Dragger } = Upload
const fieldColumns = [
  { title: '字段名称', dataIndex: 0, width: 150 }, { title: '字段含义', dataIndex: 1, width: 160 },
  { title: '识别类型', dataIndex: 2, width: 110, render: (value) => <Tag color="blue">{value}</Tag> },
  { title: '示例值', dataIndex: 3, width: 180 }, { title: '业务标签', dataIndex: 4, render: (value) => <Tag color="geekblue">{value}</Tag> },
]

function ConnectionFields({ group }) {
  if (group === 'database') return <Row gutter={16}><Col span={16}><Form.Item name="host" label="主机地址" rules={[{ required: true }]}><Input placeholder="例如：10.20.30.40" /></Form.Item></Col><Col span={8}><Form.Item name="port" label="端口" rules={[{ required: true }]}><InputNumber className="full-width" placeholder="5432" /></Form.Item></Col><Col span={12}><Form.Item name="database" label="数据库名称" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={12}><Form.Item name="schema" label="数据表或 Schema" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={12}><Form.Item name="username" label="用户名" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={12}><Form.Item name="password" label="密码" rules={[{ required: true }]}><Input.Password autoComplete="new-password" /></Form.Item></Col></Row>
  if (group === 'api') return <><Form.Item name="apiUrl" label="接口地址" rules={[{ required: true }, { type: 'url' }]}><Input placeholder="https://api.example.cn/v1/data" /></Form.Item><Row gutter={16}><Col span={8}><Form.Item name="method" label="请求方式" rules={[{ required: true }]}><Select options={['GET', 'POST'].map((value) => ({ value, label: value }))} /></Form.Item></Col><Col span={16}><Form.Item name="auth" label="认证方式" rules={[{ required: true }]}><Select options={['Bearer Token', 'API Key', 'Basic Auth', '无需认证'].map((value) => ({ value, label: value }))} /></Form.Item></Col></Row><Form.Item name="headers" label="请求头"><Input.TextArea rows={2} placeholder='例如：{"Content-Type":"application/json"}' /></Form.Item><Form.Item name="params" label="请求参数"><Input.TextArea rows={2} placeholder='例如：{"region":"广东省"}' /></Form.Item></>
  if (group === 'gis') return <><Form.Item name="files" label="GIS 文件"><Dragger beforeUpload={() => false} maxCount={1}><p className="ant-upload-drag-icon"><CloudUploadOutlined /></p><p>点击或拖拽 Shapefile、GeoJSON、GeoTIFF、DEM 文件</p><Text type="secondary">Demo 仅展示文件选择，不会真实上传</Text></Dragger></Form.Item><Row gutter={16}><Col span={8}><Form.Item name="coordinate" label="坐标系" rules={[{ required: true }]}><Select options={['CGCS2000', 'WGS84', '西安80'].map((value) => ({ value, label: value }))} /></Form.Item></Col><Col span={8}><Form.Item name="layerType" label="图层类型" rules={[{ required: true }]}><Select options={['线要素', '点要素', '面要素', '栅格'].map((value) => ({ value, label: value }))} /></Form.Item></Col><Col span={8}><Form.Item name="fileFormat" label="文件格式" rules={[{ required: true }]}><Select options={['Shapefile', 'GeoJSON', 'GeoTIFF', 'DEM', 'DOM'].map((value) => ({ value, label: value }))} /></Form.Item></Col></Row><Form.Item name="extent" label="空间范围"><Input placeholder="例如：广东省输电通道范围" /></Form.Item></>
  if (group === 'file' || group === 'design') return <><Form.Item name="files" label="选择文件"><Dragger beforeUpload={() => false} maxCount={1}><p className="ant-upload-drag-icon"><CloudUploadOutlined /></p><p>点击或拖拽文件到此区域</p><Text type="secondary">Demo 不会执行真实文件上传</Text></Dragger></Form.Item><Row gutter={16}><Col span={12}><Form.Item name="fileFormat" label="文件格式" rules={[{ required: true }]}><Select options={(group === 'design' ? ['DWG', 'DXF', 'IFC', 'RVT'] : ['Excel', 'CSV', 'JSON', 'XML']).map((value) => ({ value, label: value }))} /></Form.Item></Col><Col span={12}><Form.Item name="encoding" label="编码方式" rules={[{ required: true }]}><Select options={['UTF-8', 'GBK', '自动识别'].map((value) => ({ value, label: value }))} /></Form.Item></Col></Row></>
  return <><Row gutter={16}><Col span={12}><Form.Item name="broker" label="服务地址" rules={[{ required: true }]}><Input placeholder="10.20.30.40:9092" /></Form.Item></Col><Col span={12}><Form.Item name="topic" label="Topic / 点位组" rules={[{ required: true }]}><Input placeholder="wind-monitor-hourly" /></Form.Item></Col></Row><Row gutter={16}><Col span={12}><Form.Item name="consumerGroup" label="消费组"><Input placeholder="data-access-platform" /></Form.Item></Col><Col span={12}><Form.Item name="protocol" label="传输协议"><Select options={['PLAINTEXT', 'SASL_SSL', 'TLS'].map((value) => ({ value, label: value }))} /></Form.Item></Col></Row></>
}

function CreateAccessDrawer({ open, initialGroup, onClose, onCreated, onGoGovernance }) {
  const [messageApi, contextHolder] = message.useMessage()
  const [current, setCurrent] = useState(0)
  const [connected, setConnected] = useState(false)
  const [testing, setTesting] = useState(false)
  const [executionIndex, setExecutionIndex] = useState(-1)
  const [completed, setCompleted] = useState(false)
  const [sourceValues, setSourceValues] = useState({})
  const [syncValues, setSyncValues] = useState({ syncMode: 'incremental', frequency: 'daily' })
  const [sourceForm] = Form.useForm()
  const [connectionForm] = Form.useForm()
  const [syncForm] = Form.useForm()
  const timerRef = useRef(null)
  const group = Form.useWatch('group', sourceForm) || initialGroup || 'database'
  const profile = previewProfiles[group]
  const groupConfig = sourceTypeGroups.find((item) => item.key === group)

  useEffect(() => () => clearInterval(timerRef.current), [])
  useEffect(() => {
    if (!open) return
    sourceForm.setFieldsValue({ group: initialGroup || 'database', type: sourceTypeGroups.find((item) => item.key === (initialGroup || 'database'))?.types[0], domain: '勘测数据', region: '广东省', department: '勘测工程中心' })
    syncForm.setFieldsValue({ syncMode: 'incremental', frequency: 'daily', autoMetadata: true, autoQuality: true, autoClassify: true })
  }, [initialGroup, open, sourceForm, syncForm])

  const typeOptions = useMemo(() => groupConfig?.types.map((value) => ({ value, label: value })) || [], [groupConfig])
  const resetFlow = () => { clearInterval(timerRef.current); setCurrent(0); setConnected(false); setTesting(false); setExecutionIndex(-1); setCompleted(false); setSourceValues({}); setSyncValues({ syncMode: 'incremental', frequency: 'daily' }); sourceForm.resetFields(); connectionForm.resetFields(); syncForm.resetFields() }
  const closeFlow = () => { resetFlow(); onClose() }
  const handleGroupChange = (value) => { const next = sourceTypeGroups.find((item) => item.key === value); sourceForm.setFieldValue('type', next.types[0]); connectionForm.resetFields(); setConnected(false) }
  const handleNext = async () => {
    if (current === 0) setSourceValues(await sourceForm.validateFields())
    if (current === 1) { await connectionForm.validateFields(); if (!connected) { messageApi.warning('请先测试连接，确认数据源可访问'); return } }
    setCurrent((value) => value + 1)
  }
  const handleTest = async () => { await connectionForm.validateFields(); setTesting(true); setTimeout(() => { setTesting(false); setConnected(true); messageApi.success('连接测试成功，已识别数据结构') }, 900) }
  const startExecution = async () => {
    const finalSyncValues = await syncForm.validateFields(); setExecutionIndex(0); setCompleted(false)
    let index = 0
    timerRef.current = setInterval(() => {
      index += 1
      if (index >= executionStages.length) {
        clearInterval(timerRef.current); setExecutionIndex(executionStages.length); setCompleted(true)
        onCreated({ ...sourceValues, ...finalSyncValues, profile })
      } else setExecutionIndex(index)
    }, 650)
  }

  const summaryItems = [
    { key: 1, label: '数据源名称', children: sourceValues.name || '—' }, { key: 2, label: '接入类型', children: `${groupConfig?.title} / ${sourceValues.type || '—'}` },
    { key: 3, label: '业务领域', children: sourceValues.domain || '—' }, { key: 4, label: '所属地区', children: sourceValues.region || '—' },
    { key: 5, label: '同步方式', children: syncValues.syncMode === 'full' ? '全量接入' : '增量接入' }, { key: 6, label: '更新频率', children: ({ manual: '手动', daily: '每天', weekly: '每周', monthly: '每月' })[syncValues.frequency] || '每天' },
  ]

  const stepContent = [
    <Form key="source" form={sourceForm} layout="vertical" className="access-form"><Alert showIcon type="info" message="选择数据来源并补充业务归属信息，平台将据此推荐预览规则。" /><Row gutter={16}><Col span={12}><Form.Item name="group" label="数据源大类" rules={[{ required: true }]}><Select options={sourceTypeGroups.map(({ key, title }) => ({ value: key, label: title }))} onChange={handleGroupChange} /></Form.Item></Col><Col span={12}><Form.Item name="type" label="具体数据源类型" rules={[{ required: true }]}><Select options={typeOptions} /></Form.Item></Col><Col span={24}><Form.Item name="name" label="数据源名称" rules={[{ required: true, message: '请输入数据源名称' }]}><Input placeholder="例如：广东输电线路路径 GIS 成果" /></Form.Item></Col><Col span={12}><Form.Item name="domain" label="所属业务领域" rules={[{ required: true }]}><Select options={businessDomains.map((value) => ({ value, label: value }))} /></Form.Item></Col><Col span={12}><Form.Item name="region" label="所属地区" rules={[{ required: true }]}><Select showSearch options={regions.map((value) => ({ value, label: value }))} /></Form.Item></Col><Col span={24}><Form.Item name="department" label="责任部门" rules={[{ required: true }]}><Input /></Form.Item></Col></Row></Form>,
    <Form key="connection" form={connectionForm} layout="vertical" className="access-form"><Alert showIcon type="warning" message="仅用于 Demo 配置展示，请勿填写真实生产地址或密码。" /><ConnectionFields group={group} />{connected && <Alert className="connection-result" showIcon type="success" message="连接成功" description={`已识别 ${profile.objectCount} 个数据对象、${profile.fieldCount} 个字段，可进入数据预览。`} />}</Form>,
    <div key="preview" className="access-preview"><Alert showIcon type="success" message="数据结构识别完成" description={`识别对象 ${profile.objectName}，并自动匹配业务字段与标签。`} /><div className="preview-metrics"><Card size="small"><Text type="secondary">数据对象</Text><strong>{profile.objectCount}</strong></Card><Card size="small"><Text type="secondary">字段数量</Text><strong>{profile.fieldCount}</strong></Card><Card size="small"><Text type="secondary">数据行数</Text><strong>{profile.rowCount}</strong></Card><Card size="small"><Text type="secondary">预计数据量</Text><strong>{profile.volume}</strong></Card></div><Title level={5}>字段结构与样例数据</Title><Table size="small" rowKey={(_, index) => index} columns={fieldColumns} dataSource={profile.fields} pagination={false} scroll={{ x: 720 }} /><Space wrap className="recognized-tags"><Text strong>自动识别标签：</Text><Tag color="blue">华南地区</Tag><Tag color="geekblue">{sourceValues.domain || '勘测数据'}</Tag><Tag color="cyan">工程设计成果</Tag><Tag color="purple">可采集元数据</Tag></Space></div>,
    <div key="sync" className="access-confirm"><Form form={syncForm} layout="vertical"><Row gutter={16}><Col span={12}><Form.Item name="syncMode" label="接入方式" rules={[{ required: true }]}><Radio.Group options={[{ value: 'full', label: '全量接入' }, { value: 'incremental', label: '增量接入' }]} /></Form.Item></Col><Col span={12}><Form.Item name="frequency" label="更新频率" rules={[{ required: true }]}><Select options={[['manual', '手动'], ['daily', '每天'], ['weekly', '每周'], ['monthly', '每月']].map(([value, label]) => ({ value, label }))} /></Form.Item></Col><Col span={12}><Form.Item name="executeTime" label="执行时间"><TimePicker format="HH:mm" className="full-width" /></Form.Item></Col></Row><div className="automation-options"><Form.Item name="autoMetadata" valuePropName="checked" label="自动采集元数据"><Switch /></Form.Item><Form.Item name="autoQuality" valuePropName="checked" label="自动质量检查"><Switch /></Form.Item><Form.Item name="autoClassify" valuePropName="checked" label="自动识别分类与标签"><Switch /></Form.Item></div></Form><Divider orientation="left">接入配置摘要</Divider><Descriptions bordered column={2} items={summaryItems} /></div>,
  ]

  return (
    <Drawer title="新建数据接入" width={920} open={open} onClose={closeFlow} destroyOnHidden footer={!completed && executionIndex < 0 ? <div className="drawer-footer"><Button onClick={closeFlow}>取消</Button><Space>{current > 0 && <Button onClick={() => setCurrent((value) => value - 1)}>上一步</Button>}{current === 1 && <Button icon={<PlayCircleOutlined />} loading={testing} onClick={handleTest}>测试连接</Button>}{current < 3 ? <Button type="primary" onClick={handleNext}>下一步</Button> : <Button type="primary" onClick={startExecution}>创建接入任务</Button>}</Space></div> : null}>
      {contextHolder}
      {executionIndex < 0 ? <><Steps current={current} items={['选择数据源', '配置连接', '预览与识别', '同步配置'].map((title) => ({ title }))} /><div className="access-step-content">{stepContent[current]}</div></> : completed ? <Result status="success" title="数据接入任务执行成功" subTitle={`任务编号：ACCESS-20260715-${String(Date.now()).slice(-4)}，数据已写入原始数据区。`} extra={<Space wrap><Button onClick={() => messageApi.info('接入结果已在下方展示')}>查看接入结果</Button><Button onClick={onGoGovernance}>前往数据治理</Button><Button type="primary" onClick={closeFlow}>返回数据源列表</Button></Space>}><Descriptions bordered column={2} items={[['接入数据量', profile.volume], ['数据对象数量', `${profile.objectCount} 个`], ['识别字段数量', `${profile.fieldCount} 个`], ['生成元数据', `${profile.fieldCount + 12} 项`], ['质量问题', '3 项（均为提示级）'], ['推荐业务分类', sourceValues.domain || '勘测数据'], ['推荐安全等级', '一般数据'], ['接入状态', <Tag key="result-status" color="success">成功</Tag>]].map(([label, children], index) => ({ key: index, label, children }))} /></Result> : <div className="execution-panel"><Spin size="large" /><Title level={4}>正在执行数据接入任务</Title><Text type="secondary">平台正在建立连接、解析结构并完成元数据识别，请稍候。</Text><Progress percent={Math.round((executionIndex / executionStages.length) * 100)} status="active" /><Steps direction="vertical" current={executionIndex} items={executionStages.map((title, index) => ({ title, status: index < executionIndex ? 'finish' : index === executionIndex ? 'process' : 'wait', icon: index < executionIndex ? <CheckCircleFilled /> : undefined }))} /></div>}
    </Drawer>
  )
}

export default CreateAccessDrawer
