import { StoreStatus, defineODataStore } from "./odata";

const INTEROPStore = defineODataStore('INTEROP', {
    base: '/sap/opu/odata/UI2'
})
export const useINTEROPStore = () => {
    const { store, init } = INTEROPStore

    return INTEROPStore
}

export async function queryThemes() {
    const { query } = useINTEROPStore()
    
    const themes = await query('Themes')

    return themes
}