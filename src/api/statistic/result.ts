import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function searchResultReport(data) {
  return http.request({
    url: '/statistic/searchResultReport',
    method: 'POST',
    data,
  });
}

export function exportResultReport(data) {
  return http.request({
    url: '/statistic/downloadResult',
    method: 'POST',
    data,
    config: { responseType: 'blob' },
  });
}
export function getTaskResultDetailByTime(data) {
  return http.request({
    url: '/statistic/getTaskResultDetailByTime',
    method: 'POST',
    data,
  });
}

// /statistic/getTaskResultDetailByTime
