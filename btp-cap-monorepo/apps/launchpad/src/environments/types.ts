export type IEnvironment = {
  /**
   * 是否为生产环境
   */
  production: boolean
  /**
   * 此 Web 应用所适用的服务器平台
   */
  platform: 'S4' | 'BTP' | 'LOCAL'
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
}
