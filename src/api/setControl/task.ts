import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function getTaskPage(data) {
  return http.request({
    url: '/qcTask/list',
    data,
    method: 'POST',
  });
}
/**
 * 新增质控任务
 * @param data
 * @returns
 */
export function insertTask(data) {
  return http.request({
    url: '/qcTask/add',
    method: 'POST',
    data,
  });
}
/**
 * 查询质控任务
 * @param data
 * @returns
 */
export const searchTask = (data) => {
  return http.request({
    url: '/qcTask/serchTask',
    method: 'POST',
    data,
  });
};
/**
 * 获取任务详情
 * @param data
 * @returns
 */
export const getTaskResultDetail = (data: any) => {
  return http.request({
    url: '/qcTaskResult/list',
    data,
    method: 'POST',
  });
};
/**
 * 处理任务
 */
export const taskDeal = (data: any) => {
  return http.request({
    url: '/qcTaskResult/manual/deal',
    data,
    method: 'POST',
  });
};
