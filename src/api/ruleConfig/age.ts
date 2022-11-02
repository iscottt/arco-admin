// 100004
import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getRuleAgePage(data) {
  return http.request({
    url: '/age/fee/rule/list',
    data,
    method: 'POST',
  });
}
/**
 * 新增性别质控
 * @param data
 * @returns
 */
export function insertRuleAge(data) {
  return http.request({
    url: '/age/fee/rule/add',
    method: 'POST',
    data,
  });
}
export const deleteRuleAge = (data) => {
  return http.request({
    url: '/age/fee/rule/del',
    method: 'POST',
    data,
  });
};
