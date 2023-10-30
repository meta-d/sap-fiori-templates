<template>
  <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
    <span class="ant-pro-account-avatar p-2 cursor-pointer">
      <a-avatar size="small" src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
        class="antd-pro-global-header-index-avatar" />
      <span>{{ currentUser.name }}</span>
    </span>

    <template #overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]" >
        <a-menu-item v-if="menu" key="center" @click="handleToCenter" class="flex items-center">
          <div class="flex items-center gap-2">
            <UserOutlined :style="{color: token.colorTextBase}"/>
            {{ $t('menu.account.center') }}
          </div>
        </a-menu-item>
        <a-menu-item v-if="menu" key="settings" @click="handleToSettings" class="flex items-center">
          <div class="flex items-center gap-2">
            <SettingOutlined :style="{color: token.colorTextBase}"/>
            {{ $t('menu.account.settings') }}
          </div>
        </a-menu-item>
        <a-menu-divider v-if="menu" />
        <a-menu-item key="logout" @click="handleLogout">
          <div class="flex items-center gap-2">
            <LogoutOutlined :style="{color: token.colorTextBase}"/>
            {{ $t('menu.account.logout') }}
          </div>
        </a-menu-item>
      </a-menu>
    </template>

  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script setup lang="ts">
import { Modal, theme } from 'ant-design-vue'
const { useToken } = theme;
const { token } = useToken();

defineProps<{
  currentUser: {
    id: string;
    name: string;
  },
  menu: boolean;
}>()

function handleToCenter() {
  // this.$router.push({ path: '/account/center' })
}
function handleToSettings() {
  // this.$router.push({ path: '/account/settings' })
}
function handleLogout(e) {
  Modal.confirm({
    title: this.$t('layouts.usermenu.dialog.title'),
    content: this.$t('layouts.usermenu.dialog.content'),
    onOk: () => {
      // return new Promise((resolve, reject) => {
      //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
      // }).catch(() => console.log('Oops errors!'))
      return this.$store.dispatch('Logout').then(() => {
        this.$router.push({ name: 'login' })
      })
    },
    onCancel() { }
  })
}
</script>

<style scoped>
.ant-pro-drop-down {}
</style>