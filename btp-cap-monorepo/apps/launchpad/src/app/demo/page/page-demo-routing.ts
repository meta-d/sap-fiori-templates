import { Routes } from '@angular/router'

export default [
  {
    path: 'form',
    title: 'Forms',
    loadChildren: () => import('./form/form-routing')
  },
  {
    path: 'list',
    title: 'List',
    loadChildren: () => import('./list/list-routing.module')
  },
  {
    path: 'detail',
    title: 'Detail',
    loadChildren: () => import('./detail/detail-routing')
  },
  {
    path: 'personal',
    title: 'Personal',
    loadChildren: () => import('./personal/personal-routing')
  },
  {
    path: 'except',
    title: 'Except',
    loadChildren: () => import('./except/except-routing')
  },
  {
    path: 'result',
    title: 'Result',
    loadChildren: () => import('./result/result-routing')
  },
  {
    path: 'visual',
    title: 'Visual',
    loadChildren: () => import('./flow/flow-routing')
  },
  {
    path: 'task',
    title: 'Task',
    data: { key: 'task' },
    loadComponent: () => import('./task/task.component').then((m) => m.TaskComponent)
  }
] as Routes
