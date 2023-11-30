import { Routes } from '@angular/router'
import { AppComponent } from './app.component'

export const routes: Routes = [
  {
    path: ':id',
    title: 'Fiori App',
    component: AppComponent,
  }
]
