import { InjectionToken, Signal } from '@angular/core'
import { NzMenuThemeType } from 'ng-zorro-antd/menu'
import { MenuMode, ThemeType } from '../core/types'

export const PersContainerId = 'zng.settings'
export enum WebGuiModeEnum {
  self = 'self',
  blank = 'blank',
  popup = 'popup'
}

export interface PersonalizationType {
  theme: ThemeType
  menuTheme: NzMenuThemeType
  menuMode: MenuMode
  primaryColor?: string
  fixedLayoutSider: boolean
  fixedLayoutHeader: boolean
  isShowTab: boolean
  fixedTab: boolean
  isOverMode: boolean
  hasTopArea: boolean // 是否展示顶部区域
  hasFooterArea: boolean // 是否展示底部区域
  hasNavArea: boolean // 是否有菜单
  hasNavHeadArea: boolean // 菜单是否有菜单头
  splitNav: boolean // 是否分割菜单

  /**
   * The mode of open WebGUI tech fiori app
   */
  webGuiMode: WebGuiModeEnum
}

export interface UserType {
  id: string
  name: string
}

export interface AppStoreState {
  personalization: {
    record?: PersContainer
    value: PersonalizationType
  }
  user?: UserType
}

export const DefaultPersonalization: PersonalizationType = {
  theme: ThemeType.default,
  menuTheme: 'dark',
  menuMode: MenuMode.side,
  fixedLayoutSider: true,
  fixedLayoutHeader: false,
  isShowTab: true,
  fixedTab: true,
  isOverMode: false,
  hasTopArea: true,
  hasFooterArea: true,
  hasNavArea: true,
  hasNavHeadArea: true,
  splitNav: true,
  webGuiMode: WebGuiModeEnum.blank
}

export interface IAppStore {
  user: Signal<UserType | undefined>
  personalization: Signal<PersonalizationType>

  currentUser(): Promise<UserType | undefined>
  refreshUser(): Promise<void>
  refreshPersonalization(): Promise<void>
  savePersonalization(): Promise<void>
  updatePersonalization(value: Partial<PersonalizationType>): void
}

export const APP_STORE_TOKEN: InjectionToken<IAppStore> = new InjectionToken<IAppStore>("Token for App Store Service");

export interface PersContainer {
  ID: string
  appId: string
  category: string
  appName: string
  value: any
}