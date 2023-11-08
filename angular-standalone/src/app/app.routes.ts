import { Route } from '@angular/router'
import { DashboardComponent } from './pages/dashboard/'
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
    loadChildren: () => import('./pages/admin/admin-routing').then((m) => m.default)
  },
  {
    path: 'ui5',
    title: 'SAP',
    data: {
      hidden: true
    },
    loadChildren: () => import('./pages/ui5').then((m) => m.routes),
  }
]
