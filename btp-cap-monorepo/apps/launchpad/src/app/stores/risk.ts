import { Supplier, Suppliers, Risk, Risks } from '#cds-models/RiskService'
import { StoreStatus, defineODataStore } from '@metad/cap-odata'

const riskStore = defineODataStore('risk', {
  base: '/api/odata/v4/'
})
export const useRiskStore = () => {
  const { store, init } = riskStore
  if (store.value.status === StoreStatus.init || store.value.status === StoreStatus.error) {
    init()
  }

  return riskStore
}

export async function querySuppliers(): Promise<Supplier[]> {
  const { query } = riskStore
  return await query(Suppliers, {
    $top: 11
  })
}

export async function queryRisks(): Promise<Risk[]> {
  const { query } = riskStore
  return await query(Risks, {
    $top: 11,
    $expand: ['supplier']
  })
}