import { ThemeService } from '@/app/core'
import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { Component, effect, inject, signal } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { AnalyticalCardModule } from '@metad/ocap-angular/analytical-card'
import { NgmControlsModule } from '@metad/ocap-angular/controls'
import { DensityDirective, DisplayDensity } from '@metad/ocap-angular/core'
import {
  ChartMeasure,
  ChartSettings,
  DataSettings,
  ISlicer,
  OrderDirection,
  nonNullable,
  putFilter
} from '@metad/ocap-core'
import { ZngS4DSCoreService } from '../services'

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
    NgmControlsModule,
    DensityDirective,
    MatButtonModule,
    ZngAntdModule
  ]
})
export class FlightBookingComponent {
  #themeService = inject(ThemeService)
  DisplayDensity = DisplayDensity
  OrderDirection = OrderDirection

  s4ModelName = ZngS4DSCoreService.S4ModelName
  /**
   * Change to your sqlViewName of cds
   */
  cdsSqlViewName = 'ZYCUBEFLIGHTBOOK'
  cube = `$2C${this.cdsSqlViewName}`
  country = '[2CIFICOUNTRY]'
  city = '[2COFZF39VMMOVTFTGW9GF0Y0TJC]'
  travelAgency = '[2CZDIMETRVAGENCY]'

  linkAnalysis = signal<Record<string, ISlicer[]>>({
    '[2CICALENDARYEAR]': [],
    '[2CZDIMEAIRLINE]': []
  })

  form = new FormGroup({
    country: new FormControl(),
    travelAgency: new FormControl()
  })

  chartSettings = signal<ChartSettings>({})

  yearTotal: DataSettings = {
    dataSource: ZngS4DSCoreService.S4ModelName,
    entitySet: this.cube,
    chartAnnotation: {
      chartType: {
        type: 'Pie',
        variant: 'Doughnut'
      },
      dimensions: [
        {
          dimension: '[2CICALENDARYEAR]',
          hierarchy: '[2CICALENDARYEAR]',
          level: '[2CICALENDARYEAR].[LEVEL01]',
          zeroSuppression: true
        }
      ],
      measures: [
        {
          dimension: 'Measures',
          measure: '2CHSJ3HNIKQB9EKBGBJ3EBUY53Z',
          zeroSuppression: true,
          palette: {
            name: 'RdBu'
          }
        } as ChartMeasure
      ]
    }
  } as DataSettings

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
    const slicers = Object.values(this.form.value).filter(nonNullable)
    this.linkAnalysis.update((state) => {
      return Object.keys(state).reduce((acc, key) => {
        acc[key] = putFilter(state[key], slicers)
        return acc
      }, {} as any)
    })
  }

  onSlicersChanging(dimension: string, event: ISlicer[]) {
    this.linkAnalysis.update((state) => {
      return Object.keys(state).reduce((acc, key) => {
        acc[key] = key !== dimension ? putFilter(state[key], event) : state[key]
        return acc
      }, {} as any)
    })
  }
}
