import { ThemeService } from '@/app/core/services'
import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NzConfigService } from 'ng-zorro-antd/core/config'
import { NzMessageService } from 'ng-zorro-antd/message'
import { GlobalSettingsComponent } from '../GlobalSettings/global-settings.component'


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ZngAntdModule, GlobalSettingsComponent],
  selector: 'zng-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss']
})
export class GlobalHeaderComponent {
  private themeService = inject(ThemeService)
  private nzConfigService = inject(NzConfigService)
  public message = inject(NzMessageService)

  showMessage(): void {
    this.message.info('切换成功');
  }
}
