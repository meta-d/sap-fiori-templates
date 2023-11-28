import { AppMenu, MenusService } from '@/app/core'
import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { Component, Input, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { NzMenuThemeType } from 'ng-zorro-antd/menu'
import { GlobalSettingsComponent } from '../GlobalSettings/global-settings.component'

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, ZngAntdModule, GlobalSettingsComponent],
  selector: 'zng-side-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class SideNavBarComponent {
  private menusService = inject(MenusService)
  private router = inject(Router)

  @Input() nzTheme: NzMenuThemeType = 'dark'
  @Input() isCollapsed = false

  readonly menus = this.menusService.menus
  readonly flpLoading = this.menusService.flpLoading

  loadMenus(menu: AppMenu) {
    this.menusService.loadMenus(menu)
  }

  goUI5Page(menu: AppMenu) {
    this.menusService.goUI5Page(menu)
  }

  /**
   * @todo implementation
   * 
   * @param path 
   * @returns 
   */
  isOpen(path: string | undefined) {
    return false
  }
}
