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

  ThemeType = ThemeType
  MenuMode = MenuMode

  get menuTheme() {
    return this.themeService.menuTheme
  }
  get menuMode() {
    return this.themeService.menuMode
  }
  get fixedLayoutSider() {
    return this.themeService.fixedLayoutSider
  }

  isCollapsed = false

  readonly breadcrumbs = computed(() => {
    let parentPath = '/'
    return this.menusService.pathFromRoot()?.map((route) => {
      parentPath += parentPath.endsWith('/')
        ? route?.path || ''
        : '/' + (route?.path || '')
      return {
        value: parentPath,
        label: route?.data?.['label'] || (parentPath === '/' ? 'Home' : '')
      }
    })
  })

  toggleSideMenu() {
    this.isCollapsed = !this.isCollapsed
  }
}
