import { UI5AppComponent } from '@/app/components'
import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: ':id',
    title: 'Fiori App',
    component: UI5AppComponent,
  }
]
