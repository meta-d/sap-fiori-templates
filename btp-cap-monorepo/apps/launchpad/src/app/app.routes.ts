import { environment } from '@/environments/environment'
import { Routes } from '@angular/router'

export const appRoutes: Routes = [
  {
    path: 'ui5',
    title: 'SAP',
    data: {
      hidden: true,
      key: 'ui5'
    },
    loadChildren: () => import('./pages/ui5').then((m) => m.routes),
  },
  {
    path: 'app',
    data: {
      hidden: true,
      key: 'ui5-app'
    },
    loadChildren: () => import('./pages/app').then((m) => m.routes),
  },
  {
    path: 'admin',
    title: 'Admin',
    data: {
      icon: 'setting',
      key: 'admin'
    },
    loadChildren: () => import('./pages/admin/admin-routing').then((m) => m.default)
  },
  ...(environment.enableDemo ? [
    {
      path: 'dashboard',
      title: 'Dashboard',
      data: {
        icon: 'dashboard',
        key: 'demo-dashboard'
      },
      loadChildren: () => import('./demo/dashboard/dashboard-routing').then((m) => m.default)
    },
    {
      path: 'feature',
      title: 'Feature',
      data: {
        icon: 'block',
        key: 'demo-features'
      },
      loadChildren: () => import('./demo/feat/feat-routing').then((m) => m.default)
    },
    {
      path: 'page',
      title: 'Pages',
      data: {
        icon: 'form',
        key: 'demo-pages'
      },
      loadChildren: () => import('./demo/page/page-demo-routing').then((m) => m.default)
    },
    {
      path: 'element',
      title: 'Elements',
      data: {
        icon: 'appstore-add',
        key: 'demo-elements'
      },
      loadChildren: () => import('./demo/elements/routing').then((m) => m.default)
    },
  ] : []),
  ...(environment.embeddedAnalytics ? 
  [{
    path: 'bi',
    title: 'BI',
    data: {
      icon: 'bar-chart',
      key: 'bi-platform'
    },
    loadChildren: () => import('./bi/bi.module').then((m) => m.BIModule)
  }] : [])
]