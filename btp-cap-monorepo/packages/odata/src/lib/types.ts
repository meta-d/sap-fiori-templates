import { BehaviorSubject, Observable } from 'rxjs'

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

export type ODataError = {
  code: number
  error: string
}

export interface ODataQueryOptions {
  headers?: Record<string, string>
  $select?: string | string[]
  $filter?: string
    | {
        [key: string]: ValueOfKey
      }
    | Filter[]
  $expand?: string | string[]

  $orderby?: string
    | {
      name: string
      order?: OrderEnum | null
    }[]

  $skip?: number
  $top?: number
}

export const XCsrfTokenName = 'X-Csrf-Token'
export const XCsrfTokenFetch = 'Fetch'

export type ValueOfKey = number | string | boolean | null | Date
export type Keys = ValueOfKey | Record<string, ValueOfKey>

export type Property = {
  '@': {
    Name: string
    Type: 'Edm.Decimal' | 'Edm.String' | 'Edm.Time' | 'Edm.DateTime'
  }
}
export type EntityType = {
  Property: Property[]
}

/**
 * The status type of an odata store
 */
export enum StoreStatus {
  init,
  initializing,
  loaded,
  error,
  complete
}

/**
 * The store type of odata service
 */
export type ODataStore = {
  /**
   * The store of odata service
   */
  store: BehaviorSubject<{ status: StoreStatus; Schema: any }>
  /**
   * Initialize the store:
   * - Fetch metadata file
   * - Parse metadata as schema
   */
  init: () => void
  /**
   * Selector for odata store
   *
   * @param selector
   * @returns
   */
  select: <T>(selector: (state: { status: StoreStatus; Schema: any }) => T) => Observable<T>
  /**
   * Selector for entity type
   *
   * @param entity
   * @returns
   */
  selectEntityType: (entity: string) => Observable<EntityType>

  /**
   * Get the entity type
   *
   * @param entity
   * @returns
   */
  entityType: (entity: string) => EntityType

  /**
   * Read an entity using keys
   * 
   * @param entitySet 
   * @param keys 
   * @param options 
   * @returns 
   */
  read: <T>(entitySet: string, keys: Keys, options?: ODataQueryOptions) => Promise<T>

  /**
   * Create an entity.
   * 
   * Examples:
   * ```ts
   * const result = await create('EntitySet', {name: 'Metad', age: 18})
   * ```
   * 
   * @param entitySet 
   * @param data 
   * @param options 
   * @returns 
   */
  save: <T>(entitySet: string, data: T, options?: ODataQueryOptions) => Promise<T>

  /**
   * Query entities using ODataQueryOptions
   * 
   * @param entitySet 
   * @param options 
   * @returns 
   */
  query: <T>(entitySet: string | { name: string }, options?: ODataQueryOptions) => Promise<T[]>

  /**
   * Update an entity
   * 
   * @param entitySet 
   * @param keys 
   * @param data 
   * @param options 
   * @returns 
   */
  update: <T>(entitySet: string, keys: Keys, data: T, options?: ODataQueryOptions) => Promise<T>

  /**
   * Count entities using ODataQueryOptions
   * 
   * @param entitySet 
   * @param options 
   * @returns 
   */
  count: (entitySet: string, options?: ODataQueryOptions) => Promise<number>

  /**
   * Remove an entity using keys
   * 
   * @param entitySet 
   * @param keys 
   * @param options 
   * @returns 
   */
  remove: (entitySet: string, keys: Keys, options?: ODataQueryOptions) => Promise<void>

  /**
   * Call a function import
   * 
   * @param functionName 
   * @returns 
   */
  functionImport: <T>(functionName: string, params?: Record<string, unknown>) => Promise<T>

  /**
   * Call an action import with data
   * 
   * @param actionName 
   * @param data 
   * @returns 
   */
  actionImport: <T>(actionName: string, data?: unknown) => Promise<T>
  /**
   * Set the X-Csrf-Token into the store
   * 
   * @param token 
   * @returns 
   */
  setXCsrfToken: (token: string) => void
}
