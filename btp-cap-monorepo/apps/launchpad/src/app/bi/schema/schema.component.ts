import { ZngAntdModule } from '@/app/core/shared.module'
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { Component, computed, effect, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatListModule } from '@angular/material/list'
import { AnalyticalCardModule } from '@metad/ocap-angular/analytical-card'
import { NgmSearchComponent } from '@metad/ocap-angular/common'
import { DensityDirective, DisplayDensity } from '@metad/ocap-angular/core'
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
import { map, startWith, switchMap, take, tap } from 'rxjs'
import { ZngS4DSCoreService } from '../s4-ds-core.service'
import { ZngOcapTranslateService } from '../translate.service'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import {MatTabsModule} from '@angular/material/tabs'
import {ScrollingModule} from '@angular/cdk/scrolling'
import { MatIconModule } from '@angular/material/icon'


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
    MatMenuModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatIconModule,
    ScrollingModule,
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

  readonly #dsCoreService = inject(ZngS4DSCoreService)

  country = '[2CIFICOUNTRY]'
  get cube() {
    return this.#cube()
  }
  set cube(value) {
    this.#cube.set(value)
  }
  readonly #cube = signal<string[]>(['$2CZYCUBEFLIGHTBOOK'])
  readonly showCubesList = signal(false)
  readonly searchControl = new FormControl('')

  calFilter: ISlicer | null = null

  slicers = signal<ISlicer[]>([])

  readonly #dataSource$ = this.#dsCoreService.getDataSource(ZngS4DSCoreService.S4ModelName)
  readonly dataSource = toSignal(this.#dataSource$)
  readonly loadingCatalogs = signal(false)
  readonly catalogs = toSignal(
    this.#dataSource$.pipe(
      take(1),
      tap(() => this.loadingCatalogs.set(true)),
      switchMap((dataSource) => dataSource.discoverDBCatalogs()),
      tap(() => this.loadingCatalogs.set(false)),
    )
  )
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

  readonly catalog = signal<string>(ZngS4DSCoreService.S4InfoCube)

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

  selectCatalog(value: string) {
    this.catalog.set(value)
    this.#dsCoreService.updateCatalog(value)
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

  toggleCubesList() {
    this.showCubesList.update((state) => !state)
  }
}
