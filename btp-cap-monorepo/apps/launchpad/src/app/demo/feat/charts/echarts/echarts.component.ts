import { ComponentPortal, ComponentType, Portal, PortalModule } from '@angular/cdk/portal';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@/app/components';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import { StartedComponent } from './started/started.component';
import { AdvancedComponent } from './advanced/advanced.component';
import { SeriesComponent } from './series/series.component';

enum TabEnum {
  Started,
  Advanced,
  Series
}

type targetComp = StartedComponent | AdvancedComponent | SeriesComponent;

@Component({
  selector: 'zng-echarts',
  templateUrl: './echarts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, PortalModule, NzTabsModule, NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ]
})
export class EchartsComponent implements OnInit, AfterViewInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Echarts',
    breadcrumb: ['首页', '功能', '图表', 'Echarts'],
    desc: 'Echarts的示例内容'
  };
  @ViewChild('headerFooter', { static: false }) headerFooter!: TemplateRef<NzSafeAny>;

  tabEnum = TabEnum;
  currentSelTab: number = this.tabEnum.Started;
  componentArray: Array<ComponentType<targetComp>> = [StartedComponent, AdvancedComponent, SeriesComponent];
  componentPortal?: ComponentPortal<targetComp>;
  selectedPortal!: Portal<any>;

  constructor(private cdr: ChangeDetectorRef) {}

  to(tabIndex: TabEnum): void {
    this.currentSelTab = tabIndex;
    this.componentPortal = new ComponentPortal(this.componentArray[tabIndex]);
    this.selectedPortal = this.componentPortal;
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.to(this.tabEnum.Started);
  }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: 'Echarts',
      desc: 'Echarts的示例内容',
      breadcrumb: ['首页', '功能', '图表', 'Echarts'],
      footer: this.headerFooter
    };
  }
}
