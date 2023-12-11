import { nonNullable } from '@/app/utils'
import { HttpClient } from '@angular/common/http'
import { Injectable, computed, inject } from '@angular/core'
import { AppMenu, MenusService } from './menus.service'

export interface SearchItem {
  group: string
  items: Array<{
    label: string
    itemSelected?: () => void
    shortcut: string
    separatorOnTop?: boolean
    searchKeywords: string
    menu: AppMenu
  }>
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private httpClient = inject(HttpClient)
  private menusService = inject(MenusService)

  readonly menuGroups = computed<SearchItem[]>(() => {
    return this.menusService
      .menus()
      .map((group) => {
        return (
          group.submenus && {
            group: group.title,
            items: group.submenus.map((item) => {
              return {
                label: item.title,
                shortcut: '',
                separatorOnTop: false,
                searchKeywords: item.data?.['searchKeywords'],
                menu: item,
              }
            })
          }
        )
      })
      .filter(nonNullable)
  })

}
