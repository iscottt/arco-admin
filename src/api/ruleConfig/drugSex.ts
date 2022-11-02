import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getDrugSexPage(data) {
  return http.request({
    url: '/FeeRuleSexDrug/list',
    data,
    method: 'POST',
  });
}
/**
 * 新增互斥质控
 * @param data
 * @returns
 */
export function insertDrugSex(data) {
  return http.request({
    url: '/FeeRuleSexDrug/add',
    method: 'POST',
    data,
  });
}
/**
 * 编辑互斥质控
 * @param data
 * @returns
 */
export function updateDrugSex(data) {
  return http.request({
    url: '/FeeRuleSexDrug/update',
    method: 'POST',
    data,
  });
}
/**
 * 删除
 * @param data
 * @returns
 */
export const deleteDrugSex = (data) => {
  return http.request({
    url: '/FeeRuleSexDrug/delete',
    method: 'POST',
    data,
  });
};
