import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getRuleMutexProjectPage(data) {
  return http.request({
    url: '/feeRuleMutexProjectGroup/searchGroup',
    data,
    method: 'POST',
  });
}
/**
 * 新增互斥质控
 * @param data
 * @returns
 */
export function insertRuleMutexProject(data) {
  return http.request({
    url: '/feeRuleMutexProjectGroup/addGroup',
    method: 'POST',
    data,
  });
}
/**
 * 新增互斥质控
 * @param data
 * @returns
 */
export function updateRuleMutexProject(data) {
  return http.request({
    url: '/feeRuleMutexProjectGroup/updateGroup',
    method: 'POST',
    data,
  });
}
/**
 * 删除
 * @param data
 * @returns
 */
export const deleteRuleMutexProject = (data) => {
  return http.request({
    url: '/feeRuleMutexProjectGroup/deleteGroup',
    method: 'POST',
    data,
  });
};
/**
 * 搜索
 * @param data
 * @returns
 */
export const searchRuleMutexProject = (data) => {
  return http.request({
    url: '/feeRuleMutexProjectGroup/searchGroup',
    method: 'POST',
    data,
  });
};

// 费用质控-项目分组互斥

export const searchMutexProjectDtl = (data: any) => {
  return http.request({
    url: '/feeRuleMutexProjectGroup/searchGroupDtl',
    data,
    method: 'POST',
  });
};

export const deleteMutexProjectDtl = (data: any) => {
  return http.request({
    url: '/feeRuleMutexProjectGroup/deleteGroupDtl',
    data,
    method: 'POST',
  });
};
export const addMutexProjectDtl = (data: any) => {
  return http.request({
    url: '/feeRuleMutexProjectGroup/addGroupDtl',
    data,
    method: 'POST',
  });
};
export const updateMutexProjectDtl = (data: any) => {
  return http.request({
    url: '/feeRuleMutexProjectGroup/updateGroupDtl',
    data,
    method: 'POST',
  });
};
