// 100004
import { http } from './httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getJobNoPage(data) {
  return http.request({
    url: '/100013',
    method: 'POST',
    data,
  });
}
/**
 * 新增工号
 * @param data
 * @returns
 */
export function insertJobNo(data) {
  return http.request({
    url: '/100005',
    method: 'POST',
    data,
  });
}
/**
 * 编辑工号
 * @param data
 * @returns
 */
export function updateJobNo(data) {
  return http.request({
    url: '/100006',
    method: 'POST',
    data,
  });
}
/**
 * 删除工号
 * @param data
 * @returns
 */
export function deleteJobNo(data) {
  return http.request({
    url: '/100007',
    method: 'POST',
    data,
  });
}
/**
 * 获取对应层级的列表数据
 * @param data
 * @returns
 */
export function getTargetIdList(data) {
  return http.request({
    url: '/fee/targetId/list',
    method: 'POST',
    data,
  });
}
/**
 * 获取科室列表数据
 * @param data
 * @returns
 */
export function getDeptList(data) {
  return http.request({
    url: '/fee/dept/list',
    method: 'POST',
    data,
  });
}
/**
 * 获取对病区列表数据
 * @param data
 * @returns
 */
export function getAreaList(data) {
  return http.request({
    url: '/fee/area/list',
    method: 'POST',
    data,
  });
}
