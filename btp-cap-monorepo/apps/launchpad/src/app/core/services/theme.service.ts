import { Injectable, computed, effect, inject, signal } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { NzConfigService } from 'ng-zorro-antd/core/config'
import { NzMessageService } from 'ng-zorro-antd/message'
import { map } from 'rxjs/operators'
import { APP_STORE_TOKEN, IAppStore, PersonalizationType } from '../../stores'
import { ThemeType } from '../types'

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly #appStore = inject<IAppStore>(APP_STORE_TOKEN)
  readonly #nzConfigService = inject(NzConfigService)
  readonly #translate = inject(TranslateService)
  readonly #message = inject(NzMessageService)

  readonly personalization = this.#appStore.personalization

  readonly currentTheme = computed(() => this.personalization().theme)
  readonly menuTheme = computed(() => this.personalization().menuTheme)
  readonly menuMode = computed(() => this.personalization().menuMode)
  readonly fixedLayoutSider = computed(() => this.personalization().fixedLayoutSider)
  readonly fixedLayoutHeader = computed(() => this.personalization().fixedLayoutHeader)
  readonly primaryColor = computed(() => this.personalization().primaryColor)
  readonly isShowTab = computed(() => this.personalization().isShowTab)
  readonly fixedTab = computed(() => this.personalization().fixedLayoutHeader && this.personalization().fixedTab)
  readonly isOverMode = computed(() => this.personalization().isOverMode)
  readonly isNightTheme = computed(() => this.personalization().theme === ThemeType.dark)
  readonly webGuiMode = computed(() => this.personalization().webGuiMode)

  readonly isCollapsed = signal(false)

  // Translator
  get currentLang() {
    return this.#translate.currentLang
  }

  constructor() {
    effect(() => {
      if (this.currentTheme()) {
        this.loadTheme(false)
      }
    })

    effect(() => {
      if (this.primaryColor()) {
        this.#nzConfigService.set('theme', { primaryColor: this.primaryColor() })
      }
    })
  }

  private reverseTheme(theme: ThemeType | undefined): ThemeType {
    return theme === ThemeType.dark ? ThemeType.default : ThemeType.dark
  }

  private removeUnusedTheme(theme: ThemeType): void {
    document.documentElement.classList.remove(theme)
    const removedThemeStyle = document.getElementById(theme)
    if (removedThemeStyle) {
      document.head.removeChild(removedThemeStyle)
    }
  }

  private async loadCss(href: string, id: string): Promise<Event> {
    return new Promise((resolve, reject) => {
      const style = document.createElement('link')
      style.rel = 'stylesheet'
      style.href = href
      style.id = id
      style.onload = resolve
      style.onerror = reject
      document.head.append(style)
    })
  }

  async loadTheme(firstLoad = true): Promise<Event[]> {
    const theme = this.currentTheme() as string
    if (firstLoad) {
      document.documentElement.classList.add(theme)
    }

    return Promise.all([
      this.loadCss(`${theme}.css`, theme)
      // this.loadCss(`mat-${theme}.css`, theme)
    ]).then((e) => {
      if (!firstLoad) {
        document.documentElement.classList.add(theme)
      }
      this.removeUnusedTheme(this.reverseTheme(this.currentTheme()))
      return e
    })
  }

  setTheme(theme?: ThemeType) {
    this.#appStore.updatePersonalization({
      theme: theme ?? this.reverseTheme(this.currentTheme())
    })
  }

  setPrimaryColor(color?: string) {
    this.#appStore.updatePersonalization({
      primaryColor: color
    })
  }

  updatePersonalization(value: Partial<PersonalizationType>) {
    this.#appStore.updatePersonalization(value)
  }

  getThemesMode() {
    return toObservable(this.personalization)
  }

  useLanguage(lang: string): void {
    this.#translate.use(lang).subscribe()
    this.#message.info(
      this.#translate.instant('ZNG.GlobalHeader.LanguageChanged', {
        Default: 'Language changed!'
      })
    )
  }

  onLangChange() {
    return this.#translate.onLangChange.pipe(map((event: LangChangeEvent) => event.lang))
  }
}
