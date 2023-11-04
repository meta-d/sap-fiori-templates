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

export interface Chip {
    id: string;
    title: string;
    subTitle: string;
    navigationSemanticObject: string;
    navigationSemanticAction: string;
    navigationTargetUrl: string;
}