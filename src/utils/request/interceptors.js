import { http, toast, route } from "@/uni_modules/uview-plus";

import { useUserStore } from "@/store/modules/user";

// 请求拦截
/* eslint-disable */
const requestInterceptors = vm => {
  /* eslint-enable */
  http.interceptors.request.use(
    config => {
      config.data = config.data || {};
      // 根据custom参数中配置的是否需要token，添加对应的请求头
      if (config?.custom?.auth && useUserStore().userToken) {
        config.header["rls-token"] = useUserStore().userToken;
      }
      return config;
    },
    config => Promise.reject(config),
  );
};

// 响应拦截
/* eslint-disable */
const responseInterceptors = vm => {
  /* eslint-enable */
  http.interceptors.response.use(
    response => {
      /* 对响应成功做点什么 可使用async await 做异步操作*/
      const { statusCode, data } = response;
      // 自定义参数
      const custom = response.config?.custom;
      // 处理请求错误
      if (statusCode !== 200 || data.code !== 0) {
        // 请求封装中的报错
        if (custom.toast !== false) {
          let codeMsg = "系统错误";
          if (statusCode == 500 || data.code == 500) codeMsg = "系统异常";
          if (statusCode == 400 || data.code == 400) codeMsg = "参数校验失败";
          if (statusCode == 404 || data.code == 404)
            codeMsg = "没有找到相关数据";
          if (statusCode == 403 || data.code == 403) codeMsg = "没有相关权限";
          toast(data.msg || codeMsg);
        }
        // 处理「用户登录信息过期」
        if (
          (statusCode == 500 || data.code == 500) &&
          data.msg &&
          data.msg.indexOf("登录信息已过期") != -1
        ) {
          route({
            type: "reLaunch",
            url: "pages/error/index",
            params: {
              type: "loginExpired",
            },
          });
        }
        // 如果需要catch返回，则进行reject
        if (custom?.catch) {
          return Promise.reject(data);
        } else {
          // 否则返回一个pending中的promise
          return new Promise(() => {});
        }
      }
      return data.data || {};
    },
    response => {
      /*  对响应错误做点什么 （statusCode !== 200）*/
      return Promise.reject(response?.data || {});
    },
  );
};

export { requestInterceptors, responseInterceptors };
