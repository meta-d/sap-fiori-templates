import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentPortal, ComponentType, Portal, PortalModule } from '@angular/cdk/portal';
import { NgFor } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FromLeftToRightComponent } from './from-left-to-right/from-left-to-right.component';
import { RadialTreeComponent } from './radial-tree/radial-tree.component';
import { SimpleGraphComponent } from './simple-graph/simple-graph.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTabPosition } from 'ng-zorro-antd/tabs/interfaces';

type targetComp = SimpleGraphComponent | FromLeftToRightComponent | RadialTreeComponent;

@Component({
  selector: 'zng-series',
  templateUrl: './series.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzCardModule, NzTabsModule, NgFor, PortalModule]
})
export class SeriesComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  componentPortal?: ComponentPortal<targetComp>;
  selectedPortal!: Portal<any>;
  tabArray: Array<{ label: string; value: ComponentType<targetComp> }> = [
    { label: 'Simple Graph', value: SimpleGraphComponent },
    { label: 'From Left To Right', value: FromLeftToRightComponent },
    { label: 'Radial Tree', value: RadialTreeComponent }
  ];
  tabPosition: NzTabPosition = 'left';

  constructor(private cdr: ChangeDetectorRef, private breakpointObserver: BreakpointObserver) {}
  to(tabIndex: number): void {
    this.componentPortal = new ComponentPortal(this.tabArray[tabIndex].value);
    this.selectedPortal = this.componentPortal;
  }

  ngOnInit(): void {
    this.to(0);
    this.breakpointObserver
      .observe(['(max-width: 767px)'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.tabPosition = result.matches ? 'top' : 'left';
        this.cdr.markForCheck();
      });
  }
}
