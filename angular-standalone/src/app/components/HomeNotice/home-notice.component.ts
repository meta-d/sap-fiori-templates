import { NumberLoopPipe } from '@/app/core/pipes/number-loop.pipe';
import { NgTemplateOutlet, NgFor } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'zng-home-notice',
  templateUrl: './home-notice.component.html',
  styleUrls: ['./home-notice.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzCardModule, NzTabsModule, NgTemplateOutlet, NzListModule, NgFor, NzTypographyModule, NzTagModule, NumberLoopPipe]
})
export class HomeNoticeComponent {
}
