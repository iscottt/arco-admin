import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getExclusivePage(data) {
  return http.request({
    url: '/feeRuleMutexYbkind/list',
    data,
    method: 'POST',
  });
}
/**
 * 新增互斥质控
 * @param data
 * @returns
 */
export function insertExclusive(data) {
  return http.request({
    url: '/feeRuleMutexYbkind/add',
    method: 'POST',
    data,
  });
}
/**
 * 编辑互斥质控
 * @param data
 * @returns
 */
export function updateExclusive(data) {
  return http.request({
    url: '/feeRuleMutexYbkind/update',
    method: 'POST',
    data,
  });
}
/**
 * 删除
 * @param data
 * @returns
 */
export const deleteExclusive = (data) => {
  return http.request({
    url: '/feeRuleMutexYbkind/delete',
    method: 'POST',
    data,
  });
};
