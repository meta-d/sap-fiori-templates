import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'zng-copy',
  templateUrl: './copy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzCardModule, NzButtonModule, NzInputModule, FormsModule, NzWaveModule, ClipboardModule]
})
export class CopyComponent implements OnInit {
  value = '';

  constructor(private msg: NzMessageService) {}

  info(): void {
    this.msg.success('复制成功，直接粘贴');
  }

  ngOnInit(): void {}
}
