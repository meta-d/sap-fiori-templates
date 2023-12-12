export const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
export enum OrderEnum {
  asc = 'asc',
  desc = 'desc'
}
export interface Filter {
  path: string
  operator: FilterOperator
  value: number | string
}
export enum FilterOperator {
  eq = 'eq'
}

export const XCsrfTokenName = 'X-Csrf-Token'
export const XCsrfTokenFetch = 'Fetch'