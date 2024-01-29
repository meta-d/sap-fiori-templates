import { DOCUMENT } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@/app/components';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzScrollService } from 'ng-zorro-antd/core/services';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ZngScrollDirective } from '@/app/core';

/*https://segmentfault.com/a/1190000020769492*/
@Component({
  selector: 'zng-play-scroll',
  templateUrl: './play-scroll.component.html',
  styleUrls: ['./play-scroll.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzCardModule, NzGridModule, NzButtonModule, NzWaveModule, ZngScrollDirective]
})
export class PlayScrollComponent {
  private scrollService = inject(NzScrollService)
  private _doc: Document = inject(DOCUMENT)
  
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '操作滚动条',
    breadcrumb: ['首页', '拓展功能', '操作滚动条'],
    desc: '滚动条是用户界面中的一个常见组件，其主要功能是允许用户在视图中查看超出可见区域的内容。它通常与滚动区域（例如，文本框、面板、网页等）一起使用。'
  };

  toDocBottom(): void {
    this.scrollService.scrollTo(null, this._doc.body.scrollHeight);
  }

  toDoc100(): void {
    this.scrollService.scrollTo(null, 100);
  }

  toBox1(): void {
    this.scrollService.scrollTo(this._doc.querySelector('#div-scroll3'), 100);
  }

  toBox2(): void {
    this.scrollService.scrollTo(this._doc.querySelector('#div-scroll4'), 100);
  }

  toDocHead(): void {
    this.scrollService.scrollTo(null, 0);
  }

}
