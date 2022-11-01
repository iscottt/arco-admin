// 100004
import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getCodeLimitPage(data) {
  return http.request({
    url: '/feeRuleChargeCodeLimit/list',
    data,
    method: 'POST',
  });
}
/**
 * 新增互斥质控
 * @param data
 * @returns
 */
export function insertCodeLimit(data) {
  return http.request({
    url: '/feeRuleChargeCodeLimit/add',
    method: 'POST',
    data,
  });
}
/**
 * 编辑互斥质控
 * @param data
 * @returns
 */
export function updateCodeLimit(data) {
  return http.request({
    url: '/feeRuleChargeCodeLimit/update',
    method: 'POST',
    data,
  });
}
/**
 * 删除
 * @param data
 * @returns
 */
export const deleteCodeLimit = (data) => {
  return http.request({
    url: '/feeRuleChargeCodeLimit/delete',
    method: 'POST',
    data,
  });
};
/**
 * 搜索
 * @param data
 * @returns
 */
export const searchCodeLimit = (data) => {
  return http.request({
    url: '/feeRuleChargeCodeLimit/search',
    method: 'POST',
    data,
  });
};
