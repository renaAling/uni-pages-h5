<template>
  <section class="succeed-page">
    <!-- 全局加载 -->
    <common-loading v-if="isLoading" mTop="0vh"></common-loading>
    <template v-else>
      <!-- title -->
      <view class="page-title">
        <up-icon
          name="checkmark-circle-fill"
          color="#4785EA"
          size="48rpx"
        ></up-icon>
        <view class="title">支付成功</view>
      </view>
      <!-- price -->
      <view class="symbol-price">
        <span class="symbol">￥</span>
        <span class="money">
          {{ formatPaymentAmount(orderData?.payPrice) }}
        </span>
      </view>
      <!-- cells -->
      <view class="cells-box">
        <view class="cell-item">
          <view class="label">订单编号</view>
          <view class="value">{{ orderData?.orderCode }}</view>
        </view>
        <view class="cell-item">
          <view class="label">下单时间</view>
          <view class="value">{{ orderData?.orderTime }}</view>
        </view>
        <view class="cell-item">
          <view class="label">支付方式</view>
          <view class="value">微信支付</view>
        </view>
        <view class="cell-item">
          <view class="label">支付金额</view>
          <view class="value">
            ￥{{ formatPaymentAmount(orderData?.payPrice) }}
          </view>
        </view>
      </view>
      <!-- 底部按钮 -->
      <view class="bottom-btns">
        <up-button
          type="primary"
          shape="circle"
          :custom-style="tingeBtnStyle"
          @click="backToIndex"
          text="回到首页"
        ></up-button>
        <up-button
          type="primary"
          shape="circle"
          :custom-style="btnStyle"
          @click="jumpToOrderList"
          text="查看订单"
        ></up-button>
      </view>
    </template>
  </section>
</template>

<script setup>
import { route, toast } from "@/uni_modules/uview-plus";
import { getOrderPayDetailApi } from "@/api/express.js";
import { formatPaymentAmount } from "@/utils/index.js";

const isLoading = ref(true);
const orderCode = ref(null);
const orderData = ref({});

// 底部按钮样式
const tingeBtnStyle = {
  background: "#E3F0FF",
  width: "320rpx",
  height: "100rpx",
  margin: "0",
  color: "#4785EA",
  borderColor: "#E3F0FF",
};
const btnStyle = {
  background: "#4785EA",
  width: "320rpx",
  height: "100rpx",
  margin: "0",
};

// 回到首页
const backToIndex = () => {
  route({
    type: "reLaunch",
    url: "pages/express/index",
  });
};

// 查看订单
const jumpToOrderList = () => {
  route({
    type: "reLaunch",
    url: "pages/express-order/list",
  });
};

// 获取订单详情
const getOrderInfo = () => {
  isLoading.value = true;
  getOrderPayDetailApi(orderCode.value)
    .then(res => {
      orderData.value = res;
      isLoading.value = false;
    })
    .catch(() => {
      toast("查询支付结果失败～");
      setTimeout(() => {
        route({
          url: "pages/express/index",
          type: "reLaunch",
        });
      }, 2000);
    });
};

onLoad(option => {
  orderCode.value = option?.orderCode;
  getOrderInfo();
});
</script>
<style lang="scss" scoped>
page {
  background-color: #f5f7f9;
}
.succeed-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .page-title {
    @include flex-hc;

    .title {
      font-size: 40rpx;
      font-weight: 500;
      color: #333333;
      margin-left: 16rpx;
    }
  }

  .symbol-price {
    height: 112px;
    @include flex-hc;
    color: #1a1a1a;
    margin-bottom: 64rpx;

    .symbol {
      font-size: 32rpx;
      position: relative;
      top: 14rpx;
    }

    .money {
      font-size: 80rpx;
    }
  }

  .cells-box {
    width: 702rpx;
    border-radius: 24px;
    background: #ffffff;
    padding: 28rpx 24rpx;
    @include borderBox;

    .cell-item {
      height: 44rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 28rpx;
      margin-bottom: 24rpx;
      &:last-child {
        margin-bottom: 0rpx;
      }
    }

    .label {
      flex-shrink: 0;
      color: #999999;
      margin-right: 24rpx;
    }

    .value {
      color: #333333;
      @include ellipsis-multiLine(1);
    }
  }

  .bottom-btns {
    width: 700rpx;
    padding-top: 390rpx;
    @include flex-hcb;
  }
}
</style>
