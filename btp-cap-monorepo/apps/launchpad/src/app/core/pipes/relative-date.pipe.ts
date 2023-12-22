import { LOCALE_ID, Pipe, PipeTransform, inject } from '@angular/core'
import { formatRelative, isDate } from 'date-fns'
import { mapDateLocale } from '../services/translate'

/*
 * Turn Date into realtive date (e.g. 5 days ago)
 * Usage:
 *   value | relativeDate
 * Example:
 *   {{ 86400 |  relativeDate}}
 *   formats to: '1 day ago'
 */
@Pipe({ name: 'relativeDate', standalone: true })
export class RelativeDatePipe implements PipeTransform {
  readonly #localeId = inject(LOCALE_ID)

  transform(input: number | string | Date, lang?: string): string {
    if (!isDate(input)) {
      input = new Date(input)
    }

    return formatRelative(input as Date, new Date(), {
      locale: mapDateLocale(lang ?? this.#localeId)
    })
  }
}
