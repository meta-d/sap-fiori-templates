import { BehaviorSubject, Subject, debounceTime, map } from 'rxjs'
import { XCsrfTokenFetch, XCsrfTokenName, isEqual } from '@zsap/odata'
import { MenuMode, ThemeType } from '../types'
import { useESHSearchStore } from '../services/ESH_SEARCH'
import { useINTEROPStore } from '../services/INTEROP'

const PersContainerId = 'zsap.settings'
const PersPersonalizationId = 'personalization'

export interface User {
  id: string
  name: string
}

export interface FlpStoreState {
  personalization: {
    theme: ThemeType
    menuMode: MenuMode
    primaryColor: string
    fixedLayoutSider: boolean
    fixedLayoutHeader: boolean
    colorPrimary: string
    contentWidth: string
    fixSiderbar: boolean
    layout: MenuMode
    menuTheme: string
    navTheme: string
    splitMenus: boolean
  }
  user?: User
}

const DefaultPersonalization = {
  theme: ThemeType.default,
  menuTheme: 'dark',
  menuMode: MenuMode.mix,
  fixedLayoutSider: true,
  fixedLayoutHeader: false,
  primaryColor: '#722ED1',
  colorPrimary: '#1677FF',
  contentWidth: '',
  fixSiderbar: true,
  navTheme: 'real-dark',
  layout: MenuMode.mix,
  splitMenus: true
} as any

export class FlpStoreService {
  private state$ = new BehaviorSubject<FlpStoreState>({ personalization: DefaultPersonalization })

  public readonly user$ = this.state$.pipe(map((state) => state.user))
  public readonly personalization$ = this.state$.pipe(map((state) => state.personalization))

  readonly #savePers$ = new Subject<void>()

  #savePersSub = this.#savePers$.pipe(debounceTime(1000)).subscribe(() => {
    this.savePersonalization().then()
  })

  async refreshUser() {
    const { read } = useESHSearchStore()
    const user = await read('Users', { Id: '<current>' })
      .then((result) => {
        return {
          id: result.Id,
          name: result.Name
        }
      })
      .catch((err) => console.error(err))

    if (user) {
      this.state$.next({
        ...this.state$.value,
        user
      })
    }
  }

  /**
   * Update personalization in flp store using config from server
   */
  async refreshPersonalization() {
    const { read } = useINTEROPStore()
    const personalization = await read(
      'PersContainers',
      { category: 'P', id: PersContainerId },
      {
        headers: {
          [XCsrfTokenName]: XCsrfTokenFetch
        },
        $expand: 'PersContainerItems'
      }
    )
      .then((result) => {
        const personalization = result.PersContainerItems.results.find((item: any) => item.id === PersPersonalizationId)
        if (personalization) {
          try {
            return JSON.parse(personalization.value)
          } catch (err) {
            console.error(err)
          }
        }
        return null
      })
      .catch((err) => console.error(err))

    // Update flp store
    if (personalization) {
      this.state$.next({
        ...this.state$.value,
        personalization: {
          ...this.state$.value.personalization,
          ...personalization
        }
      })
    }
  }

  async savePersonalization() {
    const { save } = useINTEROPStore()

    const value = this.state$.value.personalization

    const containerCategory = 'P'
    await save('PersContainers', {
      id: PersContainerId,
      category: containerCategory,
      validity: 0,
      component: '',
      appName: 'ZNG',
      PersContainerItems: [
        {
          value: JSON.stringify(value),
          id: PersPersonalizationId,
          category: 'I',
          containerId: PersContainerId,
          containerCategory: containerCategory
        }
      ]
    })
  }

  updatePersonalization(value: any) {
    if (isEqual(this.state$.value.personalization, value)) {
      return 
    }

    console.log(value)
    this.state$.next({
      ...this.state$.value,
      personalization: {
        ...(this.state$.value.personalization ?? {}),
        ...value
      }
    })

    this.#savePers$.next()
  }
}
