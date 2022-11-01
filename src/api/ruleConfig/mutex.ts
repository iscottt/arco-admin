// 100004
import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getRuleMutexPage(data) {
  return http.request({
    url: '/feeRuleMutex/list',
    data,
    method: 'POST',
  });
}
/**
 * 新增互斥质控
 * @param data
 * @returns
 */
export function insertRuleMutex(data) {
  return http.request({
    url: '/feeRuleMutex/add',
    method: 'POST',
    data,
  });
}
/**
 * 删除
 * @param data
 * @returns
 */
export const deleteRuleMutex = (data) => {
  return http.request({
    url: '/feeRuleMutex/delete',
    method: 'POST',
    data,
  });
};
/**
 * 搜索
 * @param data
 * @returns
 */
export const searchRuleMutex = (data) => {
  return http.request({
    url: '/feeRuleMutex/search',
    method: 'POST',
    data,
  });
};
