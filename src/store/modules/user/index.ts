import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  LoginData,
} from '@/api/user';
import {
  setToken,
  removeToken,
  getToken,
  getUserInfo,
  setUserInfo,
} from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';
import { useRouterPush } from '@/composables';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: getUserInfo(),
    token: getToken(),
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    // Set user's information
    setInfo(userInfo: Auth.UserInfo) {
      setUserInfo(userInfo);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Login
    async login(loginForm: LoginData) {
      const { toLoginRedirect } = useRouterPush(false);
      try {
        const res: any = await userLogin(loginForm);
        setToken(res.token);
        this.setInfo(res.data);
        toLoginRedirect();
      } catch (err) {
        removeToken();
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      removeToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
