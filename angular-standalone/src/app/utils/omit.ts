import { isNil } from './isNil';
import { isPlainObject } from './isPlainObject';
import { isString } from './isString';

export function isBlank(value) {
  return isNil(value) || (isString(value) && !value.trim());
}

export function omitBlank(obj) {
  if (Array.isArray(obj)) {
    return obj.map((value) => omitBlank(value));
  } else if (isPlainObject(obj)) {
    return Object.entries(obj)
      .filter(([, v]) => !isBlank(v))
      .reduce((r, [key, value]) => ({ ...r, [key]: omitBlank(value) }), {});
  } else {
    return obj;
  }
}
