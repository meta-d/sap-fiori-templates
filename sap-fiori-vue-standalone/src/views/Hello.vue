<template>
  <page-container>
    <a-card class="flex flex-col items-start gap-2 overflow-hidden">
      <a-button type="primary" @click="handleClick">Refresh Table</a-button>
      <a-table class="vsap-table max-w-full" :columns="columns" :data-source="data" :loading="loading" size="small"
        :scroll="{ x: 2000 }" :expand-column-width="100"></a-table>
    </a-card>
  </page-container>
</template>

<script lang="ts" setup>
import { useObservable } from '@vueuse/rxjs';
import { Button as AButton } from 'ant-design-vue';
import { filter, map } from 'rxjs';
import { ref } from 'vue';
import { usePurchaseOrderStore } from '../stores/index';

const { selectEntityType, read } = usePurchaseOrderStore

const data = ref([])
const loading = ref(false)

const columns = useObservable(selectEntityType('PurchaseOrder').pipe(
  filter((entityType) => entityType != null),
  map((entityType) => entityType.Property.map((property) => ({
    title: property['@']["sap:label"],
    dataIndex: property['@'].Name,
    key: property['@'].Name,
  })))
))

const handleClick = async () => {
  loading.value = true
  const response = await read('PurchaseOrder', null)
  const results = response.d.results
  data.value = results
  loading.value = false
};
</script>

<style scoped>
.vsap-welcome.ant-result {
  @apply bg-slate-50;
}
</style>

<style>
.vsap-welcome.ant-result .ant-result-title {
  @apply italic text-sm;
}

.ant-table-cell {
  @apply whitespace-nowrap;
}

.ant-card-body {
  @apply max-w-full;
}
</style>
