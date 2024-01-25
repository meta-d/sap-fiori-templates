import { StoreStatus, defineODataStore } from '@metad/cap-odata'

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

  const result = await save('ActionSet', {})

  return result
}