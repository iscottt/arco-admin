import Axios from 'axios';
import { Message, Notification } from '@arco-design/web-vue';
import router from '@/router';
import { removeToken, getToken, getUserInfo } from '@/utils/auth';
import { removeUserInfo } from '../../utils/auth';

const BASE_URL = process.env.NODE_ENV === 'production' ? '/qcApi' : '/api';
class HttpRequest {
  options: any = {};
  queue: any = {};
  constructor() {
    this.options = {
      method: '',
      url: '',
    };
    // 存储请求队列
    this.queue = {};
  }
  // 销毁请求实例
  destroy(url: any) {
    delete this.queue[url];
    const queue = Object.keys(this.queue);
    return queue.length;
  }
  // 请求拦截
  interceptors(instance: any) {
    // 添加请求拦截器
    instance.interceptors.request.use(
      (config: any) => {
        // 在发送请求之前做些什么
        return config;
      },
      (error: any) => {
        // 对请求错误做些什么
        return Promise.reject(error);
      }
    );

    // 添加响应拦截器
    instance.interceptors.response.use(
      (res: any) => {
        let { data } = res;
        if (data.retCode && data.retCode !== '0') {
          if (data.retCode == '-100') {
            Notification.warning({
              id: 'logout',
              title: '登录超时',
              content: '2秒后将跳转到登录页面...',
            });
            setTimeout(() => {
              localStorage.clear();
              removeToken();
              removeUserInfo();
              router.push('/login');
              Notification.success({
                id: 'logout',
                title: '提示',
                content: '成功退出登录！',
              });
            }, 2000);
          } else {
            Message.error(data.retMessage);
            throw new Error(data.retMessage);
          }
        }
        return data;
      },
      (error: any) => {
        if (error.message.indexOf('502') > -1) {
          router.push('/server-error');
          return Promise.reject(error);
        }
        Message.error('服务器内部错误');
        // 对响应错误做点什么
        return Promise.reject(error);
      }
    );
  }
  // 创建实例
  create(baseURL: any) {
    let conf = {
      baseURL: baseURL || BASE_URL,
      // timeout: 2000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'x-rjyb-token': getToken(),
        // 'application / json'
      },
    };
    return Axios.create(conf);
  }
  // 请求实例
  request(options: any) {
    var instance = this.create(options.baseURL);
    const { operatorId } = getUserInfo();
    Object.assign(options.data || {}, { statusOperatorId: operatorId });
    this.interceptors(instance);
    // options = Object.assign({}, options)
    // options.data = Qs.stringify(options.data)
    this.queue[options.url] = instance;
    return instance(options);
  }
}

export const http = new HttpRequest();
export default HttpRequest;
