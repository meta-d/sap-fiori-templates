import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  public setItem<T = unknown>(key: string, data: T): void {
    localStorage.setItem(key as string, JSON.stringify(data))
  }

  public getItem<T>(key: string): T | null {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key)
  }

  public clear() {
    localStorage.clear()
  }
}
