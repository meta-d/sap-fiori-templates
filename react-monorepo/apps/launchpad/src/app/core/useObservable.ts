import { isDeepEqualReact } from '@ant-design/pro-components'
import { useEffect, useState } from 'react'
import { Observable, distinctUntilChanged } from 'rxjs'

function get<T>(observable$: Observable<T>) {
  let value: T | null = null
  observable$.subscribe((val) => (value = val)).unsubscribe()
  return value!
}

export function useObservable<TOutput>(observable$: Observable<TOutput>): TOutput {
  const [value, setValue] = useState<TOutput>(() => get<TOutput>(observable$))

  useEffect(() => {
    const subscription = observable$.pipe(distinctUntilChanged(isDeepEqualReact)).subscribe(setValue)
    return function cleanup() {
      subscription.unsubscribe()
    }
  }, [observable$])

  return value
}
