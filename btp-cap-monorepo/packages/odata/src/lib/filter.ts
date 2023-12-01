import { Filter, FilterOperator, entityKeyValue } from './types'

export function filterString(filter: Filter): string {
  const value = filter.value
  switch (filter.operator) {
    case FilterOperator.eq:
      if (Array.isArray(value)) {
        return `(${value.map((value) => filterString({ ...filter, value })).join(' or ')})`
      } else {
        return `${filter.path} ${FilterOperator.eq} ${entityKeyValue(value)}`
      }
    case FilterOperator.bt:
      if (Array.isArray(value)) {
        return `(${filter.path} ${FilterOperator.ge} ${entityKeyValue(value[0])} and ${filter.path} ${
          FilterOperator.le
        } ${entityKeyValue(value[1])})`
      } else {
        return `${filter.path} ${FilterOperator.eq} ${entityKeyValue(value)}`
      }
  }

  return ''
}
