import { AntTableComponent, AntTableConfig } from '@/app/components'
import { BreakpointObserver } from '@angular/cdk/layout'
import { NgTemplateOutlet } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  TemplateRef,
  ViewChild,
  inject
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

import { NzBadgeModule } from 'ng-zorro-antd/badge'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzSafeAny } from 'ng-zorro-antd/core/types'
import { NzWaveModule } from 'ng-zorro-antd/core/wave'
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions'
import { NzDividerModule } from 'ng-zorro-antd/divider'
import { NzDropDownModule } from 'ng-zorro-antd/dropdown'
import { NzEmptyModule } from 'ng-zorro-antd/empty'
import { NzGridModule } from 'ng-zorro-antd/grid'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzMenuModule } from 'ng-zorro-antd/menu'
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header'
import { NzPopoverModule } from 'ng-zorro-antd/popover'
import { NzRadioModule } from 'ng-zorro-antd/radio'
import { NzSpaceModule } from 'ng-zorro-antd/space'
import { NzStatisticModule } from 'ng-zorro-antd/statistic'
import { NzStepsModule } from 'ng-zorro-antd/steps'
import { NzTabsModule } from 'ng-zorro-antd/tabs'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip'

interface ReturnObj {
  num: string
  name: string
  code: string
  unitPrice: number
  number: string
  price: string
}

enum TabEnum {
  Detail,
  Rule
}

@Component({
  selector: 'zng-adv-detail',
  templateUrl: './adv-detail.component.html',
  styleUrls: ['./adv-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NzRadioModule,
    NzDropDownModule,
    NzIconModule,
    NzButtonModule,
    NzMenuModule,
    NzWaveModule,
    NzGridModule,
    NzDescriptionsModule,
    NzStatisticModule,
    NzTabsModule,
    NzCardModule,
    NzStepsModule,
    NzPopoverModule,
    NgTemplateOutlet,
    NzBadgeModule,
    NzToolTipModule,
    NzDividerModule,
    NzEmptyModule,
    NzPageHeaderModule,
    NzSpaceModule,
    AntTableComponent
  ]
})
export class AdvDetailComponent implements OnInit {
  @ViewChild('highLightTpl', { static: true }) highLightTpl!: TemplateRef<NzSafeAny>
  stepDirection: 'horizontal' | 'vertical' = 'horizontal'
  returnTableConfig!: AntTableConfig

  tabEnum = TabEnum
  currentSelTab: number = this.tabEnum.Detail
  destroyRef = inject(DestroyRef)

  returnDataList: ReturnObj[] = [
    {
      num: '1234561',
      name: 'Mineral Water 550ml',
      code: 'Demo Scope',
      unitPrice: 1233333,
      number: '1',
      price: '2.00'
    },
    {
      num: '1234561',
      name: 'Mineral Water 550ml',
      code: 'Demo Scope',
      unitPrice: 1233333,
      number: '1',
      price: '2.00'
    },
    {
      num: '1234561',
      name: 'Mineral Water 550ml',
      code: 'Demo Scope',
      unitPrice: 1233333,
      number: '1',
      price: '2.00'
    },
    {
      num: '1234561',
      name: 'Mineral Water 550ml',
      code: 'Demo Scope',
      unitPrice: 1233333,
      number: '1',
      price: '2.00'
    },
    {
      num: '1234561',
      name: 'Mineral Water 550ml',
      code: 'Demo Scope',
      unitPrice: 1233333,
      number: '1',
      price: '2.00'
    }
  ]

  constructor(private cdr: ChangeDetectorRef, private breakpointObserver: BreakpointObserver) {}

  to(tabIndex: TabEnum): void {
    this.currentSelTab = tabIndex
    this.cdr.detectChanges()
  }

  private initReturnTable(): void {
    this.returnTableConfig = {
      showCheckbox: false,
      headers: [
        {
          title: 'Operation Type',
          field: 'num',
          width: 50
        },
        {
          title: 'Operator',
          width: 60,
          field: 'name'
        },
        {
          title: 'Execution Result',
          width: 50,
          field: 'code',
          tdTemplate: this.highLightTpl
        },
        {
          title: 'Operation Time',
          width: 50,
          field: 'unitPrice',
          pipe: 'date:yyyy-MM-dd HH:mm'
        },
        {
          title: 'Remarks',
          width: 50,
          field: 'number'
        }
      ],
      xScroll: 500,
      total: 0,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    }
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 770px)'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result.matches) {
          this.stepDirection = 'vertical'
        } else {
          this.stepDirection = 'horizontal'
        }
      })
    this.initReturnTable()
  }
}
