import { useState } from 'react'
import {
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ThunderboltFilled,
} from '@ant-design/icons'
import { Avatar, Breadcrumb, Button, Layout, Menu, Tooltip, Typography } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getRouteMeta, menuItems } from '../router/config'

const { Sider, Content } = Layout
const { Text } = Typography

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const currentRoute = getRouteMeta(location.pathname)
  const pageTitle = currentRoute?.title || '页面未找到'

  const breadcrumbItems = [
    { title: '电力数据资产管理平台' },
    { title: pageTitle },
  ]

  return (
    <Layout className="app-layout">
      <Sider
        className="app-sider"
        width={232}
        collapsedWidth={72}
        collapsed={collapsed}
        trigger={null}
      >
        <div className="brand" title="电力数据资产管理平台">
          <span className="brand-icon">
            <ThunderboltFilled />
          </span>
          {!collapsed && <span className="brand-name">电力数据资产管理平台</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          selectedKeys={currentRoute ? [currentRoute.path] : []}
          onClick={({ key }) => navigate(key)}
        />
        <div className="sider-footer">
          <Tooltip title="进入个人工作台" placement="right">
            <div className="sider-user sider-user-link" role="button" tabIndex={0} onClick={() => navigate('/workbench')} onKeyDown={(event) => { if (event.key === 'Enter') navigate('/workbench') }}>
              <Avatar className="user-avatar">管</Avatar>
              {!collapsed && (
                <div className="sider-user-info">
                  <Text className="user-name">数据管理员</Text>
                  <Text className="user-role">平台管理员</Text>
                </div>
              )}
            <Button
              type="text"
              className="sider-notification-button"
              icon={<BellOutlined />}
              aria-label="消息通知"
              onClick={(event) => event.stopPropagation()}
            />
            </div>
          </Tooltip>
          <Button
            type="text"
            className="sider-collapse-button"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? '展开侧边栏' : '折叠侧边栏'}
          >
            {!collapsed && '收起侧边栏'}
          </Button>
        </div>
      </Sider>

      <Layout className="site-layout">
        <Content className="app-main">
          <Breadcrumb className="app-breadcrumb" items={breadcrumbItems} />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
