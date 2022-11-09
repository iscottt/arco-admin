import { http } from '../httpUtil';

/**
 * 分页查询
 * @param data
 * @returns
 */
export function searchMission(data) {
  return http.request({
    url: '/statistic/serchReport',
    method: 'POST',
    data,
  });
}

export function exportMission(data) {
  return http.request({
    url: '/statistic/download',
    method: 'POST',
    data,
    config: { responseType: 'blob' },
  });
}
