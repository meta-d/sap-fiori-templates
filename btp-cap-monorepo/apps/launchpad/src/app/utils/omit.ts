import { isNil } from './isNil';
import { isPlainObject } from './isPlainObject';
import { isString } from './isString';

export function isBlank(value: any) {
  return isNil(value) || (isString(value) && !value.trim());
}

export function omitBlank(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((value: any) => omitBlank(value));
  } else if (isPlainObject(obj)) {
    return Object.entries(obj)
      .filter(([, v]) => !isBlank(v))
      .reduce((r, [key, value]) => ({ ...r, [key]: omitBlank(value) }), {});
  } else {
    return obj;
  }
}

export function omitSystemProperty(obj: any) {
  return Object.keys(obj).filter((key) => !(key.startsWith('__') && key.endsWith('__'))).reduce((acc, key) => {
    acc[key] = obj[key]
    return acc
  }, {} as any)
}