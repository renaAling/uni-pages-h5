<template>
  <section class="business-list">
    <!-- 加载中 -->
    <common-loading v-if="isFullLoading" mTop="36vh"></common-loading>
    <!-- 场馆列表 -->
    <template v-else>
      <view class="card-list" v-if="businessList.length">
        <business-card
          v-for="business in businessList"
          :key="business.code"
          :data="business"
        ></business-card>
      </view>
      <common-empty v-else type="business"></common-empty>
    </template>
  </section>
</template>

<script setup>
import wx from "weixin-js-sdk";
import { getBusinessListApi } from "@/api/business.js";
import BusinessCard from "./components/business-card.vue";

const isFullLoading = ref(true);
const businessList = ref([]);

const getBusinessList = () => {
  isFullLoading.value = true;
  getBusinessListApi()
    .then(res => {
      businessList.value = res || [];
      isFullLoading.value = false;
    })
    .catch(() => {
      isFullLoading.value = false;
    });
};

onMounted(() => {
  getBusinessList();
});

// 返回小程序
const backToMp = () => {
  wx.miniProgram.navigateBack({ delta: 1 });
};
// 用户在场馆列表的返回行为 固定为「退出H5，返回小程序」
onShow(() => {
  if (typeof wx !== "undefined" && wx.miniProgram) {
    // 监听页面返回按钮（包括物理返回键和导航栏返回）
    wx.miniProgram.getEnv(res => {
      if (res.miniprogram) {
        // 拦截返回事件
        // window.history.pushState({ page: "back" }, "", "#/pages/business/list");
        window.addEventListener("popstate", backToMp);
      }
    });
  }
});
onHide(() => {
  window.removeEventListener("popstate", backToMp);
});
</script>
<style lang="scss" scoped>
.business-list {
  padding: 40rpx;
  padding-bottom: 60rpx;

  .card-list {
    @include flex-vc;
  }
}
</style>
