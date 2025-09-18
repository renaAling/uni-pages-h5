import { defineStore } from "pinia";
import { test } from "@/uni_modules/uview-plus";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      // 用户token
      userToken: null,
      // 用户手机号
      userMobile: null,
      // 目标页面
      toPagePath: null,
    };
  },
  getters: {
    // 当前用户是否已经登录
    isUserLogined: state => {
      return !test.isEmpty(state.userToken);
    },
    // 目标页面
    getToPagePath: state => {
      let path = state.toPagePath;
      if (path === null || path === undefined || path === "") {
        return null;
      }
      if (typeof path === "string" && !path.startsWith("/")) {
        return "/" + path;
      }
      return path;
    },
  },
  actions: {
    // 更新「用户token」
    updateUserToken(userToken) {
      this.userToken = userToken;
    },
    // 更新 「用户手机号」
    updateUserMobile(userMobile) {
      this.userMobile = userMobile;
    },
    // 更新 「目标页面」
    updateToPagePath(toPagePath) {
      this.toPagePath = toPagePath;
    },
  },
  // 开启后对 state 的数据读写都将持久化
  unistorage: true,
});
