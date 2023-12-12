import { Routes } from '@angular/router'
import { Ui5LaunchpadComponent } from './launchpad/launchpad.component'
import { Ui5Component } from './ui5.component'
import { UI5AppComponent } from '@/app/components'

export const routes: Routes = [
  {
    path: ':group',
    title: 'Fiori Group',
    component: Ui5Component,
    children: [
      {
        path: ':id',
        title: 'Application',
        component: UI5AppComponent,
        data: {
          icon: 'application'
        }
      },
      {
        path: '',
        title: 'Launchpad',
        component: Ui5LaunchpadComponent
      }
    ]
  }
]
