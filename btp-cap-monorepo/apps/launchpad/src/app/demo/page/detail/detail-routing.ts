import { Routes } from '@angular/router'
export default [
  { path: '', redirectTo: 'base-detail', pathMatch: 'full', data: { hidden: true } },
  {
    path: 'base-detail',
    title: 'Base Detail Page',
    data: { key: 'base-detail' },
    loadComponent: () => import('./base-detail/base-detail.component').then((m) => m.BaseDetailComponent)
  },
  {
    path: 'adv-detail',
    title: 'Advanced Detail Page',
    data: { key: 'adv-detail' },
    loadComponent: () => import('./adv-detail/adv-detail.component').then((m) => m.AdvDetailComponent)
  }
] as Routes
