// 100004
import { http } from './httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getRuleMgrPage(data) {
  return http.request({
    url: '/fee/ruleMgr/list',
    data,
    method: 'POST',
  });
}
/**
 * 修改状态
 * @param data
 * @returns
 */
export function switchRuleStatus(data) {
  return http.request({
    url: '/fee/ruleMgr/switchStatus',
    method: 'POST',
    data,
  });
}
export const getControlMenu = () => {
  return http.request({
    url: '/fee/rule/menu',
    method: 'POST',
  });
};
