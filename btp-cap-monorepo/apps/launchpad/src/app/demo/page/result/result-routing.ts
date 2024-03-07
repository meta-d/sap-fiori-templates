import { Route } from '@angular/router'

export default [
  { path: '', redirectTo: 'role-manage', pathMatch: 'full', data: { hidden: true } },
  {
    path: 'success',
    title: 'Success Page',
    data: { key: 'success' },
    loadComponent: () => import('./success/success.component').then((m) => m.SuccessComponent)
  },
  {
    path: 'fail',
    title: 'Failure Page',
    data: { key: 'fail' },
    loadComponent: () => import('./fail/fail.component').then((m) => m.FailComponent)
  }
] as Route[]
