import { Menu, SplitNavStoreService, ThemeService } from '@/app/core'
import { NgTemplateOutlet } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  Renderer2,
  TemplateRef,
  inject
} from '@angular/core'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzSafeAny } from 'ng-zorro-antd/core/types'

@Component({
  selector: 'zng-footer-submit',
  templateUrl: './footer-submit.component.html',
  styleUrls: ['./footer-submit.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzCardModule, NgTemplateOutlet]
})
export class FooterSubmitComponent {
  @Input() leftTpl: TemplateRef<NzSafeAny> | undefined
  themesOptions$ = this.themesService.getThemesMode()
  readonly isNightTheme = this.themesService.isNightTheme
  readonly isCollapsed = this.themesService.isCollapsed
  readonly isOverMode = this.themesService.isOverMode
  leftMenuArray$ = this.splitNavStoreService.getSplitLeftNavArrayStore()
  hasLeftNav = false
  isTopMode = false
  leftMenuArray: Menu[] = []
  isMixMode = false
  destroyRef = inject(DestroyRef)

  constructor(
    private splitNavStoreService: SplitNavStoreService,
    private themesService: ThemeService,
    private rd2: Renderer2,
    private el: ElementRef
  ) {}

  setWidth(width: number): void {
    const dom = this.el.nativeElement.querySelector('.ant-pro-footer-bar')
    this.rd2.setStyle(dom, 'width', `calc(100% - ${width}px)`)
  }
}
