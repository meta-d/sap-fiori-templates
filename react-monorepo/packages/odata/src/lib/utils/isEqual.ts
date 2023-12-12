import equal from 'fast-deep-equal'

export function isEqual(a: unknown, b: unknown) {
  return equal(a, b)
}
