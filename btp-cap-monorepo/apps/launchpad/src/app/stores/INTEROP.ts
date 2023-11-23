import { StoreStatus, defineODataStore } from "@zcap/odata";

export interface UI5Theme {
    id: string;
    name: string;
    shellType: string;
}

const INTEROPStore = defineODataStore('INTEROP', {
    base: '/sap/opu/odata/UI2'
})
export const useINTEROPStore = () => {
    const { store, init } = INTEROPStore

    return INTEROPStore
}

export async function queryThemes() {
    const { query } = useINTEROPStore()
    
    const themes = await query<UI5Theme>('Themes')

    return themes
}