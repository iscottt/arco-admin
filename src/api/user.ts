import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
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
// 100017
export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

export function getUserInfo(operatorId) {
  return http.request({
    url: '/100017',
    method: 'POST',
    data: { operatorId },
  });
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}
