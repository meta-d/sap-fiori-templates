import { registerLocaleData } from '@angular/common'
import { provideHttpClient } from '@angular/common/http'
import en from '@angular/common/locales/en'
import { ApplicationConfig } from '@angular/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import {
  provideRouter,
  withEnabledBlockingInitialNavigation
} from '@angular/router'
import { IconDefinition } from '@ant-design/icons-angular'
import * as AllIcons from '@ant-design/icons-angular/icons'
import { NZ_ICONS } from 'ng-zorro-antd/icon'
import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';

import { appRoutes } from './app.routes'

registerLocaleData(en)

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition
}
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(
  (key) => antDesignIcons[key]
)

const ngZorroConfig: NzConfig = {
  // 注意组件名称没有 nz 前缀
  theme: {
  },
  pageHeader: {
    nzGhost: true
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    provideHttpClient(),
    { provide: NZ_ICONS, useValue: icons },
    { provide: NZ_CONFIG, useValue:  ngZorroConfig  }
  ]
}
