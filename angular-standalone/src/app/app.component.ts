import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'

import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { LayoutDefaultComponent } from './components/'
import { ThemeService } from './core'

@Component({
  standalone: true,
  selector: 'zng-standalone-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule, LayoutDefaultComponent]
})
export class AppComponent {
  private themeService = inject(ThemeService)

  constructor() {
    this.themeService.loadTheme(true).then()
  }
}
