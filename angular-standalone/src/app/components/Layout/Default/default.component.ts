import {
  MenuMode,
  MenusService,
  ResizeObserverDirective,
  ThemeService,
  ThemeType
} from '@/app/core'
import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { GlobalHeaderComponent } from '../../GlobalHeader/global-header.component'
import { SideNavBarComponent } from '../../SideNavBar/nav-bar.component'
import { SubSideNavBarComponent } from '../../SubSideNavBar/nav-bar.component'
import { TopNavBarComponent } from '../../TopNavBar/top-nav-bar.component'
import { environment } from '@/environments/environment'
import { AppStoreService } from '@/app/stores'

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
    ResizeObserverDirective
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

  isCollapsed = false

  readonly breadcrumbs = this.menusService.breadcrumbs
  
  readonly waterMark = computed(() => `${this.appStore.user()?.name} ${this.appStore.user()?.id} ©2023 Metad Team`)

  toggleSideMenu() {
    this.isCollapsed = !this.isCollapsed
  }
}
