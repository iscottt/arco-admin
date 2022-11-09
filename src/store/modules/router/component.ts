import NOT_FOUND_PAGE from '@/views/not-found-page/index.vue';
import { views } from '@/views';
console.log('views', views);
/**
 * 获取页面导入的vue文件(懒加载的方式)
 * @param routeKey - 路由key
 */
export function getViewComponent(routeKey: string) {
  return () => setViewComponentName(views[routeKey], routeKey) as Promise<any>;
}

/** 给页面组件设置名称 */
async function setViewComponentName(
  asyncComponent: () => Promise<any>,
  name: string
) {
  try {
    console.log('component', asyncComponent());
    const component = await asyncComponent();
    Object.assign(component.default, { name });
    return component;
  } catch (error) {
    return NOT_FOUND_PAGE;
  }
}
