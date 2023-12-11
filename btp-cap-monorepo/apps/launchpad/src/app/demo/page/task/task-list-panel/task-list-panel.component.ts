import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'zng-task-list-panel',
  standalone: true,
  imports: [CommonModule, NzCollapseModule, NzCardModule, NzIconModule],
  templateUrl: './task-list-panel.component.html',
  styleUrls: ['./task-list-panel.component.less']
})
export class TaskListPanelComponent {
  panels = [
    {
      active: true,
      name: 'Kubernetes cluster meeting last tuesday',
      disabled: false
    }
  ];
}
