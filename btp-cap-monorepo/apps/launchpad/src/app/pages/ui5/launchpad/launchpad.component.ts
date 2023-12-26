import { FioriLaunchpadService } from '@/app/core'
import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { Component, computed, effect, inject } from '@angular/core'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { NGXLogger } from 'ngx-logger'
import { distinctUntilChanged, map, of, switchMap } from 'rxjs'

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, ZngAntdModule],
  selector: 'zng-ui5-launchpad',
  templateUrl: 'launchpad.component.html',
  styleUrl: 'launchpad.component.scss',
})
export class Ui5LaunchpadComponent {
  private flpService = inject(FioriLaunchpadService)
  private route = inject(ActivatedRoute)
  private title = inject(Title)
  private logger = inject(NGXLogger)

  public groupId = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('group') as string),
      distinctUntilChanged()
    )
  )

  readonly appGroup = computed(() => {
    const groupId = this.groupId()
    return groupId ? this.flpService.getGroup(groupId) : null
  })

  readonly chips = toSignal(
    toObservable(this.groupId).pipe(switchMap((id) => (id ? this.flpService.selectGroupChips(id) : of([]))))
  )

  constructor() {
    effect(() => {
      this.title.setTitle(this.appGroup()?.title ?? this.title.getTitle())
    })
  }
}
