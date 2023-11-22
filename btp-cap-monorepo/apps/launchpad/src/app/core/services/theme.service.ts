import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { NzMenuThemeType } from 'ng-zorro-antd/menu';
import { MenuMode, ThemeType } from '../types';
import { AppStoreService } from '@/app/stores';
import { NzConfigService } from 'ng-zorro-antd/core/config';

export interface ThemeState {
  fixedLayoutSider: boolean;
  fixedLayoutHeader: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private appStore = inject(AppStoreService)
  private nzConfigService = inject(NzConfigService)

  readonly personalization = this.appStore.personalization

  readonly currentTheme = computed(() => this.personalization().theme)
  readonly menuTheme = computed(() => this.personalization().menuTheme)
  readonly menuMode = computed(() => this.personalization().menuMode)
  readonly fixedLayoutSider = computed(() => this.personalization().fixedLayoutSider)
  readonly fixedLayoutHeader = computed(() => this.personalization().fixedLayoutHeader)
  readonly primaryColor = computed(() => this.personalization().primaryColor)

  constructor() {
    effect(() => {
      if (this.currentTheme()) {
        this.loadTheme(false)
      }
    })

    effect(() => {
      if (this.primaryColor()) {
        this.nzConfigService.set('theme', { primaryColor: this.primaryColor() })
      }
    })
  }

  private reverseTheme(theme: ThemeType | undefined): ThemeType {
    return theme === ThemeType.dark ? ThemeType.default : ThemeType.dark;
  }

  private removeUnusedTheme(theme: ThemeType): void {
    document.documentElement.classList.remove(theme);
    const removedThemeStyle = document.getElementById(theme);
    if (removedThemeStyle) {
      document.head.removeChild(removedThemeStyle);
    }
  }

  private loadCss(href: string, id: string): Promise<Event> {
    return new Promise((resolve, reject) => {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = href;
      style.id = id;
      style.onload = resolve;
      style.onerror = reject;
      document.head.append(style);
    });
  }

  public loadTheme(firstLoad = true): Promise<Event> {
    const theme = this.currentTheme() as string;
    if (firstLoad) {
      document.documentElement.classList.add(theme);
    }
    return new Promise<Event>((resolve, reject) => {
      this.loadCss(`${theme}.css`, theme).then(
        (e) => {
          if (!firstLoad) {
            document.documentElement.classList.add(theme);
          }
          this.removeUnusedTheme(this.reverseTheme(this.currentTheme()));
          resolve(e);
        },
        (e) => reject(e)
      );
    });
  }

  setTheme(theme?: ThemeType) {
    this.appStore.updatePersonalization({
      theme: theme ?? this.reverseTheme(this.currentTheme())
    })
  }

  setPrimaryColor(color?: string) {
    this.appStore.updatePersonalization({
      primaryColor: color
    })
  }

  updatePersonalization(value: any) {
    this.appStore.updatePersonalization(value)
  }
}