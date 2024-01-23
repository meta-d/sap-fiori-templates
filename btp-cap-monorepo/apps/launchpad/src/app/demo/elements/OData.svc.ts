import { ODataQueryOptions, StoreStatus, defineODataStore } from '@metad/cap-odata'

const demoODataStore = defineODataStore('OData.svc', {
  base: '/odata.org/V3/OData/'
})

export const useDemoODataStore = () => {
  const { store, init } = demoODataStore
  if (store.value.status === StoreStatus.init || store.value.status === StoreStatus.error) {
    init()
  }

  return demoODataStore
}

export async function queryProducts(options?: ODataQueryOptions) {
  const { query } = useDemoODataStore()
  const result = await query<ProductType>('Products', {
    ...options
  })
  return result
}

export async function helpProductCategory(options?: ODataQueryOptions) {
  const { query } = useDemoODataStore()
  const result = await query<CategoryType>('Categories', options)
  return result
}

export async function helpSuppliers(options?: ODataQueryOptions) {
  const { query } = useDemoODataStore()
  const result = await query<SupplierType>('Suppliers', options)
  return result
}

export type ProductType = {
  ID: string
  Name: string
  Description: string
  ReleaseDate: Date
  DiscontinuedDate: Date
  Rating: number
  Price: number

  Categories: CategoryType[]
  Supplier: SupplierType
  ProductDetail: ProductDetailType
}

export type CategoryType = {
  ID: string
  Name: string
}

export type ProductDetailType = {
  ProductID: number
  Details: string

  Product?: ProductType
}

export type SupplierType = {
  ID: number
  Name: string
  Address: string
  Location: string
  Concurrency: string

  Products?: ProductType[]
}