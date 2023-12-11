import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AnalyticalCardModule } from '@metad/ocap-angular/analytical-card'
import { ControlsModule } from '@metad/ocap-angular/controls'
import { DensityDirective } from '@metad/ocap-angular/core'

@Component({
  standalone: true,
  selector: 'zng-dashboard',
  templateUrl: 'dashboard.component.html',
  styles: [
    `
      :host {
        height: 100vh;
      }
    `
  ],
  imports: [CommonModule, FormsModule, AnalyticalCardModule, ControlsModule, DensityDirective]
})
export class DashboardComponent {}
