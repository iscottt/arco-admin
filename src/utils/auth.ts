import { getLocal, removeLocal, setLocal } from './storage';

const TokenKey = 'x-rjyb-token';

export const getToken = () => getLocal<string>(TokenKey) || '';

export const setToken = (token: string) => setLocal(TokenKey, token);

export const removeToken = () => {
  removeLocal(TokenKey);
};

export const isLogin = () => {
  return !!getToken();
};

/** 获取用户信息 */
export function getUserInfo() {
  const emptyInfo: Auth.UserInfo = {
    areaId: '',
    areaName: '',
    blockStatus: '',
    branchId: '',
    branchName: '',
    contactAddr: '',
    contactPerson: '',
    contactPhone: '',
    deptId: '',
    deptName: '',
    funcList: '',
    operatorCode: '',
    operatorId: '',
    operatorLevel: '',
    operatorName: '',
    phoneNumber: '',
    statusOperatorId: '',
  };
  const userInfo: Auth.UserInfo =
    getLocal<Auth.UserInfo>('user_info') || emptyInfo;
  return userInfo;
}

/** 设置用户信息 */
export function setUserInfo(userInfo: Auth.UserInfo) {
  setLocal('user_info', userInfo);
}

/** 去除用户信息 */
export function removeUserInfo() {
  removeLocal('user_info');
}
