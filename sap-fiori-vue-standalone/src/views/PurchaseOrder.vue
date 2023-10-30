<template>
    <page-container>
        <a-card class="flex flex-col items-start gap-2 overflow-hidden">
            <div class="table-page-search-wrapper">
                <a-form layout="inline" :model="formState">
                    <a-row class="flex-1" :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="规则编号">
                                <a-input v-model:value="formState.id" placeholder="" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="使用状态">
                                <a-select v-model:value="formState.status" placeholder="请选择" default-value="0">
                                    <a-select-option value="0">全部</a-select-option>
                                    <a-select-option value="1">关闭</a-select-option>
                                    <a-select-option value="2">运行中</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="Supplier">
                                <a-select v-model:value="formState.supplier" placeholder="请选择">
                                    <a-select-option v-for="supplier in Suppliers" :key="supplier.Id" :value="supplier.Id">
                                        {{ supplier.Name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>

                        <template v-if="advanced">
                            <a-col :md="8" :sm="24">
                                <a-form-item label="调用次数">
                                    <a-input-number v-model:value="formState.callNo" style="width: 100%" />
                                </a-form-item>
                            </a-col>
                        </template>
                        <a-col :md="!advanced && 8 || 24" :sm="24">
                            <span class="table-page-search-submitButtons"
                                :style="advanced && { float: 'right', overflow: 'hidden' } || {}">
                                <a-button type="primary" @click="handleClick">查询</a-button>
                                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                                <a @click="toggleAdvanced" style="margin-left: 8px">
                                    {{ advanced ? '收起' : '展开' }}
                                    <a-icon :type="advanced ? 'up' : 'down'" />
                                </a>
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
            </div>

            <a-table class="vsap-table max-w-full" ref="table" :columns="columns" :data-source="data" :loading="loading"
                size="small" :scroll="{ x: 2000 }" :expand-column-width="100"></a-table>
        </a-card>
    </page-container>
</template>
  
<script lang="ts" setup>
import { useObservable } from '@vueuse/rxjs';
import { Button as AButton } from 'ant-design-vue';
import { filter, from, map } from 'rxjs';
import { reactive, ref } from 'vue';
import { usePurchaseOrderStore } from '../stores/index';
import { nonNullable } from '../utils/index';

const { store, select, selectEntityType, read } = usePurchaseOrderStore

const PurchaseOrderEntity = 'PurchaseOrder'
const PurchaseOrderEntitySet = 'PurchaseOrders'
const SupplierEntitySet = 'Suppliers'

const table = ref(null)
const data = ref([])
const loading = ref(false)

interface FormState {
    id: string
    status: string
    callNo: string
    supplier: string
}

const formState = reactive<FormState>({
    id: null,
    status: null,
    callNo: null,
    supplier: null,
});

const advanced = ref(false)

const columns = useObservable(selectEntityType(PurchaseOrderEntity).pipe(
    filter(nonNullable),
    map((entityType) => entityType.Property.map((property) => ({
        title: property['@']["sap:label"],
        dataIndex: property['@'].Name,
        key: property['@'].Name,
    })))
))

const Suppliers = useObservable(from(read(SupplierEntitySet, null)).pipe(
    map((response) => response.d.results)
))

const handleClick = async () => {
    loading.value = true
    const filters = Object.entries(formState).map(([key, value]) => [key, value]).filter(([, value]) => nonNullable(value)).reduce((acc, key) => {
            acc[key[0]] = key[1]
            return acc
        }, {})
    const response = await read(PurchaseOrderEntitySet, null, {
        $filter: filters
    })
    const results = response.d.results
    data.value = results
    loading.value = false
};

const toggleAdvanced = () => {
    advanced.value = !advanced.value
}

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
