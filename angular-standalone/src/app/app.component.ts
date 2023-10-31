import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzLayoutModule } from 'ng-zorro-antd/layout'
import { NzMenuModule } from 'ng-zorro-antd/menu'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NzLayoutModule,
    NzButtonModule,
    NzMenuModule,
    NzBreadCrumbModule
  ],
  selector: 'angular-standalone-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-standalone'
}
