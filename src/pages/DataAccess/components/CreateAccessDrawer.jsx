import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircleFilled, CloudUploadOutlined, PlayCircleOutlined } from '@ant-design/icons'
import {
  Alert as AntAlert,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Progress,
  Radio,
  Result,
  Row,
  Select,
  Space,
  Spin,
  Steps,
  Switch,
  Table,
  Tag,
  TimePicker,
  Typography,
  Upload,
  message,
} from 'antd'
import {
  accessModes,
  businessDomains,
  executionStages,
  previewProfiles,
  regions,
  sourceTypeGroups,
} from '../../../mock/dataAccess'

const { Text, Title } = Typography
const { Dragger } = Upload
function Alert({ message, title, ...props }) {
  return <AntAlert {...props} title={title ?? message} />
}
const fieldColumns = [
  { title: '字段名称', dataIndex: 0, width: 150 },
  { title: '字段含义', dataIndex: 1, width: 160 },
  { title: '识别类型', dataIndex: 2, width: 110, render: (value) => <Tag color="blue">{value}</Tag> },
  { title: '示例值', dataIndex: 3, width: 180 },
  { title: '业务标签', dataIndex: 4, render: (value) => <Tag color="geekblue">{value}</Tag> },
]

const connectionDefaults = {
  database: {},
  api: { method: 'GET', auth: '无需认证' },
  file: { encoding: '自动识别' },
  gis: { encoding: '自动识别', coordinate: 'CGCS2000' },
  design: { encoding: '自动识别' },
  realtime: { protocol: 'PLAINTEXT' },
}

const encodingOptions = ['自动识别', 'UTF-8', 'GBK', 'GB2312', 'Big5', 'ISO-8859-1'].map((value) => ({ value, label: value }))

function EncodingField() {
  return <Form.Item name="encoding" label="编码方式" rules={[{ required: true }]}><Select options={encodingOptions} /></Form.Item>
}

function FileUpload({ text }) {
  return (
    <Form.Item label="选择文件">
      <Dragger beforeUpload={() => false} maxCount={1}>
        <p className="ant-upload-drag-icon"><CloudUploadOutlined /></p>
        <p>{text}</p>
        <Text type="secondary">Demo 仅展示文件选择，不执行真实文件上传</Text>
      </Dragger>
    </Form.Item>
  )
}

function SelectedTypeSummary({ groupConfig, type }) {
  const accessMode = accessModes.find((item) => item.key === groupConfig?.accessMode)
  return (
    <Alert
      className="selected-source-summary"
      showIcon
      type="info"
      title="已选择的接入分类"
      description={`${accessMode?.title || '—'} / ${groupConfig?.title || '—'} / ${type || '—'}；如需变更，请返回上一步。`}
    />
  )
}

function ConnectionFields({ group, type, groupConfig }) {
  if (group === 'database') {
    return <><SelectedTypeSummary groupConfig={groupConfig} type={type} /><Row gutter={16}><Col span={16}><Form.Item name="host" label="主机地址" rules={[{ required: true }]}><Input placeholder="例如：10.20.30.40" /></Form.Item></Col><Col span={8}><Form.Item name="port" label="端口" rules={[{ required: true }]}><InputNumber className="full-width" placeholder="5432" /></Form.Item></Col><Col span={12}><Form.Item name="database" label="数据库名称" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={12}><Form.Item name="schema" label="数据表或 Schema" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={12}><Form.Item name="username" label="用户名" rules={[{ required: true }]}><Input /></Form.Item></Col><Col span={12}><Form.Item name="password" label="密码" rules={[{ required: true }]}><Input.Password autoComplete="new-password" /></Form.Item></Col></Row></>
  }
  if (group === 'api') {
    return <><SelectedTypeSummary groupConfig={groupConfig} type={type} /><Form.Item name="apiUrl" label="接口地址" rules={[{ required: true }, { type: 'url' }]}><Input placeholder="https://api.example.cn/v1/data" /></Form.Item><Row gutter={16}><Col span={8}><Form.Item name="method" label="请求方式" rules={[{ required: true }]}><Select options={['GET', 'POST'].map((value) => ({ value, label: value }))} /></Form.Item></Col><Col span={16}><Form.Item name="auth" label="认证方式" rules={[{ required: true }]}><Select options={['Bearer Token', 'API Key', 'Basic Auth', '无需认证'].map((value) => ({ value, label: value }))} /></Form.Item></Col></Row><Form.Item name="headers" label="请求头"><Input.TextArea rows={2} placeholder='例如：{"Content-Type":"application/json"}' /></Form.Item><Form.Item name="params" label="请求参数"><Input.TextArea rows={2} placeholder='例如：{"region":"广东省"}' /></Form.Item></>
  }
  if (group === 'file') {
    return <><SelectedTypeSummary groupConfig={groupConfig} type={type} /><FileUpload text={`点击或拖拽 ${type || '文件'} 到此区域`} /><Row gutter={16}><Col span={12}><Form.Item label="文件类型"><Input readOnly value={type} /></Form.Item></Col><Col span={12}><EncodingField /></Col></Row></>
  }
  if (group === 'gis') {
    return <><SelectedTypeSummary groupConfig={groupConfig} type={type} /><FileUpload text={`点击或拖拽 ${type || 'GIS 文件'} 到此区域`} /><Alert className="gis-file-hint" type="info" showIcon message={`${type || '空间数据'}将按空间文件方式识别，Demo 不执行真实解析。`} /><Row gutter={16}><Col span={12}><Form.Item label="数据类型"><Input readOnly value={type} /></Form.Item></Col><Col span={12}><EncodingField /></Col><Col span={12}><Form.Item name="coordinate" label="坐标系" rules={[{ required: true }]}><Select options={['CGCS2000', 'WGS84', '西安80'].map((value) => ({ value, label: value }))} /></Form.Item></Col><Col span={12}><Form.Item name="extent" label="空间范围"><Input placeholder="例如：广东省输电通道范围" /></Form.Item></Col></Row></>
  }
  if (group === 'design') {
    return <><SelectedTypeSummary groupConfig={groupConfig} type={type} /><FileUpload text={`点击或拖拽 ${type || '设计成果'} 到此区域`} /><Row gutter={16}><Col span={8}><Form.Item name="fileVersion" label="文件版本"><Input placeholder="例如：2024" /></Form.Item></Col><Col span={8}><Form.Item name="designSoftware" label="设计软件"><Select options={['AutoCAD', 'Revit', 'Bentley', '其他'].map((value) => ({ value, label: value }))} /></Form.Item></Col><Col span={8}><Form.Item name="discipline" label="成果专业"><Select options={['输电', '变电', '勘测', '建筑结构'].map((value) => ({ value, label: value }))} /></Form.Item></Col></Row><Form.Item name="encoding" hidden><Input /></Form.Item></>
  }
  return <><SelectedTypeSummary groupConfig={groupConfig} type={type} /><Row gutter={16}><Col span={12}><Form.Item name="broker" label="服务地址" rules={[{ required: true }]}><Input placeholder="10.20.30.40:9092" /></Form.Item></Col><Col span={12}><Form.Item name="topic" label="Topic / 点位组" rules={[{ required: true }]}><Input placeholder="wind-monitor-hourly" /></Form.Item></Col></Row><Row gutter={16}><Col span={12}><Form.Item name="consumerGroup" label="消费组"><Input placeholder="data-access-platform" /></Form.Item></Col><Col span={12}><Form.Item name="protocol" label="传输协议"><Select options={['PLAINTEXT', 'SASL_SSL', 'TLS'].map((value) => ({ value, label: value }))} /></Form.Item></Col></Row></>
}

function SyncConfiguration({ form, sourceValues, groupConfig, type }) {
  const accessMode = accessModes.find((item) => item.key === groupConfig?.accessMode)
  return (
    <div className="access-confirm">
      <Form form={form} layout="vertical">
        <Form.Item name="syncMode" label="同步方式" rules={[{ required: true }]}><Radio.Group options={[{ value: 'full', label: '全量接入' }, { value: 'incremental', label: '增量接入' }]} /></Form.Item>
        <Form.Item noStyle shouldUpdate={(previous, current) => previous.frequency !== current.frequency}>
          {({ getFieldValue }) => <Row gutter={16}><Col span={12}><Form.Item name="frequency" label="更新频率" rules={[{ required: true }]}><Select options={[['manual', '手动'], ['daily', '每天'], ['weekly', '每周'], ['monthly', '每月']].map(([value, label]) => ({ value, label }))} /></Form.Item></Col><Col span={12}><Form.Item name="executeTime" label="执行时间" extra={getFieldValue('frequency') === 'manual' ? '手动接入不需要配置执行时间' : undefined}><TimePicker disabled={getFieldValue('frequency') === 'manual'} format="HH:mm" className="full-width" /></Form.Item></Col></Row>}
        </Form.Item>
        <div className="automation-options"><Form.Item name="autoMetadata" valuePropName="checked" label="自动采集元数据"><Switch /></Form.Item><Form.Item name="autoQuality" valuePropName="checked" label="自动质量检查"><Switch /></Form.Item><Form.Item name="autoClassify" valuePropName="checked" label="自动识别分类与标签"><Switch /></Form.Item></div>
        <Divider orientation="left">接入配置摘要</Divider>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => <Descriptions bordered column={2} items={[
            { key: 1, label: '数据源名称', children: sourceValues.name || '—' },
            { key: 2, label: '接入模式', children: accessMode?.title || '—' },
            { key: 3, label: '数据源类型', children: groupConfig?.title || '—' },
            { key: 4, label: '数据格式', children: sourceValues.type || type || '—' },
            { key: 5, label: '业务领域', children: sourceValues.domain || '—' },
            { key: 6, label: '所属地区', children: sourceValues.region || '—' },
            { key: 7, label: '同步方式', children: getFieldValue('syncMode') === 'full' ? '全量接入' : '增量接入' },
            { key: 8, label: '更新频率', children: ({ manual: '手动', daily: '每天', weekly: '每周', monthly: '每月' })[getFieldValue('frequency')] || '每天' },
          ]} />}
        </Form.Item>
      </Form>
    </div>
  )
}

function CreateAccessDrawer({ open, mode = 'general', presetGroup, onClose, onCreated, onGoGovernance }) {
  const [messageApi, contextHolder] = message.useMessage()
  const [current, setCurrent] = useState(0)
  const [connected, setConnected] = useState(false)
  const [testing, setTesting] = useState(false)
  const [executionIndex, setExecutionIndex] = useState(-1)
  const [completed, setCompleted] = useState(false)
  const [sourceValues, setSourceValues] = useState({})
  const [sourceForm] = Form.useForm()
  const [connectionForm] = Form.useForm()
  const [syncForm] = Form.useForm()
  const timerRef = useRef(null)
  const watchedAccessMode = Form.useWatch('accessMode', sourceForm)
  const watchedGroup = Form.useWatch('group', sourceForm)
  const watchedType = Form.useWatch('type', sourceForm)
  const group = watchedGroup || sourceValues.group
  const type = watchedType || sourceValues.type
  const profile = previewProfiles[group] || previewProfiles.database
  const groupConfig = sourceTypeGroups.find((item) => item.key === group)
  const accessMode = watchedAccessMode || sourceValues.accessMode || groupConfig?.accessMode
  const accessModeConfig = accessModes.find((item) => item.key === accessMode)
  const isPresetMode = mode === 'preset' && Boolean(presetGroup)

  const initializeFlow = useCallback(() => {
    clearInterval(timerRef.current)
    const initialGroup = isPresetMode ? presetGroup : undefined
    const initialAccessMode = sourceTypeGroups.find((item) => item.key === initialGroup)?.accessMode
    const initialType = initialGroup ? sourceTypeGroups.find((item) => item.key === initialGroup)?.types[0] : undefined
    setCurrent(0)
    setConnected(false)
    setTesting(false)
    setExecutionIndex(-1)
    setCompleted(false)
    setSourceValues({})
    sourceForm.resetFields()
    sourceForm.setFieldsValue({ accessMode: initialAccessMode, group: initialGroup, type: initialType, domain: '勘测数据', region: '广东省', department: '勘测工程中心' })
  }, [isPresetMode, presetGroup, sourceForm])

  useEffect(() => () => clearInterval(timerRef.current), [])
  useEffect(() => { if (open) initializeFlow() }, [initializeFlow, open])
  useEffect(() => {
    if (!open || current !== 1 || !group) return
    connectionForm.resetFields()
    connectionForm.setFieldsValue(connectionDefaults[group] || {})
  }, [connectionForm, current, group, open])
  useEffect(() => {
    if (!open || current !== 3) return
    syncForm.resetFields()
    syncForm.setFieldsValue({ syncMode: 'incremental', frequency: 'daily', autoMetadata: true, autoQuality: true, autoClassify: true })
  }, [current, open, syncForm])

  const sourceTypeOptions = useMemo(() => sourceTypeGroups.filter((item) => !accessMode || item.accessMode === accessMode).map(({ key, title }) => ({ value: key, label: title })), [accessMode])
  const typeOptions = useMemo(() => groupConfig?.types.map((value) => ({ value, label: value })) || [], [groupConfig])
  const clearConnectionForSelection = () => setConnected(false)
  const handleAccessModeChange = (value) => {
    const next = sourceTypeGroups.find((item) => item.accessMode === value)
    sourceForm.setFieldsValue({ group: next?.key, type: next?.types[0] })
    clearConnectionForSelection()
  }
  const handleGroupChange = (value) => {
    const next = sourceTypeGroups.find((item) => item.key === value)
    sourceForm.setFieldsValue({ accessMode: next?.accessMode, type: next?.types[0] })
    clearConnectionForSelection(value)
  }
  const handleTypeChange = () => clearConnectionForSelection(group)
  const closeFlow = () => {
    clearInterval(timerRef.current)
    setCurrent(0)
    setConnected(false)
    setTesting(false)
    setExecutionIndex(-1)
    setCompleted(false)
    setSourceValues({})
    onClose()
  }
  const handleNext = async () => {
    if (current === 0) setSourceValues(await sourceForm.validateFields())
    if (current === 1) {
      await connectionForm.validateFields()
      if (!connected) { messageApi.warning('请先测试连接，确认数据源可访问'); return }
    }
    setCurrent((value) => value + 1)
  }
  const handlePrevious = () => setCurrent((value) => Math.max(0, value - 1))
  const handleTest = async () => {
    await connectionForm.validateFields()
    setTesting(true)
    setTimeout(() => { setTesting(false); setConnected(true); messageApi.success('连接测试成功，已识别数据结构') }, 700)
  }
  const startExecution = async () => {
    const finalSourceValues = sourceValues
    const finalSyncValues = await syncForm.validateFields()
    const connectionValues = connectionForm.getFieldsValue(true)
    setExecutionIndex(0)
    setCompleted(false)
    let index = 0
    timerRef.current = setInterval(() => {
      index += 1
      if (index >= executionStages.length) {
        clearInterval(timerRef.current)
        setExecutionIndex(executionStages.length)
        setCompleted(true)
        onCreated({ ...finalSourceValues, ...finalSyncValues, connection: connectionValues, profile })
      } else setExecutionIndex(index)
    }, 500)
  }

  const stepContent = [
    <Form key="source" form={sourceForm} layout="vertical" className="access-form">
      <Alert showIcon type="info" message={isPresetMode ? '当前数据源类型由快捷卡片确定；请选择该类型下的数据格式。' : '请选择接入模式、数据源类型并补充业务归属信息。'} />
      <Row gutter={16}>
        <Col span={8}>{isPresetMode ? <><Form.Item name="accessMode" hidden><Input /></Form.Item><Form.Item label="接入模式"><Input readOnly value={accessModeConfig?.title} /></Form.Item></> : <Form.Item name="accessMode" label="接入模式" rules={[{ required: true, message: '请选择接入模式' }]}><Select placeholder="请选择接入模式" options={accessModes.map(({ key, title }) => ({ value: key, label: title }))} onChange={handleAccessModeChange} /></Form.Item>}</Col>
        <Col span={8}>{isPresetMode ? <><Form.Item name="group" hidden><Input /></Form.Item><Form.Item label="数据源类型"><Input readOnly value={groupConfig?.title} /></Form.Item></> : <Form.Item name="group" label="数据源类型" rules={[{ required: true, message: '请选择数据源类型' }]}><Select disabled={!accessMode} placeholder="请选择数据源类型" options={sourceTypeOptions} onChange={handleGroupChange} /></Form.Item>}</Col>
        <Col span={8}><Form.Item name="type" label="数据格式" rules={[{ required: true, message: '请选择数据格式' }]}><Select disabled={!group} options={typeOptions} onChange={handleTypeChange} /></Form.Item></Col>
        <Col span={24}><Form.Item name="name" label="数据源名称" rules={[{ required: true, message: '请输入数据源名称' }]}><Input placeholder="例如：广东输电线路路径 GIS 成果" /></Form.Item></Col>
        <Col span={12}><Form.Item name="domain" label="所属业务领域" rules={[{ required: true }]}><Select options={businessDomains.map((value) => ({ value, label: value }))} /></Form.Item></Col>
        <Col span={12}><Form.Item name="region" label="所属地区" rules={[{ required: true }]}><Select showSearch options={regions.map((value) => ({ value, label: value }))} /></Form.Item></Col>
        <Col span={24}><Form.Item name="department" label="责任部门" rules={[{ required: true }]}><Input /></Form.Item></Col>
      </Row>
    </Form>,
    <Form key={`${group}-${type}`} form={connectionForm} layout="vertical" className="access-form"><Alert showIcon type="warning" message="仅用于 Demo 配置展示，请勿填写真实生产地址或密码。" /><ConnectionFields group={group} type={type} groupConfig={groupConfig} />{connected && <Alert className="connection-result" showIcon type="success" message="连接成功" description={`已识别 ${profile.objectCount} 个数据对象、${profile.fieldCount} 个字段，可进入数据预览。`} />}</Form>,
    <div key="preview" className="access-preview"><Alert showIcon type="success" message="数据结构识别完成" description={`识别对象 ${profile.objectName}，并自动匹配业务字段与标签。`} /><div className="preview-metrics"><Card size="small"><Text type="secondary">数据对象</Text><strong>{profile.objectCount}</strong></Card><Card size="small"><Text type="secondary">字段数量</Text><strong>{profile.fieldCount}</strong></Card><Card size="small"><Text type="secondary">数据行数</Text><strong>{profile.rowCount}</strong></Card><Card size="small"><Text type="secondary">预计数据量</Text><strong>{profile.volume}</strong></Card></div><Title level={5}>字段结构与样例数据</Title><Table size="small" rowKey={(_, index) => index} columns={fieldColumns} dataSource={profile.fields} pagination={false} scroll={{ x: 720 }} /><Space wrap className="recognized-tags"><Text strong>自动识别标签：</Text><Tag color="blue">华南地区</Tag><Tag color="geekblue">{sourceValues.domain || '勘测数据'}</Tag><Tag color="cyan">工程设计成果</Tag><Tag color="purple">可采集元数据</Tag></Space></div>,
    <SyncConfiguration key="sync" form={syncForm} sourceValues={sourceValues} groupConfig={groupConfig} type={type} />,
  ]

  return (
    <Drawer title="新建数据接入" size={920} open={open} onClose={closeFlow} forceRender footer={!completed && executionIndex < 0 ? <div className="drawer-footer"><Button onClick={closeFlow}>取消</Button><Space>{current > 0 && <Button onClick={handlePrevious}>上一步</Button>}{current === 1 && <Button icon={<PlayCircleOutlined />} loading={testing} onClick={handleTest}>测试连接</Button>}{current < 3 ? <Button type="primary" onClick={handleNext}>下一步</Button> : <Button type="primary" onClick={startExecution}>创建接入任务</Button>}</Space></div> : null}>
      {contextHolder}
      {executionIndex < 0 ? <><Steps current={current} items={['选择数据源', '配置连接', '预览与识别', '同步配置'].map((title) => ({ title }))} /><div className="access-step-content">{stepContent[current]}</div></> : completed ? <Result status="success" title="数据接入任务执行成功" subTitle={`任务编号：ACCESS-20260715-${String(Date.now()).slice(-4)}，数据已写入原始数据区。`} extra={<Space wrap><Button onClick={onGoGovernance}>前往数据治理</Button><Button type="primary" onClick={closeFlow}>返回数据源列表</Button></Space>}><Descriptions bordered column={2} items={[['接入数据量', profile.volume], ['数据表或文件数量', `${profile.objectCount} 个`], ['识别字段数量', `${profile.fieldCount} 个`], ['生成元数据数量', `${profile.fieldCount + 12} 项`], ['质量问题数量', '3 项（均为提示级）'], ['推荐业务分类', sourceValues.domain || '勘测数据'], ['推荐安全等级', '一般数据'], ['接入状态', <Tag key="result-status" color="success">成功</Tag>]].map(([label, children], index) => ({ key: index, label, children }))} /></Result> : <div className="execution-panel"><Spin size="large" /><Title level={4}>正在执行数据接入任务</Title><Text type="secondary">平台正在建立连接、解析结构并完成元数据识别，请稍候。</Text><Progress percent={Math.round((executionIndex / executionStages.length) * 100)} status="active" /><Steps orientation="vertical" current={executionIndex} items={executionStages.map((title, index) => ({ title, status: index < executionIndex ? 'finish' : index === executionIndex ? 'process' : 'wait', icon: index < executionIndex ? <CheckCircleFilled /> : undefined }))} /></div>}
    </Drawer>
  )
}

export default CreateAccessDrawer
