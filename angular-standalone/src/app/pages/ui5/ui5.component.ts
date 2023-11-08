import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'zng-ui5',
  templateUrl: './ui5.component.html',
  styleUrls: ['./ui5.component.scss']
})
export class Ui5Component {}
