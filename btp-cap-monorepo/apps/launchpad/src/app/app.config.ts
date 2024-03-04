import { environment } from '@/environments/environment'
import { DOCUMENT, registerLocaleData } from '@angular/common'
import { provideHttpClient } from '@angular/common/http'
import en from '@angular/common/locales/en'
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import {
  RouteReuseStrategy,
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation
} from '@angular/router'
import { provideServiceWorker } from '@angular/service-worker'
import { IconDefinition } from '@ant-design/icons-angular'
import * as AllIcons from '@ant-design/icons-angular/icons'
import { provideClientCopilot } from '@metad/ocap-angular/copilot'
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config'
import { NzDrawerModule } from 'ng-zorro-antd/drawer'
import { NZ_ICONS } from 'ng-zorro-antd/icon'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { CookieService } from 'ngx-cookie-service'
import { provideMarkdown } from 'ngx-markdown'
import { appRoutes } from './app.routes'
import { ScrollService, provideLogger, provideTranslate } from './core'
import { SimpleReuseStrategy, ZngPageTitleStrategy } from './core/strategies'
import { APP_STORE_TOKEN, BTPAppStoreService, IAppStore, S4AppStoreService } from './stores'

registerLocaleData(en)

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition
}
const icons: IconDefinition[] = Object.keys(antDesignIcons).map((key) => antDesignIcons[key])

const ngZorroConfig: NzConfig = {
  // 注意组件名称没有 nz 前缀
  theme: {},
  pageHeader: {
    nzGhost: true
  }
}

function initializeApp(appStore: IAppStore) {
  return () => {
    Promise.all([appStore.currentUser(), appStore.refreshPersonalization()]).then()
  }
}

const APPINIT_PROVIDES = [
  // 项目启动
  {
    provide: APP_INITIALIZER,
    useFactory: initializeApp,
    deps: [APP_STORE_TOKEN],
    multi: true
  }
]

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy, deps: [DOCUMENT, ScrollService] }, // 路由复用
    provideRouter(
      appRoutes,
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding() // 开启路由参数绑定到组件的输入属性,ng16新增特性
    ),
    provideAnimations(),
    provideHttpClient(),
    { provide: NZ_ICONS, useValue: icons },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    provideTranslate(),
    provideLogger(),
    CookieService,
    {
      provide: APP_STORE_TOKEN,
      useClass: environment.platform === 'S4H' ? S4AppStoreService : BTPAppStoreService
    },
    ...APPINIT_PROVIDES,
    ZngPageTitleStrategy,
    {
      provide: TitleStrategy,
      useExisting: ZngPageTitleStrategy
    },
    importProvidersFrom(NzDrawerModule, NzModalModule),
    provideClientCopilot(async () =>
      Promise.resolve(environment.copilot ?? { enabled: false, chatUrl: '', defaultModel: '' })
    ),
    provideMarkdown(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
}
