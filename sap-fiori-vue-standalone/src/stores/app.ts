import { defineStore } from 'pinia';

export const useAppStore = defineStore('application', {
  state: () => {
    return {
      sideCollapsed: false,
      isMobile: false,
      theme: 'system',
      layout: '',
      contentWidth: '',
      fixedHeader: false,
      fixedSidebar: false,
      autoHideHeader: false,
      color: '',
      weak: false,
      multiTab: true,
      lang: 'en-US',
    };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    increment() {},
  },
});
