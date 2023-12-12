import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  selector: 'zng-qrcode',
  standalone: true,
  imports: [CommonModule, NzQRCodeModule],
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrcodeComponent {
}
