import { AsyncPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NavigationEnd, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { filter } from 'rxjs/operators'
import { TranslateModule } from '@ngx-translate/core'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzSafeAny } from 'ng-zorro-antd/core/types'
import { NzContextMenuService, NzDropDownModule, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzMenuModule } from 'ng-zorro-antd/menu'
import { NzTabsModule } from 'ng-zorro-antd/tabs'
import { Menu, MouseHoverShowDirective, SplitNavStoreService, TabModel, TabService, ThemeService } from '../../core'
import { fnStopMouseEvent } from '../../core/utils'

@Component({
  selector: 'zng-menu-tab',
  templateUrl: './menu-tab.component.html',
  styleUrls: ['./menu-tab.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    TranslateModule,
    NzCardModule,
    NzTabsModule,
    NgFor,
    NzDropDownModule,
    NzMenuModule,
    NzButtonModule,
    NgClass,
    NgStyle,
    MouseHoverShowDirective,
    NzIconModule,
    AsyncPipe
  ]
})
export class MenuTabComponent implements OnInit {
  public tabService = inject(TabService)
  readonly destroyRef = inject(DestroyRef)

  tabsSourceData: TabModel[] = []
  tabsSourceData$ = this.tabService.getTabArray$()
  fixedTab = this.themesService.fixedTab
  isNightTheme = computed(() => this.themesService.currentTheme() === 'dark')
  leftMenuArray$: Observable<Menu[]> = this.splitNavStoreService.getSplitLeftNavArrayStore()
  isOverMode = this.themesService.isOverMode
  isCollapsed = this.themesService.isCollapsed
  menuMode = this.themesService.menuMode
  hasNavArea = computed(() => this.themesService.personalization().hasNavArea)
  hasTopArea = computed(() => this.themesService.personalization().hasTopArea)
  splitNav = computed(() => this.themesService.personalization().splitNav)

  constructor(
    private nzContextMenuService: NzContextMenuService,
    private splitNavStoreService: SplitNavStoreService,
    private themesService: ThemeService,
    public router: Router,
    public cdr: ChangeDetectorRef
  ) {
    this.router.events
      .pipe(filter((event: NzSafeAny) => event instanceof NavigationEnd))
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.cdr.markForCheck()
      })
  }

  get currentIndex(): number {
    return this.tabService.getCurrentTabIndex()
  }

  // 点击tab跳转到对应的path
  goPage(tab: TabModel): void {
    this.router.navigateByUrl(tab.path)
  }

  // 右键点击关闭右侧tab
  closeRithTab(tab: TabModel, e: MouseEvent, index: number): void {
    fnStopMouseEvent(e)
    this.tabService.delRightTab(tab.path, index)
  }

  // 右键点击关闭左侧tab
  closeLeftTab(tab: TabModel, e: MouseEvent, index: number): void {
    if (index === 0) {
      return
    }
    fnStopMouseEvent(e)
    this.tabService.delLeftTab(tab.path, index)
  }

  // 关闭其他tab
  closeOtherTab(tab: TabModel, e: MouseEvent, index: number): void {
    fnStopMouseEvent(e)
    this.tabService.delOtherTab(tab.path, index)
  }

  // 右键关闭当前Tab
  closeTab(tab: TabModel, e: MouseEvent, index: number): void {
    fnStopMouseEvent(e)
    this.closeCurrentTab(tab, index)
  }

  // 点击tab上的关闭icon
  clickCloseIcon(indexObj: { index: number }): void {
    this.closeCurrentTab(this.tabsSourceData[indexObj.index], indexObj.index)
  }

  // 关闭当前Tab
  closeCurrentTab(tab: TabModel, index: number): void {
    if (this.tabsSourceData.length === 1) {
      return
    }
    this.tabService.delTab(tab, index)
    // ngZoneEventCoalescing，ngZoneRunCoalescing例子,请查看main.ts
    this.cdr.detectChanges()
  }

  refresh(): void {
    this.tabService.refresh()
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu)
  }

  closeMenu(): void {
    this.nzContextMenuService.close()
  }

  ngOnInit(): void {
    this.tabsSourceData$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      this.tabsSourceData = res
    })
  }
}
