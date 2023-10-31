import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ZngAntdModule],
  selector: 'zng-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {}
