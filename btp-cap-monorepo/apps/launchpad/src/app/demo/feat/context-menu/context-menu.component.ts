import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@/app/components';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzContextMenuService, NzDropdownMenuComponent, NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'zng-context-menu',
  templateUrl: './context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzCardModule, NzButtonModule, NzWaveModule, NzDropDownModule, NzMenuModule]
})
export class ContextMenuComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '右键菜单示例',
    breadcrumb: ['首页', '功能', '右键菜单'],
    desc: '没什么，搬运的zorro官网示例'
  };
  constructor(private nzContextMenuService: NzContextMenuService) {}

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }
  ngOnInit(): void {}
}
