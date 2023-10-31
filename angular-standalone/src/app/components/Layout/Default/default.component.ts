import { MenuMode, ResizeObserverDirective, ThemeService, ThemeType } from '@/app/core'
import { ZngAntdModule } from '@/app/core/shared.module'
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { GlobalHeaderComponent } from '../../GlobalHeader/global-header.component'
import { SubSideNavBarComponent } from '../../SubSideNavBar/nav-bar.component'
import { TopNavBarComponent } from '../../TopNavBar/top-nav-bar.component'
import { SideNavBarComponent } from '../../SideNavBar/nav-bar.component'

@Component({
  selector: 'zng-layout-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgTemplateOutlet,
    RouterOutlet,
    AsyncPipe,
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
}
