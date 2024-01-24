import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output, forwardRef, inject, signal } from '@angular/core'
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
import { flattenDeep, isEqual, uniq } from 'lodash-es'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzSpinModule } from 'ng-zorro-antd/spin'
import { FilterField, SelectionType, dependencyAlias, dependencyName, mapSelectionType2Operator } from './types'
import { ZngPasteDirective } from '@/app/core'
import { nonBlank } from '@/app/utils'

type _FilterField = FilterField & {
  _valueHelpLoaded?: boolean
  _dependencies?: Record<string, ValueOfKey | ValueOfKey[]>
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
    NzDatePickerModule,
    NzCheckboxModule,

    ZngPasteDirective
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
  SelectionType = SelectionType
  #message = inject(NzMessageService)

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

  get valid() {
    return this.formGroup.valid
  }
  get invalid() {
    return this.formGroup.invalid
  }

  _onChange?: (value: any) => void
  _onTouched?: (value: any) => void

  #formSub = this.formGroup.valueChanges.subscribe((value: any) => {
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
  registerOnTouched(fn: any): void {
    this._onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.formGroup.disable() : this.formGroup.enable()
  }

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

  /**
   * Load values for filter field, when dependency values changed or value help is not loaded.
   * 
   * @param field 
   */
  async loadValueHelp(field: _FilterField) {
    let dependencyRequired = false
    const dependencyValues = field.dependencies?.map((dependency) => {
      const value = this.getFieldValue(this.#fields().find((item) => item.name === dependencyName(dependency))!)
      if (value == null) {
        dependencyRequired = true
      }
      return {
        name: dependencyName(dependency),
        value: value,
        alias: dependencyAlias(dependency)
      }
    })

    // The required dependency is not fullfilled
    if (dependencyRequired) {
      return
    }

    const dependenciesChanged = dependencyValues?.some(
      ({ name, value }) => !isEqual(value, field._dependencies?.[name] as any)
    )
    if (!field.loading && (!field._valueHelpLoaded || dependenciesChanged)) {
      const dependencies = dependencyValues?.reduce((acc, {name, value}) => {
          acc[name] = value
          return acc
        }, {} as Record<string, ValueOfKey | ValueOfKey[]>)
      this.updateField(field.name, { loading: true, _dependencies: dependencies })
      const queryOptions: ODataQueryOptions = {
        // prerestriction
        $filter: dependencyValues
          ?.map(({ value, alias }) => ({
            path: alias,
            operator: FilterOperator.eq,
            value: value
          }))
          .filter((filter) => !isNil(filter.value)) as Filter[]
      }

      try {
        const results = await field.valueHelp!(queryOptions)
        this.updateField(field.name, {
          loading: false,
          options: results.map((item) => ({
            value: item[field.valueKey!],
            label: item[field.labelKey!]
          }))
        })

        this.updateField(field.name, { _valueHelpLoaded: true })
      } catch (err: any) {
        this.#message.error(err.error)
      }
    }
  }

  updateField(name: string, field: Partial<_FilterField>) {
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
    return field.valueFormatter
      ? Array.isArray(value)
        ? value.map(field.valueFormatter)
        : field.valueFormatter(<ValueOfKey>value)
      : value
  }

  onPaste(field: _FilterField, text: string) {
    const values = flattenDeep(text.split('\r').map((t) => t.split('\n').map((l) => l.split(' ')))).filter(nonBlank)
    const value = field.selectionType === SelectionType.multiple ? 
      uniq([...(this.formGroup.get(field.name)?.value ?? []), ...values])
      : values[0];
    
    this.formGroup.get(field.name)?.setValue(value)
  }
}
