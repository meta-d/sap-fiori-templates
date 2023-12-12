import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TaskManageFormComponent } from './/task-manage-form/task-manage-form.component';
import { WarehouseManageFormComponent } from './/warehouse-manage-form/warehouse-manage-form.component';
import { fnCheckForm } from '@/app/utils/tools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageService } from 'ng-zorro-antd/message';

import { TaskManageFormComponent as TaskManageFormComponent_1 } from './task-manage-form/task-manage-form.component';
import { UserMemberManageComponent } from './user-member-manage/user-member-manage.component';
import { WarehouseManageFormComponent as WarehouseManageFormComponent_1 } from './warehouse-manage-form/warehouse-manage-form.component';
import { FooterSubmitComponent } from '@/app/components';
import { TranslateModule } from '@ngx-translate/core';

// 自定义表单
/*https://juejin.cn/post/6844904018922176520*/
@Component({
  selector: 'zng-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    NzFormModule,
    ReactiveFormsModule,
    NzCardModule,
    WarehouseManageFormComponent_1,
    TaskManageFormComponent_1,
    UserMemberManageComponent,
    FooterSubmitComponent,
    NzButtonModule,
    NzWaveModule
  ]
})
export class AdvancedComponent implements OnInit, OnDestroy {
  @ViewChild('warehouseManageComponent') warehouseManageComponent!: WarehouseManageFormComponent;
  @ViewChild('taskManageComponent') taskManageComponent!: TaskManageFormComponent;

  validateForm!: FormGroup;

  constructor(private fb: FormBuilder, public message: NzMessageService) {}

  submit(): void {
    // @ts-ignore
    if (!fnCheckForm(this.validateForm) | this.warehouseManageComponent.checkForm() | this.taskManageComponent.checkForm()) {
      return;
    }
    this.message.info('控制台打印出了表单数据');
    console.log(this.validateForm.value);
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      warehouseManage: [null, [Validators.required]],
      taskManage: [null, [Validators.required]]
    });
  }

  ngOnDestroy(): void {
    console.log('GAOJI');
  }
}
