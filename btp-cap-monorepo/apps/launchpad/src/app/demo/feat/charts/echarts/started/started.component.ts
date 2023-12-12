import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentPortal, ComponentType, Portal, PortalModule } from '@angular/cdk/portal';
import { NgFor } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EventsChartsComponent } from './events-charts/events-charts.component';
import { InitOptsChartsComponent } from './init-opts-charts/init-opts-charts.component';
import { InstanceOptsChartsComponent } from './instance-opts-charts/instance-opts-charts.component';
import { LoadingChartsComponent } from './loading-charts/loading-charts.component';
import { MergeChartsComponent } from './merge-charts/merge-charts.component';
import { SimpleChartComponent } from './simple-chart/simple-chart.component';
import { ThemeChartsComponent } from './theme-charts/theme-charts.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTabPosition } from 'ng-zorro-antd/tabs/interfaces';

type targetComp = EventsChartsComponent | InitOptsChartsComponent | InstanceOptsChartsComponent | LoadingChartsComponent | MergeChartsComponent | SimpleChartComponent | ThemeChartsComponent;

@Component({
  selector: 'zng-started',
  templateUrl: './started.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzCardModule, NzTabsModule, NgFor, PortalModule]
})
export class StartedComponent implements OnInit {
  tabPosition: NzTabPosition = 'left';
  componentPortal?: ComponentPortal<targetComp>;
  selectedPortal!: Portal<any>;
  tabArray: Array<{ label: string; value: ComponentType<targetComp> }> = [
    { label: 'Simple Chart', value: SimpleChartComponent },
    { label: 'Events', value: EventsChartsComponent },
    { label: '[theme]', value: ThemeChartsComponent },
    { label: '[loading]', value: LoadingChartsComponent },
    { label: '[merge]', value: MergeChartsComponent },
    { label: '[initOpts]', value: InitOptsChartsComponent },
    { label: 'ECharts Instance', value: InstanceOptsChartsComponent }
  ];
  destroyRef = inject(DestroyRef);

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
