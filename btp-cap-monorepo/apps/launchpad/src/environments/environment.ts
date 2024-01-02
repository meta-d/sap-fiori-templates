import { IEnvironment } from './types'

export const environment: IEnvironment = {
  production: true,
  platform: 'BTP',
  enableFiori: false,
  enableNotification: false,
  enableWaterMark: true,
  mockData: false,
  embeddedAnalytics: false,
  enableDemo: false,
  copilot: {
    enabled: false,
    chatUrl: ''
  }
}
