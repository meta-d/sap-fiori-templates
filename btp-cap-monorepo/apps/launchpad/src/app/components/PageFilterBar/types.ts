import { isString } from '@/app/utils/'
import { FilterOperator, ODataQueryOptions, ValueOfKey } from '@metad/cap-odata'

export enum SelectionType {
  single = 'single',
  multiple = 'multiple',
  singleRange = 'singleRange'
}

export type FilterDependency =
  | string
  | {
      name: string
      alias?: string
      required?: boolean
    }

export type FilterField<T = any> = {
  name: string
  label: string
  default?: string
  disabled?: boolean
  valueHelp?: (options?: ODataQueryOptions) => Promise<T[]>
  valueKey?: keyof T
  labelKey?: keyof T
  valueHelpAsync?: boolean
  options?: { value: string | number | null | boolean; label: string }[]
  loading?: boolean
  placeHolder?: string
  required?: boolean
  /**
   * 依赖的过滤器
   */
  dependencies?: Array<FilterDependency>
  /**
   * 是否显示 ID
   */
  showId?: boolean

  valueType?: 'date' | 'datetime' | 'string' | 'number' | 'boolean'
  valueFormatter?: (value: ValueOfKey) => string | number
  selectionType?: SelectionType
}

export function dependencyName(dependency: FilterDependency) {
  return isString(dependency) ? dependency : dependency.name
}

export function dependencyAlias(dependency: FilterDependency) {
  return isString(dependency) ? dependency : dependency.alias ?? dependency.name
}

export function mapSelectionType2Operator(type?: SelectionType) {
  switch (type) {
    case SelectionType.single:
      return FilterOperator.eq
    case SelectionType.multiple:
      return FilterOperator.eq
    case SelectionType.singleRange:
      return FilterOperator.bt
    default:
      return FilterOperator.eq
  }
}
