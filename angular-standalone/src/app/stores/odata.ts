import { isString } from '@/app/utils/isString'
import { BehaviorSubject, map } from 'rxjs'
import * as convert from 'xml-js'
import { isPlainObject } from '../utils/isPlainObject'
import { environment } from '@/environments/environment'

export enum StoreStatus {
  init,
  initializing,
  loaded,
  error,
  complete
}

const xCsrfToken$ = new BehaviorSubject<string | null>(null)

export function defineODataStore(
  service: string,
  options: {
    base: string;
    version?: string | null;
  } = {
    base: '/sap/opu/odata/sap',
  }
) {
  const { base, version } = options

  const store = new BehaviorSubject<{ status: StoreStatus; Schema: any;}>({
    status: StoreStatus.init,
    Schema: null
  })

  // Dont use version when use fe mock server, because it doesn't support versioning
  const baseUrl = `${base}/${service}${version && !environment.mockData ? `/${version}` : ''}`

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
    xCsrfToken$.next(token)
    // store.next({
    //   ...store.value,
    //   xCsrfToken: token
    // })
  }

  const read = async (
    entity: string,
    keys: string | Record<string, number | string> | null,
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
      if (isPlainObject(keys)) {
        url += `(${Object.keys(keys)
          .map((key) => `${key}=${entityKeyValue(keys[key])}`)
          .join(',')})`
      } else {
        url += `(${entityKeyValue(keys)})`
      }
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
        'X-Csrf-Token': xCsrfToken$.value ?? ''
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

  const query = async <T>(entitySet: string, options?: ODataQueryOptions): Promise<T[]> => {
    const queryObj = constructQuery(options)
    // const qString = queryString.stringify(queryObj) // .toString()
    const qString = queryObj.toString()

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
        Accept: 'application/json',
      },
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
        'X-Csrf-Token': xCsrfToken$.value ?? ''
      },
      body: body ? JSON.stringify(body) : null
    }
    return fetch(url, reqOptions).then(async (response) => {
      if (response.ok) {
        try {
          return await response.json()
        } catch(err) {
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
    const queryObj = constructQuery(options)
    const queryString = queryObj.toString()

    const url = `${baseUrl}/${entitySet}/$count`
    return fetch(`${url}${queryString ? '?' + queryString : ''}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options?.headers ?? {})
      }
    }).then(async (response) => {
      // const token = response.headers.get('X-Csrf-Token')
      // if (token) {
      //   setXCsrfToken(token)
      // }

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
    functionImport,
    actionImport,
    count,
    setXCsrfToken
  }
}

export interface ODataQueryOptions {
  headers?: Record<string, string>
  $filter?: {
    [key: string]: any
  } | Filter[]
  $expand?: string | string[];

  $orderby?: {
    name: string;
    order?: OrderEnum | null;
  }[];

  $skip?: number;
  $top?: number;
}

const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export function entityKeyValue(value: number | string | Date): string {
  if (isString(value)) {
    if (uuidRegex.test(value)) {
      return `${value}`
    }
    return `'${encodeURIComponent(value)}'`
  } else {
    return `${value}`
  }
}

export function constructQuery(options?: ODataQueryOptions) {
  const { $filter, $expand, $orderby, $skip, $top } = options ?? {}
  // const query = {} as any // new URLSearchParams()
  const query = new URLSearchParams()

  // Filters to query string
  if ($filter) {
    if (Array.isArray($filter)) {
      query.append('$filter', $filter.reduce((acc, item) => {
        const filterString = `${item.path} ${item.operator} ${entityKeyValue(item.value)}`
        if (acc) {
          return acc + ' and ' + filterString
        } else {
          return filterString
        }
      }, ''))
      // query['$filter'] = $filter.reduce((acc, item) => {
      //     const filterString = `${item.path} ${item.operator} ${entityKeyValue(item.value)}`
      //     if (acc) {
      //       return acc + ' and ' + filterString
      //     } else {
      //       return filterString
      //     }
      //   }, '')
    } else {
      query.append('$filter', Object.keys($filter).reduce((acc, key) => {
        const filterString = `${key} ${FilterOperator.eq} ${entityKeyValue($filter[key])}`
        if (acc) {
          return acc + ' and ' + filterString
        } else {
          return filterString
        }
      }, ''))
      // query['$filter'] = Object.keys($filter).reduce((acc, key) => {
      //     const filterString = `${key} ${FilterOperator.eq} ${entityKeyValue($filter[key])}`
      //     if (acc) {
      //       return acc + ' and ' + filterString
      //     } else {
      //       return filterString
      //     }
      //   }, '')
    }
  }

  if ($expand) {
    // query['$expand'] = isString($expand) ? $expand : $expand.join(',')
    query.append('$expand', isString($expand) ? $expand : $expand.join(','))
  }

  if ($orderby) {
    // query['$orderby'] = $orderby.map(({name, order}) => `${name} ${order ?? OrderEnum.asc}`).join(',')
    query.append('$orderby', $orderby.map(({name, order}) => `${name} ${order ?? OrderEnum.asc}`).join(','))
  }

  if ($skip != null) {
    // query['$skip'] = `${$skip}`
    query.append('$skip', `${$skip}`)
  }
  if ($top != null) {
    // query['$top'] = `${$top}`
    query.append('$top', `${$top}`)
  }

  return query
}

export enum OrderEnum {
  asc = 'asc',
  desc = 'desc'
}
export interface Filter {
  path: string;
  operator: FilterOperator;
  value: number | string
}
export enum FilterOperator {
  eq = 'eq'
}