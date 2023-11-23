import { isPlainObject } from "./utils";
import { isString } from "./utils/isString";

export const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
export enum OrderEnum {
  asc = 'asc',
  desc = 'desc'
}
export interface Filter {
  path: string
  operator: FilterOperator
  value: number | string | boolean | Date
}
export enum FilterOperator {
  eq = 'eq'
}

export const XCsrfTokenName = 'X-Csrf-Token'
export const XCsrfTokenFetch = 'Fetch'

export type Keys = string | Record<string, number | string | null> | null | undefined

export function entityKeyValue(value: number | string | Date | null | unknown): string {
  if (isString(value)) {
    if (uuidRegex.test(value)) {
      return `${value}`
    }
    return `'${encodeURIComponent(value)}'`
  } else {
    return `${value}`
  }
}

export function KeysParameters(keys: Keys) {
  if (isPlainObject(keys)) {
    return `(${Object.keys(keys)
      .map((key) => `${key}=${entityKeyValue(keys[key])}`)
      .join(',')})`
  } else {
    return `(${entityKeyValue(keys)})`
  }
}