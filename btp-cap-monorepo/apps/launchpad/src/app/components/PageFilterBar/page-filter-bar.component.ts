import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output, effect, forwardRef, signal } from '@angular/core'
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { Filter, FilterOperator, ODataQueryOptions, ValueOfKey, isNil } from '@metad/cap-odata'
import { TranslateModule } from '@ngx-translate/core'
import { isEqual } from 'lodash'
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzSpinModule } from 'ng-zorro-antd/spin'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { FilterField, dependencyAlias, dependencyName, mapSelectionType2Operator } from './types'

type _FilterField = FilterField & {
  _dependencies?: Record<string, string[]>
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NzDescriptionsModule,
    NzSpinModule,
    NzSelectModule,
    NzDatePickerModule
  ],
  selector: 'zng-page-filter-bar',
  templateUrl: './page-filter-bar.component.html',
  styleUrl: './page-filter-bar.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => PageFilterBarComponent)
    }
  ]
})
export class PageFilterBarComponent implements ControlValueAccessor {
  @Input() get fields(): FilterField<any>[] {
    return this.#fields()
  }
  set fields(value) {
    this.initFormGroup(value)
    this.#fields.set(value)
  }

  #fields = signal<_FilterField[]>([])

  @Output() filtersChanging = new EventEmitter()

  formGroup = new FormGroup<Record<string, any>>({})

  _onChange?: (value: any) => void

  #formSub = this.formGroup.valueChanges.subscribe((value) => {
    this._onChange?.(value)
    this.filtersChanging.emit(this.getFilters())
  })

  writeValue(obj: any): void {
    if (obj) {
      this.formGroup.patchValue(obj)
    }
  }
  registerOnChange(fn: any): void {
    this._onChange = fn
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  initFormGroup(fields: FilterField[]) {
    Object.keys(this.formGroup.controls).forEach((key) => this.formGroup.removeControl(key))
    fields.forEach((field) => {
      const control = new FormControl(field.default ?? null)
      if (field.disabled) {
        control.disable()
      }
      if (field.required) {
        control.addValidators(Validators.required)
      }
      if (!field.valueHelpAsync && field.valueHelp) {
        this.loadValueHelp(field)
      }
      this.formGroup.registerControl(field.name, control)
    })
  }

  /**
   * Load options list when open select panel
   *
   * @param event
   * @param field
   */
  async onSelectOpen(event: boolean, field: _FilterField) {
    if (event && field.valueHelp) {
      await this.loadValueHelp(field)
    }
  }

  async loadValueHelp(field: _FilterField) {
    const dependencieValues = field.dependencies?.map((dependency) => ({
      name: dependencyName(dependency),
      value: this.getFieldValue(this.#fields().find((item) => item.name === dependencyName(dependency))!),
      alias: dependencyAlias(dependency)
    }))
    const dependenciesChanged = dependencieValues?.some(
      ({ name, value }) => !isEqual(value, field._dependencies?.[name] as any)
    )
    if (!field.loading && (!field.options || dependenciesChanged)) {
      this.updateField(field.name, { loading: true })
      const queryOptions: ODataQueryOptions = {
        // prerestriction
        $filter: dependencieValues
          ?.map(({ value, alias }) => ({
            path: alias,
            operator: FilterOperator.eq,
            value: value
          }))
          .filter((filter) => !isNil(filter.value)) as Filter[]
      }

      const results = await field.valueHelp!(queryOptions)
      this.updateField(field.name, {
        loading: false,
        options: results.map((item) => ({
          value: item[field.valueKey!],
          label: item[field.labelKey!]
        }))
      })
    }
  }

  updateField(name: string, field: Partial<FilterField>) {
    this.#fields.update((state) => {
      const index = state.findIndex((item) => item.name === name)
      if (index > -1) {
        state[index] = {
          ...state[index],
          ...field
        }

        return [...state]
      }
      return state
    })
  }

  isRequiredError(field: FilterField) {
    return !!this.formGroup.get(field.name)?.getError('required')
  }

  getFilters() {
    return this.#fields()
      .map((field) => this.getFilter4Field(field))
      .filter((filter) => !isNil(filter.value))
  }

  getFilter4Field(field: FilterField) {
    return {
      path: field.name,
      operator: mapSelectionType2Operator(field.selectionType),
      value: this.getFieldValue(field)
    }
  }

  getFieldValue(field: FilterField): ValueOfKey | ValueOfKey[] {
    const value = this.formGroup.getRawValue()?.[field.name] as ValueOfKey
    if (isNil(value)) return null
    return field.valueFormatter ? (Array.isArray(value) ? value.map(field.valueFormatter) : field.valueFormatter(<ValueOfKey>value)) : value
  }
}
