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
/**
 * 获取字典值
 * @param data
 * @returns
 */
export const getEnums = (data: any) => {
  return http.request({
    url: '/paramEnum/list',
    data,
    method: 'POST',
  });
};

export * from './sex';
export * from './mutex';
export * from './codeLimit';
export * from './kindLimit';
