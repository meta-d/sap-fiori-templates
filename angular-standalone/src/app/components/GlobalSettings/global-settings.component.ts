import { ThemeService } from '@/app/core/services'
import { ZngAntdModule } from '@/app/core/shared.module'
import { MenuMode, ThemeType } from '@/app/core/types'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { NzConfigService } from 'ng-zorro-antd/core/config'
import { NzMenuThemeType } from 'ng-zorro-antd/menu'
import { map } from 'rxjs/operators'

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ZngAntdModule],
  selector: 'zng-global-settings',
  templateUrl: './global-settings.component.html',
  styleUrls: ['./global-settings.component.scss']
})
export class GlobalSettingsComponent {
  private themeService = inject(ThemeService)
  private nzConfigService = inject(NzConfigService)
  private translateService = inject(TranslateService)

  ThemeType = ThemeType
  MenuMode = MenuMode

  readonly themeOptions = toSignal(
    this.translateService
      .stream('ZNG.GlobalSettings.Themes', { Default: {} })
      .pipe(
        map((i18n) => [
          {
            value: ThemeType.default,
            label: i18n.Light || 'Light'
          },
          {
            value: ThemeType.dark,
            label: i18n.Dark || 'Dark'
          }
        ])
      ),
    { initialValue: [] }
  )

  get currentTheme() {
    return this.themeService.currentTheme
  }
  get themeIndex() {
    return this.themeOptions().findIndex(
      (item) => item.value === this.themeService.currentTheme()
    )
  }
  set themeIndex(index: number) {
    this.themeService.setTheme(this.themeOptions()[index].value)
  }

  menuThemes = [
    {
      label: 'Light style',
      value: ThemeType.light as NzMenuThemeType,
      image: 'assets/images/themes/menu-theme-light.svg'
    },
    {
      label: 'Dark style',
      value: ThemeType.dark as NzMenuThemeType,
      image: 'assets/images/themes/menu-theme-dark.svg'
    }
  ]

  get menuTheme() {
    return this.themeService.menuTheme
  }

  primaryColors = [
    {
      label: '薄暮',
      value: '#F5222D'
    },
    {
      label: '火山',
      value: '#FA541C'
    },
    {
      label: '日暮',
      value: '#FAAD14'
    },
    {
      label: '明青',
      value: '#13C2C2'
    },
    {
      label: '极光绿',
      value: '#52C41A'
    },
    {
      label: '拂晓蓝',
      value: '#1890FF'
    },
    {
      label: '极客蓝',
      value: '#2F54EB'
    },
    {
      label: '酱紫',
      value: '#722ED1'
    }
  ]

  get primaryColor() {
    return this.nzConfigService.getConfigForComponent('theme')?.primaryColor
  }

  menuModes = [
    {
      value: MenuMode.side,
      image: 'assets/images/themes/menu-side.svg',
      label: 'Sidebar Menu Layout',
    },
    {
      value: MenuMode.top,
      image: 'assets/images/themes/menu-top.svg',
      label: 'Top Menu Layout',
    },
    {
      value: MenuMode.mix,
      image: 'assets/images/themes/menu-top.svg',
      label: 'Mixed Menu Layout',
    }
  ]

  get menuMode() {
    return this.themeService.menuMode
  }

  get fixedLayoutSider() {
    return this.themeService.fixedLayoutSider()
  }
  set fixedLayoutSider(value: boolean | undefined) {
    this.themeService.updatePersonalization({
      fixedLayoutSider: value
    })
  }

  get fixedLayoutHeader() {
    return this.themeService.fixedLayoutHeader()
  }
  set fixedLayoutHeader(value: boolean | undefined) {
    this.themeService.updatePersonalization({
      fixedLayoutHeader: value
    })
  }

  selectPrimaryColor(color: string) {
    this.themeService.setPrimaryColor(color)
  }

  toggleMenuTheme(theme: NzMenuThemeType) {
    this.themeService.updatePersonalization({
      menuTheme: theme
    })
  }

  toggleMenuMode(mode: MenuMode) {
    this.themeService.updatePersonalization({
      menuMode: mode
    })
  }
}
