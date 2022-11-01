import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';

import { useUserStore } from '@/store';

export function useUser() {
  const router = useRouter();
  const userStore = useUserStore();
  const logout = async (logoutTo?: string) => {
    await userStore.logout();
    const currentRoute = router.currentRoute.value;
    Message.success('登出成功');
    router.replace({
      name: logoutTo && typeof logoutTo === 'string' ? logoutTo : 'login',
      query: {
        ...router.currentRoute.value.query,
        redirect: currentRoute.fullPath as string,
      },
    });
  };
  return {
    logout,
  };
}
