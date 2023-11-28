import { ChangeDetectorRef, Component, DestroyRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { fnCheckForm } from '@/app/utils/tools';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'zng-search-table-detail',
  templateUrl: './search-table-detail.component.html',
  standalone: true,
  imports: [NzInputModule, FormsModule, NzDividerModule, NzFormModule, ReactiveFormsModule, NzGridModule]
})
export class SearchTableDetailComponent implements OnInit, OnDestroy {

  validateForm!: FormGroup;
  @Input({ required: true }) name!: string; // 从路由中获取的参数，ng16支持的新特性
  backUrl = '/default/page-demo/list/search-table';
  destroyRef = inject(DestroyRef);

  constructor(private routeParam: ActivatedRoute, public cdr: ChangeDetectorRef, private fb: FormBuilder) {}

  initForm(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
  }

  _onReuseDestroy(): void {
    console.log('tab销毁了，调用_OnReuseDestroy');
  }

  ngOnInit(): void {
    this.initForm();
    this.validateForm.get('userName')?.setValue(this.name);
  }

  ngOnDestroy(): void {
    console.log('组件实力销毁，调用ngOnDestroy');
  }
}
