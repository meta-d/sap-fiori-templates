import { isString } from '@/utils/isString';
import { BehaviorSubject, map } from 'rxjs';
import * as convert from 'xml-js';

export function defineODataStore(
  service: string,
  options: {
    base: string;
  } = {
    base: '/sap/opu/odata/sap',
  }
) {
  const { base } = options;

  const store = new BehaviorSubject<{ Schema: any }>({ Schema: null });

  setTimeout(() => {
    try {
      fetch(`${base}/${service}/$metadata`)
      .then((response) => response.text())
      .then((text) => convert.xml2js(text, { compact: true, attributesKey: '@' }))
      .then((metadata) => {
        return metadata['edmx:Edmx']['edmx:DataServices']['Schema'];
      })
      .then((Schema) => {
        store.next({
          ...store.value,
          Schema,
        });
      })
      .catch((err) => {
        console.error(err);
      })
    } catch(err) {
      console.error(err);
    } 
  });
  

  const select = (selector: (state) => any) => {
    return store.pipe(map(selector));
  };

  const selectEntityType = (entity: string) => {
    return store.pipe(
      map((state) =>
        state.Schema?.EntityType.find((item) => item['@'].Name === entity)
      )
    );
  };

  const entityType = (entity: string) =>
    store.value.Schema?.EntityType.find((item) => item['@'].Name === entity);

  const read = (
    entity: string, id: string,
    options?: {
      $filter?: {
        [key: string]: any;
      };
    }
  ) => {
    const { $filter } = options ?? {};
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

    let url = `${base}/${service}/${entity}`
    if (id) {
      if (isString(id)) {
        url += `('${id}')`
      } else if (typeof id === 'number') {
        url += `${id}`
      }
    }

    const queryString = query.toString()

    return fetch(`${url}${queryString ? '?' + queryString : ''}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then((response) => response.json());
  };

  return {
    store,
    select,
    selectEntityType,
    entityType,
    read,
  };
}