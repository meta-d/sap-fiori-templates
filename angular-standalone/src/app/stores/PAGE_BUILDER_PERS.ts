import { defineODataStore } from "./odata";

export const usePageBuilderStore = defineODataStore('PAGE_BUILDER_PERS', {
    base: '/sap/opu/odata/UI2'
})

export async function readFLPH() {
    const { read } = usePageBuilderStore
    
    const result = await read('PageSets', '/UI2/Fiori2LaunchpadHome', {
        $expand: 'Pages/PageChipInstances/Chip/ChipBags/ChipProperties,Pages/PageChipInstances/RemoteCatalog,Pages/PageChipInstances/ChipInstanceBags/ChipInstanceProperties,AssignedPages,DefaultPage'
    })

    return result.d
}