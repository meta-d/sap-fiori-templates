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
  selector: 'zng-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
