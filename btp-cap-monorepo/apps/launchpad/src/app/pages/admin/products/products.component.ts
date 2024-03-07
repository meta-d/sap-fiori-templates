import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { Component, signal } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { ProductType, queryProducts } from './odata.service'
import { TableColumn } from '@/app/components/AntTable'

@Component({
  selector: 'zng-products',
  standalone: true,
  imports: [CommonModule, TranslateModule, ZngAntdModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  readonly loading = signal(true)
  readonly tableColumns = signal<TableColumn<ProductType>[]>([
    {
      name: 'ID',
      label: 'ID'
    },
    {
      name: 'Name',
      label: 'Name'
    },
    {
      name: 'Description',
      label: 'Description'
    },
    {
      name: 'ReleaseDate',
      label: 'Release Date'
    },
    {
      name: 'DiscontinuedDate',
      label: 'Discontinued Date'
    },
    {
      name: 'Rating',
      label: 'Rating'
    },
    {
      name: 'Price',
      label: 'Price'
    }
  ])
  readonly items = signal<ProductType[]>([])

  constructor() {
    queryProducts().then((result) => {
      this.loading.set(false)
      this.items.set(result)
    })
  }
}
