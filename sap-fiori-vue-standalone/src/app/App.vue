<script setup lang="ts">
import { RouterView } from 'vue-router';
import { ConfigProvider, theme } from 'ant-design-vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { computed, provide } from 'vue';
import { useAppStore } from '@/stores/app';

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

provide(THEME_KEY, 'dark');

const appStore = useAppStore();
const themeAlgorithm = computed(() => {
  switch(appStore.theme) {
    case 'light':
      return theme.defaultAlgorithm
    case 'dark':
      return theme.darkAlgorithm;
    // case 'realDark':
    //   return theme.darkAlgorithm;
    default:
      return theme.defaultAlgorithm;
  }
});

const getPopupContainer = (triggerNode?: HTMLElement): HTMLElement => {
  // if (dialogContext) {
  //   return dialogContext.getDialogWrap()
  // }
  if (triggerNode) {
    return (triggerNode?.parentNode as HTMLElement) || document.body;
  }
  return document.body;
};
</script>

<template>
  <ConfigProvider :get-popup-container="getPopupContainer"
    :theme="{
      algorithm: themeAlgorithm,
      token: {
        colorPrimary: '#00b96b',
      }
    }">
    <RouterView />
  </ConfigProvider>
</template>

<style>
#app {
  height: 100%;
}
</style>
