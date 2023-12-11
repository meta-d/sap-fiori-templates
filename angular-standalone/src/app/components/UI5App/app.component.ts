import { FioriLaunchpadService, ToggleFullscreenDirective } from '@/app/core'
import { fadeAnimation } from '@/app/core/animations'
import { SafePipe } from '@/app/core/pipes'
import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
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
import { EMPTY, distinctUntilChanged, map, startWith } from 'rxjs'

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
  selector: 'zng-ui5-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: [
    fadeAnimation
  ]
})
export class UI5AppComponent implements AfterViewInit, OnDestroy {
  private flpService = inject(FioriLaunchpadService)
  private route = inject(ActivatedRoute)
  private title = inject(Title)
  private logger = inject(NGXLogger)

  @Input('sap-ui-tech-hint') sapUiTechHint = null
  
  @ViewChildren('appiframe') apps!: QueryList<ElementRef>

  /**
   * Get semantic object id from param ':id' or current path
   */
  public semanticObject = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('id') || this.route.snapshot.url[0]?.path as string),
      distinctUntilChanged(),
    )
  )

  public groupId = toSignal(
    this.route.parent?.paramMap.pipe(
      map((params) => params.get('group') as string),
      distinctUntilChanged()
    ) ?? EMPTY
  )

  readonly chip = computed(() => {
    const soUrl = this.semanticObject()
    if (soUrl) {
      const group = this.groupId()
      return this.flpService.getChip(soUrl, group)
    }

    return null
  })

  readonly chipIsGui = computed(() => this.sapUiTechHint === 'GUI' ||
    this.chip()?.navigationSemanticParameters?.['sap-ui-tech-hint'] === 'GUI'
  )

  readonly #semanticTargetUrl = computed(() => {
    if (this.semanticObject()) {
      const fragment = this.route.snapshot.fragment || this.chip()?.navigationTargetUrl || this.semanticObject()
      const sapUserContext = this.flpService.getUserContext()
      return fragment
        ? `/sap/bc/ui2/flp${sapUserContext ? '?' + sapUserContext : ''}#${fragment}`
        : null
    }
    return null
  })

  iframeUrls = computed(() => {
    if (this.semanticObject()) {
      if (!this.chipIsGui() && this.#semanticTargetUrl()) {
        return [this.#semanticTargetUrl()]
      } else {
        return []
      }
    } else {
      return null
    }
  })

  readonly appFullscreen = signal(false)

  constructor() {
    effect(() => {
      const semanticTargetUrl = this.#semanticTargetUrl()
      if (this.chipIsGui() && semanticTargetUrl) {
        window.open(semanticTargetUrl, '_self')
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

  ngOnDestroy() {
    //
  }
}
