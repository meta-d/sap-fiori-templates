import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { GlobalSettingsComponent } from '../GlobalSettings/global-settings.component'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import {
  AuthenticationService,
  SAPUserContextCookieName,
  SAPUserContextLanguage,
  ScreenLessHiddenDirective,
  ToggleFullscreenDirective,
  toSAPLanguage
} from '@/app/core'
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal'
import { HomeNoticeComponent } from '../HomeNotice/home-notice.component'
import { AppStoreService } from '@/app/stores'
import { Params, Router } from '@angular/router'
import { GlobalSearchComponent } from '../GlobalSearch/global-search.component'
import { CookieService } from 'ngx-cookie-service'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
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
  private modalService = inject(NzModalService)
  public appStore = inject(AppStoreService)
  private cookieService = inject(CookieService)
  public authService = inject(AuthenticationService)
  private router = inject(Router)

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

  useLanguage(lang: string): void {
    this.translate.use(lang).subscribe(() => {
      // Update the sap language in the cookie `sap-usercontext`
      const userContext = this.cookieService.get(SAPUserContextCookieName)
      const searchParams = new URL(`http://localhost?${userContext}`).searchParams
      searchParams.set(SAPUserContextLanguage, toSAPLanguage(lang))
      this.cookieService.set(SAPUserContextCookieName, searchParams.toString(), undefined, '/')
      this.message.info(
        this.translate.instant('ZNG.GlobalHeader.LanguageChanged', {
          Default: 'Language changed!'
        })
      )
    })
  }

  goLogin(): void {
    this.router.navigate(['auth/login'])
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
    // Use current user context to reload page to change password
    const userContext = this.cookieService.get(SAPUserContextCookieName)
    const queryParams: Params = {}
    if (userContext) {
      const searchParams = new URL(`http://localhost?${userContext}`).searchParams
      searchParams.forEach((value, key) => queryParams[key] = value)
    }
    this.authService.logout().subscribe(async (response) => {
      await this.router.navigate(['/'], {
        queryParams
      })
      window.location.reload()
    })
  }

  lockScreen() {
    //
  }

  goLogout() {
    this.authService.logout().subscribe((html) => {
      console.log(html)
    })
  }

  openSearch() {
    const options: ModalOptions = {
      nzContent: GlobalSearchComponent,
      nzClosable: false,
      nzMaskClosable: true,
      nzStyle: { top: '48px' },
      nzFooter: null,
      nzBodyStyle: { padding: '0' },
      nzClassName: 'zng-global-search-modal',
    }
    this.modalService.create(options)
  }
}
