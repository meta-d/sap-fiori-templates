import { appRoutes } from '@/app/app.routes'
import { Injectable, computed, inject, signal } from '@angular/core'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Route,
  Router
} from '@angular/router'
import { BehaviorSubject, EMPTY, from } from 'rxjs'
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators'
import { MenuMode } from '../types'
import { ThemeService } from './theme.service'
import { readFLPH } from '@/app/stores'

export interface AppMenu {
  path: string | undefined
  label: string
  icon: string
  hasSubmenus?: boolean
  submenus?: AppMenu[] | undefined | null
  route: Route
  isUi5: boolean
  data?: any
}

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  private themeService = inject(ThemeService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  readonly menuMode = this.themeService.menuMode

  /**
   * All menus in app
   */
  private appMenus = signal<AppMenu[]>(
    appRoutes.filter((route) => !route.data?.['hidden'] ).map((route) => mapRouteToMenu(route))
  )

  /**
   * Display menus
   */
  readonly menus = computed(() => {
    return this.appMenus().map((menu) => {
      if (this.menuMode() === MenuMode.mix) {
        return {
          ...menu,
          submenus: null
        }
      }
      return menu
    })
  })

  rootPath = new BehaviorSubject<string>('/')

  private rootPathSub = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    switchMap(() => this.route.firstChild?.url ?? EMPTY),
    map((url) => url[0].path),
    distinctUntilChanged(),
    takeUntilDestroyed()
  ).subscribe((url) => this.rootPath.next(url))

  /**
   * Get current menu in the first level routes
   */
  readonly rootMenu = toSignal(this.rootPath.pipe(
      map((path) => this.appMenus()?.find((menu) => menu.route.path === path)),
      switchMap((menu) => {
        return menu ? from(this.loadMenus(menu)) : EMPTY
      })
    )
  )

  /**
   * The submenus of current root menu
   */
  readonly subMenus = computed(() => {
    return this.rootMenu()?.submenus
  })

  readonly pathFromRoot = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route: ActivatedRouteSnapshot = this.route.snapshot
        while (route.firstChild) {
          route = route.firstChild
        }
        return route.pathFromRoot.map((route) => route.routeConfig)
      })
    )
  )

  constructor() {
    this.loadFLPMenus().then()
  }

  setRootPath(path: string) {
    this.rootPath.next(path)
  }

  /**
   * Load the menu's submenus
   *
   * @param menu
   * @returns
   */
  async loadMenus(menu: AppMenu) {
    if (
      menu.hasSubmenus &&
      !menu.submenus?.length &&
      menu.route?.loadChildren
    ) {
      const result = await menu.route?.loadChildren()
      if (Array.isArray(result)) {
        menu.submenus = result.map((route: Route) =>
          mapRouteToMenu(route, menu.route)
        )
        this.appMenus.set([...this.appMenus()])
      }
    }

    return menu
  }

  async loadFLPMenus() {
    const result = await readFLPH()
    const { AssignedPages, Pages } = result
    this.appMenus.set([
      ...this.appMenus(),
      ...AssignedPages.results.map((item: any) => {
        const submenus = Pages.results.find((g: any) => g.id === item.id)?.PageChipInstances.results.map((page: any) => {
          const chipBag = page.Chip.ChipBags.results.find((bag: any) => bag.id === "tileProperties")
          const chipTitle = chipBag.ChipProperties.results.find((prop: any) => prop.name === "display_title_text")
          const configuration = JSON.parse(page.Chip.configuration)
          const tileConfiguration = JSON.parse(configuration.tileConfiguration)
          return {
            path: tileConfiguration.navigation_target_url,
            id: page.instanceId,
            label: chipTitle?.value,
            route: {
              path: tileConfiguration.navigation_target_url,
            },
            isUi5: true,
            data: tileConfiguration
          }
        })
        return {
          id: item.id,
          path: item.id,
          label: item.title,
          route: {
            path: item.id,
          },
          hasSubmenus: true,
          submenus,
          isUi5: true
        }
      })
    ])
  }

  goUI5Page(menu: AppMenu) {
    this.router.navigate(['/ui5', menu.data.navigation_semantic_object], {
      queryParams: {
        action:  menu.data.navigation_semantic_action,
      }
    })
  }
}

export function mapRouteToMenu(route: Route, parent?: Route): AppMenu {
  return {
    path: parent ? parent.path + '/' + route.path : route.path,
    label: route.data?.['label'],
    icon: route.data?.['icon'],
    route: route,
    hasSubmenus: !!(
      (route.children && route.children?.length > 0) ||
      route.loadChildren
    ),
    submenus: route.children?.map((child) => {
      return mapRouteToMenu(child, route)
    }),
    isUi5: false
  }
}
