import { ThemeService } from '@/app/core'
import { CommonModule } from '@angular/common'
import { Component, effect, inject, signal } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { AnalyticalCardModule } from '@metad/ocap-angular/analytical-card'
import { ControlsModule } from '@metad/ocap-angular/controls'
import { DensityDirective, DisplayDensity } from '@metad/ocap-angular/core'
import { ChartSettings, ISlicer, OrderDirection, nonNullable } from '@metad/ocap-core'

@Component({
  standalone: true,
  selector: 'zng-flight-booking',
  templateUrl: 'flight-booking.component.html',
  styleUrl: 'flight-booking.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AnalyticalCardModule,
    ControlsModule,
    DensityDirective,
    MatButtonModule
  ]
})
export class FlightBookingComponent {
  #themeService = inject(ThemeService)
  DisplayDensity = DisplayDensity
  OrderDirection = OrderDirection

  country = '[2CIFICOUNTRY]'
  city = '[2COFZF39VMMOVTFTGW9GF0Y0TJC]'
  travelAgency = '[2CZDIMETRVAGENCY]'
  cube = '$2CZYCUBEFLIGHTBOOK'

  slicers = signal<ISlicer[]>([])

  form = new FormGroup({
    country: new FormControl(),
    travelAgency: new FormControl()
  })

  chartSettings = signal<ChartSettings>({})

  constructor() {
    effect(
      () => {
        this.chartSettings.update((state) => ({
          ...state,
          theme: this.#themeService.currentTheme()
        }))
      },
      { allowSignalWrites: true }
    )
  }

  onGo() {
    this.slicers.set(Object.values(this.form.value).filter(nonNullable))
  }
}
