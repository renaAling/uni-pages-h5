<template>
  <section class="order-card" @click="jumpToOrder">
    <!-- 顶部 -->
    <view class="card-top">
      <view class="type">{{ order.categoryName }}</view>
      <view class="status">
        <view class="text">{{ orderStatus }}</view>
        <up-icon name="arrow-right" color="#171A1D" size="12"></up-icon>
      </view>
    </view>
    <!-- 内容 -->
    <view class="card-content">
      <up-steps current="0" dot direction="column">
        <up-steps-item desc="10:30">
          <template #icon>
            <text class="slot-icon"></text>
          </template>
          <template #title>
            <text class="slot-title">
              {{ order.senderAddress }}
            </text>
          </template>
          <template #desc>
            <text class="slot-desc">
              {{ order.senderName }}
              {{ formatPhoneNumber(order.senderPhone) }}
            </text>
          </template>
        </up-steps-item>
        <up-steps-item>
          <template #icon>
            <text class="slot-icon active"></text>
          </template>
          <template #title>
            <text class="slot-title">
              {{ order.receiverAddress }}
            </text>
          </template>
          <template #desc>
            <text class="slot-desc">
              {{ order.receiverName }}
              {{ formatPhoneNumber(order.receiverPhone) }}
            </text>
          </template>
        </up-steps-item>
      </up-steps>
    </view>
    <!-- 底部 -->
    <view class="date-company">
      <view class="date">{{ order.orderTime }}</view>
      <view class="company-info">
        <view class="cover-img" v-if="order.companyIcon">
          <up-image
            :src="order.companyIcon"
            mode="aspectFit"
            width="34rpx"
            height="34rpx"
            :fade="false"
          ></up-image>
        </view>
        <view class="name">{{ order.carrierName }}</view>
      </view>
    </view>
  </section>
</template>

<script setup>
import { route } from "@/uni_modules/uview-plus";

import { formatPhoneNumber } from "@/utils/index.js";

const props = defineProps({
  // 订单数据
  order: {
    type: Object,
    required: true,
  },
});

// 订单状态
const orderStatus = computed(() => {
  let retStr = "";
  const status = props.order.status;
  switch (status) {
    case 1:
      retStr = "待支付";
      break;
    case 2:
      retStr = "已下单";
      break;
    case 3:
      retStr = "已完成";
      break;
    case 4:
      retStr = "已取消";
      break;
    case 5:
      retStr = "已退款";
      break;
    default:
      retStr = "";
      break;
  }
  return retStr;
});

// 订单详情
const jumpToOrder = () => {
  route({
    url: "pages/express-order/order-details",
    params: {
      orderCode: props.order.orderCode,
    },
  });
};
</script>
<style lang="scss" scoped>
.order-card {
  width: 702rpx;
  border-radius: 24rpx;
  background: #ffffff;
  margin-bottom: 16rpx;
  padding: 24rpx;
  @include borderBox;
  display: flex;
  flex-direction: column;

  .card-top {
    height: 68rpx;
    display: flex;
    @include flex-hcb;
    border-bottom: 2rpx solid #f6f6f6;

    .type {
      font-size: 28rpx;
      color: #333333;
    }

    .status {
      @include flex-hc;

      .text {
        font-size: 28rpx;
        color: #4785ea;
        margin-right: 12rpx;
      }
    }
  }
  .card-content {
    padding: 32rpx 0 24rpx;

    .slot-title {
      font-size: 28rpx;
      line-height: 40rpx;
      color: #333333;
    }

    .slot-desc {
      font-size: 24rpx;
      line-height: 32rpx;
      color: #999999;
    }

    .slot-icon {
      width: 8rpx;
      height: 8rpx;
      border-radius: 50%;
      border: 8rpx solid #4785ea;
      position: relative;

      &.active {
        border-color: #ea9b25;
      }
    }
  }

  .date-company {
    border-top: 2rpx solid #f6f6f6;
    padding-top: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .date {
      flex-shrink: 0;
      font-size: 24rpx;
      color: #7b7b7b;
      margin-right: 24rpx;
    }

    .company-info {
      display: flex;
      align-items: center;
      .cover-img {
        flex-shrink: 0;
        width: 34rpx;
        height: 34rpx;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 6rpx;
      }
      .name {
        font-size: 24rpx;
        color: #333333;
        @include ellipsis-multiLine(1);
      }
    }
  }
}
</style>
