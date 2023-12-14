import { environment } from '@/environments/environment'
import { Routes } from '@angular/router'

export default [
  ...(environment.production ? [] : [
    {
      path: 'list-report',
      title: 'List Report',
      data: {
        key: 'list-report',
        icon: 'unordered-list'
      },
      loadComponent: () => import('./list-report/list-report.component').then((c) => c.ListReportComponent)
    }
  ])
] as Routes
