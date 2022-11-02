import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getUnitLimitPage(data) {
  return http.request({
    url: '/feeRuleChargeUnitLimit/list',
    data,
    method: 'POST',
  });
}
/**
 * 新增收费大类质控
 * @param data
 * @returns
 */
export function insertUnitLimit(data) {
  return http.request({
    url: '/feeRuleChargeUnitLimit/add',
    method: 'POST',
    data,
  });
}
/**
 * 编辑收费大类质控
 * @param data
 * @returns
 */
export function updateUnitLimit(data) {
  return http.request({
    url: '/feeRuleChargeUnitLimit/update',
    method: 'POST',
    data,
  });
}
/**
 * 删除收费大类质控
 * @param data
 * @returns
 */
export const deleteUnitLimit = (data) => {
  return http.request({
    url: '/feeRuleChargeUnitLimit/delete',
    method: 'POST',
    data,
  });
};
/**
 * 搜索
 * @param data
 * @returns
 */
export const searchUnitLimit = (data) => {
  return http.request({
    url: '/feeRuleChargeUnitLimit/search',
    method: 'POST',
    data,
  });
};
