import { http } from '../httpUtil';

/**
 * 获取规则大类
 * @param data
 * @returns
 */
export function getRulekindList() {
  return http.request({
    url: '/fee/rulekind/list',
    method: 'POST',
  });
}
/**
 * 根据ruleKindId获取质控项目列表
 * @param ruleKindId
 * @returns
 */
export function getRuleListByKindId(ruleKindId) {
  return http.request({
    url: '/fee/rule/list',
    data: { ruleKindId },
    method: 'POST',
  });
}
/**
 * 根据branchId获取病区列表
 * @param branchId
 * @returns
 */
export function getAreaList(branchId) {
  return http.request({
    url: '/fee/area/list',
    data: { branchId },
    method: 'POST',
  });
}
/**
 * 根据areaId获取科室列表
 * @param areaId
 * @returns
 */
export function getDeptList(areaId) {
  return http.request({
    url: '/fee/dept/list',
    data: { areaId },
    method: 'POST',
  });
}
/**
 * 查询医生列表
 * @param data
 * @returns
 */
export const searchDoctorList = (data) => {
  return http.request({
    url: '/fee/doctor/list',
    data,
    method: 'POST',
  });
};
/**
 * 查询患者列表
 * @param data
 * @returns
 */
export const searchPatientList = (data) => {
  return http.request({
    url: '/fee/patient/list',
    data,
    method: 'POST',
  });
};

export * from './task';
