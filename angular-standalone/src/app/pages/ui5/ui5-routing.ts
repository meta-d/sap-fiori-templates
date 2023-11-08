import { Routes } from '@angular/router'
import { Ui5AppComponent } from './app/app.component'
import { Ui5LaunchpadComponent } from './launchpad/launchpad.component'
import { Ui5Component } from './ui5.component'

export const routes: Routes = [
  {
    path: ':group',
    title: 'Fiori Group',
    component: Ui5Component,
    children: [
      {
        path: ':id',
        title: 'Application',
        component: Ui5AppComponent,
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
