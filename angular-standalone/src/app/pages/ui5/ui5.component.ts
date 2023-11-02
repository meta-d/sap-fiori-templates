import { SafePipe } from '@/app/core/pipes'
import { FioriLaunchpadService } from '@/app/core/'
import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { Subject, distinctUntilChanged, map, of, switchMap } from 'rxjs'

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ZngAntdModule, SafePipe],
  selector: 'zng-ui5',
  templateUrl: './ui5.component.html',
  styleUrls: ['./ui5.component.scss']
})
export class Ui5Component {
  private flpService = inject(FioriLaunchpadService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private httpClient = inject(HttpClient)

  readonly soTargetMapping = toSignal(this.route.paramMap.pipe(
    map((params) => params.get('id') as string),
    distinctUntilChanged(),
    switchMap((semanticObject) => {
      return semanticObject ? this.httpClient.get<{ targetMappings: Record<string, any> }>('/sap/bc/ui2/start_up', {
        params: {
          so: semanticObject,
          action: this.route.snapshot.queryParamMap.get('action') as string,
          systemAliasesFormat: 'object',
          formFactor: 'desktop',
          shellType: 'FLP',
          depth: 0
        }
      }).pipe(
        map((result) => {
          const key = Object.keys(result.targetMappings).find((key) => key.startsWith(semanticObject))
          return key && result.targetMappings[key]
        })
      ) : of(null)
    })
  ))

  readonly chips = toSignal(this.route.paramMap.pipe(
    map((params) => params.get('group') as string),
    distinctUntilChanged(),
    switchMap((id) => id ? this.flpService.selectGroupChips(id) : of([])),
  ))
 
}
