import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@/app/components';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { DriverService } from '@/app/core';

@Component({
  selector: 'zng-setup',
  templateUrl: './setup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzButtonModule, NzWaveModule]
})
export class SetupComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '引导页',
    breadcrumb: ['首页', '引导页'],
    desc: '用于给用户的指引操作'
  };

  constructor(private driverService: DriverService) {}

  go(): void {
    this.driverService.load();
  }

  ngOnInit(): void {}
}
