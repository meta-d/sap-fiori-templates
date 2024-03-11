import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout'
import { CommonModule } from '@angular/common'
import { Component, computed, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'zng-responsive',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './responsive.component.html',
  styleUrl: './responsive.component.scss'
})
export class ResponsiveComponent {
  readonly breakpointObserver = inject(BreakpointObserver)

  readonly breakpointResult = toSignal<BreakpointState, BreakpointState>(
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web]),
    {
      initialValue: {
        matches: false,
        breakpoints: {}
      }
    }
  )

  readonly deviceType = computed(() => {
    const result = this.breakpointResult()
    if (result.matches) {
      const devices = []
      for (const name in Breakpoints) {
        if (result.breakpoints[Breakpoints[name as keyof typeof Breakpoints]]) {
          devices.push(name)
        }
      }

      return devices.join(', ')
    }

    return `None`
  })
}
