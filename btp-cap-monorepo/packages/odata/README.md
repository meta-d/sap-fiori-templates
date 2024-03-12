# Metad CAP OData

This package provides a TypeScript library for interacting with OData services. It includes utilities for initializing and managing an OData store, querying entities, updating data, and more.

## Installation

You can install this package using npm:

```bash
npm i @metad/cap-odata
```
or yarn:
    
```bash
yarn add @metad/cap-odata
```

## Usage

### Importing

```typescript
import { ODataStore, StoreStatus, EntityType, ODataQueryOptions, Keys, OrderEnum } from '@metad/cap-odata';
```

### Example

You can define an OData store using the `defineODataStore` function. This function takes the name of the OData service as a parameter and returns an OData store instance.

Then you can create a hook to access the store, in the hook you can initialize the store if it is not yet initialized or in error state.

Using the hook you can access the store actions and perform operations on it.

```ts
/**
 * Define the private store for the authorization OData service.
 */
const authStore = defineODataStore('ZNG_AUTHORIZATION_SRV')

/**
 * Export a hook to access the authorization store.
 *  - If the store is not yet initialized, it will be initialized.
 *  - If the store is in error state, it will be reinitialized.
 * 
 * @returns store for odata service
 */
export const useAuthStore = () => {
  const { store, init } = authStore
  if (store.value.status === StoreStatus.init || store.value.status === StoreStatus.error) {
    init()
  }
  return authStore
}

/**
 * Deconstruct actions from the store using the hook
 * 
 * @returns 
 */
export async function checkAuthorization() {
  const { save } = useAuthStore()

  const result = await save('ActionSet', {...})

  return result
}
```

### Actions in Store

- `init`: Initializes the OData store by fetching the metadata file and parsing it as a schema.

#### Selectors

- `select`: Selects a portion of the store state using a selector function.
- `selectEntityType`: Selects the entity type for a given entity.

#### Entity Operations

- `read`: Reads an entity using keys.
- `save`: Creates an entity.
- `query`: Queries entities using ODataQueryOptions.
- `update`: Updates an entity.
- `count`: Counts entities using ODataQueryOptions.
- `remove`: Removes an entity using keys.

#### Function and Action Imports

- `functionImport`: Calls a function import.
- `actionImport`: Calls an action import with optional data.

#### CSRF Token

- `setXCsrfToken`: Sets the X-Csrf-Token into the store.

## API

### defineODataStore

Defines an OData store using the name of the OData service.

```ts
const store = defineODataStore('ZNG_AUTHORIZATION_SRV')
```

With different options, base url:
```ts
const store = defineODataStore('OData.svc', {
  base: 'https://services.odata.org/odata.org/V3/OData/'
})
```

### select

Selects a portion of the store state using a selector function.

### query

Query entities using filter string:
```ts
const { query } = useStore()
const result = await query<ProductType>('Products', {
  $filter: 'Supplier/ID eq 0',
  $orderby: 'Price desc',
  $top: 10,
  $expand: ['ProductDetail', 'Categories', 'Supplier']
})
```

Query entities using filter object:
```ts
import { Filter, FilterOperator, OrderEnum } from '@metad/cap-odata'

const { query } = useStore()
const result = await query<ProductType>('Products', {
  $filter: [
    {
        path: 'Supplier/ID',
        operator: FilterOperator.eq,
        value: [0, 1]
    }
  ],
  $orderby: [
    {
        name: 'Price',
        order: OrderEnum.desc
    }
  ],
})
```

### read

Reads an entity using keys:
```ts
const { read } = useStore()
const product = await read<ProductType>('Products', {ID: 8}, {
  $expand: ['ProductDetail', 'Categories', 'Supplier']
})
```

### save

Creates an entity:
```ts
const { save } = useStore()
const product = await save<ProductType>('Products', {
  Name: 'New Product',
  Price: 49.99,
  Category: 'Electronics'
})
```

### update

Updates an entity:
```ts
const { update } = useStore()
const product = await update<ProductType>('Products', {ID: 8}, {
  ID: 8,
  Name: 'New Product',
  Price: 49.99,
  Category: 'Electronics'
})
```

### remove

Delete en entity:
```ts
const { remove } = useStore()
const product = await remove<ProductType>('Products', {ID: 8})
```

### functionImport

Calls a function import:
```ts
const { functionImport } = useStore()
const result = await functionImport<ReturnType>('FunctionImport')
```

### actionImport

Calls an action import with optional data:
```ts
const { actionImport } = useStore()
const result = await actionImport<ReturnType>('ActionImport', data)
```

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 💌 Contact Us

- For business inquiries: <mailto:service@mtda.cloud>
- [Metad Platform @ Twitter](https://twitter.com/CloudMtda)