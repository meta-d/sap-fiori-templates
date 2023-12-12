import { appRoutes } from '@/app/app.routes'
import { Injectable, computed, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Params, Route, Router, Routes } from '@angular/router'
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
  icon?: string | null
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
  private appMenus = signal<AppMenu[]>(mapRoutes2Menus(appRoutes))
  
  /**
   * App menus with title translation
   */
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
    return environment.platform === 'S4' && environment.enableFiori && !this.flpMenus()
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
      if (path === 'app') {
        isUi5App = 'app'
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
    const indexes = findMenuIndex(this.appMenus(), menu)

    if (indexes.length > 0 && menu.hasSubmenus && !menu.submenus?.length && menu.route?.loadChildren) {
      // 兼容 export Routes 和 export default Routes 两种方式
      const result = await (<Promise<any>>menu.route?.loadChildren()).then(getChildrenRoutes)
      if (Array.isArray(result)) {
        const submenus = mapRoutes2Menus(result, menu.path)
        menu = {
          ...menu,
          submenus,
          hasSubmenus: !!submenus.length,
        }
        this.appMenus.update((menus) => updateMenus(menus, indexes, menu))
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

function getChildrenRoutes(m: any) {
  if (Array.isArray(m)) {
    // load children from component
    return m
  } else if (Array.isArray(m.default)) {
    // load children from component default
    return m.default
  } else if (m.ɵinj) {
    // load children from providers in sub module 
    return m.ɵinj.providers[0].ɵproviders[0].useValue
  }

  return []
}

export function mapRoutes2Menus(routes: Routes, parent?: string): AppMenu[] {
  return routes.filter((route) => !route.data?.['hidden']).map((route) => mapRouteToMenu(route, parent))
}

export function mapRouteToMenu(route: Route, parent?: string): AppMenu {
  const children = route.children ? mapRoutes2Menus(route.children, route.path) : null
  return {
    path: parent ? parent + '/' + route.path : route.path,
    queryParams: route.data?.['queryParams'],
    title: route.title as string,
    icon: route.data?.['icon'],
    route: route,
    hasSubmenus: !!((children && children.length > 0) || route.loadChildren),
    submenus: children,
    isUi5: false
  }
}

/**
 * 
 * 
 * @param menus 
 * @param menu 
 * @returns 
 */
function findMenuIndex(menus: AppMenu[] | undefined | null, menu: AppMenu) {
  if (menus == null) {
    return []
  }
  const index = menus.findIndex((item) => item.path === menu.path)
  if (index > -1) {
    return [index]
  }

  const indexes: number[] = []
  menus.find((item, index) => {
    const _indexes = findMenuIndex(item.submenus, menu)
    if (_indexes.length > 0) {
      indexes.push(index, ..._indexes)
      return true
    }

    return false
  })

  return indexes
}

/**
 * 
 * 
 * @param menus 
 * @param indexes 
 * @param menu 
 * @returns 
 */
function updateMenus(menus: AppMenu[], indexes: number[], menu: AppMenu): AppMenu[] {
  const index = indexes[0]

  if (indexes.length === 1) {
    return [
      ...menus.slice(0, index),
      menu,
      ...menus.slice(index + 1)
    ]
  }

  return [
    ...menus.slice(0, index),
    {
      ...menus[index],
      submenus: updateMenus(menus[index].submenus!, indexes.slice(1), menu)
    },
    ...menus.slice(index + 1)
  ] 
}