import { StoreStatus, defineODataStore } from "./odata";

const eshStore = defineODataStore('ESH_SEARCH_SRV')
export const useESHSearchStore = () => {
    const { store, init } = eshStore
    if (store.value.status === StoreStatus.init || store.value.status === StoreStatus.error) {
        init()
    }

    return eshStore
}