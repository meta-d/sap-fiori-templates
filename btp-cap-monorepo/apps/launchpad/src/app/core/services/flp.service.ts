import { PageSetsType, UI5Theme, queryThemes, readFLPH } from '@/app/stores'
import { environment } from '@/environments/environment'
import { Injectable, computed, inject, signal } from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import queryString from 'query-string'
import { AppGroup, Chip, Ui5Path } from '../types'
import { AppMenu } from './menus.service'
import { CookieService } from 'ngx-cookie-service'
import { ThemeService } from './theme.service'
import { toSAPLanguage } from './translate'
import { LocalStorageService } from './local-storage.service'

export const SAPUserContextCookieName = 'sap-usercontext'
export const SAPUserContextLanguage = 'sap-language'
export const SAPFioriPageSetsName = 'Fiori_Page_Sets'

@Injectable({
  providedIn: 'root'
})
export class FioriLaunchpadService {
  private localStorage = inject(LocalStorageService)
  private cookieService = inject(CookieService)
  private themeService = inject(ThemeService)
  
  readonly state = signal<{
    pageSets: PageSets[] | null;
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

  readonly routes = computed<AppMenu[] | undefined>(() => {
    return this.pageSets()?.map((item) => {
      const path = `/${Ui5Path}/${item.id}`

      const submenus = item.chips
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

  readonly #translateSub = this.themeService.onLangChange().pipe(takeUntilDestroyed()).subscribe((lang) => {
    // Update the sap language in the cookie `sap-usercontext`
    const userContext = this.cookieService.get(SAPUserContextCookieName)
    const searchParams = new URL(`http://localhost?${userContext}`).searchParams
    searchParams.set(SAPUserContextLanguage, toSAPLanguage(lang))
    this.cookieService.set(SAPUserContextCookieName, searchParams.toString(), undefined, '/')
  })
  
  constructor() {
    if (environment.enableFiori) {
      this.loadFLPMenus().then()
      this.loadCookie()
      const localPageSets = this.localStorage.getItem<PageSets[]>(SAPFioriPageSetsName)
      if (localPageSets) {
        this.state.update((state) => ({
          ...state,
          pageSets: state.pageSets ?? localPageSets
        }))
      }
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
    const pageSets = simplifyPageSets(await readFLPH())
    this.state.update((state) => ({
      ...state,
      pageSets
    }))
    this.localStorage.setItem(SAPFioriPageSetsName, pageSets)
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

  // getPage(id: string) {
  //   return this.pageSets()?.Pages.results.find((item: any) => item.id === id)
  // }

  selectGroupChips(id: string): Observable<Chip[] | undefined> {
    return this.state$.pipe(
      map((state) => state.pageSets?.find((item) => item.id === id)?.chips)
    )
  }

  getGroup(name: string): AppGroup {
    return this.routes()?.find((item) => item.route.path === name)?.data
  }

  getChip(path: string, group?: string | null): Chip | null {
    let chip: Chip | null = null
    this.routes()?.filter((item) => !group || item.route.path === group).forEach((menu) => {
      const submenu = menu?.submenus?.find((item) => item.route.path === path)
      if (submenu) {
        chip = submenu.data
      }
    })
    return chip
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

  let navigationSemanticParameters = null
  if (tileConfiguration?.navigation_semantic_parameters) {
    navigationSemanticParameters = queryString.parse(tileConfiguration?.navigation_semantic_parameters) as Record<string, string>
  }
  
  return {
    id,
    title: chipTitle?.value,
    subTitle: chipSubTitle?.value,
    searchKeywords: searchKeywords?.value,
    navigationSemanticObject: tileConfiguration?.navigation_semantic_object,
    navigationSemanticAction: tileConfiguration?.navigation_semantic_action,
    navigationSemanticParameters,
    navigationTargetUrl: tileConfiguration?.navigation_target_url?.startsWith('#') ? tileConfiguration.navigation_target_url.slice(1) : tileConfiguration?.navigation_target_url,
  }
}

function simplifyPageSets(pageSets: PageSetsType): PageSets[] {
  const { AssignedPages, Pages } = pageSets ?? {}
  return AssignedPages?.results.map((item: any) => {
    return {
      id: item.id,
      title: item.title,
      chips: Pages.results.find((g: any) => g.id === item.id)?.PageChipInstances.results.map(toChip)
    }
  })
}

interface PageSets {
  id: string;
  title: string;
  chips: Chip[]
}