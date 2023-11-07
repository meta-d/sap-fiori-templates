import { Injectable, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { Title } from '@angular/platform-browser'
import { RouterStateSnapshot, TitleStrategy } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

@Injectable()
export class ZngPageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title)
  private readonly translate = inject(TranslateService)

  public readonly pagesTranslate = toSignal(this.translate.stream('ZNG.Pages', {Default: {}}))

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState) || 'Home'
    const tTitle = this.translate.instant('ZNG.Pages.' + title, { Default: title })
    if (tTitle) {
      this.title.setTitle(tTitle)
    }
  }

}