import { Injectable, computed, signal } from '@angular/core';
import { NzMenuThemeType } from 'ng-zorro-antd/menu';
import { MenuMode, ThemeType } from '../types';

export interface ThemeState {
  fixedLayoutSider: boolean;
  fixedLayoutHeader: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentTheme = ThemeType.default;
  readonly menuTheme = signal<NzMenuThemeType>(ThemeType.dark)
  readonly menuMode = signal<MenuMode>(MenuMode.side)
  readonly themeOptions = signal<ThemeState>({
    fixedLayoutSider: true,
    fixedLayoutHeader: false
  })
  readonly fixedLayoutSider = computed(() => this.themeOptions().fixedLayoutSider)
  readonly fixedLayoutHeader = computed(() => this.themeOptions().fixedLayoutHeader)

  private reverseTheme(theme: string): ThemeType {
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
    const theme = this.currentTheme;
    if (firstLoad) {
      document.documentElement.classList.add(theme);
    }
    return new Promise<Event>((resolve, reject) => {
      this.loadCss(`${theme}.css`, theme).then(
        (e) => {
          if (!firstLoad) {
            document.documentElement.classList.add(theme);
          }
          this.removeUnusedTheme(this.reverseTheme(theme));
          resolve(e);
        },
        (e) => reject(e)
      );
    });
  }

  public toggleTheme(theme?: ThemeType): Promise<Event> {
    this.currentTheme = theme ?? this.reverseTheme(this.currentTheme);
    return this.loadTheme(false);
  }
}