import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import BasicLayout from '../layouts/BasicLayout.vue';
import BlankLayout from '../layouts/BlankLayout.vue';
import AnalysisPage from '../views/Analysis.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    meta: { title: 'Home' },
    component: BasicLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: { title: 'Dashboard', icon: 'SmileOutlined' },
        component: AnalysisPage,
      },
      {
        path: '/admin',
        name: 'admin',
        meta: { title: '管理页', icon: 'CrownOutlined' },
        redirect: '/admin/monitor',
        component: BlankLayout,
        children: [
          {
            path: '/admin/workspace',
            name: 'workspace',
            meta: { title: '一级页面' },
            component: () => import('../views/TestPage.vue'),
          },
          {
            path: '/admin/monitor',
            name: 'monitor',
            meta: { title: '二级页面' },
            component: () => import('../views/MyPage.vue'),
          },
        ],
      },
      {
        path: '/list',
        name: 'list',
        meta: { title: 'Procurement', icon: 'MobileOutlined' },
        redirect: '/list/child2',
        component: BlankLayout,
        children: [
          {
            path: 'child1',
            name: 'list-child1',
            meta: { title: 'Purchaser (EPM)' },
            component: BlankLayout,
            children: [
              {
                path: 'child1',
                name: 'list-child1-child1',
                meta: { title: 'Approve Purchase Orders' },
                component: () => import('../views/PurchaseOrder.vue'),
              },
              {
                path: 'child2',
                name: 'list-child1-child2',
                meta: { title: '二一级列表页面' },
                component: () => import('../views/DynamicPage.vue'),
              },
              {
                path: 'child3',
                name: 'list-child1-child3',
                meta: { title: '三一级列表页面' },
                component: () => import('../views/DynamicPage.vue'),
              },
            ],
          },
          {
            path: 'child2',
            name: 'list-child2',
            meta: { title: '二级列表页面' },
            component: () => import('../views/TestPage.vue'),
          },
          {
            path: 'child3',
            name: 'list-child3',
            meta: { title: '三级列表页面' },
            component: () => import('../views/TestPage.vue'),
          },
        ],
      },
      {
        path: '/test-tab',
        name: 'TestTab',
        meta: { title: '测试Tab标签', icon:'icon-icon-test', hideInMenu: false },
        component: () => import('../views/TestTab.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
