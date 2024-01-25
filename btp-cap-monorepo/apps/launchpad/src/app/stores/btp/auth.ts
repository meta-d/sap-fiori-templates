import { StoreStatus, defineODataStore } from '@metad/cap-odata'

type ODataUserType = {
  ID: string
  Name: string
}

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
  return await functionImport<ODataUserType>('current')
}
