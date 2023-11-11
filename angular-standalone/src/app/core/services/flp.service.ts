import { UI5Theme, queryThemes, readFLPH } from '@/app/stores'
import { environment } from '@/environments/environment'
import { Injectable, computed, inject, signal } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { AppGroup, Chip, Ui5Path } from '../types'
import { AppMenu } from './menus.service'
import { CookieService } from 'ngx-cookie-service'

export const SAPUserContextCookieName = 'sap-usercontext'
export const SAPUserContextLanguage = 'sap-language'

@Injectable({
  providedIn: 'root'
})
export class FioriLaunchpadService {
  private cookieService = inject(CookieService)
  
  readonly state = signal<{
    pageSets: {
      AssignedPages: any;
      Pages: any;
      id: string;
      configuration: string;
    } | null;
    themes: UI5Theme[] | null;
    theme: string;
  }>({
    pageSets: null,
    themes: null,
    theme: 'sap_horizon'
  })
  readonly state$ = toObservable(this.state)

  readonly pageSets = computed(() => this.state().pageSets)
  readonly themes = computed(() => this.state().themes)
  readonly theme = computed(() => this.state().theme)

  readonly routes = computed<AppMenu[] | null>(() => {
    const { AssignedPages, Pages } = this.pageSets() ?? {}

    return AssignedPages?.results.map((item: any) => {
      const path = `/${Ui5Path}/${item.id}`

      const submenus = Pages.results.find((g: any) => g.id === item.id)?.PageChipInstances.results.map(toChip)
        .filter((chip: Chip) => chip.navigationSemanticObject)
        .map((chip: Chip) => {
          const chipUrl = chip.navigationSemanticObject + '-' + chip.navigationSemanticAction
          return {
            path: `${path}/${chipUrl}`,
            id: chip.id,
            title: chip.title,
            route: {
              path: chipUrl
            },
            isUi5: true,
            fragment: chip.navigationTargetUrl?.startsWith('#') ? chip.navigationTargetUrl.slice(1) : chip.navigationTargetUrl,
            data: chip
          }
        })

      return {
        id: item.id,
        path,
        title: item.title,
        route: {
          path: item.id
        },
        hasSubmenus: true,
        submenus,
        isUi5: true,
        data: {
          ...item
        } as AppGroup
      }
    })
  })

  constructor() {
    if (environment.enableFiori) {
      this.loadFLPMenus().then()
      this.loadCookie()
    }
  }

  loadCookie() {
    const userContext = this.getUserContext()
    let searchParams: URLSearchParams
    if (userContext) {
      searchParams = new URL(`http://localhost?${userContext}`).searchParams
    } else {
      searchParams = new URLSearchParams()
    }

    this.state.update((state) => ({
      ...state,
      theme: searchParams.get('sap-theme') || 'sap_horizon'
    }))
  }

  async loadFLPMenus() {
    const pageSets = await readFLPH()
    this.state.update((state) => ({
      ...state,
      pageSets
    }))
  }

  async loadThemes() {
    if (!this.themes()) {
      const themes = await queryThemes()
      this.state.update((state) => ({
        ...state,
        themes
      }))
    }
  }

  getPage(id: string) {
    return this.pageSets()?.Pages.results.find((item: any) => item.id === id)
  }

  selectGroupChips(id: string): Observable<Chip[]> {
    return this.state$.pipe(
      map((state) => state.pageSets?.Pages.results.find((item: any) => item.id === id)?.PageChipInstances.results.map(toChip))
    )
  }

  getGroup(name: string): AppGroup {
    return this.routes()?.find((item) => item.route.path === name)?.data
  }

  getChip(path: string, group?: string | null): Chip | null {
    return this.routes()?.find((item) => !group || item.route.path === group)?.submenus?.find((item) => item.route.path === path)?.data
  }

  /**
   * Save Fiori theme to sap-usercontext in cookie
   * 
   * @param themeId 
   */
  setFioriTheme(themeId: string) {
    const userContext = this.getUserContext()
    let searchParams
    if (userContext) {
      searchParams = new URL(`http://localhost?${userContext}`).searchParams
    } else {
      searchParams = new URLSearchParams()
    }

    searchParams.set('sap-theme', themeId)
    this.cookieService.set(SAPUserContextCookieName, searchParams.toString())
    this.state.update((state) => ({
      ...state,
      theme: themeId
    }))
  }

  getUserContext() {
    return this.cookieService.get(SAPUserContextCookieName)
  }
}

export function toChip(item: any /*odata result*/): Chip {
  const id = item.instanceId
  const chipBag = item.Chip.ChipBags.results.find((bag: any) => bag.id === 'tileProperties')
  const chipTitle = chipBag?.ChipProperties.results.find((prop: any) => prop.name === 'display_title_text')
  const chipSubTitle = chipBag?.ChipProperties.results.find((prop: any) => prop.name === 'display_subtitle_text')
  const searchKeywords = chipBag?.ChipProperties.results.find((prop: any) => prop.name === 'display_search_keywords')

  let tileConfiguration
  try {
    const configuration = JSON.parse(item.Chip.configuration)
    tileConfiguration = JSON.parse(configuration.tileConfiguration)
  } catch (err) {
    //
  }
  
  return {
    id,
    title: chipTitle?.value,
    subTitle: chipSubTitle?.value,
    searchKeywords: searchKeywords?.value,
    navigationSemanticObject: tileConfiguration?.navigation_semantic_object,
    navigationSemanticAction: tileConfiguration?.navigation_semantic_action,
    navigationTargetUrl: tileConfiguration?.navigation_target_url?.startsWith('#') ? tileConfiguration.navigation_target_url.slice(1) : tileConfiguration?.navigation_target_url,
  }
}
