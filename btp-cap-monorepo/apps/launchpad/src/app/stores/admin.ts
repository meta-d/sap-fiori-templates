import { StoreStatus, defineODataStore } from './odata'

const adminStore = defineODataStore('auth', {
  base: '/api'
})
export const useAdminStore = () => {
  const { store, init } = adminStore
  if (store.value.status === StoreStatus.init || store.value.status === StoreStatus.error) {
    init()
  }

  return adminStore
}

export async function getCurrentUser() {
  const { functionImport } = useAdminStore()
  return await functionImport('current')
}
