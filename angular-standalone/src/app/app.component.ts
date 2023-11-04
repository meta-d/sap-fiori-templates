import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'

import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { LayoutDefaultComponent } from './components/'
import { ThemeService, mapBrowserLanguage } from './core'


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

  constructor() {
    this.themeService.loadTheme(true).then()
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en')

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(mapBrowserLanguage(navigator.language))
  }
}
