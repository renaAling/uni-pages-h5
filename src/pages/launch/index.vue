<template>
  <section class="launch-page">
    <common-loading mBottom="20vh"></common-loading>
  </section>
</template>

<script setup>
// 小程序链接示例
// {domain}/#/?token={token}&toPagePath={pagePath}&mobile={mobile}
// 开发完整示例
// http://localhost:5173/#/?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoicmxzLXRva2VuIiwiZXhwIjoxNzcwNjI2MjQzLCJ1c2VyIjoie1widW5pb25JZFwiOlwiS0FPRFRNR1RWQldTQU02SERSTUdGQVwiLFwidXNlcklkXCI6XCJicnVhYkVQRmdVOU80QkoyaVlIV1wiLFwiY2hhbm5lbENvZGVcIjpudWxsLFwibG9naW5UaW1lXCI6WzIwMjUsOCwxMywxNiwzNywyMyw3NDkwOTE5MDNdLFwidXNlcm5hbWVcIjpudWxsLFwibmFtZVwiOm51bGwsXCJuaWNrTmFtZVwiOm51bGwsXCJlbmFibGVkXCI6dHJ1ZSxcImNyZWRlbnRpYWxzTm9uRXhwaXJlZFwiOmZhbHNlLFwicGFzc3dvcmRcIjpcIlwiLFwiYXV0aG9yaXRpZXNcIjpbXSxcImFjY291bnROb25FeHBpcmVkXCI6ZmFsc2UsXCJhY2NvdW50Tm9uTG9ja2VkXCI6ZmFsc2V9IiwiaWF0IjoxNzU1MDc0MjQzfQ.jFyRq0bGXQReqHT4JKSyo2c_YJHyp75mZC1j4MKmwJs&mobile=13167966332&toPagePath=pages/business/list

import { route } from "@/uni_modules/uview-plus";

// 用户状态管理
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore();

// 用户 token
const isUserLogined = computed(() => {
  return userStore.isUserLogined;
});

// 目标页面
const toPagePath = computed(() => {
  return userStore.getToPagePath;
});

// 接收&储存页面参数
const getDataFromParams = option => {
  // api token
  userStore.updateUserToken(option?.token || option?.query?.token || null);
  // 用户手机号
  userStore.updateUserMobile(option?.mobile || option?.query?.mobile || null);
  // 目标页面
  userStore.updateToPagePath(
    option?.toPagePath || option?.query?.toPagePath || null,
  );
};

onLoad(async option => {
  // 接收&储存页面参数
  getDataFromParams(option);
  // 用户暂无登录信息 或者 登录信息过期
  if (!isUserLogined.value) {
    route({
      type: "reLaunch",
      url: "pages/error/index",
      params: {
        type: "needLogin",
      },
    });
  } else {
    uni.reLaunch({
      url: toPagePath.value,
      fail() {
        console.log("启动页路由参数toPagePath错误");
        route({
          type: "reLaunch",
          url: "pages/error/index",
          params: {
            type: "pathError",
          },
        });
      },
    });
  }
});
</script>
<style lang="scss" scoped>
page {
  background-color: #fff;
}

.launch-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
