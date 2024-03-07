import { Route } from '@angular/router'

export default [
  { path: '', redirectTo: 'personal-center', pathMatch: 'full', data: { hidden: true } },
  {
    path: 'personal-center',
    title: 'Personal Center',
    data: { key: 'personal-center' },
    loadComponent: () => import('./personal-center/personal-center.component').then((m) => m.PersonalCenterComponent)
  },
  {
    path: 'personal-setting',
    title: 'Personal Settings',
    data: { key: 'personal-setting' },
    loadComponent: () => import('./personal-setting/personal-setting.component').then((m) => m.PersonalSettingComponent)
  }
] as Route[]
