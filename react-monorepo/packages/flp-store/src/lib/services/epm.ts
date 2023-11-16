import { defineODataStore } from '@zsap/odata'

export interface Product {
  Id: string
  Name: string
}

export const purchaseOrderStore = defineODataStore('EPM_REF_APPS_PO_APV_SRV')

export async function getProducts(): Promise<Product[]> {
  const { query } = purchaseOrderStore

  const result = await query<Product>('Suppliers')

  return result
}
