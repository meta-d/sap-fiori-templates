import { Injectable, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NGXLogger } from 'ngx-logger'
import { BehaviorSubject, map } from 'rxjs'
import { PersContainer } from '#cds-models/zm/appstore'
import { getCurrentUser } from '../auth'
import { upsertPersonalization, readPersonalization } from './personalization'
import { IAppStore, AppStoreState, DefaultPersonalization, PersContainerId, PersonalizationType } from '../app'



@Injectable()
export class BTPAppStoreService implements IAppStore {
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
