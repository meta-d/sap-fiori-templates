import { FioriLaunchpadService, ThemeService, ToggleFullscreenDirective } from '@/app/core'
import { fadeAnimation } from '@/app/core/animations'
import { SafePipe } from '@/app/core/pipes'
import { ZngAntdModule } from '@/app/core/shared.module'
import { nonBlank } from '@/app/utils'
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
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { NGXLogger } from 'ngx-logger'
import { EMPTY, distinctUntilChanged, filter, map, startWith } from 'rxjs'

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
  readonly #flpService = inject(FioriLaunchpadService)
  readonly #themeService = inject(ThemeService)
  readonly #route = inject(ActivatedRoute)
  readonly #title = inject(Title)
  readonly #logger = inject(NGXLogger)

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({ alias: 'sap-ui-tech-hint' }) sapUiTechHint = null
  
  @ViewChildren('appiframe') apps!: QueryList<ElementRef>

  /**
   * Get semantic object id from param ':id' or current path
   */
  public semanticObject = toSignal(
    this.#route.paramMap.pipe(
      map((params) => params.get('id') || this.#route.snapshot.url[0]?.path as string),
      distinctUntilChanged(),
    )
  )

  public groupId = toSignal(
    this.#route.parent?.paramMap.pipe(
      map((params) => params.get('group') as string),
      distinctUntilChanged()
    ) ?? EMPTY
  )

  readonly chip = computed(() => {
    const soUrl = this.semanticObject()
    if (soUrl) {
      const group = this.groupId()
      return this.#flpService.getChip(soUrl, group)
    }

    return null
  })

  readonly chipIsGui = computed(() => this.sapUiTechHint === 'GUI' ||
    this.chip()?.navigationSemanticParameters?.['sap-ui-tech-hint'] === 'GUI'
  )

  readonly #semanticTargetUrl = computed(() => {
    if (this.semanticObject()) {
      const fragment = this.#route.snapshot.fragment || this.chip()?.navigationTargetUrl || this.semanticObject()
      const sapUserContext = this.#flpService.getUserContext()
      return fragment
        ? `/sap/bc/ui2/flp${sapUserContext ? '?' + sapUserContext : ''}#${fragment}`
        : null
    }
    return null
  })

  readonly iframeUrls = computed(() => {
    if (this.semanticObject()) {
      if (this.#semanticTargetUrl()) {
        return [this.#semanticTargetUrl()]
      } else {
        return []
      }
    } else {
      return null
    }
  })

  readonly appFullscreen = signal(false)

  readonly #appWindowRef = signal<{
    status: null | 'Opened' | 'Closed';
    ref: Window | null
  }>({
    status: null,
    ref: null
  })

  readonly hasAppWindowRef = computed(() => !!this.#appWindowRef().ref)

  readonly webGuiMode = this.#themeService.webGuiMode

  // Reset window status when semantic object changed
  #soSub = toObservable(this.semanticObject).pipe(filter(nonBlank), takeUntilDestroyed()).subscribe(() => {
    this.#appWindowRef().ref?.close()
    this.#appWindowRef.update((state) => ({
      ...state,
      status: null,
      ref: null
    }))
  })

  constructor() {
    effect(() => {
      const semanticTargetUrl = this.#semanticTargetUrl()
      if (this.chipIsGui() && semanticTargetUrl && !this.#appWindowRef().status) {
        this.newAppWindow(semanticTargetUrl)
      }
    }, { allowSignalWrites: true })

    effect(() => {
      const title = this.chip()?.title ?? this.#title.getTitle()
      this.#title.setTitle(title)
    })
  }

  ngAfterViewInit(): void {
    this.apps?.changes.pipe(startWith(this.apps.toArray())).subscribe((apps: ElementRef[]) => {
      apps.forEach((app) => this.styleFioriApp(app.nativeElement))
    })
  }

  private styleFioriApp(ref: HTMLIFrameElement | Window) {
    ref.onload = () => {
      const newDocument = (<HTMLIFrameElement>ref).contentDocument || (<Window>ref).document
      // Hidden Fiori App shell header
      const style = newDocument.createElement('style')
      style.setAttribute('type', 'text/css')
      style.appendChild(
        newDocument.createTextNode(
          `#shell-hdr.sapUshellShellHead { display: none !important; } #shell-cntnt.sapUshellShellCanvas {top: 10px;}`
        )
      )

      newDocument.head.appendChild(style)
    }
  }

  toggleFullscreen() {
    this.appFullscreen.update((value) => !value)
  }

  newAppWindow(semanticTargetUrl: string) {
    this.#appWindowRef().ref?.close()
    let windowObjectRef: Window | null = null
    switch(this.webGuiMode()) {
      case 'self':
        windowObjectRef = window.open(semanticTargetUrl, '_self')
        break
      case 'popup':
        windowObjectRef = window.open(semanticTargetUrl, semanticTargetUrl, 'popup=yes,toolbar=no,location=no,menubar=no,status=no')
        break
      default:
        windowObjectRef = window.open(semanticTargetUrl, '_blank')
    }
    
    if (windowObjectRef) {
      windowObjectRef.addEventListener('beforeunload', (event) => {
        this.#appWindowRef.update((state) => ({
          status: 'Closed',
          ref: null
        }))
      })

      this.styleFioriApp(windowObjectRef)

      this.#appWindowRef.update(() => ({
        status: 'Opened',
        ref: windowObjectRef
      }))
    }
  }

  gotoAppWindow() {
    if (this.#appWindowRef().ref) {
      this.#appWindowRef().ref?.focus()
    } else if(this.#semanticTargetUrl()) {
      this.newAppWindow(this.#semanticTargetUrl()!)
    }
  }

  closeAppWindow() {
    // Bring window to top view
    this.#appWindowRef().ref?.focus()
    // Close it!
    this.#appWindowRef().ref?.close()
  }

  ngOnDestroy(): void {
    this.closeAppWindow()
  }
}
