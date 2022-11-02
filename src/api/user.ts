import { http } from './httpUtil';
export interface LoginData {
  operatorCode: string;
  password: string;
}

export interface LoginRes {
  token: string;
  data: any;
}
export function login(data: LoginData) {
  return http.request({
    url: '/100016',
    method: 'POST',
    data,
  });
}

export function getUserInfo(operatorId) {
  return http.request({
    url: '/100017',
    method: 'POST',
    data: { operatorId },
  });
}
export function resetUserPassword(data) {
  return http.request({
    url: '/100006',
    method: 'POST',
    data,
  });
}
