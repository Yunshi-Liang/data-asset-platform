import { createHashRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AssetCatalog from '../pages/AssetCatalog'
import Dashboard from '../pages/Dashboard'
import DataAccess from '../pages/DataAccess'
import DataGovernance from '../pages/DataGovernance'
import DataPortal from '../pages/DataPortal'
import NotFound from '../pages/NotFound'
import ProductPublish from '../pages/ProductPublish'
import Workbench from '../pages/Workbench'
import Login from '../pages/Login'
import ProtectedRoute from './ProtectedRoute'

import { routeConfig } from './config'

const pageComponents = [
  Dashboard,
  DataPortal,
  DataAccess,
  DataGovernance,
  AssetCatalog,
  ProductPublish,
]

const businessRoutes = routeConfig.map(({ path }, index) => {
  const PageComponent = pageComponents[index]

  return path === '/'
    ? { index: true, element: <PageComponent /> }
    : { path: path.slice(1), element: <PageComponent /> }
})

const router = createHashRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          ...businessRoutes,
          { path: 'workbench', element: <Workbench /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
])

export default router
