<template>
  <div :class="wrpCls">
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />

    <a-popover title="Title">
      <template #content>
        <p>
          <a-radio-group v-model:value="theme" button-style="solid" size="small" placement="bottomRight">
            <a-radio-button value="system">System</a-radio-button>
            <a-radio-button value="light">Light</a-radio-button>
            <a-radio-button value="dark">Dark</a-radio-button>
          </a-radio-group>
        </p>
        <p>Content</p>
      </template>

      <a-button type="primary" shape="circle" :icon="h(SettingOutlined)" />

    </a-popover>
  </div>
</template>
<script>
import { h } from 'vue';
import { ref, computed, onMounted } from 'vue'
import { SettingOutlined } from '@ant-design/icons-vue';
import AvatarDropdown from './AvatarDropdown.vue'
import { storeToRefs } from "pinia";
import { useAppStore } from '@/stores/app'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
  },
  props: {
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
  },
  setup(props) {
    const showMenu = ref(true)
    const currentUser = ref({})

    const { theme } = storeToRefs(useAppStore())

    const wrpCls = computed(() => {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(props.isMobile || !props.topMenu) ? 'light' : theme.value}`]: true
      }
    })

    onMounted(() => {
      setTimeout(() => {
        currentUser.value = {
          name: 'Serati Ma'
        }
      }, 1500)
    })

    return {
      showMenu,
      currentUser,
      theme,
      wrpCls,
      h,
      SettingOutlined
    }
  }
}
</script>