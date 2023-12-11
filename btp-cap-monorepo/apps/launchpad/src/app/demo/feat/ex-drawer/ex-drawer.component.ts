import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ExDrawerDrawerService, ModalBtnStatus } from '@/app/components/Drawer';

@Component({
  selector: 'zng-ex-drawer',
  templateUrl: './ex-drawer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzInputModule, FormsModule, NzButtonModule, NzWaveModule]
})
export class ExDrawerComponent implements OnInit {
  data = '';
  dataFromDrawer = '';
  destroyRef = inject(DestroyRef);
  constructor(private drawerService: ExDrawerDrawerService, private cdr: ChangeDetectorRef) {}

  showDrawer(): void {
    this.drawerService
      .show({ nzTitle: '服务创建' }, { name: this.data })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ modalValue, status }) => {
        if (status === ModalBtnStatus.Cancel) {
          return;
        }
        this.dataFromDrawer = modalValue.password;
        this.cdr.markForCheck();
      });
  }

  ngOnInit(): void {}
}
