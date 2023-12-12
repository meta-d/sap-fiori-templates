import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PageHeaderType, PageHeaderComponent } from '@/app/components';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { ExampleService } from '@/app/core/services/example.service';

@Component({
  selector: 'zng-session-timeout',
  templateUrl: './session-timeout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzButtonModule, NzWaveModule]
})
export class SessionTimeoutComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '登录超时',
    breadcrumb: ['首页', '功能', '登录超时'],
    desc: '用户登录超时示例。如果redis超时了，则重新弹出登录框，登录成功则将原先的接口重新发送，' + '登录失败，则跳转到登录页面。'
  };
  destroyRef = inject(DestroyRef);

  constructor(private dataService: ExampleService) {}

  go(): void {
    this.dataService.sessionTimeOut().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  ngOnInit(): void {}
}
