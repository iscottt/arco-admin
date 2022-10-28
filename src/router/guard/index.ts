import type { Router } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { createDynamicRouteGuard } from './dynamic';
import NProgress from 'nprogress'; // progress bar
import { setRouteEmitter } from '@/utils/route-listener';
NProgress.configure({
  showSpinner: false,
});

/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export function createRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // 开始 loadingBar
    NProgress.start();
    setRouteEmitter(to);
    // 页面跳转权限处理
    await createDynamicRouteGuard(to, from, next, router);
  });
  router.afterEach((to) => {
    // 设置document title
    useTitle(to.meta.title as string);
    // 结束 loadingBar
    NProgress.done();
  });
}
