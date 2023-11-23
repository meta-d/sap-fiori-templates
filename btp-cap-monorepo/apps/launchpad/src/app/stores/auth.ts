import { StoreStatus, defineODataStore } from '@zcap/odata'

const authStore = defineODataStore('auth', {
  base: '/api'
})
export const useAuthStore = () => {
  const { store, init } = authStore
  if (store.value.status === StoreStatus.init || store.value.status === StoreStatus.error) {
    init()
  }

  return authStore
}

export async function getCurrentUser() {
  const { functionImport } = useAuthStore()
  return await functionImport('current')
}
