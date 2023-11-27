import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeaderComponent, PageHeaderType } from '@/app/components';
import { NzWaterMarkModule } from 'ng-zorro-antd/water-mark';

@Component({
  selector: 'zng-water-mark',
  standalone: true,
  imports: [CommonModule, NzWaterMarkModule, PageHeaderComponent],
  templateUrl: './water-mark.component.html',
  styleUrls: ['./water-mark.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaterMarkComponent {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '水印',
    breadcrumb: ['首页', '功能', '水印'],
    desc: '没什么，搬运的zorro官网示例,https://ng.ant.design/components/water-mark/zh'
  };
}
