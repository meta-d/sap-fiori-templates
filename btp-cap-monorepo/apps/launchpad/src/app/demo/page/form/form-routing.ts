import { Routes } from '@angular/router'

export default [
  { path: '', redirectTo: 'base-form', pathMatch: 'full', data: { hidden: true } },
  {
    path: 'base-form',
    title: 'Base Form',
    data: { key: 'base-form' },
    loadComponent: () => import('./base/base.component').then((m) => m.BaseComponent)
  },
  {
    path: 'step-form',
    title: 'Step Form',
    data: { key: 'step-form' },
    loadComponent: () => import('./step/step.component').then((m) => m.StepComponent)
  },
  {
    path: 'advanced-form',
    title: 'Advanced Form',
    data: { key: 'advanced-form' },
    loadComponent: () => import('./advanced/advanced.component').then((m) => m.AdvancedComponent)
  }
] as Routes
