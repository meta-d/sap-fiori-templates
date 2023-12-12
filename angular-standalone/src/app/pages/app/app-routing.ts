import { Routes } from '@angular/router'
import { UI5AppComponent } from '@/app/components'

export const routes: Routes = [
  {
    path: ':id',
    title: 'Fiori App',
    component: UI5AppComponent,
  }
]
