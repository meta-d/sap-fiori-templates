import { ZngAntdModule } from '@/app/core/shared.module';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';


@Component({
  selector: 'zng-home-notice',
  templateUrl: './home-notice.component.html',
  styleUrls: ['./home-notice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ZngAntdModule,
  ]
})
export class HomeNoticeComponent {
  messages = signal([])
}
