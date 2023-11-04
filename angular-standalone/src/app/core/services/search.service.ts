import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { MenusService } from './menus.service'

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private httpClient = inject(HttpClient)
  private menusService = inject(MenusService)

  search(text: string) {
    return this.menusService.menus().filter((menu) => menu.title?.includes(text))
  }
 
}
