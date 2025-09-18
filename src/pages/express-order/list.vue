<template>
  <section class="order-list">
    <!-- 顶部tabs -->
    <up-sticky :customNavHeight="0" bgColor="#f5f7f9">
      <up-tabs
        :list="tabsList"
        :scrollable="false"
        @change="onTabsChange"
      ></up-tabs>
    </up-sticky>
    <common-loading v-if="isLoading" mTop="36vh"></common-loading>
    <template v-else>
      <view class="card-list" v-if="orderList.length">
        <order-card
          v-for="order in orderList"
          :key="order.orderCode"
          :order="order"
        ></order-card>
        <up-loadmore
          :status="status"
          marginTop="60rpx"
          fontSize="12"
          color="#ccc"
        />
      </view>
      <common-empty type="order" v-else></common-empty>
    </template>
  </section>
</template>

<script setup>
import { getOrderListApi } from "@/api/express.js";

import OrderCard from "./components/order-card.vue";

// 顶部 tabs 相关
const curType = ref("all");
const tabsList = reactive([
  { type: "all", name: "全部" },
  { type: "1", name: "待支付" },
  { type: "2", name: "已下单" },
  { type: "3", name: "已完成" },
  { type: "4", name: "已取消" },
  { type: "5", name: " 已退款" },
]);

// 刷新订单列表
const refreshOrderList = () => {
  status.value = "loadmore";
  pageNum.value = 1;
  orderList.value = [];
  isLoading.value = true;
  getOrderList();
};

// 顶部 tabs 改变
const onTabsChange = curTab => {
  curType.value = curTab.type;
  refreshOrderList();
};

// 订单列表数据
const isLoading = ref(true);
const orderList = ref([]);
const pageNum = ref(1);
const status = ref("loadmore");

// 获取订单列表
const getOrderList = () => {
  status.value = "loading";
  let params = {
    current: pageNum.value,
    size: 20,
  };
  if (curType.value !== "all") params.status = curType.value;
  if (pageNum.value == 1) isLoading.value = true;
  getOrderListApi(params)
    .then(res => {
      const list = res?.records || [];
      orderList.value = orderList.value.concat(list);
      if (orderList.value.length >= res?.total) {
        // 没有更多了
        status.value = "nomore";
      } else {
        // 还有下一页
        pageNum.value += 1;
        status.value = "loadmore";
      }
      isLoading.value = false;
    })
    .catch(() => {
      isLoading.value = false;
      status.value = "loadmore";
    });
};

// 页面触底加载更多
onReachBottom(() => {
  if (status.value === "loading" || status.value == "nomore") return;
  getOrderList();
});

// 下拉刷新
onPullDownRefresh(async () => {
  refreshOrderList();
  uni.stopPullDownRefresh();
});

onLoad(() => {
  getOrderList();
});
</script>
<style lang="scss" scoped>
page {
  background-color: #f5f7f9;
}
.order-list {
  padding-bottom: 60rpx;

  .card-list {
    @include flex-vc;
  }
}
</style>
