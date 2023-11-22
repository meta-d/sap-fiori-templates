import { Routes } from '@angular/router'

export const appRoutes: Routes = [
  {
    path: 'admin',
    title: 'Admin',
    data: {
      icon: 'setting'
    },
    loadChildren: () => import('./pages/admin/admin-routing').then((m) => m.default)
  }
]
