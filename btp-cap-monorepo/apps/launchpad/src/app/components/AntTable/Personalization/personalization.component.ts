import { ScreenLessHiddenDirective } from '@/app/core'
import { isNil } from '@/app/utils'
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop'
import { NgFor, NgStyle } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
  effect,
  forwardRef,
  input,
  signal
} from '@angular/core'
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { cloneDeep } from 'lodash-es'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'
import { NzDividerModule } from 'ng-zorro-antd/divider'
import { NzDropDownModule } from 'ng-zorro-antd/dropdown'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzTableSize } from 'ng-zorro-antd/table'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip'
import { TableColumn } from '../types'

interface TableSizeItem {
  value: NzTableSize
}

@Component({
  standalone: true,
  imports: [
    NgFor,
    NgStyle,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NzDividerModule,
    NzCheckboxModule,
    NzIconModule,
    NzDropDownModule,
    NzToolTipModule,
    ScreenLessHiddenDirective
  ],
  selector: 'zng-table-personalization',
  templateUrl: './personalization.component.html',
  styleUrl: './personalization.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ZngTablePersonalizationComponent)
    }
  ]
})
export class ZngTablePersonalizationComponent<T> {
  /**
   * 是否展示复选框
   */
  readonly showCheckbox = input.required<boolean, string | boolean>({ transform: booleanAttribute })
  readonly columns = input.required<TableColumn<T>[], TableColumn<T>[] | null | undefined>({
    transform: (value) => {
      this.tableColumns.set(
        [...(value ?? [])].map((column) => ({ ...column, show: isNil(column.show) || column.show }))
      )
      if (!this.copyHeader && value?.length) {
        this.copyHeader = cloneDeep(this.tableColumns())
      }
      return this.tableColumns()
    }
  })

  @Input() tableSize: NzTableSize | null = 'default'

  @Output() showCheckboxChange = new EventEmitter<boolean>()
  @Output() columnsChange = new EventEmitter<TableColumn<T>[]>()
  @Output() tableSizeChange = new EventEmitter<NzTableSize>()

  tableSizeOptions: TableSizeItem[] = [{ value: 'default' }, { value: 'middle' }, { value: 'small' }]

  /**
   * 设置里面全选列的半选状态
   */
  allTableFieldIndeterminate = false
  /**
   * 全选列
   */
  allTableFieldChecked = false

  copyHeader: TableColumn<T>[] | null = null // 缓存默认配置
  readonly tableColumns = signal<TableColumn<T>[]>([])

  constructor() {
    // 判断列展示这个checkbox的状态
    effect(() => {
      this.allTableFieldChecked = this.tableColumns().every((item) => item.show === true)
      const allUnChecked = this.tableColumns().every((item) => !item.show)
      this.allTableFieldIndeterminate = !this.allTableFieldChecked && !allUnChecked
    })
  }

  changeTableCheckBoxShow(e: boolean): void {
    this.showCheckboxChange.emit(e)
  }

  // 大中小表格密度
  tableSizeMenuClick(item: TableSizeItem): void {
    this.tableSize = item.value
    this.tableSizeChange.emit(this.tableSize!)
  }

  // 配置中tableCheckbox是否全选
  changeAllTableTableConfigShow(e: boolean): void {
    if (e) {
      this.allTableFieldChecked = e
      this.allTableFieldIndeterminate = false
    }
    this.tableColumns.update((columns) => columns.map((col) => ({ ...col, show: e })))
    this.tableChangeDectction()
  }

  // 重置
  reset(): void {
    this.tableColumns.set(this.copyHeader?.map((item) => ({ ...item })) ?? [])
    this.tableChangeDectction()
  }

  dropTableConfig(event: CdkDragDrop<string[]>): void {
    const columns = this.tableColumns()
    moveItemInArray(columns, event.previousIndex, event.currentIndex)
    this.tableColumns.set([...columns])
    this.tableChangeDectction()
  }

  // 某一列check变化
  changeSignalCheck(e: boolean, item: TableColumn<T>): void {
    item.show = e
    this.tableChangeDectction()
  }

  fixedTableHead(dir: 'right' | 'left', item: TableColumn<T>): void {
    if (item.freeze === dir) {
      item.freeze = null
    } else {
      item.freeze = dir
    }

    this.tableChangeDectction()
  }

  // 使子列表变更检测
  tableChangeDectction(): void {
    this.columnsChange.emit(this.tableColumns())
  }
}
