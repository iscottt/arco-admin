import { http } from '../httpUtil';

export const searchUnusedListByName = (data: any) => {
  return http.request({
    url: '/chargeCode/center/listbyName',
    data,
    method: 'POST',
  });
};

export const searchRuleConfig = (data: any) => {
  return http.request({
    url: '/fee/rule/search',
    data,
    method: 'POST',
  });
};

export * from './sex';
export * from './mutex';
export * from './codeLimit';
