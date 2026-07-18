import { useState } from 'react'
import { LeftOutlined, LogoutOutlined, RightOutlined, ThunderboltFilled, UserOutlined } from '@ant-design/icons'
import { App, Avatar, Button, Divider, Dropdown, Layout, Menu, Tooltip, Typography } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { currentUser } from '../mock/currentUser'
import { constructionMenuItems, coreMenuItems, getRouteMeta } from '../router/config'
import { clearAuthentication } from '../utils/authSession'

const { Sider, Content } = Layout
const { Text } = Typography
const logoutIcon = <LogoutOutlined className="logout-menu-icon" />

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { modal } = App.useApp()
  const currentRoute = getRouteMeta(location.pathname)

  const userMenu = { items: [
    {
      key: 'workbench',
      icon: collapsed ? undefined : <UserOutlined />,
      label: collapsed
        ? <Tooltip title="个人工作台" placement="right"><span className="collapsed-user-menu-icon" aria-label="个人工作台"><UserOutlined /></span></Tooltip>
        : '个人工作台',
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: collapsed ? undefined : logoutIcon,
      label: collapsed
        ? <Tooltip title="退出登录" placement="right"><span className="collapsed-user-menu-icon" aria-label="退出登录">{logoutIcon}</span></Tooltip>
        : '退出登录',
      danger: true,
    },
  ], onClick: ({ key }) => {
    if (key === 'workbench') navigate('/workbench')
    if (key === 'logout') modal.confirm({
      title: '确认退出登录？',
      content: '退出后需要重新登录才能进入平台。',
      okText: '退出登录',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: () => { clearAuthentication(); navigate('/login', { replace: true }) },
    })
  } }

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
        <div className="sider-navigation">
          <Menu
            theme="dark"
            mode="inline"
            items={coreMenuItems}
            selectedKeys={currentRoute ? [currentRoute.path] : []}
            onClick={({ key }) => navigate(key)}
          />
          <Divider className="sider-menu-divider" />
          <div className={collapsed ? 'construction-menu is-collapsed' : 'construction-menu'}>
            <Menu
              theme="dark"
              mode="inline"
              items={constructionMenuItems}
              selectedKeys={currentRoute ? [currentRoute.path] : []}
              onClick={({ key }) => navigate(key)}
            />
          </div>
        </div>
        <div className="sider-footer">
          <Dropdown
            menu={userMenu}
            placement="topLeft"
            trigger={['click']}
            rootClassName={collapsed ? 'sider-user-dropdown is-collapsed' : 'sider-user-dropdown'}
          >
            <div className="sider-user sider-user-link" role="button" tabIndex={0} aria-label="打开用户菜单" onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.click() }}>
              <Avatar className="user-avatar">{currentUser.name.slice(0, 1)}</Avatar>
              {!collapsed && (
                <div className="sider-user-info">
                  <Text className="user-name">{currentUser.name}</Text>
                  <Text className="user-role">{currentUser.role}</Text>
                </div>
              )}
            </div>
          </Dropdown>
        </div>
        <Tooltip title={collapsed ? '展开侧边栏' : '收起侧边栏'} placement="right">
          <Button
            type="text"
            className="sider-collapse-button"
            icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? '展开侧边栏' : '折叠侧边栏'}
          />
        </Tooltip>
      </Sider>

      <Layout className="site-layout">
        <Content className="app-main">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
