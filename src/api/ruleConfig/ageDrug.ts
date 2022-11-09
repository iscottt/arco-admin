import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getDrugAgePage(data) {
  return http.request({
    url: '/age/drug/rule/list',
    data,
    method: 'POST',
  });
}
/**
 * 新增性别质控
 * @param data
 * @returns
 */
export function insertDrugAge(data) {
  return http.request({
    url: '/age/drug/rule/add',
    method: 'POST',
    data,
  });
}
export const deleteDrugAge = (data) => {
  return http.request({
    url: '/age/drug/rule/del',
    method: 'POST',
    data,
  });
};
