import { createSSRApp } from "vue";
import App from "./App.vue";

// UI框架
import uviewPlus from "@/uni_modules/uview-plus";

// pinia - 状态管理库
import pinia from "@/store";

// 请求封装
import { initRequest } from "./utils/request/index";

export function createApp() {
  const app = createSSRApp(App);
  // 引入请求封装
  initRequest(app);

  app.use(uviewPlus);
  app.use(pinia);
  return {
    app,
    pinia,
  };
}
