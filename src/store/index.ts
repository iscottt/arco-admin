import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import { useRouteStore } from './modules/router';

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore, useRouteStore };
export default pinia;
