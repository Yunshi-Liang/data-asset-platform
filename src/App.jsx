import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { RouterProvider } from 'react-router-dom'
import router from './router'

const theme = {
  token: {
    colorPrimary: '#1677ff',
    colorBgLayout: '#f3f6fa',
    colorText: '#1f2937',
    colorTextSecondary: '#64748b',
    borderRadius: 6,
    fontFamily:
      "'Inter', 'PingFang SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  components: {
    Layout: {
      bodyBg: '#f3f6fa',
      headerBg: '#ffffff',
      siderBg: '#0b2347',
    },
    Menu: {
      darkItemBg: '#0b2347',
      darkSubMenuItemBg: '#0b2347',
      darkItemSelectedBg: '#1677ff',
      itemBorderRadius: 6,
    },
  },
}

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

export default App
