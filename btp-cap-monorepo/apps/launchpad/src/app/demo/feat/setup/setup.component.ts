import { ChangeDetectionStrategy, Component } from '@angular/core'

import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzWaveModule } from 'ng-zorro-antd/core/wave'
import { DriverService } from './driver.service'

@Component({
  selector: 'zng-setup',
  templateUrl: './setup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzButtonModule, NzWaveModule],
  providers: [DriverService]
})
export class SetupComponent {
  constructor(private driverService: DriverService) {}

  go(): void {
    this.driverService.load()
  }
}
