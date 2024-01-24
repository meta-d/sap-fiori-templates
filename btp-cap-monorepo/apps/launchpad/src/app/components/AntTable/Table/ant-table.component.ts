import { MapPipe, TableFiledPipe } from '@/app/core';
import { NgIf, NgFor, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzResizeEvent, NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzTableQueryParams, NzTableSize, NzTableModule } from 'ng-zorro-antd/table';
import { AntTableComponentToken, AntTableConfig, SortFile, TableHeader } from '../types';


@Component({
  selector: 'zng-ant-table',
  templateUrl: './ant-table.component.html',
  styleUrls: ['./ant-table.component.less'],
  providers: [{ provide: AntTableComponentToken, useExisting: AntTableComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzTableModule, NgIf, NgFor, NzResizableModule, NgClass, NgTemplateOutlet, MapPipe, TableFiledPipe]
})
export class AntTableComponent implements OnChanges {
  _dataList!: NzSafeAny[];
  _tableConfig!: AntTableConfig;
  _scrollConfig: { x: string; y: string } | {} = {};
  // 从业务组件中传入的缓存的已经选中的checkbox数据数组
  @Input() checkedCashArrayFromComment: NzSafeAny[] = [];

  @Input()
  set tableData(value: NzSafeAny[]) {
    this._dataList = value;
    if (this.tableConfig.showCheckbox) {
      this._dataList.forEach(item => {
        item['_checked'] = false;
      });
    }
  }

  get tableData(): NzSafeAny[] {
    return this._dataList;
  }

  _tableSize: NzTableSize = 'default';
  set tableSize(value: NzTableSize) {
    this._tableSize = value;
    this.tableChangeDectction();
  }

  get tableSize(): NzTableSize {
    return this._tableSize;
  }

  @Input()
  set tableConfig(value: AntTableConfig) {
    this._tableConfig = value;
    this.setScrollConfig(value);
  }

  get tableConfig(): AntTableConfig {
    return this._tableConfig;
  }

  @Output() readonly changePageNum = new EventEmitter<NzTableQueryParams>();
  @Output() readonly changePageSize = new EventEmitter<number>();
  @Output() readonly selectedChange: EventEmitter<NzSafeAny[]> = new EventEmitter<NzSafeAny[]>();
  @Output() readonly sortFn: EventEmitter<SortFile> = new EventEmitter<SortFile>();
  indeterminate: boolean = false;
  allChecked: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  setScrollConfig(value: AntTableConfig): void {
    if (value && !value.needNoScroll) {
      // 默认x：100
      this._scrollConfig = { x: '100px' };
      let tempX = {};
      if (value.xScroll !== undefined) {
        tempX = { x: `${value.xScroll}px` };
      }
      let tempY = {};
      if (value.yScroll !== undefined) {
        tempY = { y: `${value.yScroll}px` };
      }
      this._scrollConfig = { ...this._scrollConfig, ...tempX, ...tempY };
    } else {
      this._scrollConfig = {};
    }
  }

  changeSort(tableHeader: TableHeader): void {
    this.tableConfig.headers.forEach(item => {
      if (item.field !== tableHeader.field) {
        item.sortDir = undefined;
      }
    });
    const sortDicArray: [undefined, 'asc', 'desc'] = [undefined, 'asc', 'desc'];
    const index = sortDicArray.findIndex(item => item === tableHeader.sortDir);
    tableHeader.sortDir = index === sortDicArray.length - 1 ? sortDicArray[0] : sortDicArray[index + 1];
    this.sortFn.emit({ fileName: tableHeader.field!, sortDir: tableHeader.sortDir });
  }

  tableChangeDectction(): void {
    // 改变引用触发变更检测。
    this._dataList = [...this._dataList];
    this.cdr.markForCheck();
  }

  trackById(_: number, data: { id: number }): number {
    return data.id;
  }

  public trackByTableHead(index: number, item: NzSafeAny): NzSafeAny {
    return item;
  }

  public trackByTableBody(index: number, item: NzSafeAny): NzSafeAny {
    return item;
  }

  // 分页页码改变
  onQueryParamsChange(tableQueryParams: NzTableQueryParams): void {
    this.changePageNum.emit(tableQueryParams);
  }

  // 修改一页几条的页码
  onPageSizeChange($event: NzSafeAny): void {
    this.changePageSize.emit($event);
  }

  onResize({ width }: NzResizeEvent, col: string): void {
    this.tableConfig.headers = this.tableConfig.headers.map(e =>
      e.title === col
        ? {
            ...e,
            width: +`${width}`
          }
        : e
    ) as TableHeader[];
  }

  checkFn(dataItem: NzSafeAny, isChecked: boolean): void {
    dataItem['_checked'] = isChecked;
    const index = this.checkedCashArrayFromComment.findIndex(cashItem => cashItem.id === dataItem.id);
    if (isChecked) {
      if (index === -1) {
        this.checkedCashArrayFromComment.push(dataItem);
      }
    } else {
      if (index !== -1) {
        this.checkedCashArrayFromComment.splice(index, 1);
      }
    }
  }

  // 单选
  public checkRowSingle(isChecked: boolean, selectIndex: number): void {
    this.checkFn(this._dataList[selectIndex], isChecked);
    this.selectedChange.emit(this.checkedCashArrayFromComment);
    this.refreshStatus();
  }

  // 全选
  onAllChecked(isChecked: boolean): void {
    this._dataList.forEach(item => {
      this.checkFn(item, isChecked);
    });
    this.selectedChange.emit(this.checkedCashArrayFromComment);
    this.refreshStatus();
  }

  // 刷新复选框状态
  refreshStatus(): void {
    this._dataList.forEach(item => {
      const index = this.checkedCashArrayFromComment.findIndex(cashItem => {
        return item.id === cashItem.id;
      });
      item['_checked'] = index !== -1;
    });
    const allChecked =
      this._dataList.length > 0 &&
      this._dataList.every(item => {
        return item['_checked'] === true;
      });
    const allUnChecked = this._dataList.every(item => item['_checked'] !== true);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checkedCashArrayFromComment']) {
      this.refreshStatus();
    }
  }
}
