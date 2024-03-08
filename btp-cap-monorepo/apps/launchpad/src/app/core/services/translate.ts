import { registerLocaleData } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import en from '@angular/common/locales/en'
import zh from '@angular/common/locales/zh'
import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { enUS, zhCN, zhHK } from 'date-fns/locale'
import { en_US, ja_JP, zh_CN, zh_TW } from 'ng-zorro-antd/i18n'
import { Observable, map } from 'rxjs'
import { LanguageEnum } from '../types'

registerLocaleData(zh)
registerLocaleData(en)

class CustomTranslateHttpLoader extends TranslateHttpLoader {
  override getTranslation(lang: string): Observable<Record<string, any>> {
    return super.getTranslation(lang).pipe(
      map((t) => ({
        ...t
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
  lang = lang?.toLowerCase()
  switch (lang) {
    case 'zh-cn':
    case 'zh-hans':
    case 'zh':
      return LanguageEnum.SimplifiedChinese
    case 'zh-hant':
    case 'zh-tw':
    case 'zh-hk':
    case 'zf':
      return LanguageEnum.TraditionalChinese
    default:
      return lang as LanguageEnum
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

export function mapLanguageNzLocale(lang: LanguageEnum) {
  switch (lang) {
    case LanguageEnum.SimplifiedChinese:
    case LanguageEnum.Chinese:
      return zh_CN
    case LanguageEnum.TraditionalChinese:
      return zh_TW
    case LanguageEnum.Japanese:
      return ja_JP
    default:
      return en_US
  }
}
