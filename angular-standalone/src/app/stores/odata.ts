import { isString } from '@/app/utils/isString';
import { BehaviorSubject, map } from 'rxjs';
import * as convert from 'xml-js';
import { isPlainObject } from '../utils/isPlainObject';

export enum StoreStatus {
  init,
  initializing,
  loaded,
  error,
  complete,
}

export function defineODataStore(
  service: string,
  options: {
    base: string;
  } = {
    base: '/sap/opu/odata/sap',
  }
) {
  const { base } = options;

  const store = new BehaviorSubject<{ status: StoreStatus; Schema: any; xCsrfToken?: string | undefined; }>({ status: StoreStatus.init, Schema: null });

  const init = () => {
    store.next({
      ...store.value,
      status: StoreStatus.initializing
    })
    setTimeout(() => {
      fetch(`${base}/${service}/$metadata`)
        .then((response) => response.text())
        .then((text) => convert.xml2js(text, { compact: true, attributesKey: '@' }))
        .then((metadata: any) => {
          return metadata['edmx:Edmx']['edmx:DataServices']['Schema'];
        })
        .then((Schema) => {
          store.next({
            ...store.value,
            Schema,
            status: StoreStatus.loaded
          });
        })
        .catch((err) => {
          console.error(err);
          store.next({
            ...store.value,
            status: StoreStatus.error
          });
        })
    });
  }

  const select = (selector: (state: any) => any) => {
    return store.pipe(map(selector));
  };

  const selectEntityType = (entity: string) => {
    return store.pipe(
      map((state) =>
        state.Schema?.EntityType.find((item: any) => item['@'].Name === entity)
      )
    );
  };

  const entityType = (entity: string) =>
    store.value.Schema?.EntityType.find((item: any) => item['@'].Name === entity);

  function setXCsrfToken(token: string) {
    store.next({
      ...store.value,
      xCsrfToken: token
    })
  }

  const read = (
    entity: string,
    keys: string | Record<string, number | string> | null,
    options?: {
      headers?: Record<string, string>;
      $filter?: {
        [key: string]: any;
      };
      $expand?: string | string[];
    }
  ) => {
    const { $filter, $expand } = options ?? {};
    const query = new URLSearchParams();
    if ($filter) {
      query.append('$filter', Object.keys($filter).reduce((acc, key) => {
        if (acc) {
          acc += '&' + key + ' eq ' + $filter[key];
        } else {
          acc = key + ' eq ' + $filter[key];
        }
        return acc;
      }, ''));
    }

    if ($expand) {
      query.append('$expand', isString($expand) ? $expand : $expand.join(','))
    }

    let url = `${base}/${service}/${entity}`
    if (keys) {
      if (isPlainObject(keys)) {
        url += `(${Object.keys(keys).map((key) => `${key}=${entityKeyValue(keys[key])}`).join(',')})`
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
      },
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
    });
  };

  const save = (entitySet: string, body: any) => {
    const url = `${base}/${service}/${entitySet}`

    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Csrf-Token': store.value.xCsrfToken ?? ''
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
    });
  }

  return {
    store,
    init,
    select,
    selectEntityType,
    entityType,
    read,
    save,
    setXCsrfToken
  };
}

export function entityKeyValue(value: number | string | Date): string {
  if (isString(value)) {
    return `'${encodeURIComponent(value)}'`
  } else if (typeof value === 'number') {
    return `${value}`
  }

  return 'null'
}