import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'

import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { CookieService } from 'ngx-cookie-service'
import { LayoutDefaultComponent } from './components/'
import { SAPUserContextCookieName, SAPUserContextLanguage, ThemeService, mapBrowserLanguage } from './core'

@Component({
  standalone: true,
  selector: 'zng-standalone-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule, LayoutDefaultComponent]
})
export class AppComponent {
  private themeService = inject(ThemeService)
  private translate = inject(TranslateService)
  private cookieService = inject(CookieService)

  constructor() {
    this.themeService.loadTheme(true).then()
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en')

    // Use the language from the user context cookie if it exists, otherwise use the browser language
    const userContext = this.cookieService.get(SAPUserContextCookieName)
    this.translate.use(
      mapBrowserLanguage(
        new URL(`http://localhost?${userContext}`).searchParams.get(SAPUserContextLanguage) || navigator.language
      )
    )
  }
}
