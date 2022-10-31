import { http } from './httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getRolePage(data) {
  return http.request({
    url: '/100004',
    method: 'POST',
    data,
  });
}
/**
 * 获取角色树列表
 * @returns
 */
export function getRoleTree() {
  return http.request({
    url: '/100008',
    method: 'POST',
  });
}
/**
 * 新增角色
 * @param data
 * @returns
 */
export function insertRole(data) {
  return http.request({
    url: '/100001',
    method: 'POST',
    data,
  });
}
/**
 * 编辑角色
 * @param data
 * @returns
 */
export function updateRole(data) {
  return http.request({
    url: '/100003',
    method: 'POST',
    data,
  });
}
/**
 * 删除角色
 * @param data
 * @returns
 */
export function deleteRole(data) {
  return http.request({
    url: '/100002',
    method: 'POST',
    data,
  });
}
/**
 * 获取角色下拉框列表
 * @param data
 * @returns
 */
export function selectRole(data) {
  return http.request({
    url: '/1000041',
    method: 'POST',
    data,
  });
}
//1000041
