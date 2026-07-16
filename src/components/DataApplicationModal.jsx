import { useEffect } from 'react'
import { Checkbox, Col, Form, Input, Modal, Row, Select } from 'antd'
import { applicationMethods, getApplicationDefaults, usagePeriods } from '../mock/application'

const options = (values) => values.map((value) => ({ label: value, value }))

function DataApplicationModal({ product, open, onCancel, onSubmit }) {
  const [form] = Form.useForm()
  useEffect(() => {
    if (open) form.setFieldsValue(getApplicationDefaults(product))
  }, [form, open, product])

  const cancel = () => { form.resetFields(); onCancel() }
  const finish = (values) => { onSubmit(product, values); form.resetFields() }

  return <Modal open={open} zIndex={1200} title="数据使用申请" width={700} okText="提交申请" cancelText="取消" forceRender destroyOnHidden maskClosable={false} onCancel={cancel} onOk={() => form.submit()}><Form form={form} layout="vertical" preserve={false} onFinish={finish}><Row gutter={16}>
    <Col span={12}><Form.Item name="applicant" label="申请人"><Input readOnly /></Form.Item></Col>
    <Col span={12}><Form.Item name="department" label="所属部门"><Input readOnly /></Form.Item></Col>
    <Col span={12}><Form.Item name="productName" label="申请产品"><Input readOnly /></Form.Item></Col>
    <Col span={12}><Form.Item name="project" label="使用项目" rules={[{ required: true, message: '请输入使用项目' }]}><Input placeholder="请输入项目名称" /></Form.Item></Col>
    <Col span={24}><Form.Item name="purpose" label="使用目的" rules={[{ required: true, message: '请输入使用目的' }, { min: 10, message: '请至少输入 10 个字符说明用途' }]}><Input.TextArea rows={3} placeholder="说明使用场景、范围和预期成果" /></Form.Item></Col>
    <Col span={12}><Form.Item name="method" label="申请方式" rules={[{ required: true, message: '请选择申请方式' }]}><Select options={options(applicationMethods)} placeholder="请选择" /></Form.Item></Col>
    <Col span={12}><Form.Item name="period" label="期望使用期限" rules={[{ required: true, message: '请选择使用期限' }]}><Select options={options(usagePeriods)} placeholder="请选择" /></Form.Item></Col>
    <Col span={24}><Form.Item name="scope" label="数据使用范围" rules={[{ required: true, message: '请说明数据使用范围' }]}><Input placeholder="说明使用部门、项目和数据范围" /></Form.Item></Col>
  </Row><Form.Item name="confidentiality" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('请阅读并勾选保密承诺')) }]}><Checkbox>我已阅读并承诺遵守数据安全、保密和最小化使用要求</Checkbox></Form.Item></Form></Modal>
}

export default DataApplicationModal
