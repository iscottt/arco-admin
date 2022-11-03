import { useRouter } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';
import globalRouter from '@/router';

/**
 * 路由跳转
 * @param inSetup - 是否在vue页面/组件的setup里面调用，在axios里面无法使用useRouter和useRoute
 */
export function useRouterPush(inSetup = true) {
  const router = inSetup ? useRouter() : globalRouter;
  const route = globalRouter.currentRoute;

  /**
   * 路由跳转
   * @param to - 需要跳转的路由
   * @param newTab - 是否在新的浏览器Tab标签打开
   */
  function routerPush(to: RouteLocationRaw, newTab = false) {
    if (newTab) {
      const routerData = router.resolve(to);
      window.open(routerData.href, '_blank');
    } else {
      router.push(to);
    }
  }

  /** 返回上一级路由 */
  function routerBack() {
    router.go(-1);
  }

  /**
   * 跳转首页
   * @param newTab - 在新的浏览器标签打开
   */
  function toHome(newTab = false) {
    routerPush({ path: '/dashboard/workplace' }, newTab);
  }

  /**
   * 登录成功后跳转重定向的地址
   */
  function toLoginRedirect() {
    const { query, fullPath } = route.value;
    if (query?.redirect) {
      routerPush({ path: fullPath }, false);
    } else {
      toHome();
    }
  }

  return {
    routerPush,
    routerBack,
    toHome,
    toLoginRedirect,
  };
}
