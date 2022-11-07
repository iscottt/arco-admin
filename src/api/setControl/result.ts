import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function searchTaskResult(data) {
  return http.request({
    url: '/qcTaskResult/search',
    data,
    method: 'POST',
  });
}

/**
 * 导出
 * @param data
 * @returns
 */
export function exportTaskResult(data) {
  return http.request({
    url: '/qcTaskResult/download',
    data,
    method: 'POST',
    config: { responseType: 'blob' },
  });
}
