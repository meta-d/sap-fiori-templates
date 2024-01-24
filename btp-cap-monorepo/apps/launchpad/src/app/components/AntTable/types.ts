import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table'

export type TableColumn<T> = {
  name: keyof T
  label: string
  width?: string
  freeze?: 'left' | 'right' | boolean | null
  align?: 'left' | 'right' | 'center' | null
  valueFormatter?: (value: any) => string
  show?: boolean | null

  // Sort
  showSort?: boolean
  sortOrder?: NzTableSortOrder
  compare?: boolean | NzTableSortFn<T> | null
  priority?: number | boolean
  sortDirections?: NzTableSortOrder[]

  // Filter
  filters?: NzTableFilterList | null
  filterFn?: NzTableFilterFn<T> | null
}