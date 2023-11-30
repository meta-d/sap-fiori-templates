import { Injectable, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NGXLogger } from 'ngx-logger'
import { BehaviorSubject, map } from 'rxjs'
import { useESHSearchStore } from './ESH_SEARCH'
import { useINTEROPStore } from './INTEROP'
import { IAppStore, AppStoreState, DefaultPersonalization, PersContainerId, PersonalizationType } from '../app'

const PersPersonalizationId = 'personalization'

@Injectable()
export class S4AppStoreService implements IAppStore {
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
    const { read } = useESHSearchStore()
    const user = await read('Users', { Id: '<current>' })
      .then((result) => {
        return {
          id: result.Id,
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
    )
      .then((result) => result.PersContainerItems.results.find((item: any) => item.id === PersPersonalizationId))
      .catch((err) => this.logger.error(err))

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
    const { save } = useINTEROPStore()

    const value = this.state$.value.personalization.value

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
