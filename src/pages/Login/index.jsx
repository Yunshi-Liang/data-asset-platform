import { LockOutlined, ThunderboltFilled, UserOutlined } from '@ant-design/icons'
import { App, Button, Card, Form, Input, Typography } from 'antd'
import { Navigate, useNavigate } from 'react-router-dom'
import loginBackground from '../../assets/images/login-background.png'
import { authenticate, isAuthenticated, setAuthenticated } from '../../utils/authSession'
import './login.css'

function Login() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  if (isAuthenticated()) return <Navigate to="/" replace />

  const submit = ({ username, password }) => {
    if (!authenticate(username, password)) {
      message.error('用户名或密码错误')
      return
    }
    setAuthenticated()
    message.success('登录成功')
    navigate('/', { replace: true })
  }

  return <main className="login-page" style={{ backgroundImage: `linear-gradient(rgba(7, 28, 57, 0.3), rgba(7, 28, 57, 0.38)), url(${loginBackground})` }}>
    <Card className="login-card">
      <div className="login-brand"><span><ThunderboltFilled /></span><div><Typography.Title level={3}>电力数据资产管理平台</Typography.Title><Typography.Text type="secondary">电力设计院数据资产全生命周期管理平台</Typography.Text></div></div>
      <Form layout="vertical" size="large" onFinish={submit} requiredMark={false}>
        <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}><Input prefix={<UserOutlined />} autoComplete="username" placeholder="请输入用户名" /></Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}><Input.Password prefix={<LockOutlined />} autoComplete="current-password" placeholder="请输入密码" /></Form.Item>
        <Button type="primary" htmlType="submit" block>登录</Button>
      </Form>
      <Typography.Text className="login-demo-note" type="secondary">当前认证仅用于前端 Demo 演示</Typography.Text>
    </Card>
  </main>
}

export default Login
