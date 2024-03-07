import { Route } from '@angular/router'

export default [
  { path: '', redirectTo: 'analysis', pathMatch: 'full', data: { hidden: true } },
  {
    path: 'analysis',
    title: 'Analysis',
    data: { preload: true, key: 'analysis' },
    loadComponent: () => import('./analysis/analysis.component').then((m) => m.AnalysisComponent)
  },
  {
    path: 'monitor',
    title: 'Monitor',
    data: { key: 'monitor' },
    loadComponent: () => import('./monitor/monitor.component').then((m) => m.MonitorComponent)
  },
  {
    path: 'workbench',
    title: 'Workbench',
    data: { key: 'workbench' },
    loadComponent: () => import('./workbench/workbench.component').then((m) => m.WorkbenchComponent)
  }
] as Route[]
