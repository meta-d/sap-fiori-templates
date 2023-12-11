import { NumberLoopPipe } from '@/app/core';
import { NgFor } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'zng-detail',
  templateUrl: './detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzInputModule, NgFor, NumberLoopPipe]
})
export class DetailComponent implements OnInit {
  id = 0;
  destroyRef = inject(DestroyRef);
  constructor(private routeParam: ActivatedRoute, public cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.routeParam.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.id = params['id'];
      this.cdr.markForCheck();
    });
  }
}
