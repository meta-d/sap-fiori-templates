import format from 'date-fns/format'
import isDate from 'date-fns/isDate'
import { isPlainObject } from './utils'
import { isString } from './utils/isString'

export const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
export enum OrderEnum {
  asc = 'asc',
  desc = 'desc'
}

export interface Filter {
  path: string
  operator: FilterOperator
  value: number | string | boolean | Date | Array<number | string | Date>
}

export enum FilterOperator {
  eq = 'eq',
  bt = 'bt',
  ge = 'ge',
  le = 'le'
}

export const XCsrfTokenName = 'X-Csrf-Token'
export const XCsrfTokenFetch = 'Fetch'

export type ValueOfKey = number | string | boolean | null | Date
export type Keys = ValueOfKey | Record<string, ValueOfKey>

export function entityKeyValue(value: number | string | boolean | Date | null): string {
  if (isString(value)) {
    if (uuidRegex.test(value)) {
      return `${value}`
    }
    return `'${encodeURIComponent(value)}'`
  } else if (isDate(value)) {
    return `datetime'${format(value as Date, "yyyy-MM-dd'T'HH:mm:ss")}'`
  } else {
    return `${value}`
  }
}

export function KeysParameters(keys: Keys) {
  if (isPlainObject(keys)) {
    return `(${Object.keys(keys)
      .map((key) => `${key}=${entityKeyValue((<Record<string, number | string | boolean | Date | null>>keys)[key])}`)
      .join(',')})`
  } else {
    return `(${entityKeyValue(keys)})`
  }
}

export function getEntityName(entity: string | { name: string }): string {
  return typeof entity === 'string' ? entity : entity.name.split('.').pop()!
}
