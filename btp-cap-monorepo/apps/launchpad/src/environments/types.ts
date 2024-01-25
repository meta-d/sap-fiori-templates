import { ICopilot } from "@metad/copilot"

export type IEnvironment = {
  /**
   * 是否为生产环境
   */
  production: boolean
  /**
   * 此 Web 应用所适用的服务器平台
   */
  platform: 'S4H' | 'BTP' | 'LOCAL'
  /**
   * 启用兼容 S4 系统 Fiori Apps 功能
   */
  enableFiori: boolean
  /**
   * 启用通知服务
   */
  enableNotification: boolean
  /**
   * 启用水印
   */
  enableWaterMark: boolean
  /**
   * 启用模拟数据
   */
  mockData: boolean
  /**
   * Enable Embedded Analytics Module
   */
  embeddedAnalytics: boolean
  /**
   * Enable Demo Module
   */
  enableDemo: boolean

  /**
   * AI Copilot config
   */
  copilot?: ICopilot
}
