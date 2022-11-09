import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getRuleMutexGroupPage(data) {
  return http.request({
    url: '/feeRuleMutexGroup/searchGroup',
    data,
    method: 'POST',
  });
}
/**
 * 新增互斥质控
 * @param data
 * @returns
 */
export function insertRuleMutexGroup(data) {
  return http.request({
    url: '/feeRuleMutexGroup/addGroup',
    method: 'POST',
    data,
  });
}
/**
 * 新增互斥质控
 * @param data
 * @returns
 */
export function updateRuleMutexGroup(data) {
  return http.request({
    url: '/feeRuleMutexGroup/updateGroup',
    method: 'POST',
    data,
  });
}
/**
 * 删除
 * @param data
 * @returns
 */
export const deleteRuleMutexGroup = (data) => {
  return http.request({
    url: '/feeRuleMutexGroup/deleteGroup',
    method: 'POST',
    data,
  });
};
/**
 * 搜索
 * @param data
 * @returns
 */
export const searchRuleMutexGroup = (data) => {
  return http.request({
    url: '/feeRuleMutexGroup/searchGroup',
    method: 'POST',
    data,
  });
};

// 费用质控-项目分组互斥

export const searchGroupDtl = (data: any) => {
  return http.request({
    url: '/feeRuleMutexGroup/searchGroupDtl',
    data,
    method: 'POST',
  });
};

export const deleteGroupDtl = (data: any) => {
  return http.request({
    url: '/feeRuleMutexGroup/deleteGroupDtl',
    data,
    method: 'POST',
  });
};
export const addGroupDtl = (data: any) => {
  return http.request({
    url: '/feeRuleMutexGroup/addGroupDtl',
    data,
    method: 'POST',
  });
};
export const updateGroupDtl = (data: any) => {
  return http.request({
    url: '/feeRuleMutexGroup/updateGroupDtl',
    data,
    method: 'POST',
  });
};
