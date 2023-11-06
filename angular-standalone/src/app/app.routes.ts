import { Route } from '@angular/router'
import { DashboardComponent } from './pages/dashboard/'
import { Ui5Component } from './pages/ui5/'
// import { AuthLoginComponent } from './pages/auth/login/login.component'

export const appRoutes: Route[] = [
  // {
  //   path: 'auth/login',
  //   component: AuthLoginComponent,
  //   data: {
  //     hidden: true
  //   }
  // },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    data: {
      icon: 'dashboard'
    }
  },
  {
    path: 'admin',
    title: 'Admin',
    data: {
      icon: 'setting'
    },
    loadChildren: () =>
      import('./pages/admin/admin-routing').then((m) => m.default)
  },
  {
    path: 'ui5/:group',
    title: 'UI5 launchpad',
    data: {
      hidden: true
    },
    component: Ui5Component
  },
  {
    path: 'ui5/:group/:id',
    title: 'Fiori App',
    data: {
      hidden: true
    },
    component: Ui5Component
  }
]
