import { appRoutes } from '@/app/app.routes'
import { Injectable, computed, inject, signal } from '@angular/core'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router'
import { EMPTY, from, of } from 'rxjs'
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators'
import { MenuMode } from '../types'
import { ThemeService } from './theme.service'

export interface AppMenu {
  path: string | undefined
  label: string
  icon: string
  hasSubmenus?: boolean
  submenus?: AppMenu[] | undefined | null
  route: Route
}

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  private themeService = inject(ThemeService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  readonly menuMode = this.themeService.menuMode

  private appMenus = signal<AppMenu[]>(
    appRoutes.map((route) => mapRouteToMenu(route))
  )

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

  readonly rootMenu = toSignal(this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      switchMap(() => this.route.firstChild?.url ?? EMPTY),
      map((url) => url[0].path),
      distinctUntilChanged(),
      map((path) => this.appMenus()?.find((menu) => menu.route.path === path)),
      switchMap((menu) => {
        return menu ? from(this.loadMenus(menu)) : EMPTY
      })
    )
  )

  readonly subMenus = computed(() => {
    return this.rootMenu()?.submenus
  })

  async loadMenus(menu: AppMenu) {
    if (menu.hasSubmenus && !menu.submenus?.length && menu.route?.loadChildren) {
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
    })
  }
}
