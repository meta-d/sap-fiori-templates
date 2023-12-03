import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { AnalyticalCardModule } from '@metad/ocap-angular/analytical-card'
import { AnalyticalGridModule } from '@metad/ocap-angular/analytical-grid'
import { ControlsModule } from '@metad/ocap-angular/controls'
import {
  NgmAgentService,
  NgmDSCoreService,
  OCAP_AGENT_TOKEN,
  OCAP_DATASOURCE_TOKEN,
  OcapCoreModule
} from '@metad/ocap-angular/core'
import { DataSource, Type } from '@metad/ocap-core'
import { DEFAULT_THEME } from '@metad/ocap-echarts'
import { registerTheme } from 'echarts/core'
import { NgxEchartsModule } from 'ngx-echarts'
import { BIRoutingModule } from './bi-routing.module'
import { S4ServerAgent } from './s4-agent.service'

registerTheme(DEFAULT_THEME.name, DEFAULT_THEME.echartsTheme)

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),

    AnalyticalCardModule,
    AnalyticalGridModule,
    OcapCoreModule,
    ControlsModule,
    BIRoutingModule
  ],
  exports: [],
  declarations: [],
  providers: [
    NgmDSCoreService,
    NgmAgentService,
    S4ServerAgent,
    {
      provide: OCAP_AGENT_TOKEN,
      useExisting: S4ServerAgent,
      multi: true
    },
    {
      provide: OCAP_DATASOURCE_TOKEN,
      useValue: {
        type: 'XMLA',
        factory: async (): Promise<Type<DataSource>> => {
          const { XmlaDataSource } = await import('@metad/ocap-xmla')
          return XmlaDataSource
        }
      },
      multi: true
    }
  ]
})
export class BIModule {}
