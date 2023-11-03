import { appRoutes } from '@/app/app.routes'
import { Injectable, computed, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Params, Route, Router } from '@angular/router'
import { distinctUntilChanged, filter, map } from 'rxjs/operators'
import { Ui5Path } from '../types'
import { FioriLaunchpadService } from './flp.service'
import { ThemeService } from './theme.service'

export interface AppMenu {
  path: string | undefined
  title: string
  icon: string
  hasSubmenus?: boolean
  submenus?: AppMenu[] | undefined | null
  route: Route
  isUi5: boolean
  data?: any
  queryParams?: Params | null
}

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  private themeService = inject(ThemeService)
  private flpService = inject(FioriLaunchpadService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  readonly menuMode = this.themeService.menuMode

  /**
   * All menus in app
   */
  private appMenus = signal<AppMenu[]>(
    appRoutes.filter((route) => !route.data?.['hidden']).map((route) => mapRouteToMenu(route))
  )

  readonly flpMenus = this.flpService.routes
  readonly menus = computed(() => {
    return [...this.appMenus(), ...(this.flpMenus() ?? [])]
  })

  /**
   * Root path, for examples: `/admin`, `/ui5/sales` is ['admin'] and ['ui5', 'sales']
   */
  readonly rootPath = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        const rootPath = this.route.snapshot.firstChild?.url[0].path ?? ''
        if (rootPath === Ui5Path) {
          return `/${this.route.snapshot.firstChild?.url[0].path ?? ''}/${
            this.route.snapshot.firstChild?.url[1].path ?? ''
          }`
        }
        return rootPath
      }),
      distinctUntilChanged()
    )
  )

  /**
   * Get current menu in the first level routes
   */
  readonly rootMenu = computed(() => {
    const rootMenu = this.menus()?.find((menu) => menu.path === this.rootPath())
    if (rootMenu) {
      this.loadMenus(rootMenu)
    }
    return rootMenu
  })

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

  /**
   * Load the menu's submenus
   *
   * @param menu
   * @returns
   */
  async loadMenus(menu: AppMenu) {
    if (menu.hasSubmenus && !menu.submenus?.length && menu.route?.loadChildren) {
      const result = await menu.route?.loadChildren()
      if (Array.isArray(result)) {
        menu.submenus = result.map((route: Route) => mapRouteToMenu(route, menu.route))
        this.appMenus.set([...this.appMenus()])
      }
    }

    return menu
  }

  goUI5Page(menu: AppMenu) {
    this.router.navigate(['/ui5', menu.data.navigation_semantic_object], {
      queryParams: {
        action: menu.data.navigation_semantic_action
      }
    })
  }
}

export function mapRouteToMenu(route: Route, parent?: Route): AppMenu {
  return {
    path: parent ? parent.path + '/' + route.path : route.path,
    title: route.data?.['label'],
    icon: route.data?.['icon'],
    route: route,
    hasSubmenus: !!((route.children && route.children?.length > 0) || route.loadChildren),
    submenus: route.children?.map((child) => {
      return mapRouteToMenu(child, route)
    }),
    isUi5: false
  }
}
