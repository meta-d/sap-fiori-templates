import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NzWaterMarkModule } from 'ng-zorro-antd/water-mark'

@Component({
  selector: 'zng-water-mark',
  standalone: true,
  imports: [CommonModule, NzWaterMarkModule],
  templateUrl: './water-mark.component.html',
  styleUrls: ['./water-mark.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaterMarkComponent {}
