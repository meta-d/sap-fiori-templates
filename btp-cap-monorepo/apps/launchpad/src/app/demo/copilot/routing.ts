import { Routes } from '@angular/router'
import { CopilotBaseComponent } from './base/base.component'

export default [
  { path: '', redirectTo: 'base', pathMatch: 'full', data: { hidden: true } },
  {
    path: 'base',
    title: 'Copilot Base',
    data: { key: 'copilot-base' },
    component: CopilotBaseComponent
  },
] as Routes
