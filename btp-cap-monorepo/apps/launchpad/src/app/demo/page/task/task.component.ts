import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

import { NzCardModule } from 'ng-zorro-antd/card'
import { NzGridModule } from 'ng-zorro-antd/grid'
import { TaskListPanelComponent } from './task-list-panel/task-list-panel.component'
import { TaskSearchInfoComponent } from './task-search-info/task-search-info.component'

@Component({
  selector: 'zng-task',
  standalone: true,
  imports: [CommonModule, NzGridModule, TaskSearchInfoComponent, NzCardModule, TaskListPanelComponent],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {}
