import { useEffect } from 'react'
import { Alert, Button, Col, Drawer, Form, Input, Row, Select, Space, Switch } from 'antd'
import { businessDomains, getDataSourceClassification, regions } from '../../../mock/dataAccess'

const frequencyOptions = ['手动', '每小时', '每天 00:30', '每天 01:30', '每天 02:00', '每天 04:00', '每天 06:00', '每周日', '每月 1 日', '实时']

function ConnectionEditFields({ group }) {
  if (group === 'database') return <><Form.Item name="host" label="主机地址"><Input /></Form.Item><Form.Item name="credential" label="重新填写凭据"><Input.Password autoComplete="new-password" placeholder="留空表示不修改原凭据" /></Form.Item></>
  if (group === 'api') return <><Form.Item name="host" label="接口地址"><Input /></Form.Item><Form.Item name="credential" label="重新填写 Token / 密钥"><Input.Password autoComplete="new-password" placeholder="留空表示不修改原凭据" /></Form.Item></>
  if (['file', 'gis', 'design'].includes(group)) return <Form.Item name="host" label="文件目录或存储位置"><Input /></Form.Item>
  return <><Form.Item name="host" label="消息服务地址"><Input /></Form.Item><Form.Item name="credential" label="重新填写认证信息"><Input.Password autoComplete="new-password" placeholder="留空表示不修改原凭据" /></Form.Item></>
}

function EditDataSourceDrawer({ source, open, onClose, onSave }) {
  const [form] = Form.useForm()
  const classification = source ? getDataSourceClassification(source) : null

  useEffect(() => {
    if (!open || !source) return
    form.setFieldsValue({
      ...source,
      credential: '',
      executeTime: source.executeTime || (source.frequency?.match(/\d{2}:\d{2}/)?.[0] ?? ''),
      autoMetadata: source.autoMetadata ?? true,
      autoQuality: source.autoQuality ?? true,
      autoClassify: source.autoClassify ?? true,
    })
  }, [form, open, source])

  if (!source) return null
  const handleClose = () => { form.resetFields(); onClose() }
  const handleSave = async () => {
    const values = await form.validateFields()
    const { credential, ...safeValues } = values
    onSave({ ...source, ...safeValues, credentialUpdated: Boolean(credential) })
    form.resetFields()
  }

  return (
    <Drawer
      title="编辑数据源配置"
      size="large"
      open={open}
      onClose={handleClose}
      destroyOnHidden
      footer={<div className="drawer-footer"><Button onClick={handleClose}>取消</Button><Button type="primary" onClick={handleSave}>保存修改</Button></div>}
    >
      <Alert showIcon type="info" title={`${classification.accessModeName} / ${classification.sourceTypeName} / ${classification.dataFormat}`} description="接入模式、数据源类型和数据格式保持不变；敏感凭据不会回显。" />
      <Form form={form} layout="vertical" className="edit-source-form">
        <Row gutter={16}>
          <Col span={12}><Form.Item name="name" label="数据源名称" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={12}><Form.Item name="domain" label="业务领域" rules={[{ required: true }]}><Select options={businessDomains.map((value) => ({ value, label: value }))} /></Form.Item></Col>
          <Col span={12}><Form.Item name="region" label="所属地区" rules={[{ required: true }]}><Select showSearch options={regions.map((value) => ({ value, label: value }))} /></Form.Item></Col>
          <Col span={12}><Form.Item name="department" label="责任部门" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={12}><Form.Item name="owner" label="负责人" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={12}><Form.Item name="syncMode" label="同步方式" rules={[{ required: true }]}><Select options={['全量接入', '增量接入', '实时接入'].map((value) => ({ value, label: value }))} /></Form.Item></Col>
          <Col span={12}><Form.Item name="frequency" label="更新频率" rules={[{ required: true }]}><Select options={[source.frequency, ...frequencyOptions].filter((value, index, list) => value && list.indexOf(value) === index).map((value) => ({ value, label: value }))} /></Form.Item></Col>
          <Col span={12}><Form.Item name="executeTime" label="执行时间"><Input placeholder="例如：02:00；手动或实时接入可留空" /></Form.Item></Col>
        </Row>
        <ConnectionEditFields group={source.group} />
        <Space direction="vertical" className="edit-automation-options">
          <Form.Item name="autoMetadata" valuePropName="checked" label="自动采集元数据"><Switch /></Form.Item>
          <Form.Item name="autoQuality" valuePropName="checked" label="自动质量检查"><Switch /></Form.Item>
          <Form.Item name="autoClassify" valuePropName="checked" label="自动分类识别"><Switch /></Form.Item>
        </Space>
      </Form>
    </Drawer>
  )
}

export default EditDataSourceDrawer
