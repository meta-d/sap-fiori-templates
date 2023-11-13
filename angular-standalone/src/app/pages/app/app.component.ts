import { FioriLaunchpadService, ToggleFullscreenDirective } from '@/app/core'
import { fadeAnimation } from '@/app/core/animations'
import { SafePipe } from '@/app/core/pipes'
import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  computed,
  effect,
  inject,
  signal
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { NGXLogger } from 'ngx-logger'
import { distinctUntilChanged, map, startWith } from 'rxjs'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    ZngAntdModule,
    SafePipe,
    ToggleFullscreenDirective
  ],
  selector: 'zng-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: [
    fadeAnimation
  ]
})
export class AppComponent implements AfterViewInit {
  private flpService = inject(FioriLaunchpadService)
  private route = inject(ActivatedRoute)
  private title = inject(Title)
  private logger = inject(NGXLogger)

  @ViewChildren('appiframe') apps!: QueryList<ElementRef>

  public semanticObject = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('id') as string),
      distinctUntilChanged()
    )
  )

  readonly chip = computed(() => {
    const soUrl = this.semanticObject()
    if (soUrl) {
      return this.flpService.getChip(soUrl)
    }

    return null
  })

  public semanticTargetUrl = computed(() => {
    if (this.semanticObject()) {
      const fragment = this.route.snapshot.fragment || this.chip()?.navigationTargetUrl
      const sapUserContext = this.flpService.getUserContext()
      return fragment
        ? [`/sap/bc/ui2/flp${sapUserContext ? '?' + sapUserContext : ''}#${fragment}`]
        : []
    }
    return null
  })

  readonly appFullscreen = signal(false)

  constructor() {
    effect(() => {
      if (this.semanticObject()) {
        this.logger.debug(`open ui5 app for id: ${this.semanticObject()}`)
      }
      if (this.chip()) {
        this.logger.debug(`find chip for ui5 app:`, this.chip())
      }
      if (this.semanticTargetUrl()) {
        this.logger.debug(`open ui5 app: ${this.semanticTargetUrl()}`)
      }
    })

    effect(() => {
      this.title.setTitle(this.chip()?.title ?? this.title.getTitle())
    })
  }

  ngAfterViewInit(): void {
    this.apps?.changes.pipe(startWith(this.apps.toArray())).subscribe((apps: ElementRef[]) => {
      apps.forEach((app) => this.styleFioriApp(app.nativeElement))
    })
  }

  private styleFioriApp(iframe: HTMLIFrameElement) {
    iframe.onload = () => {
      // Hidden Fiori App shell header
      const style = document.createElement('style')
      style.setAttribute('type', 'text/css')
      style.appendChild(
        document.createTextNode(
          `#shell-hdr.sapUshellShellHead { display: none !important; } #shell-cntnt.sapUshellShellCanvas {top: 10px;}`
        )
      )

      if (iframe.contentDocument) {
        iframe.contentDocument.head.appendChild(style)
      }
    }
  }

  toggleFullscreen() {
    this.appFullscreen.update((value) => !value)
  }
}
