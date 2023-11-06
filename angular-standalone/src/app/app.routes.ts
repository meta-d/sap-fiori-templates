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
      label: 'Dashboard',
      icon: 'dashboard'
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
    path: 'ui5/:group',
    title: async () => {
      return 'UI5 launchpad'
    },
    data: {
      hidden: true
    },
    component: Ui5Component
  },
  {
    path: 'ui5/:group/:id',
    title: async () => {
      return 'Fiori App'
    },
    data: {
      hidden: true
    },
    component: Ui5Component
  }
]
