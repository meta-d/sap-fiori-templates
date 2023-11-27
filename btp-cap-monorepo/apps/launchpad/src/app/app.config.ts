import { DOCUMENT, registerLocaleData } from '@angular/common'
import { provideHttpClient } from '@angular/common/http'
import en from '@angular/common/locales/en'
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import { RouteReuseStrategy, TitleStrategy, provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router'
import { IconDefinition } from '@ant-design/icons-angular'
import * as AllIcons from '@ant-design/icons-angular/icons'
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config'
import { NZ_ICONS } from 'ng-zorro-antd/icon'
import { CookieService } from 'ngx-cookie-service'

import { appRoutes } from './app.routes'
import { ScrollService, provideLogger, provideTranslate } from './core'
import { SimpleReuseStrategy, ZngPageTitleStrategy } from './core/strategies'
import { AppStoreService } from './stores'
import { NzDrawerModule } from 'ng-zorro-antd/drawer'
import { NzModalModule } from 'ng-zorro-antd/modal'

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
  }
]

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy, deps: [DOCUMENT, ScrollService] }, // 路由复用
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    provideHttpClient(),
    { provide: NZ_ICONS, useValue: icons },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    provideTranslate(),
    provideLogger(),
    CookieService,
    AppStoreService,
    ...APPINIT_PROVIDES,
    ZngPageTitleStrategy,
    {
      provide: TitleStrategy,
      useExisting: ZngPageTitleStrategy
    },
    importProvidersFrom(NzDrawerModule, NzModalModule),
  ]
}
