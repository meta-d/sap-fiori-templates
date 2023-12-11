import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'zng-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzResultModule, NzButtonModule, NzWaveModule, NzDescriptionsModule]
})
export class StepThreeComponent implements OnInit {
  @Input('stepDirection') stepDirection: 'horizontal' | 'vertical' = 'horizontal';
  @Output() readonly next = new EventEmitter<NzSafeAny>();

  constructor() {}

  ngOnInit(): void {}
}
