import { Injectable, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NzMenuThemeType } from 'ng-zorro-antd/menu'
import { NGXLogger } from 'ngx-logger'
import { BehaviorSubject, map } from 'rxjs'
import { MenuMode, ThemeType } from '../core/types'
import { getCurrentUser } from './auth'
import { upsertPersonalization, readPersonalization } from './personalization'
import { PersContainer } from '@zcap/contracts'

const PersContainerId = 'zng.settings'

export interface AppStoreState {
  personalization: {
    record?: PersContainer
    value: {
      theme: ThemeType
      menuTheme: NzMenuThemeType
      menuMode: MenuMode
      primaryColor: string
      fixedLayoutSider: boolean
      fixedLayoutHeader: boolean
    }
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
  private readonly logger = inject(NGXLogger)

  private state$ = new BehaviorSubject<AppStoreState>({ personalization: {
    value: DefaultPersonalization
  } })

  readonly user = toSignal(this.state$.pipe(map((state) => state.user)))
  readonly personalization = toSignal(this.state$.pipe(map((state) => state.personalization.value)), { requireSync: true })

  async currentUser() {
    if (!this.user()) {
      await this.refreshUser()
    }

    return this.user()
  }

  async refreshUser() {
    const user = await getCurrentUser()
      .then((result) => {
        return {
          id: result.ID,
          name: result.Name
        }
      })
      .catch((err) => this.logger.error(err))

    if (user) {
      this.state$.next({
        ...this.state$.value,
        user
      })
    }
  }

  async refreshPersonalization() {
    const personalization = await readPersonalization(PersContainerId)

    if (personalization) {
      this.state$.next({
        ...this.state$.value,
        personalization: {
          record: personalization,
          value: {
            ...this.state$.value.personalization.value,
            ...JSON.parse(personalization.value)
          }
        }
      })
    }
  }

  async savePersonalization() {
    const value = this.state$.value.personalization.value

    const containerCategory = 'P'
    const body = {
      appId: PersContainerId,
      category: containerCategory,
      appName: 'ZNG',
      value: JSON.stringify(value)
    } as PersContainer
    if (this.state$.value.personalization.record) {
      body.ID = this.state$.value.personalization.record.ID
    }
    await upsertPersonalization(body)
  }

  updatePersonalization(value: any) {
    this.state$.next({
      ...this.state$.value,
      personalization: {
        ...(this.state$.value.personalization ?? {}),
        value: {
          ...this.state$.value.personalization.value,
          ...value
        }
      }
    })

    this.savePersonalization().then()
  }
}
