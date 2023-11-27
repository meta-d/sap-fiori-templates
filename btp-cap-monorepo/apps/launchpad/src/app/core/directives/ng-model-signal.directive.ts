import {
  Directive,
  effect,
  EffectRef,
  inject,
  Injector,
  OnChanges,
  runInInjectionContext,
  Signal,
  SimpleChanges,
  WritableSignal
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NgModel } from '@angular/forms'
import { EMPTY } from 'rxjs'

@Directive({
  selector: '[ngModel][ngModelSignal]',
  standalone: true,
  inputs: ['ngModelSignal']
})
export class NgModelSignalDirective implements OnChanges {
  #injector = inject(Injector)
  private ngModel = inject(NgModel)
  ngModelSignal?: WritableSignal<any>
  ngModelSignalEffect?: EffectRef
  updateSignal: Signal<string> = toSignal(this.ngModel.valueChanges ?? EMPTY)
  updateEffect?: EffectRef

  ngOnChanges({ ngModelSignal }: SimpleChanges) {
    if (ngModelSignal) {
      this.ngModelSignalEffect?.destroy()
      this.updateEffect?.destroy()

      if (ngModelSignal.currentValue) {
        runInInjectionContext(this.#injector, () => {
          this.ngModelSignalEffect = effect(() => {
            this.ngModel.control.setValue(this.ngModelSignal?.(), {
              emitViewToModelChange: false
            })
          }, { allowSignalWrites: true })

          this.updateEffect = effect(() => {
            if (this.ngModelSignal) {
              this.ngModelSignal.set(this.updateSignal())
            }
          }, { allowSignalWrites: true })
        })
      }
    }
  }
}
