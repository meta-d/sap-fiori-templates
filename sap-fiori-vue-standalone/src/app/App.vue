<script setup lang="ts">
import { RouterView } from 'vue-router';
import { ConfigProvider } from 'ant-design-vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { provide } from 'vue';

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

provide(THEME_KEY, 'dark');

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
  <ConfigProvider :get-popup-container="getPopupContainer">
    <RouterView />
  </ConfigProvider>
</template>

<style>
#app {
  height: 100%;
}
</style>
