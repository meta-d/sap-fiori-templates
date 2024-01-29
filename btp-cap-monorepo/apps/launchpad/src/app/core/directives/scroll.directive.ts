import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  Renderer2,
  booleanAttribute,
  effect,
  inject,
  input
} from '@angular/core'

/**
 * Loop Scroll Directive
 *
 * ```html
 * <div class="overflow-y-auto" zngScroll auto [duration]="5000"/>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[zngScroll]'
})
export class ZngScrollDirective {
  readonly #elementRef = inject(ElementRef)
  readonly renderer = inject(Renderer2)

  /**
   * Auto scroll
   */
  readonly auto = input<boolean, boolean | string>(false, {
    transform: booleanAttribute
  })
  readonly duration = input<number>()
  readonly delay = input<number>()
  readonly loop = input<boolean, boolean | string>(true, {
    transform: booleanAttribute
  })
  readonly scrollDistance = input<number>()

  @Output()
  readonly toBottom = new EventEmitter<Event>()
  @Output()
  readonly toTop = new EventEmitter<Event>()

  #interval: any = null

  constructor() {
    effect(() => {
      if (this.auto() && this.duration()) {
        clearInterval(this.#interval)
        this.#interval = setInterval(() => {
          const element = this.#elementRef.nativeElement

          let top = element.scrollTop + (this.scrollDistance() || element.clientHeight)
          if (this.isToBottom()) {
            // Reach the bottom, clear when loop is false
            if (!this.loop()) {
              clearInterval(this.#interval)
              return
            }
            // Reach the bottom, reset scroll position to the top
            top = 0
          }
          element.scrollTo({
            top,
            behavior: 'smooth'
          })
        }, this.duration() ?? Number.MAX_SAFE_INTEGER)
      } else if (this.#interval) {
        clearInterval(this.#interval)
      }
    })
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    if (this.isToBottom()) {
      this.toBottom.emit(event)
    } else if (this.isToTop()) {
      this.toTop.emit(event)
    }
  }

  isToTop() {
    return this.#elementRef.nativeElement.scrollTop <= 0
  }

  isToBottom() {
    const element = this.#elementRef.nativeElement
    const scrollHeight = element.scrollHeight
    const scrollTop = element.scrollTop
    const clientHeight = element.clientHeight
    return scrollTop + clientHeight >= scrollHeight
  }
}
