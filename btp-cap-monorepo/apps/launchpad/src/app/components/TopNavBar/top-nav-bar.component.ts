import { AppMenu, MenusService, ResizeObserverDirective, ThemeService } from '@/app/core'
import { CommonModule } from '@angular/common'
import { Component, ElementRef, Input, ViewChild, computed, effect, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { NzMenuModule, NzMenuThemeType } from 'ng-zorro-antd/menu'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzDropDownModule } from 'ng-zorro-antd/dropdown'
import { GlobalSettingsComponent } from '../GlobalSettings/global-settings.component'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzSpinModule } from 'ng-zorro-antd/spin'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    NzDropDownModule,
    NzMenuModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzToolTipModule,
    GlobalSettingsComponent,
    ResizeObserverDirective
  ],
  selector: 'zng-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.scss']
})
export class TopNavBarComponent {
  public message = inject(NzMessageService)
  private menusService = inject(MenusService)
  private themeService = inject(ThemeService)
  private hostElement = inject(ElementRef)

  @ViewChild('menusContainer', { static: false }) menusContainer: ElementRef | null = null
  @ViewChild('mEl', { static: false }) menusElement: ElementRef | null = null

  @Input() nzTheme: NzMenuThemeType = 'dark'

  get currentTheme() {
    return this.themeService.currentTheme
  }

  readonly isMix = computed(() => this.themeService.menuMode() === 'mix')
  readonly hasMoreMenus = signal<boolean>(false)
  readonly menus = this.menusService.menus
  readonly flpLoading = this.menusService.flpLoading

  constructor() {
    effect(() => {
      console.log(this.menus())
    })
  }

  trackByIndex(index: number) {
    return index
  }
  trackByPath(index: number, item: AppMenu) {
    return item.path
  }

  loadMenus(menu: AppMenu) {
    this.menusService.loadMenus(menu)
  }

  showMessage(): void {
    this.message.info('切换成功')
  }

  onResize(event: any) {
    if (this.menusElement && this.hostElement) {
      const childWidth = this.menusElement.nativeElement.offsetWidth
      const hostWidth = this.hostElement.nativeElement.offsetWidth
      this.hasMoreMenus.set(childWidth > hostWidth)
    }
  }

  scrollLeft() {
    if (this.menusContainer) {
      const width = this.menusContainer.nativeElement.offsetWidth
      this.menusContainer.nativeElement.scrollLeft -= width - 100
    }
  }

  scrollRight() {
    if (this.menusContainer) {
      const width = this.menusContainer.nativeElement.offsetWidth
      this.menusContainer.nativeElement.scrollLeft += width - 100
    }
  }

  get alignLeft() {
    return this.menusContainer?.nativeElement.scrollLeft === 0
  }
  get alignRight() {
    return (
      this.menusContainer?.nativeElement.scrollWidth - this.menusContainer?.nativeElement.scrollLeft <=
      this.hostElement.nativeElement.offsetWidth
    )
  }

  goUI5Page(menu: AppMenu) {
    this.menusService.goUI5Page(menu)
  }
}
