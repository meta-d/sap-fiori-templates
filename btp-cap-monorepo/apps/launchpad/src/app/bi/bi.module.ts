import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { RouterModule, provideRouter } from '@angular/router'
import { AnalyticalCardModule } from '@metad/ocap-angular/analytical-card'
import { AnalyticalGridModule } from '@metad/ocap-angular/analytical-grid'
import { NgmControlsModule } from '@metad/ocap-angular/controls'
import {
  NgmAgentService,
  NgmDSCacheService,
  NgmDSCoreService,
  NgmMissingTranslationHandler,
  OCAP_AGENT_TOKEN,
  OCAP_DATASOURCE_TOKEN,
  OcapCoreModule
} from '@metad/ocap-angular/core'
import { ZhHans, ZhHant } from '@metad/ocap-angular/i18n'
import { DataSource, Type } from '@metad/ocap-core'
import { DEFAULT_THEME } from '@metad/ocap-echarts'
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { registerTheme } from 'echarts/core'
import { NgxEchartsModule } from 'ngx-echarts'
import { Observable, map } from 'rxjs'
import { routes } from './bi-routing'
import { S4ServerAgent, ZngOcapCacheService, ZngOcapTranslateService, ZngS4DSCoreService } from './services'
import { DARK_THEME } from './theme.dark'
import { LanguagesEnum } from '../core'

registerTheme(DEFAULT_THEME.name, {
  ...DEFAULT_THEME.echartsTheme,
  textStyle: {
    ...DEFAULT_THEME.echartsTheme.textStyle,
    fontFamily: null
  }
})
registerTheme(DARK_THEME.name, DARK_THEME.chartTheme)

class ZngTranslateLoader extends TranslateHttpLoader {
  override getTranslation(lang: string): Observable<any> {
    let ocapTranslates = {}
    switch (lang) {
      case LanguagesEnum.Chinese:
      case LanguagesEnum.SimplifiedChinese:
        ocapTranslates = { ...ZhHans }
        break
      case LanguagesEnum.TraditionalChinese:
        ocapTranslates = {
          ...ZhHant
        }
        break
      default:
        ocapTranslates = {}
    }

    return super.getTranslation(lang).pipe(
      map((t) => ({
        ...t,
        ...ocapTranslates
      }))
    )
  }
}

function createTranslateLoader(http: HttpClient) {
  return new ZngTranslateLoader(http, './assets/i18n/', '.json')
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
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
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
    NgmControlsModule,
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
    {
      provide: NgmDSCacheService,
      useClass: ZngOcapCacheService
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
