import {
    ChromeFilled,
    CrownFilled,
    SmileFilled,
    TabletFilled,
  } from '@ant-design/icons';
  
  export default {
    route: {
      path: '/',
      routes: [
        {
          path: '/welcome',
          name: '欢迎',
          icon: <SmileFilled />,
          component: './Welcome',
        },
        {
          path: '/admin',
          name: '管理页',
          icon: <CrownFilled />,
          access: 'canAdmin',
          component: './Admin',
          routes: [
            {
              path: '/admin/sub-page1',
              name: '一级页面',
              icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
              component: './Welcome',
            },
            {
              path: '/admin/sub-page2',
              name: '二级页面',
              icon: <CrownFilled />,
              component: './Welcome',
            },
            {
              path: '/admin/sub-page3',
              name: '三级页面',
              icon: <CrownFilled />,
              component: './Welcome',
            },
          ],
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
                  component: './Welcome',
                },
                {
                  path: 'sub-sub-page2',
                  name: '一二级列表页面',
                  icon: <CrownFilled />,
                  component: './Welcome',
                },
                {
                  path: 'sub-sub-page3',
                  name: '一三级列表页面',
                  icon: <CrownFilled />,
                  component: './Welcome',
                },
              ],
            },
            {
              path: '/list/sub-page2',
              name: '二级列表页面',
              icon: <CrownFilled />,
              component: './Welcome',
            },
            {
              path: '/list/sub-page3',
              name: '三级列表页面',
              icon: <CrownFilled />,
              component: './Welcome',
            },
          ],
        },
        {
          path: 'https://mtda.cloud',
          name: '元数信息官网',
          icon: <ChromeFilled />,
        },
      ],
    },
    location: {
      pathname: '/',
    },
    appList: [
      {
        icon: 'favicon.svg',
        title: 'Metad Team',
        desc: '元数信息技术',
        url: 'https://mtda.cloud/sap',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
        title: 'Pro Components',
        desc: '专业级 UI 组件库',
        url: 'https://procomponents.ant.design/',
      },
    ],
  };
  