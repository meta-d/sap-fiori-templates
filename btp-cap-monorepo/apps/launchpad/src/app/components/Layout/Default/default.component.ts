import { MenuMode, MenusService, ResizeObserverDirective, TabService, ThemeService, ThemeType } from '@/app/core'
import { ZngAntdModule } from '@/app/core/shared.module'
import { AppStoreService } from '@/app/stores'
import { environment } from '@/environments/environment'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { filter, map, mergeMap } from 'rxjs/operators'
import { GlobalHeaderComponent } from '../../GlobalHeader/global-header.component'
import { MenuTabComponent } from '../../MenuTab/menu-tab.component'
import { SideNavBarComponent } from '../../SideNavBar/nav-bar.component'
import { SubSideNavBarComponent } from '../../SubSideNavBar/nav-bar.component'
import { TopNavBarComponent } from '../../TopNavBar/top-nav-bar.component'

@Component({
  selector: 'zng-layout-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ZngAntdModule,
    GlobalHeaderComponent,
    TopNavBarComponent,
    SubSideNavBarComponent,
    SideNavBarComponent,
    ResizeObserverDirective,
    MenuTabComponent
  ],
  host: {
    '[class.zng-layout__mix]': `menuMode() === \'mix\'`,
    '[class.zng-layout__top]': `menuMode() === \'top\'`,
    '[class.zng-layout__side]': `menuMode() === \'side\'`
  }
})
export class LayoutDefaultComponent {
  private themeService = inject(ThemeService)
  private menusService = inject(MenusService)
  private appStore = inject(AppStoreService)
  private router = inject(Router)
  private destroyRef = inject(DestroyRef)
  private tabService = inject(TabService)
  private activatedRoute = inject(ActivatedRoute)

  ThemeType = ThemeType
  MenuMode = MenuMode
  enableWaterMark = environment.enableWaterMark

  get currentTheme() {
    return this.themeService.currentTheme() === ThemeType.default ? 'light' : 'dark'
  }
  get menuTheme() {
    return this.themeService.menuTheme
  }
  readonly menuMode = this.themeService.menuMode

  readonly fixedLayoutSider = this.themeService.fixedLayoutSider
  readonly fixedLayoutHeader = this.themeService.fixedLayoutHeader
  readonly isShowTab = this.themeService.isShowTab
  readonly isOverMode = this.themeService.isOverMode

  readonly breadcrumbs = this.menusService.breadcrumbs

  readonly waterMark = computed(() => `${this.appStore.user()?.name} ${this.appStore.user()?.id} ©2023 Metad Team`)

  readonly isCollapsed = this.themeService.isCollapsed

  readonly #navigationEnd$ = this.router.events.pipe(filter((event) => event instanceof NavigationEnd))

  routerPath = ''
  #navigationEndSub = this.#navigationEnd$.subscribe(() => {
    // @ts-expect-error Object is possibly 'null'
    this.routerPath = this.activatedRoute.snapshot['_routerState'].url

    // // 做一个copyMenus来记录当前menu状态，因为顶部模式时是不展示子menu的，然而主题由顶部模式切换成侧边栏模式，要把当前顶部模式中菜单的状态体现于侧边栏模式的菜单中
    // this.clickMenuItem(this.menus);
    // this.clickMenuItem(this.copyMenus);
    // // 是折叠的菜单并且不是over菜单,解决折叠左侧菜单时，切换tab会有悬浮框菜单的bug
    // if (this.isCollapsed && !this.isOverMode) {
    //   this.closeMenuOpen(this.menus);
    // }

    // // 顶部菜单模式，并且不是over模式，解决顶部模式时，切换tab会有悬浮框菜单的bug
    // if (this.themesMode === 'top' && !this.isOverMode) {
    //   this.closeMenu();
    // }
  })

  #navigationEndSub2 = this.#navigationEnd$
    .pipe(
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild
        }
        return route
      }),
      filter((route) => {
        return route.outlet === 'primary'
      }),
      mergeMap((route) => {
        return route.data
      }),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((routeData) => {
      // 详情页是否是打开新tab页签形式
      const isNewTabDetailPage = routeData['newTab'] === 'true'

      let route = this.activatedRoute
      while (route.firstChild) {
        route = route.firstChild
      }

      let title = 'Ant Design'
      if (typeof route.routeConfig?.title === 'string') {
        title = route.routeConfig?.title
      }

      this.tabService.addTab(
        {
          snapshotArray: [route.snapshot],
          title,
          path: this.routerPath
        },
        isNewTabDetailPage
      )
      this.tabService.findIndex(this.routerPath)
      // 混合模式时，切换tab，让左侧菜单也相应变化
      this.setMixModeLeftMenu()
    })

  toggleSideMenu() {
    this.isCollapsed.update((state) => !state)
  }

  // 设置混合模式时，左侧菜单"自动分割菜单"模式的数据源
  setMixModeLeftMenu(): void {
    // this.menus.forEach(item => {
    //   if (item.selected) {
    //     this.splitNavStoreService.setSplitLeftNavArrayStore(item.children || []);
    //   }
    // });
  }
}
