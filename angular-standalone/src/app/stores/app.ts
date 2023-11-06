import { Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NzMenuThemeType } from 'ng-zorro-antd/menu'
import { BehaviorSubject, map } from 'rxjs'
import { MenuMode, ThemeType } from '../core/types'
import { useESHSearchStore } from './ESH_SEARCH'
import { useINTEROPStore } from './INTEROP'

const PersContainerId = 'zng.settings'
const PersPersonalizationId = 'personalization'

export interface AppStoreState {
  personalization: {
    theme: ThemeType
    menuTheme: NzMenuThemeType
    menuMode: MenuMode
    primaryColor: string
    fixedLayoutSider: boolean
    fixedLayoutHeader: boolean
  }
  user?: {
    id: string
    name: string
  }
}

const DefaultPersonalization = {
  theme: ThemeType.default,
  menuTheme: 'dark',
  menuMode: MenuMode.side,
  fixedLayoutSider: true,
  fixedLayoutHeader: false
} as any

@Injectable()
export class AppStoreService {
  private state$ = new BehaviorSubject<AppStoreState>({ personalization: DefaultPersonalization })

  readonly user = toSignal(this.state$.pipe(map((state) => state.user)))
  readonly personalization = toSignal(this.state$.pipe(map((state) => state.personalization)), { requireSync: true })

  async currentUser() {
    if (!this.user()) {
      await this.refreshUser()
    }

    return this.user()
  }

  async refreshUser() {
    const { read } = useESHSearchStore()
    const user = await read('Users', { Id: '<current>' }).then((result) => {
      return {
        id: result.Id,
        name: result.Name
      }
    })

    if (user) {
      this.state$.next({
        ...this.state$.value,
        user
      })
    }
  }

  async refreshPersonalization() {
    const { read } = useINTEROPStore()
    const personalization = await read(
      'PersContainers',
      { category: 'P', id: PersContainerId },
      {
        headers: {
          'X-Csrf-Token': 'Fetch'
        },
        $expand: 'PersContainerItems'
      }
    ).then((result) => {
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

    if (personalization) {
      this.state$.next({
        ...this.state$.value,
        personalization
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
    this.state$.next({
      ...this.state$.value,
      personalization: {
        ...(this.state$.value.personalization ?? {}),
        ...value
      }
    })

    this.savePersonalization().then()
  }
}
