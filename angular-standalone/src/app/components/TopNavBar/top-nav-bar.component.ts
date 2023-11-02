import { AppMenu, MenusService, ResizeObserverDirective } from '@/app/core'
import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, ElementRef, Input, ViewChild, computed, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { NzMenuThemeType } from 'ng-zorro-antd/menu'
import { NzMessageService } from 'ng-zorro-antd/message'
import { GlobalSettingsComponent } from '../GlobalSettings/global-settings.component'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ZngAntdModule,
    GlobalSettingsComponent,
    ResizeObserverDirective
  ],
  selector: 'zng-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.scss']
})
export class TopNavBarComponent implements AfterViewInit {
  public message = inject(NzMessageService)
  private menusService = inject(MenusService)
  private hostElement = inject(ElementRef)
  @ViewChild('mEl', { static: false }) menusElement: ElementRef | null = null

  @Input() nzTheme: NzMenuThemeType = 'dark'

  readonly moreMenuSize = signal(0)

  readonly menus = computed(() => {
    const menus = this.menusService.menus()
    const result = {
      menus: menus.slice(0, menus.length - this.moreMenuSize()),
      moreMenus: menus.slice(menus.length - this.moreMenuSize())
    }

    console.log(result)
    return result
  })

  ngAfterViewInit() {
    this.checkWidth();
  }

  trackByIndex(index: number, item: AppMenu) {
    return index
  }

  loadMenus(menu: AppMenu) {
    if (menu.isUi5) {
      this.menusService.setRootPath(menu.path as string)
    } else {
      this.menusService.loadMenus(menu)
    }
  }

  onMouseEnterMenu(menu: AppMenu) {
    console.log(menu.label)
  }

  showMessage(): void {
    this.message.info('切换成功')
  }

  onScroll(event: any) {
    console.log(event)
  }

  checkWidth() {
    if (this.menusElement && this.hostElement) {
      const childWidth = this.menusElement.nativeElement.offsetWidth;
      const hostWidth = this.hostElement.nativeElement.offsetWidth;

      return childWidth > hostWidth
    }

    return false
  }

  onResize(event: any) {
    if (this.menusElement && this.hostElement) {
      const childWidth = this.menusElement.nativeElement.offsetWidth;
      const hostWidth = this.hostElement.nativeElement.offsetWidth;

      if (childWidth > hostWidth) {
        this.moreMenuSize.update((size) => ++size)
      } else if (childWidth < hostWidth - 100) {
        if (this.moreMenuSize() > 0) {
          this.moreMenuSize.update((size) => --size)
        }
      }
    }
  }

  goUI5Page(menu: AppMenu) {
    this.menusService.goUI5Page(menu)
  }
}
