import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components';
import { setupRouter } from './router';
import store from './store';
import directive from './directive';
import './mock';
import App from './App.vue';
import '@arco-design/web-vue/dist/arco.css';
import '@/assets/style/global.less';
import 'virtual:windi.css';

const app = createApp(App);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

setupRouter(app);
app.use(store);
app.use(globalComponents);
app.use(directive);

app.mount('#app');
