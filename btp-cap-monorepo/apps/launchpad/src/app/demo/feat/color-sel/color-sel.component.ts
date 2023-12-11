import { ChangeDetectionStrategy, Component } from '@angular/core'

import { PageHeaderComponent, PageHeaderType } from '@/app/components'
import { NzCardModule } from 'ng-zorro-antd/card'
import { ColorPickerModule } from 'ngx-color-picker'

@Component({
  selector: 'zng-color-sel',
  templateUrl: './color-sel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzCardModule, ColorPickerModule]
})
export class ColorSelComponent {
  public color: string = '#2889e9'
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '我突然想到了“你却说花花世界不必当真”这句歌词',
    desc: '所有示例：https://zefoy.github.io/ngx-color-picker/',
    breadcrumb: ['首页', '功能', '颜色选择器']
  }
}
