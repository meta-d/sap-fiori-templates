import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'zng-network-error',
  templateUrl: './network-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzResultModule, NzButtonModule, NzWaveModule]
})
export class NetworkErrorComponent implements OnInit {
  img = '../../../../../assets/imgs/except/net-error.svg';
  constructor() {}

  ngOnInit(): void {}
}
