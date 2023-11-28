import { AdminRiskComponent } from './risk/risk.component'
import { AdminUserComponent } from './user/user.component'

export default [
  {
    path: 'user',
    title: 'User Info',
    // loadComponent: () => import('./user/user.component').then((m) => m.AdminUserComponent),
    component: AdminUserComponent,
    data: {
      icon: 'user',
      key: 'admin-user',
    }
  },
  {
    path: 'risk',
    title: 'Risks',
    component: AdminRiskComponent,
    data: {
      icon: 'bug',
      key: 'admin-risk'
    }
  }
]