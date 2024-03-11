import {
  AuthenticationService,
  LanguageEnum,
  NotificationService,
  SAPUserContextCookieName,
  ScreenLessHiddenDirective,
  ThemeService,
  ToggleFullscreenDirective,
} from '@/app/core'
import { ZngAntdModule } from '@/app/core/shared.module'
import { APP_STORE_TOKEN, IAppStore } from '@/app/stores'
import { CommonModule } from '@angular/common'
import { Component, ViewChild, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Params, Router } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal'
import { CookieService } from 'ngx-cookie-service'
import { GlobalSearchComponent } from '../GlobalSearch/global-search.component'
import { GlobalSettingsComponent } from '../GlobalSettings/global-settings.component'
import { HomeNoticeComponent } from '../HomeNotice/home-notice.component'
import { environment } from '@/environments/environment'
import { NzPopoverDirective } from 'ng-zorro-antd/popover'

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
  private themeService = inject(ThemeService)
  public message = inject(NzMessageService)
  private modalService = inject(NzModalService)
  public appStore = inject<IAppStore>(APP_STORE_TOKEN)
  private cookieService = inject(CookieService)
  public authService = inject(AuthenticationService)
  public notificationService = inject(NotificationService)
  private router = inject(Router)

  @ViewChild(NzPopoverDirective) notification!: NzPopoverDirective

  languages = [
    { value: LanguageEnum.SimplifiedChinese, label: '简体中文' },
    { value: LanguageEnum.TraditionalChinese, label: '繁体中文' },
    { value: LanguageEnum.English, label: 'English' },
    { value: LanguageEnum.Japanese, label: '日本語' }
  ]

  get currentLang() {
    return this.themeService.currentLang
  }

  readonly user = this.appStore.user
  readonly enableNotification = environment.enableNotification

  readonly badgeNumber = this.notificationService.badgeNumber
  readonly isHandsetPortrait = this.themeService.isHandsetPortrait

  constructor() {
    if (this.enableNotification) {
      this.notificationService.startRefreshNotification()
    }
  }

  useLanguage(lang: LanguageEnum): void {
    this.themeService.useLanguage(lang)
  }

  goLogin(): void {
    this.router.navigate(['auth/login'])
  }

  changePassWorld() {
    this.goLogout()
  }

  lockScreen() {
    //
  }

  goLogout() {
    // Use current user context to reload page to change password
    const userContext = this.cookieService.get(SAPUserContextCookieName)
    const queryParams: Params = {}
    if (userContext) {
      const searchParams = new URL(`http://localhost?${userContext}`).searchParams
      searchParams.forEach((value, key) => (queryParams[key] = value))
    }
    this.authService.logout().subscribe(async () => {
      await this.router.navigate(['/'], {
        queryParams
      })
      window.location.reload()
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
      nzClassName: 'zng-global-search-modal'
    }
    this.modalService.create(options)
  }

  closeNotification() {
    if (this.notification.component) {
      this.notification.component.nzVisible = false
    }
  }
}
