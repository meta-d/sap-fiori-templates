import { Routes } from '@angular/router'

export default [
  { path: '', redirectTo: 'search-table', pathMatch: 'full', data: { hidden: true } },
  {
    path: 'search-table',
    title: '搜索表格',
    loadChildren: () => import('./search-table/search-table-routing')
  },
  {
    path: 'standard-table',
    title: '标准表格',
    data: { key: 'standard-table' },
    loadComponent: () => import('./standard-table/standard-table.component').then((m) => m.StandardTableComponent)
  },
  {
    path: 'tree-list',
    title: '树状表格',
    data: { key: 'tree-list' },
    loadComponent: () => import('./tree-list/tree-list.component').then((m) => m.TreeListComponent)
  },
  {
    path: 'card-table',
    title: '卡片列表',
    data: { key: 'card-table' },
    loadComponent: () => import('./card-table/card-table.component').then((m) => m.CardTableComponent)
  },
  {
    path: 'search-list',
    title: '搜索列表',
    loadComponent: () => import('./search-list/search-list.component').then((m) => m.SearchListComponent),
    data: { key: 'search-list' },
    loadChildren: () => import('./search-list/search-list-routing')
  }
] as Routes
