import { SafePipe } from '@/app/core/pipes'
import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { Subject, distinctUntilChanged, map, switchMap } from 'rxjs'

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ZngAntdModule, SafePipe],
  selector: 'zng-ui5',
  templateUrl: './ui5.component.html',
  styleUrls: ['./ui5.component.scss']
})
export class Ui5Component {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private httpClient = inject(HttpClient)

  // private semanticObject = new Subject()

  // readonly semanticObjecttargetMapping = toSignal(this.semanticObject.pipe(
  //   switchMap((obj: any) => this.httpClient.get<{targetMappings: Record<string, any>}>('/sap/bc/ui2/start_up', {
  //       params: {
  //           so: obj.navigation_semantic_object,
  //           action: obj.navigation_semantic_action,
  //           systemAliasesFormat: 'object',
  //           formFactor: 'desktop',
  //           shellType: 'FLP',
  //           depth: 0
  //       }
  //   }).pipe(
  //       map((result) => {
  //           const key = Object.keys(result.targetMappings).find((key) => key.startsWith(obj.navigation_semantic_object))
  //           return key && result.targetMappings[key]
  //       })
  //   )),
  // ))

  readonly soTargetMapping = toSignal(this.route.paramMap.pipe(
    map((params) => params.get('id') as string),
    distinctUntilChanged(),
    switchMap((semanticObject) => {
      return this.httpClient.get<{targetMappings: Record<string, any>}>('/sap/bc/ui2/start_up', {
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
    )
    })
  ))


  constructor() {
    // this.semanticObject.next(this.router.getCurrentNavigation()?.extras.state)
  }
}
