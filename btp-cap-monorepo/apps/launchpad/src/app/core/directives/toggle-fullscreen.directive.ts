import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  inject
} from '@angular/core'

import screenfull from 'screenfull'

@Directive({
  selector: '[zngToggleFullscreen]',
  exportAs: 'zngToggleFullscreen',
  standalone: true
})
export class ToggleFullscreenDirective implements OnInit {
  private readonly _cdr = inject(ChangeDetectorRef)

  @Input() zngFullscreenElement: HTMLElement | undefined

  isFullscreenFlag = true

  ngOnInit(): void {
    screenfull.onchange(() => {
      setTimeout(() => {
        this.isFullscreenFlag = !this.isFullscreenFlag
        this._cdr.markForCheck()
      }, 10)
    })
  }

  @HostListener('click') onClick(): void {
    if (screenfull.isEnabled) {
      if (this.zngFullscreenElement) {
        screenfull.toggle(this.zngFullscreenElement)
      } else {
        screenfull.toggle()
      }
    }
  }
}
