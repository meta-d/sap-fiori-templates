import { defineStore } from 'pinia';
import { useESHSearchStore } from './ESH_SEARCH'


export const useAppStore = defineStore('application', {
  state: () => {
    return {
      sideCollapsed: false,
      isMobile: false,
      theme: 'system',
      layout: 'mix',
      contentWidth: '',
      fixedHeader: false,
      fixedSidebar: false,
      autoHideHeader: false,
      color: '',
      weak: false,
      multiTab: true,
      lang: 'en-US',
      user: null
    } as AppStore
  },
  // could also be defined as
  actions: {
    async currentUser() {
      if (!this.user) {
        const { read } = useESHSearchStore
        this.user = await read('Users', 'current').then((result) => {
          return result.d
        })
      }

      return this.user
    },
  },
});

export interface AppStore {
  sideCollapsed: boolean;
  isMobile: boolean;
  theme: 'system' | 'light' | 'dark';
  layout: 'mix' | 'top' | 'side';
  contentWidth: '',
  fixedHeader: boolean;
  fixedSidebar: boolean;
  autoHideHeader: boolean;
  color: string;
  weak: boolean;
  multiTab: boolean;
  lang: string;
  user: {
    id: string;
    name: string;
  }
}