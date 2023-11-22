import { BreakpointObserver } from '@angular/cdk/layout'
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject
} from '@angular/core'

import { NzSafeAny } from 'ng-zorro-antd/core/types'

/**
 * The component is not displayed When the screen width is less than a certain width.
 */
@Directive({
  selector: '[zngScreenLessHidden]',
  standalone: true
})
export class ScreenLessHiddenDirective {
  private breakpointObserver = inject(BreakpointObserver)
  private templateRef = inject(TemplateRef<NzSafeAny>)
  private viewContainerRef = inject(ViewContainerRef)

  @Input('zngScreenLessHidden')
  set appScreenLessHidden(lessScreen: string | undefined) {
    if (!lessScreen) {
      this.show(true)
      return
    }
    this.breakpointObserver
      .observe([`(max-width: ${lessScreen}px)`])
      .subscribe((result) => {
        if (result.matches) {
          this.show(false)
        } else {
          this.show(true)
        }
      })
  }

  private show(matched: boolean): void {
    matched
      ? this.viewContainerRef.createEmbeddedView(this.templateRef)
      : this.viewContainerRef.clear()
  }
}
