// 引入拦截器配置
import { requestInterceptors, responseInterceptors } from "./interceptors.js";
// 引入luch-request
import { http } from "@/uni_modules/uview-plus";
//  初始化请求配置
/* eslint-disable */
const initRequest = vm => {
  /* eslint-enable */
  http.setConfig(config => {
    // 根域名
    config.baseURL = `/api`;
    // 默认配置
    config.header["appId"] = "H5";
    config.header["content-type"] = "application/json";
    /* 默认 toast 请求错误 */
    config.custom.toast = true;
    /* 默认 请求需要 auth  */
    config.custom.auth = true;
    /* 默认 请求需要 catch  */
    config.custom.catch = true;
    return config;
  });
  requestInterceptors();
  responseInterceptors();
};
export { initRequest };
