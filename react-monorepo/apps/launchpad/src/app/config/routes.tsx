import { ChromeFilled, CrownFilled, SmileFilled, TabletFilled } from '@ant-design/icons'
import { Products } from '@zng/products'
import { Route, RouteObject } from 'react-router-dom'
import Welcome from '../components/Welcome'

export const routes = [
  {
    path: '/welcome',
    name: '欢迎',
    icon: <SmileFilled />,
    element: <Welcome />
  } as RouteObject,
  {
    path: '/admin',
    name: '管理页',
    icon: <CrownFilled />,
    element: <Products />,
    // access: 'canAdmin',
    // component: './Admin',
    routes: [
      {
        path: '/admin/sub-page1',
        name: '一级页面',
        icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
        component: './Welcome'
      },
      {
        path: '/admin/sub-page2',
        name: '二级页面',
        icon: <CrownFilled />,
        component: './Welcome'
      },
      {
        path: '/admin/sub-page3',
        name: '三级页面',
        icon: <CrownFilled />,
        component: './Welcome'
      }
    ]
  },
  {
    name: '列表页',
    icon: <TabletFilled />,
    path: '/list',
    component: './ListTableList',
    routes: [
      {
        path: '/list/sub-page',
        name: '列表页面',
        icon: <CrownFilled />,
        routes: [
          {
            path: 'sub-sub-page1',
            name: '一一级列表页面',
            icon: <CrownFilled />,
            component: './Welcome'
          },
          {
            path: 'sub-sub-page2',
            name: '一二级列表页面',
            icon: <CrownFilled />,
            component: './Welcome'
          },
          {
            path: 'sub-sub-page3',
            name: '一三级列表页面',
            icon: <CrownFilled />,
            component: './Welcome'
          }
        ]
      },
      {
        path: '/list/sub-page2',
        name: '二级列表页面',
        icon: <CrownFilled />,
        component: './Welcome'
      },
      {
        path: '/list/sub-page3',
        name: '三级列表页面',
        icon: <CrownFilled />,
        component: './Welcome'
      }
    ]
  },
  {
    path: 'https://mtda.cloud',
    name: '元数信息官网',
    icon: <ChromeFilled />
  }
]
export const renderRoutes = (routes: RouteObject[]) =>
  routes.map((route, index) =>
    route.children ? (
      <Route key={index} path={route.path} element={route.element}>
        {renderRoutes(route.children)}
      </Route>
    ) : (
      <Route key={index} path={route.path} element={route.element} />
    )
  )

export default {
  route: {
    path: '/',
    routes
  },
  // location: {
  //   pathname: '/',
  // },
  appList: [
    {
      icon: 'favicon.svg',
      title: 'Metad Team',
      desc: '元数信息技术',
      url: 'https://mtda.cloud/sap'
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
      title: 'Pro Components',
      desc: '专业级 UI 组件库',
      url: 'https://procomponents.ant.design/'
    }
  ]
}
