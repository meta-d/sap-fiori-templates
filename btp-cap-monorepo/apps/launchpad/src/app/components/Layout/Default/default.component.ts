import { MenuMode, MenusService, ResizeObserverDirective, TabService, ThemeService, ThemeType } from '@/app/core'
import { ZngAntdModule } from '@/app/core/shared.module'
import { ZngPageTitleStrategy } from '@/app/core/strategies'
import { APP_STORE_TOKEN, IAppStore } from '@/app/stores'
import { environment } from '@/environments/environment'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, DestroyRef, HostBinding, computed, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router'
import { NgmCopilotChatComponent } from '@metad/ocap-angular/copilot'
import { TranslateModule } from '@ngx-translate/core'
import { filter, map, mergeMap } from 'rxjs/operators'
import { GlobalHeaderComponent } from '../../GlobalHeader/global-header.component'
import { MenuTabComponent } from '../../MenuTab/menu-tab.component'
import { NavigationProgressBarComponent } from '../../NavigationProgressBar/'
import { SideNavBarComponent } from '../../SideNavBar/nav-bar.component'
import { SubSideNavBarComponent } from '../../SubSideNavBar/nav-bar.component'
import { TopNavBarComponent } from '../../TopNavBar/top-nav-bar.component'
import { DrawerTriggerComponent } from '../../Drawer'

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
    MenuTabComponent,
    NavigationProgressBarComponent,
    DrawerTriggerComponent,

    NgmCopilotChatComponent
  ],
  host: {
    '[class.zng-layout__mix]': `menuMode() === \'mix\'`,
    '[class.zng-layout__top]': `menuMode() === \'top\'`,
    '[class.zng-layout__side]': `menuMode() === \'side\'`
  }
})
export class LayoutDefaultComponent {
  @HostBinding('class.zng-layout__fixed-sider')
  get _fixedLayoutSider() {
    return this.fixedLayoutSider()
  }
  @HostBinding('class.zng-layout__collapsed')
  get _layoutCollapsed() {
    return this.isCollapsed()
  }

  private themeService = inject(ThemeService)
  private menusService = inject(MenusService)
  private appStore = inject<IAppStore>(APP_STORE_TOKEN)
  private router = inject(Router)
  private destroyRef = inject(DestroyRef)
  private tabService = inject(TabService)
  private activatedRoute = inject(ActivatedRoute)
  private titleStrategy = inject(ZngPageTitleStrategy)

  ThemeType = ThemeType
  MenuMode = MenuMode
  enableWaterMark = environment.enableWaterMark

  // Emable AI Copilot Chat for global
  enableCopilot = environment.copilot?.enabled
  readonly openCopilotChat = signal(false)
  get copilotOpened() {
    return this.openCopilotChat()
  }
  set copilotOpened(value) {
    this.openCopilotChat.set(value)
  }

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
  readonly fixedTab = this.themeService.fixedTab
  readonly isOverMode = this.themeService.isOverMode

  readonly breadcrumbs = this.menusService.breadcrumbs
  readonly user = this.appStore.user
  readonly waterMark = computed(() => `${this.appStore.user()?.name} ${this.appStore.user()?.id} ©2023 Metad Team`)
  readonly copilotUser = computed(() => ({
    name: this.user()?.name,
    imageUrl: 'assets/images/default-user.jpg'
  }))

  readonly isCollapsed = this.themeService.isCollapsed

  readonly #navigationEnd$ = this.router.events.pipe(filter((event) => event instanceof NavigationEnd))

  routerPath = ''
  #navigationEndSub = this.#navigationEnd$.subscribe(() => {
    // @ts-expect-error Object is possibly 'null'
    this.routerPath = this.activatedRoute.snapshot['_routerState'].url
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
      const isNewTabDetailPage = routeData['newTab'] === true

      let route = this.activatedRoute
      while (route.firstChild) {
        route = route.firstChild
      }

      let title = 'Metad Team'
      if (typeof route.routeConfig?.title === 'string') {
        title = this.titleStrategy.pagesTranslate()?.[route.routeConfig?.title] || route.routeConfig?.title
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
      // 混合模式时，切换 tab，让左侧菜单也相应变化
      this.setMixModeLeftMenu()
    })

  toggleSideMenu() {
    this.isCollapsed.update((state) => !state)
  }

  onSubMenuCollapsed(event: boolean) {
    this.isCollapsed.set(event)
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
