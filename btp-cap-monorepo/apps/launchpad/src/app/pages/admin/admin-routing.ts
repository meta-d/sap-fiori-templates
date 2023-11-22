import { AdminRiskComponent } from './risk/risk.component'

export default [
  {
    path: 'user',
    title: 'User Info',
    loadComponent: () => import('./user/user.component').then((m) => m.AdminUserComponent),
    data: {
      icon: 'user'
    }
  },
  {
    path: 'risk',
    title: 'Risks',
    component: AdminRiskComponent
  }
]
