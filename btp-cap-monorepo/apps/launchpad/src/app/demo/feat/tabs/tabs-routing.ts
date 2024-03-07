import { ActionCode } from '@/app/core'
import { Route } from '@angular/router'

export default [
  {
    path: '',
    title: 'Tab Actions',
    data: { key: 'tabs' },
    loadComponent: () => import('./tabs.component').then((m) => m.TabsComponent)
  },
  {
    path: 'example-detail',
    title: 'Tab Detail',
    data: { newTab: 'true', authCode: ActionCode.TabsDetail, key: 'example-detail' },
    loadComponent: () => import('./detail/detail.component').then((m) => m.DetailComponent)
  }
] as Route[]
