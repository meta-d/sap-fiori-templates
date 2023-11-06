import { HttpClient } from '@angular/common/http'
import en from '@angular/common/locales/en'
import zh from '@angular/common/locales/zh'
import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { Observable, map } from 'rxjs'
import { registerLocaleData } from '@angular/common'
import { enUS, zhCN, zhHK } from 'date-fns/locale'

registerLocaleData(zh)
registerLocaleData(en)

class CustomTranslateHttpLoader extends TranslateHttpLoader {
  override getTranslation(lang: string): Observable<Record<string, any>> {
    return super.getTranslation(lang).pipe(
      map((t) => ({
        ...t,
      }))
    )
  }
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new CustomTranslateHttpLoader(http, `./assets/i18n/`, '.json')
}

export class ZngMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    return (<Record<string, any>>params.interpolateParams)?.['Default'] ?? params.key
  }
}

export function mapDateLocale(locale: string) {
  switch (locale) {
    case 'zh-CN':
    case 'zh-Hans':
    case 'zh':
      return zhCN
    case 'zh-Hant':
      return zhHK
    default:
      return enUS
  }
}

export function mapBrowserLanguage(lang: string) {
  switch (lang?.toLowerCase()) {
    case 'zh-cn':
    case 'zh-hans':
    case 'zh':
      return 'zh-Hans'
    case 'zh-hant':
    case 'zh-tw':
    case "zh-hk":
    case "zf":
      return 'zh-Hant'
    default:
      return lang
  }
}

export function toSAPLanguage(lang: string) {
  switch (lang) {
    case 'zh-Hans':
      return 'ZH'
    case 'zh-Hant':
      return 'ZF'
    default:
      return lang
  }
}