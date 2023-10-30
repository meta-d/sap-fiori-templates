import './styles.scss';

import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import ProLayout, { PageContainer } from "@ant-design-vue/pro-layout";
import 'ant-design-vue/dist/reset.css';
import "@ant-design-vue/pro-layout/dist/style.css"; // pro-layout css or style.less
// functional
import 'ant-design-vue/es/result/style';
import 'ant-design-vue/es/button/style';
import 'ant-design-vue/es/message/style';

import router from './router';
import App from './app/App.vue';
import icons from './app/icons';
import i18n from './locales';
import { createPinia } from 'pinia';

const app = createApp(App);

const pinia = createPinia()

app.use(router);
app.use(Antd).use(icons).use(i18n).use(pinia).use(ProLayout).use(PageContainer).mount('#root');
