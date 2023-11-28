import { NumberLoopPipe } from '@/app/core';
import { NgFor, DecimalPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'zng-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzGridModule, NgFor, NzCardModule, NzAvatarModule, NzTypographyModule, NzIconModule, NzButtonModule, NzToolTipModule, NzDropDownModule, NzMenuModule, DecimalPipe, NumberLoopPipe]
})
export class ApplicationComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
