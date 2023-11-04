import { SafePipe } from '@/app/core/pipes'
import { FioriLaunchpadService, ToggleFullscreenDirective } from '@/app/core/'
import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { Component, computed, effect, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { distinctUntilChanged, map, of, switchMap } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'
import { NGXLogger } from 'ngx-logger'
import { TranslateModule } from '@ngx-translate/core'


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, ZngAntdModule, SafePipe, ToggleFullscreenDirective],
  selector: 'zng-ui5',
  templateUrl: './ui5.component.html',
  styleUrls: ['./ui5.component.scss']
})
export class Ui5Component {
  private flpService = inject(FioriLaunchpadService)
  private route = inject(ActivatedRoute)
  private cookieService = inject(CookieService)
  private logger = inject(NGXLogger)

  public semanticObject = toSignal(this.route.paramMap.pipe(
    map((params) => params.get('id') as string),
    distinctUntilChanged()
  ))

  public semanticTargetUrl = computed(() => {
    if (this.semanticObject()) {
      const fragment = this.route.snapshot.fragment
      const sapUserContext = this.cookieService.get('sap-usercontext')
      return fragment ? `/sap/bc/ui2/flp${sapUserContext ? '?' + sapUserContext : ''}#${fragment}` : null
    }
    return null
  })

  readonly chips = toSignal(this.route.paramMap.pipe(
    map((params) => params.get('group') as string),
    distinctUntilChanged(),
    switchMap((id) => id ? this.flpService.selectGroupChips(id) : of([])),
  ))

  constructor() {
    effect(() => {
      if (this.semanticTargetUrl()) {
        this.logger.debug(`open ui5 app: ${this.semanticTargetUrl()}`)
      }
    })
  }
 
}
