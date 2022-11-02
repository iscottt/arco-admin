import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getKindLimitPage(data) {
  return http.request({
    url: '/feeRuleChargeKindLimit/list',
    data,
    method: 'POST',
  });
}
/**
 * 新增收费大类质控
 * @param data
 * @returns
 */
export function insertKindLimit(data) {
  return http.request({
    url: '/feeRuleChargeKindLimit/add',
    method: 'POST',
    data,
  });
}
/**
 * 编辑收费大类质控
 * @param data
 * @returns
 */
export function updateKindLimit(data) {
  return http.request({
    url: '/feeRuleChargeKindLimit/update',
    method: 'POST',
    data,
  });
}
/**
 * 删除收费大类质控
 * @param data
 * @returns
 */
export const deleteKindLimit = (data) => {
  return http.request({
    url: '/feeRuleChargeKindLimit/delete',
    method: 'POST',
    data,
  });
};
/**
 * 搜索
 * @param data
 * @returns
 */
export const searchKindLimit = (data) => {
  return http.request({
    url: '/feeRuleChargeKindLimit/search',
    method: 'POST',
    data,
  });
};
