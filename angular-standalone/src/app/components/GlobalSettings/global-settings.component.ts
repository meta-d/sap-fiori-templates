import { ThemeService } from '@/app/core/services'
import { ZngAntdModule } from '@/app/core/shared.module'
import { MenuMode, ThemeType } from '@/app/core/types'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NzConfigService } from 'ng-zorro-antd/core/config'
import { NzMenuThemeType } from 'ng-zorro-antd/menu'


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ZngAntdModule],
  selector: 'zng-global-settings',
  templateUrl: './global-settings.component.html',
  styleUrls: ['./global-settings.component.scss']
})
export class GlobalSettingsComponent {
  private themeService = inject(ThemeService)
  private nzConfigService = inject(NzConfigService)

  ThemeType = ThemeType
  MenuMode = MenuMode
  
  visible = false

  options = [
    {
      value: ThemeType.default,
      label: 'Default'
    },
    {
      value: ThemeType.dark,
      label: 'Dark'
    }
  ]

  get currentTheme() {
    return this.themeService.currentTheme
  }
  get themeIndex() {
    return this.options.findIndex(
      (item) => item.value === this.themeService.currentTheme
    )
  }
  set themeIndex(index: number) {
    this.themeService.toggleTheme(this.options[index].value)
  }

  menuThemes = [
    {
      label: '亮色菜单风格',
      value: ThemeType.light as NzMenuThemeType,
      image: '/assets/images/themes/menu-theme-light.svg',
    },
    {
      label: '暗色菜单风格',
      value: ThemeType.dark as NzMenuThemeType,
      image: '/assets/images/themes/menu-theme-dark.svg',
    }
  ]

  get menuTheme() {
    return this.themeService.menuTheme
  }

  parimaryColors = [
    {
      label: '薄暮', value: '#F5222D'
    },
    {
      label: '火山', value: '#FA541C'
    },
    {
      label: '日暮', value: '#FAAD14'
    },
    {
      label: '明青', value: '#13C2C2'
    },
    {
      label: '极光绿', value: '#52C41A'
    },
    {
      label: '拂晓蓝（默认）', value: '#1890FF'
    },
    {
      label: '极客蓝', value: '#2F54EB'
    },
    {
      label: '酱紫', value: '#722ED1'
    }
  ]

  get primaryColor() {
    return this.nzConfigService.getConfigForComponent('theme')?.primaryColor
  }

  menuModes = [
    {
      value: MenuMode.side,
      image: '/assets/images/themes/menu-side.svg',
      label: '侧边菜单布局',
      isChecked: true
    },
    {
      value: MenuMode.top,
      image: '/assets/images/themes/menu-top.svg',
      label: '顶部菜单布局',
      isChecked: false
    },
    {
      value: MenuMode.mix,
      image: '/assets/images/themes/menu-top.svg',
      label: '混合菜单布局',
      isChecked: false
    }
  ]

  get menuMode() {
    return this.themeService.menuMode
  }

  get fixedLayoutSider() {
    return this.themeService.fixedLayoutSider()
  }
  set fixedLayoutSider(value: boolean) {
    this.themeService.themeOptions.update((options) => {
      return {
        ...options,
        fixedLayoutSider: value
      }
    })
  }

  clickMe(): void {
    this.visible = false
  }

  change(value: boolean): void {
    console.log(value)
  }

  selectPrimaryColor(color: string) {
    this.nzConfigService.set('theme', { primaryColor: color })
  }

  toggleMenuTheme(theme: NzMenuThemeType) {
    this.themeService.menuTheme.set(theme)
  }

  toggleMenuMode(mode: MenuMode) {
    this.themeService.menuMode.set(mode)
  }
}
