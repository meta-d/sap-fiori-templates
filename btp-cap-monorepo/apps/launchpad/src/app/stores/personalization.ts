import { PersContainer } from '#cds-models/zm/appstore'
import { StoreStatus, defineODataStore } from '@zcap/odata'

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
  const { save, update } = persStore
  return await (value.ID ? update('PersContainers', { ID: value.ID }, value) : save('PersContainers', value))
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
