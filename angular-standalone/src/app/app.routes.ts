import { Route } from '@angular/router'
import { HomeComponent } from './pages/home/home.component'
import { Ui5Component } from './pages/ui5/ui5.component'

export const appRoutes: Route[] = [
  {
    path: 'home',
    component: HomeComponent,
    data: {
      label: 'Home',
      icon: 'home'
    }
  },
  {
    path: 'admin',
    data: {
      label: 'Admin',
      icon: 'setting'
    },
    loadChildren: () =>
      import('./pages/admin/admin-routing').then((m) => m.default)
  },
  {
    path: 'ui5/:id',
    data: {
      hidden: true
    },
    component: Ui5Component
  }
]
