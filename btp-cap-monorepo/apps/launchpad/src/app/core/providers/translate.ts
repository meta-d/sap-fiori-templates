import { HttpClient } from '@angular/common/http'
import { EnvironmentProviders, importProvidersFrom } from '@angular/core'
import { ZhHans, ZhHant } from '@metad/ocap-angular/i18n'
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { Observable, map } from 'rxjs'
import { LanguagesEnum } from '../config'
import { ZngMissingTranslationHandler } from '../services'

class CustomTranslateHttpLoader extends TranslateHttpLoader {
  override getTranslation(lang: string): Observable<any> {
    let ocapTranslates = {}
    switch (lang) {
      case LanguagesEnum.Chinese:
      case LanguagesEnum.SimplifiedChinese:
        ocapTranslates = {
          ...ZhHans
        }
        break
      case LanguagesEnum.TraditionalChinese:
        ocapTranslates = {
          ...ZhHant
        }
        break
      default:
    }
    return super.getTranslation(lang).pipe(
      map((t) => ({
        ...t,
        ...ocapTranslates
      }))
    )
  }
}

export function createTranslateLoader(http: HttpClient) {
  return new CustomTranslateHttpLoader(http, './assets/i18n/', '.json')
}

export function provideTranslate(): EnvironmentProviders {
  return importProvidersFrom(
    TranslateModule.forRoot({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: ZngMissingTranslationHandler
      },
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  )
}
