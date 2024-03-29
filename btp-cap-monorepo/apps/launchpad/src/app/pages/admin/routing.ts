import { environment } from '@/environments/environment'
import { Routes } from '@angular/router'
import { AdminRiskComponent } from './risk/risk.component'
import { AdminUserComponent } from './user/user.component'
import { ProductsComponent } from './products/products.component'

export default [
  {
    path: 'user',
    title: 'User Info',
    component: AdminUserComponent,
    data: {
      icon: 'user',
      key: 'admin-user'
    }
  },
  ...(environment.platform === 'BTP'
    ? [
        {
          path: 'risk',
          title: 'Risks',
          component: AdminRiskComponent,
          data: {
            icon: 'bug',
            key: 'admin-risk'
          }
        }
      ]
    : []),
  {
    path: 'products',
    title: 'Products',
    component: ProductsComponent
  }
] as Routes
