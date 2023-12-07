import { ZngAntdModule } from '@/app/core/shared.module'
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { Component, computed, effect, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatListModule } from '@angular/material/list'
import { AnalyticalCardModule } from '@metad/ocap-angular/analytical-card'
import { NgmSearchComponent } from '@metad/ocap-angular/common'
import { DensityDirective, DisplayDensity, NgmDSCoreService } from '@metad/ocap-angular/core'
import { EntityCapacity, NgmEntitySchemaComponent } from '@metad/ocap-angular/entity'
import {
  AggregationRole,
  C_MEASURES,
  ChartDimension,
  ChartMeasure,
  DataSettings,
  ISlicer,
  OrderDirection
} from '@metad/ocap-core'
import { NzResizeEvent, NzResizeHandleOption } from 'ng-zorro-antd/resizable'
import { map, startWith, switchMap } from 'rxjs'
import { ZngS4DSCoreService } from '../s4-ds-core.service'
import { ZngOcapTranslateService } from '../translate.service'

@Component({
  standalone: true,
  selector: 'zng-ocap-schema',
  templateUrl: 'schema.component.html',
  styleUrl: 'schema.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ZngAntdModule,
    DragDropModule,
    MatListModule,
    NgmEntitySchemaComponent,
    DensityDirective,
    NgmSearchComponent,
    AnalyticalCardModule
  ]
})
export class ZngOcapSchemaComponent {
  DisplayDensity = DisplayDensity
  OrderDirection = OrderDirection
  EntityCapacity = EntityCapacity

  readonly #translateService = inject(ZngOcapTranslateService)

  readonly #dsCoreService = inject(NgmDSCoreService)

  country = '[2CIFICOUNTRY]'
  get cube() {
    return this.#cube()
  }
  set cube(value) {
    this.#cube.set(value)
  }
  readonly #cube = signal<string[]>(['$2CZYCUBEFLIGHTBOOK'])
  readonly searchControl = new FormControl('')

  calFilter: ISlicer | null = null

  slicers = signal<ISlicer[]>([])

  readonly #dataSource$ = this.#dsCoreService.getDataSource(ZngS4DSCoreService.S4ModelName)
  readonly cubes = toSignal(
    this.#dataSource$.pipe(
      switchMap((dataSource) => dataSource.discoverMDCubes()),
      switchMap((cubes) =>
        this.searchControl.valueChanges.pipe(
          startWith(''),
          map((text) => text?.toLowerCase()),
          map((text) => (text ? cubes.filter((cube) => cube.caption?.toLowerCase().includes(text)) : cubes))
        )
      )
    )
  )

  col = 8
  id = -1
  directions: NzResizeHandleOption[] = [
    {
      direction: 'right',
      cursorType: 'grid'
    }
  ]

  dimension = signal<ChartDimension>({})
  measure = signal<ChartMeasure>({} as ChartMeasure)

  dataSettings = computed<DataSettings>(() => {
    return {
      dataSource: 'S4CDS',
      entitySet: this.#cube()[0],
      chartAnnotation: {
        chartType: {
          type: 'Bar'
        },
        dimensions: [this.dimension()],
        measures: [this.measure()]
      }
    } as DataSettings
  })

  constructor() {
    effect(() => console.log(this.dataSettings()))
  }

  onResize({ col }: NzResizeEvent): void {
    cancelAnimationFrame(this.id)
    this.id = requestAnimationFrame(() => {
      this.col = col!
    })
  }

  drop(event: CdkDragDrop<any[]>) {
    const property = event.item.data
    console.log(property)
    switch (property.role) {
      case AggregationRole.dimension:
        this.dimension.update((state) => ({
          ...state,
          dimension: property.name,
          hierarchy: undefined,
          level: undefined
        }))
        break
      case AggregationRole.hierarchy:
        this.dimension.update((state) => ({
          ...state,
          dimension: property.dimension,
          hierarchy: property.name,
          level: undefined
        }))
        break
      case AggregationRole.level:
        this.dimension.update((state) => ({
          ...state,
          dimension: property.dimension,
          hierarchy: property.hierarchy,
          level: property.name
        }))
        break
      case AggregationRole.measure:
        this.measure.update((state) => ({
          ...state,
          dimension: C_MEASURES,
          measure: property.name
        }))
        break
    }
  }
}
