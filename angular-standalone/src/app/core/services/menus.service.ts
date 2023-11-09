import { appRoutes } from '@/app/app.routes'
import { Injectable, computed, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Params, Route, Router } from '@angular/router'
import { distinctUntilChanged, filter, map } from 'rxjs/operators'
import { Ui5Path } from '../types'
import { FioriLaunchpadService } from './flp.service'
import { ThemeService } from './theme.service'
import { ZngPageTitleStrategy } from '../strategies'
import { nonNullable } from '@/app/utils'
import { environment } from '@/environments/environment'

export interface AppMenu<T = any> {
  path: string | undefined
  title: string
  icon: string | null
  hasSubmenus?: boolean
  submenus?: AppMenu[] | undefined | null
  route: Route
  isUi5?: boolean
  data?: T
  queryParams?: Params | null
  fragment?: string | undefined
}

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  private themeService = inject(ThemeService)
  private flpService = inject(FioriLaunchpadService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private titleStrategy = inject(ZngPageTitleStrategy)

  readonly menuMode = this.themeService.menuMode

  /**
   * All menus in app
   */
  private appMenus = signal<AppMenu[]>(
    appRoutes.filter((route) => !route.data?.['hidden']).map((route) => mapRouteToMenu(route))
  )
  private tAppMenus = computed(() => {
    return this.appMenus().map((menu) => ({
      ...menu,
      title: this.titleStrategy.pagesTranslate()?.[menu.title] || menu.title,
      submenus: menu.submenus?.map((submenu) => ({
        ...submenu,
        title: this.titleStrategy.pagesTranslate()?.[submenu.title] || submenu.title,
      }))
    }))
  })

  readonly flpMenus = this.flpService.routes
  readonly flpLoading = computed(() => {
    return environment.enableFiori && !this.flpMenus()
  })
  readonly menus = computed(() => {
    return [...this.tAppMenus(), ...(this.flpMenus() ?? [])]
  })

  /**
   * Root path, for examples: `/admin`, `/ui5/sales` is ['admin'] and ['ui5', 'sales']
   */
  readonly rootPath = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        const root = this.route.snapshot.firstChild
        if (root) {
          const rootPath = root.url[0].path ?? ''
          if (rootPath === Ui5Path) {
            return `/${root.url[0].path ?? ''}/${
              root.firstChild?.url[0].path ?? ''
            }`
          }
          return rootPath
        }
        
        return null
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
        return route.pathFromRoot // .map((route) => route.routeConfig)
      })
    )
  )

  readonly breadcrumbs = computed(() => {
    let parentPath = '/'
    let isUi5App: 'group' | 'app' | null = null
    let groupId = ''
    return this.pathFromRoot()?.map((route) => {
      let path = route?.routeConfig?.path
      // Replace path with acture param value
      if (path?.startsWith(':')) {
        path = route?.params?.[path.slice(1)]
      }
      // Append path to parent path
      parentPath += parentPath.endsWith('/')
        ? path || ''
        : '/' + (path || '')

      // Has enter ui5 path
      if (path === Ui5Path) {
        isUi5App = 'group'
        return null
      }

      // Skip hidden routes
      if (route.routeConfig?.data?.['hidden']) {
        return null
      }

      // Get app group title or app title
      let label = null
      if (isUi5App === 'group') {
        isUi5App = 'app'
        groupId = route.params?.['group'] as string
        label = groupId ? this.flpService.getGroup(groupId)?.title : null
      } else if (isUi5App === 'app') {
        isUi5App = null
        const appId = route.params?.['id'] as string
        if (appId) {
          label = this.flpService.getChip(appId, groupId)?.title
        }
      }

      // Otherwise, get translated page title
      if (!label) {
        const title = route?.title || (parentPath === '/' ? 'Home' : '')
        label = this.titleStrategy.pagesTranslate()?.[title] || title
      }

      return {
        value: parentPath,
        label
      }
    }).filter(nonNullable)
  })

  /**
   * Load the menu's submenus
   *
   * @param menu
   * @returns
   */
  async loadMenus(menu: AppMenu) {
    const index = this.appMenus().findIndex((m) => m.path === menu.path)
    if (index === -1) {
      return menu
    }

    if (menu.hasSubmenus && !menu.submenus?.length && menu.route?.loadChildren) {
      const result = await menu.route?.loadChildren()
      if (Array.isArray(result)) {
        const submenus = result.map((route: Route) => mapRouteToMenu(route, menu.route))
        menu = {
          ...this.appMenus()[index],
          submenus,
          hasSubmenus: !!submenus.length,
        }
        this.appMenus.set([
          ...this.appMenus().slice(0, index),
          menu,
          ...this.appMenus().slice(index + 1),
        ])
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
    title: route.title as string,
    icon: route.data?.['icon'],
    route: route,
    hasSubmenus: !!((route.children && route.children?.length > 0) || route.loadChildren),
    submenus: route.children?.map((child) => {
      return mapRouteToMenu(child, route)
    }),
    isUi5: false
  }
}
