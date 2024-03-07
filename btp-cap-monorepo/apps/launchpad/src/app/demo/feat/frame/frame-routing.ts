import { Route } from '@angular/router'

export default [
  {
    path: 'metad-doc',
    title: 'Metad Document',
    data: { key: 'metad-doc' },
    loadComponent: () => import('./zorro-doc/zorro-doc.component').then((m) => m.ZorroDocComponent)
  },
  { path: '', redirectTo: 'metad-doc', pathMatch: 'full', data: { hidden: true } }
] as Route[]
