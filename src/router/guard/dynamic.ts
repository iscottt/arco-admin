import type {
  Router,
  RouteLocationNormalized,
  NavigationGuardNext,
} from 'vue-router';
import { useRouteStore } from '@/store';
import { getToken } from '@/utils/auth';
import { NOT_FOUND_ROUTE } from '../routes/base';
import { WHITE_LIST } from '../constants';

/**
 * 动态路由
 */
export async function createDynamicRouteGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
  router: Router
) {
  const route = useRouteStore();
  const isLogin = Boolean(getToken());
  if (isLogin) {
    if (to.name === 'login') {
      next('/dashboard/workplace');
    } else {
      if (WHITE_LIST.indexOf(to.name as string) > -1) {
        next();
      }
      const hasRoute = router.hasRoute(to.name!);
      if (!route.isAddedDynamicRoute) {
        await route.initDynamicRoute(router);
        router.addRoute(NOT_FOUND_ROUTE);
        if (!hasRoute) {
          // 如果该路由不存在，可能是动态注册的路由，它还没准备好，需要再重定向一次到该路由
          next({ ...to, replace: true });
        } else {
          next({ ...to, replace: true });
        }
      } else {
        // 动态路由已经加载，仍然未找到，重定向到not-found
        if (to.name === 'not-found-page') {
          next({ name: 'not-found-page', replace: true });
        }
        next();
      }
    }
  } else {
    if (to.name === 'login') {
      next();
    } else {
      next({ name: 'login', query: { redirect: to.fullPath }, replace: true });
    }
  }
}
