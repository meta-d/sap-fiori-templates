import { registerLocaleData } from '@angular/common'
import {
  HttpClient,
  provideHttpClient
} from '@angular/common/http'
import en from '@angular/common/locales/en'
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import {
  TitleStrategy,
  provideRouter,
  withEnabledBlockingInitialNavigation
} from '@angular/router'
import { IconDefinition } from '@ant-design/icons-angular'
import * as AllIcons from '@ant-design/icons-angular/icons'
import { NZ_ICONS } from 'ng-zorro-antd/icon'
import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config'
import { CookieService } from 'ngx-cookie-service'

import { appRoutes } from './app.routes'
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { ZngMissingTranslationHandler } from './core'
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger'
import { AppStoreService } from './stores'
import { ZngPageTitleStrategy } from './core/strategies'

registerLocaleData(en)

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition
}
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(
  (key) => antDesignIcons[key]
)

const ngZorroConfig: NzConfig = {
  // 注意组件名称没有 nz 前缀
  theme: {},
  pageHeader: {
    nzGhost: true
  }
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

function initializeApp(appStore: AppStoreService) {
  return () => Promise.all([appStore.currentUser(), appStore.refreshPersonalization()])
}

const APPINIT_PROVIDES = [
  // 项目启动
  {
    provide: APP_INITIALIZER,
    useFactory: initializeApp,
    deps: [AppStoreService],
    multi: true
  },
]

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    provideHttpClient(),
    { provide: NZ_ICONS, useValue: icons },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    importProvidersFrom(
      TranslateModule.forRoot({
        missingTranslationHandler: {
          provide: MissingTranslationHandler,
          useClass: ZngMissingTranslationHandler
        },
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        }
      }),
      LoggerModule.forRoot({
        serverLoggingUrl: '/api/logs',
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.ERROR
      }),
    ),
    CookieService,
    AppStoreService,
    ...APPINIT_PROVIDES,
    ZngPageTitleStrategy,
    {
      provide: TitleStrategy,
      useExisting: ZngPageTitleStrategy,
    }
  ]
}
