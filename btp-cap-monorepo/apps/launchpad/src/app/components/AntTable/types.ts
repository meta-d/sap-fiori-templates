import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table'

export type TableColumn<T> = {
  name: keyof T
  label: string
  width?: string
  freeze?: string | boolean
  align?: 'left' | 'right' | 'center' | null
  valueFormatter?: (value: any) => string

  // Sort
  showSort?: boolean
  sortOrder?: NzTableSortOrder
  compare?: boolean | NzTableSortFn<T> | null
  priority?: number | boolean
  sortDirections?: NzTableSortOrder[]
}