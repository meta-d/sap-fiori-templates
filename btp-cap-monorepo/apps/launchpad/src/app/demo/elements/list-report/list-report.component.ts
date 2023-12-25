import { FilterField, PageFilterBarComponent, TableColumn } from '@/app/components'
import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Filter } from '@metad/cap-odata'
import { CategoryType, ProductType, helpProductCategory, queryProducts } from '../OData.svc'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzResizeEvent } from 'ng-zorro-antd/resizable'
import * as ExcelJS from 'exceljs'
import { omitSystemProperty } from '@/app/utils'

export type _ProductType = ProductType & {
  __key__: string
  __name__?: string
  __dirty__?: boolean
}

/**
 * List Report Floorplan
 */
@Component({
  selector: 'zng-demo-list-report',
  templateUrl: './list-report.component.html',
  styleUrls: ['./list-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ZngAntdModule, PageFilterBarComponent]
})
export class ListReportComponent {
  #message = inject(NzMessageService)

  // Common states
  loading = signal(false)
  saving = signal(false)
  dirty = signal(false)

  filterValues = null
  filters: Filter[] = []

  checked = false
  indeterminate = false
  selection = new Set<string>()

  filterFields: FilterField<CategoryType>[] = [
    {
      name: 'Name',
      label: 'Name',
      valueHelp: helpProductCategory,
      valueKey: 'ID',
      labelKey: 'Name'
    }
  ]

  defaultColumnWidth = '100px'
  tableColumns = signal<TableColumn<_ProductType>[]>([
    {
      name: 'ID',
      label: 'ID'
    },
    {
      name: 'Name',
      label: 'Name'
    },
    {
      name: 'Description',
      label: 'Description'
    },
    {
      name: 'ReleaseDate',
      label: 'Release Date'
    },
    {
      name: 'DiscontinuedDate',
      label: 'Discontinued Date'
    },
    {
      name: 'Rating',
      label: 'Rating'
    },
    {
      name: 'Price',
      label: 'Price'
    }
  ])

  items = signal<_ProductType[]>([])

  onFiltersChanging(filters: Filter[]) {
    this.filters = filters
  }

  async go() {
    this.loading.set(true)
    try {
      const items = await queryProducts()
      this.items.set(
        items.map((item) => ({
          ...item,
          __key__: item.ID
        }))
      )

      console.log(items)
    } catch (err: any) {
      console.log(err)
      this.#message.error(err.message)
    } finally {
      this.loading.set(false)
    }
  }

  // Selection rows
  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.selection.add(id)
    } else {
      this.selection.delete(id)
    }
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.items()
    this.checked = listOfEnabledData.every(({ __key__ }) => this.selection.has(__key__))
    this.indeterminate = listOfEnabledData.some(({ __key__ }) => this.selection.has(__key__)) && !this.checked
  }

  onAllChecked(checked: boolean): void {
    this.items().forEach(({ __key__ }) => this.updateCheckedSet(__key__, checked))
    this.refreshCheckedStatus()
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked)
    this.refreshCheckedStatus()
  }

  // Columns
  onResize({ width }: NzResizeEvent, col: string): void {
    this.tableColumns.update((state) => {
      const index = state.findIndex((column) => column.name === col)
      if (index > -1) {
        state[index] = {
          ...state[index],
          width: `${width ?? 60}px`
        }
      }

      return [...state]
    })
  }

  // Download data
  async export() {
    this.saving.set(true)
    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Define the columns in the worksheet based on the structure of your data
    worksheet.columns = this.tableColumns().map((col) => ({
      header: col.label, key: col.name, width: 20
    }))

    // Add data to the worksheet
    this.items().filter((item) => this.selection.has(item.__key__)).map(omitSystemProperty).forEach((item) => {
      worksheet.addRow(item);
    });

    // Save the workbook to a blob
    const blob = await workbook.xlsx.writeBuffer();

    const fileName = 'product-list-report'
    this.saveAsFile(blob, fileName)
    // // Save the blob as an Excel file using FileSaver.js
    // FileSaver.saveAs(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fileName+'.xlsx');

    this.saving.set(false)
  }

  saveAsFile(blob: ExcelJS.Buffer, fileName: string) {
    // Create a Blob URL
    const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = fileName + '.xlsx';

    // Append the link to the document
    document.body.appendChild(downloadLink);

    // Trigger the download
    downloadLink.click();

    // Clean up: remove the link and revoke the Blob URL
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(blobUrl);
  }
}
