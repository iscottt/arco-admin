import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getGroupPage(data) {
  return http.request({
    url: '/feeRuleDependGroup/searchGroup',
    data,
    method: 'POST',
  });
}
/**
 * 新增互斥质控
 * @param data
 * @returns
 */
export function insertGroup(data) {
  return http.request({
    url: '/feeRuleDependGroup/addGroup',
    method: 'POST',
    data,
  });
}
/**
 * 编辑互斥质控
 * @param data
 * @returns
 */
export function updateGroup(data) {
  return http.request({
    url: '/feeRuleDependGroup/updateGroup',
    method: 'POST',
    data,
  });
}
/**
 * 删除
 * @param data
 * @returns
 */
export const deleteGroup = (data) => {
  return http.request({
    url: '/feeRuleDependGroup/deleteGroup',
    method: 'POST',
    data,
  });
};

/**
 * 详情
 * @param data
 * @returns
 */
export const searchGroupDetail = (data) => {
  return http.request({
    url: '/feeRuleDependGroup/searchGroupDtl',
    method: 'POST',
    data,
  });
};

/**
 * 详情
 * @param data
 * @returns
 */
 export const addGroupDetail = (data) => {
  return http.request({
    url: '/feeRuleDependGroup/addGroupDtl',
    method: 'POST',
    data,
  });
};

/**
 * 详情
 * @param data
 * @returns
 */
 export const updateGroupDetail = (data) => {
  return http.request({
    url: '/feeRuleDependGroup/updateGroupDtl',
    method: 'POST',
    data,
  });
};
/**
 * 详情
 * @param data
 * @returns
 */
 export const deleteGroupDetail = (data) => {
  return http.request({
    url: '/feeRuleDependGroup/deleteGroupDtl',
    method: 'POST',
    data,
  });
};