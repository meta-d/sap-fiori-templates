import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ZngAntdModule } from './core/shared.module'
import { LayoutDefaultComponent } from './components/Layout'
import { SAPUserContextCookieName, SAPUserContextLanguage, ThemeService, mapBrowserLanguage } from './core'
import { TranslateService } from '@ngx-translate/core'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ZngAntdModule, LayoutDefaultComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
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
