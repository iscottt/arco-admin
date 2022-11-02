import { defineStore } from 'pinia';
import { login as userLogin, LoginData } from '@/api/user';
import {
  setToken,
  removeToken,
  getToken,
  getUserInfo,
  setUserInfo,
  removeUserInfo,
} from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import { useRouterPush } from '@/composables';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: getUserInfo(),
    token: getToken(),
  }),

  actions: {
    // Set user's information
    setInfo(userInfo: Auth.UserInfo) {
      this.userInfo = userInfo;
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
        removeUserInfo();
        return Promise.reject(err);
      }
    },
    logoutCallBack() {
      removeUserInfo();
      this.resetInfo();
      removeToken();
      removeRouteListener();
      location.reload();
    },
    // Logout
    async logout() {
      this.logoutCallBack();
    },
  },
});

export default useUserStore;
