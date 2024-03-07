import { Route } from '@angular/router'

export default [
  { path: '', redirectTo: 'flow-chat', pathMatch: 'full', data: { hidden: true } },
  {
    path: 'flow-chat',
    title: 'Flow Chat',
    data: { key: 'flow-chat' },
    loadComponent: () => import('./flow-chat/flow-chat.component').then((m) => m.FlowChatComponent)
  }
] as Route[]
