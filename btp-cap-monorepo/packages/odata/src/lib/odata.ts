import queryString from 'query-string'
import { BehaviorSubject, map } from 'rxjs'
import * as convert from 'xml-js'
import { filterString } from './filter'
import {
  Filter,
  FilterOperator,
  Keys,
  KeysParameters,
  OrderEnum,
  ValueOfKey,
  entityKeyValue,
  getEntityName
} from './types'
import { isString } from './utils/isString'

export enum StoreStatus {
  init,
  initializing,
  loaded,
  error,
  complete
}

export interface ODataConfig {
  xCsrfToken: string | null
  environment: string
  isMockData: boolean
}

const _config$ = new BehaviorSubject<ODataConfig>({
  xCsrfToken: null,
  environment: 'production',
  isMockData: false
})

export function updateODataConfig(value: Partial<ODataConfig>) {
  _config$.next({
    ..._config$.value,
    ...value
  })
}

export function defineODataStore(
  service: string,
  options: {
    base: string
    version?: string | null
  } = {
    base: '/sap/opu/odata/sap'
  }
) {
  const { base, version } = options

  const store = new BehaviorSubject<{ status: StoreStatus; Schema: any }>({
    status: StoreStatus.init,
    Schema: null
  })

  // Dont use version when use fe mock server, because it doesn't support versioning
  const baseUrl = `${removeLastSlash(base)}/${service}${version && !_config$.value.isMockData ? `/${version}` : ''}`

  const init = () => {
    store.next({
      ...store.value,
      status: StoreStatus.initializing
    })
    setTimeout(() => {
      fetch(`${baseUrl}/$metadata`)
        .then((response) => response.text())
        .then((text) => convert.xml2js(text, { compact: true, attributesKey: '@' }))
        .then((metadata: any) => {
          return metadata['edmx:Edmx']['edmx:DataServices']['Schema']
        })
        .then((Schema) => {
          store.next({
            ...store.value,
            Schema,
            status: StoreStatus.loaded
          })
        })
        .catch((err) => {
          // console.error(err)
          store.next({
            ...store.value,
            status: StoreStatus.error
          })
        })
    })
  }

  const select = (selector: (state: any) => any) => {
    return store.pipe(map(selector))
  }

  const selectEntityType = (entity: string) => {
    return store.pipe(map((state) => state.Schema?.EntityType.find((item: any) => item['@'].Name === entity)))
  }

  const entityType = (entity: string) => store.value.Schema?.EntityType.find((item: any) => item['@'].Name === entity)

  function setXCsrfToken(token: string) {
    updateODataConfig({
      xCsrfToken: token
    })
  }

  const read = async (
    entity: string,
    keys: Keys,
    options?: {
      headers?: Record<string, string>
      $filter?: {
        [key: string]: any
      }
      $expand?: string | string[]
    }
  ) => {
    const { $filter, $expand } = options ?? {}
    const query = new URLSearchParams()
    if ($filter) {
      query.append(
        '$filter',
        Object.keys($filter).reduce((acc, key) => {
          if (acc) {
            acc += ' and ' + key + ' eq ' + $filter[key]
          } else {
            acc = key + ' eq ' + $filter[key]
          }
          return acc
        }, '')
      )
    }

    if ($expand) {
      query.append('$expand', isString($expand) ? $expand : $expand.join(','))
    }

    let url = `${baseUrl}/${entity}`
    if (keys) {
      url += KeysParameters(keys)
    }

    const queryString = query.toString()

    return fetch(`${url}${queryString ? '?' + queryString : ''}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options?.headers ?? {})
      }
    }).then(async (response) => {
      const token = response.headers.get('X-Csrf-Token')
      if (token) {
        setXCsrfToken(token)
      }

      if (response.ok) {
        const result = await response.json()
        if (response.headers.get('Odata-Version') === '4.0') {
          return result
        } else {
          return result.d
        }
      }
      throw {
        code: response.status,
        error: await response.text()
      }
    })
  }

  const save = async (entitySet: string, body: any) => {
    const url = `${baseUrl}/${entitySet}`

    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Csrf-Token': _config$.value.xCsrfToken ?? ''
      },
      body: JSON.stringify(body)
    }
    return fetch(url, reqOptions).then(async (response) => {
      if (response.ok) {
        return response.json()
      }
      throw {
        code: response.status,
        error: await response.text()
      }
    })
  }

  const update = async (entitySet: string, keys: Keys, body: any) => {
    let url = `${baseUrl}/${entitySet}`
    if (keys) {
      url += KeysParameters(keys)
    }
    const reqOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Csrf-Token': _config$.value.xCsrfToken ?? ''
      },
      body: JSON.stringify(body)
    }
    return fetch(url, reqOptions).then(async (response) => {
      if (response.ok) {
        return response.json()
      }
      throw {
        code: response.status,
        error: await response.text()
      }
    })
  }

  const query = async <T>(entity: string | { name: string }, options?: ODataQueryOptions): Promise<T[]> => {
    const entitySet = getEntityName(entity)
    const queryObj = constructQuery(options)
    const qString = queryString.stringify(queryObj)
    // const qString = queryObj.toString()

    const url = `${baseUrl}/${entitySet}`
    return fetch(`${url}${qString ? '?' + qString : ''}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options?.headers ?? {})
      }
    }).then(async (response) => {
      const token = response.headers.get('X-Csrf-Token')
      if (token) {
        setXCsrfToken(token)
      }

      if (response.ok) {
        const result = await response.json()
        if (response.headers.get('Odata-Version') === '4.0') {
          return result.value
        } else {
          return result.d.results
        }
      }
      throw {
        code: response.status,
        error: await response.text()
      }
    })
  }

  /**
   *
   * @param name Function Import Name
   */
  const functionImport = async (name: string) => {
    const url = `${baseUrl}/${name}()`
    const reqOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
    return fetch(url, reqOptions).then(async (response) => {
      if (response.ok) {
        return response.json()
      }

      throw {
        code: response.status,
        error: await response.text()
      }
    })
  }

  const actionImport = async <T>(name: string, body?: any): Promise<T> => {
    const url = `${baseUrl}/${name}`
    const reqOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Csrf-Token': _config$.value.xCsrfToken ?? ''
      },
      body: body ? JSON.stringify(body) : null
    }
    return fetch(url, reqOptions).then(async (response) => {
      if (response.ok) {
        try {
          return await response.json()
        } catch (err) {
          return null
        }
      }

      throw {
        code: response.status,
        error: await response.text()
      }
    })
  }

  const count = async (entitySet: string, options?: ODataQueryOptions): Promise<number> => {
    // const queryObj = constructQuery(options)
    // const qString = queryString.stringify(queryObj)

    const url = `${baseUrl}/${entitySet}/$count`
    return fetch(`${url}${queryString ? '?' + queryString : ''}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options?.headers ?? {})
      }
    }).then(async (response) => {
      if (response.ok) {
        return await response.json()
      }
      throw {
        code: response.status,
        error: await response.text()
      }
    })
  }

  return {
    store,
    init,
    select,
    selectEntityType,
    entityType,
    read,
    query,
    save,
    update,
    functionImport,
    actionImport,
    count,
    setXCsrfToken
  }
}

export interface ODataQueryOptions {
  headers?: Record<string, string>
  $filter?:
    | {
        [key: string]: ValueOfKey
      }
    | Filter[]
  $expand?: string | string[]

  $orderby?: {
    name: string
    order?: OrderEnum | null
  }[]

  $skip?: number
  $top?: number
}

/**
 * Convert odata query params to query strings
 *
 * @param options
 * @returns
 */
export function constructQuery(options?: ODataQueryOptions) {
  const { $filter, $expand, $orderby, $skip, $top } = options ?? {}
  const query = {} as Record<string, string>

  // Filters to query string
  if ($filter) {
    if (Array.isArray($filter)) {
      query['$filter'] = $filter.reduce((acc, item) => {
        const _filterString = filterString(item)
        if (acc) {
          return acc + ' and ' + _filterString
        } else {
          return _filterString
        }
      }, '')
    } else {
      query['$filter'] = Object.keys($filter).reduce((acc, key) => {
        const filterString = `${key} ${FilterOperator.eq} ${entityKeyValue($filter[key])}`
        if (acc) {
          return acc + ' and ' + filterString
        } else {
          return filterString
        }
      }, '')
    }
  }

  if ($expand) {
    query['$expand'] = isString($expand) ? $expand : $expand.join(',')
  }

  if ($orderby) {
    query['$orderby'] = $orderby.map(({ name, order }) => `${name} ${order ?? OrderEnum.asc}`).join(',')
  }

  if ($skip != null) {
    query['$skip'] = `${$skip}`
  }
  if ($top != null) {
    query['$top'] = `${$top}`
  }

  return query
}

function removeLastSlash(url: string) {
  if (url.endsWith('/')) {
    return url.slice(0, -1)
  }
  return url
}
