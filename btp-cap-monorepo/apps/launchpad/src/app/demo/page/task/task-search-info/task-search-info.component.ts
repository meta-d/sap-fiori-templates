import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TaskSearchFiltersComponent } from './task-search-filters/task-search-filters.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'zng-task-search-info',
  standalone: true,
  imports: [CommonModule, UserInfoComponent, TaskSearchFiltersComponent, NzDividerModule, NzCardModule],
  templateUrl: './task-search-info.component.html',
  styleUrls: ['./task-search-info.component.less']
})
export class TaskSearchInfoComponent {}
