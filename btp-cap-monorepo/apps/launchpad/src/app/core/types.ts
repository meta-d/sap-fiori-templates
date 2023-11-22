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
    navigationTargetUrl: string;
}