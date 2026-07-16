import { Checkbox, Form, Input, Modal, Select, Typography } from 'antd'
import { currentUser } from '../../../mock/currentUser'

const { Paragraph, Text } = Typography
const { TextArea } = Input

const applicationMethods = ['文件下载', '在线查看', 'API 调用', '数据推送'].map(
  (value) => ({ label: value, value }),
)

const usagePeriods = ['1 个月', '3 个月', '6 个月', '12 个月'].map((value) => ({
  label: value,
  value,
}))

function DataApplicationModal({ product, open, onCancel, onSubmit }) {
  const [form] = Form.useForm()

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  const handleFinish = (values) => {
    onSubmit(product, values)
    form.resetFields()
  }

  return (
    <Modal
      title="数据使用申请"
      open={open}
      okText="提交申请"
      cancelText="取消"
      destroyOnHidden
      onOk={() => form.submit()}
      onCancel={handleCancel}
    >
      {product && (
        <div className="application-product-summary">
          <Text type="secondary">申请产品</Text>
          <Paragraph strong>{product.name}</Paragraph>
        </div>
      )}
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={{
          applicant: currentUser.name,
          department: currentUser.department,
          confidentiality: false,
        }}
        onFinish={handleFinish}
      >
        <Form.Item label="申请人" name="applicant">
          <Input readOnly />
        </Form.Item>
        <Form.Item
          label="所属部门"
          name="department"
          rules={[{ required: true, message: '请输入所属部门' }]}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          label="使用项目"
          name="project"
          rules={[{ required: true, message: '请输入使用项目' }]}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>
        <Form.Item
          label="使用目的"
          name="purpose"
          rules={[
            { required: true, message: '请输入使用目的' },
            { min: 10, message: '请至少输入 10 个字符说明用途' },
          ]}
        >
          <TextArea rows={3} placeholder="说明使用场景、范围和预期成果" />
        </Form.Item>
        <div className="application-form-row">
          <Form.Item
            label="申请方式"
            name="method"
            rules={[{ required: true, message: '请选择申请方式' }]}
          >
            <Select options={applicationMethods} placeholder="请选择" />
          </Form.Item>
          <Form.Item
            label="期望使用期限"
            name="period"
            rules={[{ required: true, message: '请选择使用期限' }]}
          >
            <Select options={usagePeriods} placeholder="请选择" />
          </Form.Item>
        </div>
        <Form.Item
          name="confidentiality"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('请阅读并勾选保密承诺')),
            },
          ]}
        >
          <Checkbox>我已阅读并承诺遵守数据安全与保密管理要求</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DataApplicationModal
