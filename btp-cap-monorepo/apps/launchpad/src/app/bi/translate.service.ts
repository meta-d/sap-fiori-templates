import { Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { TranslateService } from '@ngx-translate/core'
import { ThemeService } from '../core'

@Injectable()
export class ZngOcapTranslateService {
  readonly #translateService = inject(TranslateService)
  readonly #themeService = inject(ThemeService)

  readonly #translateSub = this.#themeService
    .onLangChange()
    .pipe(takeUntilDestroyed())
    .subscribe((lang) => {
      this.#translateService.use(lang)
    })
}
