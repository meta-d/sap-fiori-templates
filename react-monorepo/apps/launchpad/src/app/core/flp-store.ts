import { ProSettings } from '@ant-design/pro-components'
import { FlpStoreService, User } from '@zsap/flp-store'
import { useEffect } from 'react'
import { Observable } from 'rxjs'
import { useObservable } from './useObservable'

export const flpService = new FlpStoreService()

export const setPersonalization = (value: unknown) => {
  flpService.updatePersonalization(value)
}

export const usePersonalization = (): [Partial<ProSettings>, (value: Partial<ProSettings>) => void] => {
  const state = useObservable<Partial<ProSettings>>(flpService.personalization$ as Observable<Partial<ProSettings>>)

  useEffect(() => {
    flpService.refreshPersonalization().then()
  }, [])

  return [state, setPersonalization]
}

export const useUser = (): [Partial<User>] => {
  const state = useObservable<Partial<User>>(flpService.user$ as Observable<Partial<User>>)

  useEffect(() => {
    flpService.refreshUser().then()
  }, [])

  return [state]
}
