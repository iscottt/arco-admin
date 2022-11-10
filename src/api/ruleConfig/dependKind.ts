import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getRuleDependKindPage(data) {
  return http.request({
    url: '/feeRuleYbkind/search',
    data,
    method: 'POST',
  });
}
/**
 * 新增互斥质控
 * @param data
 * @returns
 */
export function insertRuleDependKind(data) {
  return http.request({
    url: '/feeRuleYbkind/add',
    method: 'POST',
    data,
  });
}
/**
 * 新增互斥质控
 * @param data
 * @returns
 */
export function updateRuleDependKind(data) {
  return http.request({
    url: '/feeRuleYbkind/update',
    method: 'POST',
    data,
  });
}
/**
 * 删除
 * @param data
 * @returns
 */
export const deleteRuleDependKind = (data) => {
  return http.request({
    url: '/feeRuleYbkind/delete',
    method: 'POST',
    data,
  });
};
/**
 * 搜索
 * @param data
 * @returns
 */
export const searchRuleDependKind = (data) => {
  return http.request({
    url: '/feeRuleYbkind/search',
    method: 'POST',
    data,
  });
};

// 费用质控-项目分组互斥

export const searchDependKindDtl = (data: any) => {
  return http.request({
    url: '/feeRuleYbkind/searchDtl',
    data,
    method: 'POST',
  });
};

export const deleteDependKindDtl = (data: any) => {
  return http.request({
    url: '/feeRuleYbkind/deleteDtl',
    data,
    method: 'POST',
  });
};
export const addDependKindDtl = (data: any) => {
  return http.request({
    url: '/feeRuleYbkind/addDtl',
    data,
    method: 'POST',
  });
};
export const updateDependKindDtl = (data: any) => {
  return http.request({
    url: '/feeRuleYbkind/updateDtl',
    data,
    method: 'POST',
  });
};
