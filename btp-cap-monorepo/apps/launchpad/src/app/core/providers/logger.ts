import { environment } from '@/environments/environment'
import { EnvironmentProviders, importProvidersFrom } from '@angular/core'
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger'

export function provideLogger(): EnvironmentProviders {
  return importProvidersFrom(
    LoggerModule.forRoot({
      // serverLoggingUrl: '/api/logs',
      level: environment.production ? NgxLoggerLevel.WARN : NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR
    })
  )
}
