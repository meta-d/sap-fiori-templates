import { AppMenu, MenusService } from '@/app/core'
import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { Component, Input, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { GlobalSettingsComponent } from '../GlobalSettings/global-settings.component'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ZngAntdModule,
    GlobalSettingsComponent
  ],
  selector: 'zng-sub-side-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class SubSideNavBarComponent {
  private menusService = inject(MenusService)

  readonly menus = this.menusService.subMenus

  trackByIndex(index: number, item: AppMenu) {
    return index
  }

  loadMenus(menu: AppMenu) {
    this.menusService.loadMenus(menu)
  }

  goUI5Page(menu: AppMenu) {
    this.menusService.goUI5Page(menu)
  }
}
