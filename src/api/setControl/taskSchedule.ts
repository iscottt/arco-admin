import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getTaskSchedulePage(data) {
  return http.request({
    url: '/qcTaskSchedule/list',
    data,
    method: 'POST',
  });
}
/**
 * 新增质控任务
 * @param data
 * @returns
 */
export function insertTaskSchedule(data) {
  return http.request({
    url: '/qcTaskSchedule/add',
    method: 'POST',
    data,
  });
}
/**
 * 查询质控任务
 * @param data
 * @returns
 */
export const searchTaskSchedule = (data) => {
  return http.request({
    url: '/qcTaskSchedule/serchTask',
    method: 'POST',
    data,
  });
};
/**
 * 查询质控任务
 * @param data
 * @returns
 */
export const updateTaskSchedule = (data) => {
  return http.request({
    url: '/qcTaskSchedule/update',
    method: 'POST',
    data,
  });
};
/**
 * 查询质控任务
 * @param data
 * @returns
 */
export const deleteTaskSchedule = (data) => {
  return http.request({
    url: '/qcTaskSchedule/delete',
    method: 'POST',
    data,
  });
};
