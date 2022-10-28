import Axios from 'axios';
import { Message } from '@arco-design/web-vue';
import router from '@/router';
import { removeToken, getToken } from '@/utils/auth';

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
  interceptors(instance: any, url: any) {
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
        const is = this.destroy(url);
        if (!is) {
          setTimeout(() => {
            // Spin.hide()
          }, 500);
        }
        if (data.retCode && data.retCode !== '0') {
          if (data.retCode == '-100') {
            removeToken();
            localStorage.clear();
            router.push('/login');
          }
          return data;
        }
        return data;
      },
      (error: any) => {
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
    this.interceptors(instance, options.url);
    // options = Object.assign({}, options)
    // options.data = Qs.stringify(options.data)
    this.queue[options.url] = instance;
    return instance(options);
  }
}

export const http = new HttpRequest();
export default HttpRequest;
