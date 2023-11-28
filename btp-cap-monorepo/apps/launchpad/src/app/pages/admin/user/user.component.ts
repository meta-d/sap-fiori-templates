import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ZngAntdModule],
  selector: 'zng-admin-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class AdminUserComponent {

}
