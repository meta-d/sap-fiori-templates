import { Injectable, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NzMenuThemeType } from 'ng-zorro-antd/menu'
import { NGXLogger } from 'ngx-logger'
import { BehaviorSubject, map } from 'rxjs'
import { PersContainer } from '#cds-models/zm/appstore'
import { MenuMode, ThemeType } from '../core/types'
import { getCurrentUser } from './auth'
import { upsertPersonalization, readPersonalization } from './personalization'

const PersContainerId = 'zng.settings'

export interface PersonalizationType {
  theme: ThemeType
  menuTheme: NzMenuThemeType
  menuMode: MenuMode
  primaryColor?: string
  fixedLayoutSider: boolean
  fixedLayoutHeader: boolean
  isShowTab: boolean
  fixedTab: boolean
  isOverMode: boolean
  hasTopArea: boolean; // 是否展示顶部区域
  hasFooterArea: boolean; // 是否展示底部区域
  hasNavArea: boolean; // 是否有菜单
  hasNavHeadArea: boolean; // 菜单是否有菜单头
  splitNav: boolean; // 是否分割菜单
}

export interface AppStoreState {
  personalization: {
    record?: PersContainer
    value: PersonalizationType
  }
  user?: {
    id: string
    name: string
  }
}

const DefaultPersonalization: PersonalizationType = {
  theme: ThemeType.default,
  menuTheme: 'dark',
  menuMode: MenuMode.side,
  fixedLayoutSider: true,
  fixedLayoutHeader: false,
  isShowTab: true,
  fixedTab: true,
  isOverMode: false,
  hasTopArea: true,
  hasFooterArea: true,
  hasNavArea: true,
  hasNavHeadArea: true,
  splitNav: true
}

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
            ...JSON.parse(personalization.value ?? '{}')
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

  updatePersonalization(value: Partial<PersonalizationType>) {
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
