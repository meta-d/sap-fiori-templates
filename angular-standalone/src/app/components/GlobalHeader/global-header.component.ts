import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { GlobalSettingsComponent } from '../GlobalSettings/global-settings.component'
import { TranslateService } from '@ngx-translate/core'
import {
  ScreenLessHiddenDirective,
  ToggleFullscreenDirective
} from '@/app/core'
import { ModalOptions } from 'ng-zorro-antd/modal'
import { HomeNoticeComponent } from '../HomeNotice/home-notice.component'
import { AppStoreService } from '@/app/stores'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ZngAntdModule,
    GlobalSettingsComponent,
    ToggleFullscreenDirective,
    ScreenLessHiddenDirective,
    HomeNoticeComponent
  ],
  selector: 'zng-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss']
})
export class GlobalHeaderComponent {
  private translate = inject(TranslateService)
  public message = inject(NzMessageService)
  public appStore = inject(AppStoreService)

  languages = [
    { value: 'zh-Hans', label: '简体中文' },
    { value: 'zh-Hant', label: '繁体中文' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' }
  ]

  get currentLang() {
    return this.translate.currentLang
  }

  readonly user = this.appStore.user

  constructor() {
    this.appStore.currentUser().then()
  }

  useLanguage(lang: string): void {
    this.translate.use(lang).subscribe(() => {
      this.message.info(
        this.translate.instant('ZNG.GlobalHeader.LanguageChanged', {
          Default: 'Language changed!'
        })
      )
    })
  }

  showSearchModal(): void {
    const modalOptions: ModalOptions = {
      nzClosable: false,
      nzMaskClosable: true,
      nzStyle: { top: '48px' },
      nzFooter: null,
      nzBodyStyle: { padding: '0' }
    }
    // this.searchRouteService.show(modalOptions);
  }

  goLogin(): void {
    //
  }

  clean(): void {
    this.message.success('清除成功，请重新登录');
  }

  showMessage(): void {
    this.message.info('切换成功');
  }

  goPage(path: string): void {
    //
  }

  changePassWorld() {
    //
  }

  lockScreen() {
    //
  }
}
