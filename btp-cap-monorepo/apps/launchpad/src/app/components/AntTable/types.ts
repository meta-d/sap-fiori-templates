import { TemplateRef } from '@angular/core'
import { NzSafeAny } from 'ng-zorro-antd/core/types'
import { NzTableFilterFn, NzTableFilterList, NzTableSize, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table'

export type TableColumn<T> = {
  name: keyof T
  label: string
  width?: string
  freeze?: 'left' | 'right' | boolean | null
  align?: 'left' | 'right' | 'center' | null
  valueFormatter?: (value: any) => string
  show?: boolean | null

  // Sort
  showSort?: boolean
  sortOrder?: NzTableSortOrder
  compare?: boolean | NzTableSortFn<T> | null
  priority?: number | boolean
  sortDirections?: NzTableSortOrder[]

  // Filter
  filters?: NzTableFilterList | null
  filterFn?: NzTableFilterFn<T> | null
}


export interface TableHeader {
  title: string; // 表头名称
  field?: string; // 字段
  pipe?: string; // 管道
  showSort?: boolean; // 是否显示排序
  sortDir?: undefined | 'asc' | 'desc'; // 排序方向
  width?: number; // 单元格宽度
  thTemplate?: TemplateRef<NzSafeAny>; // th单元格模板
  tdTemplate?: TemplateRef<NzSafeAny>; // td单元格模板
  fixed?: boolean; // 是否固定单元格 （只有从最左边或最右边连续固定才有效）
  fixedDir?: 'left' | 'right'; // 固定在左边还是右边，需要配合fixed来使用
  notNeedEllipsis?: boolean; // 不需要...时给true
  tdClassList?: string[]; // 为td单元格指定类 (父组件中的类必须加上 /deep/ 前缀才能对子组件生效)
  thClassList?: string[]; // 为th单元格指定类  (父组件中的类必须加上 /deep/ 前缀才能对子组件生效)
  show?: boolean; // 是否显示列，false:不显示，其他：显示
  tdClassFn?: (data: any, index: number) => string[];
  thClassFn?: (data: any) => string[];
}

export interface AntTableConfig {
  needNoScroll?: boolean; //列表是否需要滚动条
  xScroll?: number; //列表横向滚动条
  yScroll?: number; //列表纵向滚动条
  virtualItemSize?: number; //虚拟滚动时每一列的高度，与 cdk itemSize 相同
  showCheckbox?: boolean; // 如果需要checkBox,则需要showCheckbox=true,并且使用app-ant-table组件时传入 [checkedCashArrayFromComment]="cashArray"，cashArray为业务组件中自己定义的数组，并且需要table中的data都有一个id属性
  pageIndex: number; // 当前页码，（与页面中页码双向绑定）
  pageSize: number; // 每一页显示的数据条数（与页面中pageSize双向绑定）
  total: number; // 数据总量，用于计算分页（应该从后端接口中获得）
  loading: boolean; // 是否显示表格加载中
  headers: TableHeader[]; // 列设置
}

export abstract class AntTableComponentToken {
  tableSize!: NzTableSize;
  tableConfig!: AntTableConfig;

  abstract tableChangeDectction(): void;
}

export interface SortFile {
  fileName: string;
  sortDir: undefined | 'desc' | 'asc';
}