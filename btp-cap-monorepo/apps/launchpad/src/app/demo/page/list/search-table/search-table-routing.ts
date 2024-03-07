import { Route } from '@angular/router'

import { ActionCode } from '@/app/core'
import { SearchTableDetailComponent } from './search-table-detail/search-table-detail.component'
import { SearchTableComponent } from './search-table.component'

export default [
  {
    path: '',
    component: SearchTableComponent,
    title: 'Search Table',
    data: { key: 'search-table' }
  },
  {
    path: 'search-table-detail/:name/:age',
    component: SearchTableDetailComponent,
    title: 'Search Table',
    data: {
      authCode: ActionCode.SearchTableDetail,
      key: 'search-table-detail',
      hidden: true
    }
  }
] as Route[]
