<template>
  <div :class="wrpCls">
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />

    <a-popover title="Title">
      <template #content>
        <p>
          <h5 :style="{color: token.colorTextBase}">Theme</h5>
          <a-radio-group v-model:value="themeName" button-style="solid" size="small" placement="bottomRight">
            <a-radio-button value="system">System</a-radio-button>
            <a-radio-button value="light">Light</a-radio-button>
            <a-radio-button value="dark">Dark</a-radio-button>
          </a-radio-group>
        </p>

        <p>
          <h5 :style="{color: token.colorTextBase}">Theme</h5>
          <a-radio-group v-model:value="layout" button-style="solid" size="small" placement="bottomRight">
            <a-radio-button value="top">Top</a-radio-button>
            <a-radio-button value="side">Side</a-radio-button>
            <a-radio-button value="mix">Mix</a-radio-button>
          </a-radio-group>
        </p>
        <p>Content</p>
      </template>

      <a-button type="primary" shape="circle" :icon="h(SettingOutlined)" />

    </a-popover>
  </div>
</template>
<script setup lang="ts">

import { h, watchEffect } from 'vue';
import { ref, computed, onMounted } from 'vue'
import { SettingOutlined } from '@ant-design/icons-vue';
import AvatarDropdown from './AvatarDropdown.vue'
import { storeToRefs } from "pinia";
import { useAppStore } from '@/stores/app'

import { Modal, theme } from 'ant-design-vue'
const { useToken } = theme;
const { token } = useToken();

const props = defineProps({
  prefixCls: {
    type: String,
    default: 'ant-pro-global-header-index-action'
  },
  isMobile: {
    type: Boolean,
    default: () => false
  },
  topMenu: {
    type: Boolean,
    required: true
  },
})

const showMenu = ref(true)
const currentUser = ref(null)

const appStore = useAppStore()
const { theme: themeName, layout } = storeToRefs(appStore)

const wrpCls = computed(() => {
  return {
    'ant-pro-global-header-index-right': true,
    [`ant-pro-global-header-index-${(props.isMobile || !props.topMenu) ? 'light' : themeName.value}`]: true
  }
})

watchEffect(async () => {
  const user = await appStore.currentUser();
  currentUser.value = {
    id: user.Id,
    name: user.Name
  }
});

</script>