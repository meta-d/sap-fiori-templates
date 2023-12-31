import { StoreStatus, defineODataStore } from '@metad/cap-odata'

const pageStore = defineODataStore('PAGE_BUILDER_PERS', {
  base: '/sap/opu/odata/UI2'
})
export const usePageBuilderStore = () => {
  const { store, init } = pageStore
  if (store.value.status === StoreStatus.init || store.value.status === StoreStatus.error) {
    init()
  }

  return pageStore
}

export async function readFLPH() {
  const { read } = usePageBuilderStore()

  const result = await read<PageSetsType>(
    'PageSets',
    { id: '/UI2/Fiori2LaunchpadHome' },
    {
      $expand: [
        'Pages',
        'Pages/PageChipInstances/Chip/ChipBags/ChipProperties',
        'Pages/PageChipInstances/RemoteCatalog',
        'Pages/PageChipInstances/ChipInstanceBags/ChipInstanceProperties',
        'AssignedPages',
        'DefaultPage'
      ]
    }
  )

  return result
}

export interface PageSetsType {
  AssignedPages: any
  Pages: any
  id: string
  configuration: string
}
