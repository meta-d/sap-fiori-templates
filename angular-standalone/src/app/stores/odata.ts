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

  const store = new BehaviorSubject<{ status: StoreStatus; Schema: any }>({ status: StoreStatus.init, Schema: null });

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

  const read = (
    entity: string, keys: string | Record<string, number | string>,
    options?: {
      $filter?: {
        [key: string]: any;
      };
      $expand?: string
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
      query.append('$expand', $expand)
    }

    let url = `${base}/${service}/${entity}`
    if (isPlainObject(keys)) {
      url += `(${Object.keys(keys).map((key) => `${key}=${entityKeyValue(keys[key])}`).join(',')})`
    } else {
      url += `(${entityKeyValue(keys)})`
    }

    const queryString = query.toString()

    return fetch(`${url}${queryString ? '?' + queryString : ''}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then(async (response) => {
      if (response.ok) {
        return response.json()
      }
      throw {
        code: response.status,
        error: await response.text()
      }
    });
  };

  return {
    store,
    init,
    select,
    selectEntityType,
    entityType,
    read,
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