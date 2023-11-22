import { ThemeService } from '@/app/core/services'
import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NzConfigService } from 'ng-zorro-antd/core/config'
import { NzMessageService } from 'ng-zorro-antd/message'


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ZngAntdModule],
  selector: 'zng-admin-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class AdminUserComponent {

}
