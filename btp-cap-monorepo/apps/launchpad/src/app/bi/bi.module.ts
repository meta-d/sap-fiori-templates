import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { RouterModule, provideRouter } from '@angular/router'
import { AnalyticalCardModule } from '@metad/ocap-angular/analytical-card'
import { AnalyticalGridModule } from '@metad/ocap-angular/analytical-grid'
import { ControlsModule } from '@metad/ocap-angular/controls'
import {
  NgmAgentService,
  NgmDSCoreService,
  NgmMissingTranslationHandler,
  OCAP_AGENT_TOKEN,
  OCAP_DATASOURCE_TOKEN,
  OcapCoreModule
} from '@metad/ocap-angular/core'
import { ZhHans } from '@metad/ocap-angular/i18n'
import { DataSource, Type } from '@metad/ocap-core'
import { DEFAULT_THEME } from '@metad/ocap-echarts'
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { registerTheme } from 'echarts/core'
import { NgxEchartsModule } from 'ngx-echarts'
import { Observable, of } from 'rxjs'
import { routes } from './bi-routing'
import { S4ServerAgent } from './s4-agent.service'
import { ZngOcapTranslateService } from './translate.service'
import { DARK_THEME } from './theme.dark'
import { ZngS4DSCoreService } from './s4-ds-core.service'

registerTheme(DEFAULT_THEME.name, DEFAULT_THEME.echartsTheme)
registerTheme(DARK_THEME.name, DARK_THEME.chartTheme)

class ZngTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    switch (lang) {
      case 'zh-Hans':
        return of(ZhHans)
      default:
        return of(null)
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    TranslateModule.forChild({
      defaultLanguage: 'en',
      loader: { provide: TranslateLoader, useClass: ZngTranslateLoader },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: NgmMissingTranslationHandler
      },
      extend: true,
      isolate: true
    }),
    AnalyticalCardModule,
    AnalyticalGridModule,
    OcapCoreModule,
    ControlsModule,
    RouterModule
  ],
  exports: [],
  declarations: [],
  providers: [
    provideRouter(routes),
    ZngOcapTranslateService,
    ZngS4DSCoreService,
    {
      provide: NgmDSCoreService,
      useExisting: ZngS4DSCoreService
    },
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
