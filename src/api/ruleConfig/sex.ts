// 100004
import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getRuleSexPage(data) {
  return http.request({
    url: '/fee/rule/selectFeeRuleSexList',
    data,
    method: 'POST',
  });
}
/**
 * 新增性别质控
 * @param data
 * @returns
 */
export function insertRuleSex(data) {
  return http.request({
    url: '/fee/rule/addFeeRuleSex',
    method: 'POST',
    data,
  });
}
export const deleteRuleSex = (data) => {
  return http.request({
    url: '/fee/rule/deleteFeeRuleSex',
    method: 'POST',
    data,
  });
};
