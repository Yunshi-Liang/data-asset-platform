import {
  ApiOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  HomeOutlined,
  ProductOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'

export const routeConfig = [
  {
    path: '/',
    title: '数据资产概览',
    description: '汇总展示平台数据资产建设与运营的整体情况。',
    icon: <HomeOutlined />,
  },
  {
    path: '/data-portal',
    title: '数据产品门户',
    description: '面向用户提供已上架数据产品的统一检索、浏览与申请入口。',
    icon: <AppstoreOutlined />,
  },
  {
    path: '/data-access',
    title: '数据接入',
    description: '统一管理数据库、API、文件和 GIS 等多源异构数据接入任务。',
    icon: <ApiOutlined />,
  },
  {
    path: '/data-governance',
    title: '数据治理',
    description: '围绕数据标准、质量和安全开展全流程治理工作。',
    icon: <SafetyCertificateOutlined />,
  },
  {
    path: '/asset-catalog',
    title: '数据资产目录',
    description: '统一编目和管理电力设计院各专业领域的数据资产。',
    icon: <DatabaseOutlined />,
  },
  {
    path: '/product-publish',
    title: '数据产品上架',
    description: '管理数据资产封装、检查、上架与下架过程。',
    icon: <ProductOutlined />,
  },
]

export const menuItems = routeConfig.map(({ path, title, icon }) => ({
  key: path,
  label: title,
  icon,
}))

export const coreMenuItems = menuItems.slice(0, 2)
export const constructionMenuItems = menuItems.slice(2)

export const workbenchRoute = {
  path: '/workbench',
  title: '个人工作台',
  description: '集中查看数据收藏、使用申请、待办审批及个人经手的数据资产。',
}

export const getRouteMeta = (pathname) =>
  pathname === workbenchRoute.path
    ? workbenchRoute
    : routeConfig.find(({ path }) => path === pathname)
