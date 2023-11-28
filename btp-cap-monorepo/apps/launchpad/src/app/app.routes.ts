import { Routes } from '@angular/router'

export const appRoutes: Routes = [
  {
    path: 'admin',
    title: 'Admin',
    data: {
      icon: 'setting'
    },
    loadChildren: () => import('./pages/admin/admin-routing').then((m) => m.default)
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    data: {
      icon: 'dashboard'
    },
    loadChildren: () => import('./demo/dashboard/dashboard-routing').then((m) => m.default)
  },
  {
    path: 'feature',
    title: 'Feature',
    data: {
      icon: 'block'
    },
    loadChildren: () => import('./demo/feat/feat-routing').then((m) => m.default)
  },
  {
    path: 'page',
    title: 'Pages',
    data: {
      icon: 'form'
    },
    loadChildren: () => import('./demo/page/page-demo-routing').then((m) => m.default)
  },
]