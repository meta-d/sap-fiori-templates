import { format, isDate } from 'date-fns'
import { isPlainObject } from './utils'
import { isString } from './utils/isString'
import { EntityType, Keys, ODataError, uuidRegex } from './types'

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

/**
 *
 * @param entityType EntityType for the entity
 * @param item
 * @returns
 */
export function mapEdmEntity<T extends Record<string, any>>(entityType: EntityType, item: Record<keyof T, any>) {
  return Object.keys(item).reduce((acc, key: keyof T) => {
    const property = entityType.Property.find((prop) => prop['@'].Name === key)
    switch (property?.['@'].Type) {
      case 'Edm.Time':
        acc[key] = parseEdmTime(item[key]) as T[keyof T]
        break
      case 'Edm.DateTime':
        acc[key] = parseEdmDateTime(item[key]) as T[keyof T]
        break
      case 'Edm.Decimal':
        acc[key] = Number(item[key]) as T[keyof T]
        break
      default:
        acc[key] = item[key]
    }
    return acc
  }, {} as T)
}

/**
 * Convert EDM.Time in OData to humman format
 * 
 * Example:
 * 
 * ```typescript
// Example usage
const edmTimeValue = 'PT12H30M45S';
const convertedString = parseEdmTime(edmTimeValue);
console.log(convertedString); // Output: '12:30:45'
 * ```
 * @param edmTime is in the format 'PTxxHxxMxxS'
 * @returns 
 */
export function parseEdmTime(edmTime: string) {
  // Extract hours, minutes, and seconds
  const hours = edmTime.slice(2, 4)
  const minutes = edmTime.slice(5, 7)
  const seconds = edmTime.slice(8, 10)

  // Construct the string representation
  const timeString = `${hours}:${minutes}:${seconds}`

  return timeString
}

/**
 * Parse Edm.DateTime value to Date
 *
 * @param value The format is "/Date(1689206400000)/"
 * @returns
 */
export function parseEdmDateTime(value: string) {
  const mg = value.match(/\d+/)
  if (mg) {
    // 提取时间戳部分
    const timestamp = parseInt(mg[0], 10)
    // 使用 parse 函数将时间戳转换为 Date 对象
    const dateObject = new Date(timestamp)
    return dateObject
  }
  return null
}

export function getErrorMessage(err: any) {
  if (isString(err) && /^\{"error"\:\{/.test(err)) {
    const error = JSON.parse(err)

    return error.error?.message?.value
  }

  return err
}

export async function throwODataError(response: Response) {
  throw {
    code: response.status,
    error: getODataErrorMessage(await response.text())
  } as ODataError
}

/**
 * Get error message from any error object of odata
 *
 * @param err
 * @returns
 */
export function getODataErrorMessage(err: unknown): string {
  if (isString(err) && /^\{"error":\{/.test(err)) {
    const error = JSON.parse(err)

    return error.error?.message?.value
  }

  return err as string
}
