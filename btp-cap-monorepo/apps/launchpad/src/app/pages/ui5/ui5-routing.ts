import { Routes } from '@angular/router'
import { Ui5AppComponent } from './app/app.component'
import { Ui5LaunchpadComponent } from './launchpad/launchpad.component'
import { Ui5Component } from './ui5.component'

export const routes: Routes = [
  {
    path: ':group',
    title: 'Fiori Group',
    data: {
      icon: 'group',
      key: 'ui5-group/',
      newTab: true
    },
    component: Ui5Component,
    children: [
      {
        path: ':id',
        title: 'SAP Application',
        component: Ui5AppComponent,
        data: {
          icon: 'application',
          key: 'ui5-app/',
          newTab: true
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