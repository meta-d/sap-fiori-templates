import { StoreStatus, defineODataStore } from './odata'

const persStore = defineODataStore('personalization', {
  base: '/odata/v4/'
})
export const usePersStore = () => {
  const { store, init } = persStore
  if (store.value.status === StoreStatus.init || store.value.status === StoreStatus.error) {
    init()
  }

  return persStore
}

export async function createPersonalization(value: unknown) {
  const { save } = persStore
  return await save('PersContainers', value)
}