import { Routes } from '@angular/router'

export default [
  { path: '', redirectTo: 'search-table', pathMatch: 'full', data: { hidden: true } },
  {
    path: 'search-table',
    title: 'Search Table',
    loadChildren: () => import('./search-table/search-table-routing')
  },
  {
    path: 'standard-table',
    title: 'Standard Table',
    data: { key: 'standard-table' },
    loadComponent: () => import('./standard-table/standard-table.component').then((m) => m.StandardTableComponent)
  },
  {
    path: 'tree-list',
    title: 'Tree List',
    data: { key: 'tree-list' },
    loadComponent: () => import('./tree-list/tree-list.component').then((m) => m.TreeListComponent)
  },
  {
    path: 'card-table',
    title: 'Card Table',
    data: { key: 'card-table' },
    loadComponent: () => import('./card-table/card-table.component').then((m) => m.CardTableComponent)
  },
  {
    path: 'search-list',
    title: 'Search List',
    loadComponent: () => import('./search-list/search-list.component').then((m) => m.SearchListComponent),
    data: { key: 'search-list' },
    loadChildren: () => import('./search-list/search-list-routing')
  }
] as Routes
