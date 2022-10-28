// 100004
import { http } from './httpUtil';

export function getRolePage(data) {
  return http.request({
    url: '/100004',
    method: 'POST',
    data,
  });
}
