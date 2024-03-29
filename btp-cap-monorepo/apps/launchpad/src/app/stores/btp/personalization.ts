import { StoreStatus, defineODataStore } from '@metad/cap-odata'
import { PersContainer } from '../app'

const persStore = defineODataStore('personalization', {
  base: '/api/odata/v4/'
})
export const usePersStore = () => {
  const { store, init } = persStore
  if (store.value.status === StoreStatus.init || store.value.status === StoreStatus.error) {
    init()
  }

  return persStore
}

export async function upsertPersonalization(value: Partial<PersContainer>) {
  const { create, update } = persStore
  return await (value.ID ? update('PersContainers', { ID: value.ID }, value) : create('PersContainers', value))
}

export async function readPersonalization(appId: string) {
  const { query } = persStore
  return await query<PersContainer>('PersContainers', {
    $filter: { category: 'P', appId },
    headers: {
      'X-Csrf-Token': 'Fetch'
    }
  })
    .then((result) => result?.[0])
    .catch(() => null)
}
