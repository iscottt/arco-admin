import type { Router, RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { getUserInfo as fetchUserInfo } from '@/api/user';
import { getUserInfo } from '@/utils/auth';
import { getViewComponent } from './component';
import { DEFAULT_LAYOUT } from '@/router/routes/base';

interface RouteState {
  /** 是否添加过动态路由 */
  isAddedDynamicRoute: boolean;
  /** 菜单 */
  menus: any[];
  /** 缓存的路由名称 */
  cacheRoutes: string[];
}

export const useRouteStore = defineStore('route-store', {
  state: (): RouteState => ({
    isAddedDynamicRoute: false,
    menus: [],
    cacheRoutes: [],
  }),
  actions: {
    /**
     * 初始化动态路由
     * @param router - 路由实例
     */
    async initDynamicRoute(router: Router) {
      const { operatorId } = getUserInfo();
      if (!operatorId) return;
      const { data } = await fetchUserInfo(operatorId);
      if (data) {
        const vueRoutes = transformAuthRoutesToVueRoutes(data.funcList);
        this.menus = transformAuthRouteToMenu(data.funcList);
        vueRoutes.forEach((route) => {
          router.addRoute(route);
        });
        this.isAddedDynamicRoute = true;
      }
    },
  },
});

const transformAuthRoutesToVueRoutes = (routes: AuthRoute.Route[]) => {
  return routes.map((route) => transformAuthRouteToVueRoute(route)).flat(1);
};

const transformAuthRouteToVueRoute = (item: any) => {
  const resultRoute: RouteRecordRaw[] = [];
  const itemRoute: any = {
    path: item.funcUrl,
    name: item.funcUrl.replace('/', '').replace(new RegExp('/', 'g'), '_'),
    meta: {
      locale: item.funcName,
      icon: 'icon-dashboard',
      order: item.sortId,
    },
    children: item.children,
  };
  const layout = DEFAULT_LAYOUT;
  itemRoute.component =
    item.parentId == 0
      ? layout
      : getViewComponent(itemRoute.name || 'not-found-page');
  // 注意：单独路由没有children
  if (!item.children) {
    // 捕获无效路由的需特殊处理
    if (item.funcUrl === '/not-found-page') {
      itemRoute.children = [
        {
          path: '',
          name: item.funcUrl
            .replace('/', '')
            .replace(new RegExp('/', 'g'), '_'),
          component: getViewComponent('not-found-page'),
        },
      ];
    } else {
      const parentPath = `${itemRoute.path}` as AuthRoute.SingleRouteParentPath;
      const parentRoute: any = {
        path: parentPath,
        // component: layout,
        component:
          item.parentId == 0 ? layout : getViewComponent(itemRoute.name),
        name: item.funcUrl.replace('/', '').replace(new RegExp('/', 'g'), '_'),
        meta: {
          locale: item.funcName,
          icon: 'icon-dashboard',
          order: item.sortId,
        },
      };
      return [parentRoute];
    }
  }

  // 子路由
  if (item.children) {
    const children = (item.children as AuthRoute.Route[])
      .map((child) => transformAuthRouteToVueRoute(child))
      .flat();
    // 找出第一个不为多级路由中间级的子路由路径作为重定向路径
    const redirectPath: AuthRoute.RoutePath = (children.find(
      (v) => !v.meta?.multi
    )?.path || '/') as AuthRoute.RoutePath;
    if (redirectPath === '/') {
      console.error('该多级路由没有有效的子路径', item);
    }
    itemRoute.children = children;
    itemRoute.redirect = redirectPath;
  }
  resultRoute.push(itemRoute);
  return resultRoute;
};

/**
 * 将权限路由转换成菜单
 * @param routes - 路由
 */
const transformAuthRouteToMenu = (routes: any[]): any[] => {
  const globalMenu: any[] = [];
  routes.forEach((route) => {
    const routeName = route.funcUrl
      .replace('/', '')
      .replace(new RegExp('/', 'g'), '_');
    let menuChildren: any[] | undefined;
    if (route.children) {
      menuChildren = transformAuthRouteToMenu(route.children);
    }
    const menuItem: any = addPartialProps(
      {
        name: routeName,
        path: route.funcUrl,
        meta: {
          locale: route.funcName,
          icon: 'icon-dashboard',
          order: route.sortId,
        },
      },
      route.iconUrl,
      menuChildren
    );
    // if (!route.hideInMenu) {
    globalMenu.push(menuItem);
    // }
  });

  return globalMenu;
};
/** 给菜单添加可选属性 */
function addPartialProps(menuItem: any, icon?: string, children?: any[]) {
  const item = { ...menuItem };
  if (icon) {
    Object.assign(item, { icon });
  }
  if (children) {
    Object.assign(item, { children });
  }
  return item;
}
