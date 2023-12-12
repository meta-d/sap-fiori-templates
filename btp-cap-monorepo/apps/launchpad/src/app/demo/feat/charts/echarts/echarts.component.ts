import { ComponentPortal, ComponentType, Portal, PortalModule } from '@angular/cdk/portal'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core'

import { NzSafeAny } from 'ng-zorro-antd/core/types'
import { NzTabsModule } from 'ng-zorro-antd/tabs'
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts'
import { AdvancedComponent } from './advanced/advanced.component'
import { SeriesComponent } from './series/series.component'
import { StartedComponent } from './started/started.component'

enum TabEnum {
  Started,
  Advanced,
  Series
}

type targetComp = StartedComponent | AdvancedComponent | SeriesComponent

@Component({
  selector: 'zng-echarts',
  templateUrl: './echarts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PortalModule, NzTabsModule, NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    }
  ]
})
export class EchartsComponent implements OnInit {
  @ViewChild('headerFooter', { static: false }) headerFooter!: TemplateRef<NzSafeAny>

  tabEnum = TabEnum
  currentSelTab: number = this.tabEnum.Started
  componentArray: Array<ComponentType<targetComp>> = [StartedComponent, AdvancedComponent, SeriesComponent]
  componentPortal?: ComponentPortal<targetComp>
  selectedPortal!: Portal<any>

  constructor(private cdr: ChangeDetectorRef) {}

  to(tabIndex: TabEnum): void {
    this.currentSelTab = tabIndex
    this.componentPortal = new ComponentPortal(this.componentArray[tabIndex])
    this.selectedPortal = this.componentPortal
    this.cdr.detectChanges()
  }

  ngOnInit(): void {
    this.to(this.tabEnum.Started)
  }
}
