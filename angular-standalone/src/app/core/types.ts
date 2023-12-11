export enum MenuMode {
    top = 'top',
    side = 'side',
    mix = 'mix'
}

export enum ThemeType {
    dark = 'dark',
    default = 'default',
    light = 'light',
}

export const Ui5Path = 'ui5'

export interface AppGroup {
    id: string;
    title: string;
}

export interface Chip {
    id: string;
    title: string;
    subTitle: string;
    searchKeywords: string;
    navigationSemanticObject: string;
    navigationSemanticAction: string;
    navigationSemanticParameters: Record<string, string> | null
    navigationTargetUrl: string;
}


/*
 * 菜单
 * */
export interface Menu {
  id: number | string
  fatherId: number | string
  path: string
  menuName: string
  menuType: 'C' | 'F' // c:菜单，f按钮
  icon?: string // 如果showIcon为false，设置这个为搜索窗口时，最左侧的icon
  alIcon?: string // 如果showIcon为false，设置这个为搜索窗口时，最左侧的icon
  open?: boolean
  selected?: boolean // 是否选中
  children?: Menu[]
  code?: string // 权限码
  newLinkFlag?: 0 | 1 // 是否是新页
}