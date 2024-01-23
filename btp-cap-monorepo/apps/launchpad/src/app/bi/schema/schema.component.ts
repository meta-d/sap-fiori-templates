import { ZngAntdModule } from '@/app/core/shared.module'
import { makeCubePrompt, zodToAnnotations } from '@/app/utils'
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
import { ScrollingModule } from '@angular/cdk/scrolling'
import { CommonModule } from '@angular/common'
import { Component, computed, inject, signal } from '@angular/core'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTabsModule } from '@angular/material/tabs'
import { AnalyticalCardModule } from '@metad/ocap-angular/analytical-card'
import { NgmSearchComponent } from '@metad/ocap-angular/common'
import { injectCopilotCommand, injectMakeCopilotActionable } from '@metad/ocap-angular/copilot'
import { DensityDirective, DisplayDensity } from '@metad/ocap-angular/core'
import { EntityCapacity, EntitySchemaType, NgmEntitySchemaComponent } from '@metad/ocap-angular/entity'
import {
  AggregationRole,
  C_MEASURES,
  CalculatedProperty,
  CalculationType,
  ChartDimension,
  ChartMeasure,
  DataSettings,
  ISlicer,
  OrderDirection,
  isEntityType
} from '@metad/ocap-core'
import { TranslateModule } from '@ngx-translate/core'
import { nanoid } from 'ai'
import { NzResizeEvent, NzResizeHandleOption } from 'ng-zorro-antd/resizable'
import { NGXLogger } from 'ngx-logger'
import { filter, map, startWith, switchMap, take, tap } from 'rxjs'
import { z } from 'zod'
import { ZngOcapTranslateService, ZngS4DSCoreService } from '../services'

@Component({
  standalone: true,
  selector: 'zng-ocap-schema',
  templateUrl: 'schema.component.html',
  styleUrl: 'schema.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
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

  // Don't remove: for translate service creation
  readonly #translateService = inject(ZngOcapTranslateService)

  readonly #dsCoreService = inject(ZngS4DSCoreService)
  readonly #logger = inject(NGXLogger)

  dataSourceName = ZngS4DSCoreService.S4ModelName
  /**
   * Change to your sqlViewName of cds
   */
  cdsSqlViewName = ZngS4DSCoreService.S4FlightBookCdsSqlViewName
  // country = '[2CIFICOUNTRY]'
  get cube() {
    return this.#cube()
  }
  set cube(value) {
    this.#cube.set(value)
  }
  readonly #cube = signal<string[]>([`$2C${this.cdsSqlViewName}`])
  readonly cube$ = toObservable(this.#cube)

  readonly showCubesList = signal(true)
  readonly searchControl = new FormControl('')

  calFilter: ISlicer | null = null

  readonly slicers = signal<ISlicer[]>([])

  readonly #dataSource$ = this.#dsCoreService.getDataSource(this.dataSourceName)
  readonly dataSource = toSignal(this.#dataSource$)
  readonly loadingCatalogs = signal(false)
  readonly catalogs = toSignal(
    this.#dataSource$.pipe(
      take(1),
      tap(() => this.loadingCatalogs.set(true)),
      switchMap((dataSource) => dataSource.discoverDBCatalogs()),
      tap(() => this.loadingCatalogs.set(false))
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

  readonly entityType = toSignal(
    this.#dataSource$.pipe(
      switchMap((dataSource) => this.cube$.pipe(switchMap((cube) => dataSource.selectEntityType(cube[0])))),
      filter(isEntityType)
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

  customerCountry = {
    dimension: '[2CIFICOUNTRY]',
    hierarchy: '[2CIFICOUNTRY]',
    level: '[2CIFICOUNTRY].[LEVEL01]'
  }

  dimension = signal<ChartDimension>({
    ...this.customerCountry,
    zeroSuppression: true
  })
  measure = signal<ChartMeasure>({
    dimension: C_MEASURES,
    measure: 'EURBookings',
    order: OrderDirection.DESC,
    formatting: {
      shortNumber: true
    },
    chartOptions: {
      seriesStyle: {
        barWidth: 5
      }
    },
    palette: {
      colors: [
        '#5B8FF9',
        '#5AD8A6',
        '#5D7092',
        '#F6BD16',
        '#E86452',
        '#6DC8EC',
        '#945FB9',
        '#FF9845',
        '#1E9493',
        '#FF99C3'
      ]
    }
  } as ChartMeasure)

  dataSettings = computed<DataSettings>(() => {
    return {
      dataSource: this.dataSourceName,
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

  /**
   *
   */
  #chartCommand = injectCopilotCommand({
    name: 'chart',
    description: 'New Chart',
    examples: ['Total bookings by customer country', ''],
    systemPrompt: () => {
      let prompt = `New a chart by the cube info. 如果没有找到合适的度量可以先使用 MDX formula 创建一个新的 calculated measure`
      const entityType = this.entityType()
      if (entityType) {
        prompt += `The cube is:
\`\`\`
${makeCubePrompt(entityType)}
\`\`\`
`
      }
      return prompt
    },
    actions: [
      injectMakeCopilotActionable({
        name: 'new_chart',
        description: 'New chart',
        argumentAnnotations: [
          {
            name: 'chart',
            type: 'object',
            description: 'The chart config',
            required: true,
            properties: zodToAnnotations(
              z.object({
                dimension: z.object({
                  dimension: z.string().describe('The dimension'),
                  hierarchy: z.string().optional().describe('The hierarchy'),
                  level: z.string().optional().describe('The level')
                }),
                measure: z.object({
                  measure: z.string().describe('The measure'),
                  chartOptions: z
                    .object({
                      seriesStyle: z
                        .object({
                          barWidth: z.number().describe('Bar width')
                        })
                        .optional()
                        .describe('ECharts series options')
                    })
                    .optional()
                    .describe('Chart options for ECharts')
                })
              })
            )
          }
        ],
        implementation: async (chart) => {
          this.#logger.debug('The new chart is', chart)
          // const entityType = this.entityType()
          // if (entityType) {
          //   const dimension = parseDimension(chart.dimension, entityType)
          //   this.dimension.set({
          //     ...dimension,
          //     zeroSuppression: true
          //   })
          // }

          this.dimension.set({
            ...chart.dimension,
            zeroSuppression: true
          })
          this.measure.set({
            dimension: C_MEASURES,
            ...chart.measure,
            order: OrderDirection.DESC
          })
        }
      }),
      injectMakeCopilotActionable({
        name: 'new_calculated_measure',
        description: 'New a calculated measure using MDX formula',
        argumentAnnotations: [
          {
            name: 'name',
            type: 'string',
            description: 'The name of this calculated measure',
            required: true
          },
          {
            name: 'caption',
            type: 'string',
            description: 'The caption of this calculated measure ',
            required: true
          },
          {
            name: 'formula',
            type: 'string',
            description: 'MDX formula for of the calculated measure',
            required: true
          }
        ],
        implementation: async (name: string, caption: string, formula: string) => {
          this.#logger.debug(`Copilot new calculated measure '${name}' '${caption}' with formula '${formula}'`)
          this.#dsCoreService.updateProperty(ZngS4DSCoreService.S4FlightBookCube, {
            name,
            caption,
            formula
          } as CalculatedProperty)
          return {
            id: nanoid(),
            role: 'function',
            content: `The new calculated measure '${name}' '${caption}' with formula '${formula}'`
          }
        }
      }),
      injectMakeCopilotActionable({
        name: 'change_color',
        description: 'Change series color in chart',
        argumentAnnotations: [
          {
            name: 'colors',
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The series color array',
            required: true
          }
        ],
        implementation: async (colors: string[]) => {
          this.measure.update((state) => ({
            ...state,
            palette: {
              colors
            }
          }))
        }
      })
    ]
  })

  #calculatedMeasureCommand = injectCopilotCommand({
    name: 'calc',
    description: 'New Calculated Measure',
    examples: ['客户数量'],
    systemPrompt: () => {
      let prompt = `New calculated measure using MDX formula, ref to the cube info.`
      const entityType = this.entityType()
      if (entityType) {
        prompt += `The cube is:
\`\`\`
${makeCubePrompt(entityType)}
\`\`\`
`
      }
      return prompt
    },
    actions: [
      injectMakeCopilotActionable({
        name: 'new_calculated_measure',
        description: 'New a calculated measure using MDX formula',
        argumentAnnotations: [
          {
            name: 'name',
            type: 'string',
            description: 'The name of this calculated measure',
            required: true
          },
          {
            name: 'caption',
            type: 'string',
            description: 'The caption of this calculated measure ',
            required: true
          },
          {
            name: 'formula',
            type: 'string',
            description: 'MDX formula for of the calculated measure',
            required: true
          }
        ],
        implementation: async (name: string, caption: string, formula: string) => {
          this.#logger.debug(`Copilot new calculated measure '${name}' '${caption}' with formula '${formula}'`)
          this.#dsCoreService.updateProperty(ZngS4DSCoreService.S4FlightBookCube, {
            name,
            caption,
            role: AggregationRole.measure,
            calculationType: CalculationType.Calculated,
            formula
          } as CalculatedProperty)
          return `创建计算度量成功`
        }
      }),
    ]
  })

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

  drop(event: CdkDragDrop<unknown[]>) {
    const property = event.item.data
    this.#logger.debug('The drop property is', property)
    switch (property.type) {
      case EntitySchemaType.Dimension:
        this.dimension.update((state) => ({
          ...state,
          dimension: property.name,
          hierarchy: undefined,
          level: undefined,
          zeroSuppression: true
        }))
        break
      case EntitySchemaType.Hierarchy:
        this.dimension.update((state) => ({
          ...state,
          dimension: property.dimension,
          hierarchy: property.name,
          level: undefined,
          zeroSuppression: true
        }))
        break
      case EntitySchemaType.Level:
        this.dimension.update((state) => ({
          ...state,
          dimension: property.dimension,
          hierarchy: property.hierarchy,
          level: property.name,
          zeroSuppression: true
        }))
        break
      case EntitySchemaType.IMeasure:
        this.measure.update(
          (state) =>
            ({
              ...state,
              dimension: C_MEASURES,
              measure: property.name,
              order: OrderDirection.DESC
            } as ChartMeasure)
        )
        break
      case EntitySchemaType.Member:
        this.slicers.update((state) => [
          ...state,
          {
            dimension: {
              dimension: property.raw.dimension,
              hierarchy: property.raw.hierarchy,
              level: property.raw.level
            },
            members: [
              {
                value: property.raw.memberKey,
                key: property.raw.memberKey,
                caption: property.raw.memberCaption
              }
            ]
          }
        ])
        break
    }
  }

  toggleCubesList() {
    this.showCubesList.update((state) => !state)
  }
}
