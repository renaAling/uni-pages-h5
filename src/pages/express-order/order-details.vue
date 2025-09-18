<template>
  <section class="order-details" :class="{ 'blue-top': isOrderUsable }">
    <!-- 加载中 -->
    <common-loading v-if="isFullLoading" mTop="36vh"></common-loading>
    <template v-else>
      <!-- 顶部 -->
      <view class="details-content">
        <view class="order-top">
          <view class="left-info">
            <view class="status" :class="{ white: isOrderUsable }">
              {{ orderStatus }}
            </view>
            <view class="time" :class="{ white: isOrderUsable }">
              {{ orderData.orderTime }}
            </view>
          </view>
          <view
            class="comment-btn"
            v-if="orderData?.status == 3 && !orderData?.isEvaluated"
            @click="jumpToComment"
          >
            <up-image
              :src="editIcon"
              mode="aspectFit"
              width="28rpx"
              height="28rpx"
            ></up-image>
            <view>评价</view>
          </view>
        </view>
        <!-- steps -->
        <view class="step-box" v-if="isOrderUsable">
          <up-steps :current="stepsIdx" dot>
            <up-steps-item title="待支付"></up-steps-item>
            <up-steps-item title="已下单"></up-steps-item>
            <up-steps-item title="已完成"></up-steps-item>
          </up-steps>
        </view>
        <!-- 订单信息 -->
        <view class="info-box">
          <view class="title">订单信息</view>
          <view class="cut-off"></view>
          <view class="steps-content">
            <up-steps current="0" dot direction="column">
              <up-steps-item desc="10:30">
                <template #icon>
                  <text class="slot-icon"></text>
                </template>
                <template #title>
                  <text class="slot-title">
                    {{ orderData.senderAddress }}
                  </text>
                </template>
                <template #desc>
                  <text class="slot-desc">
                    {{ orderData.senderName }}
                    {{ formatPhoneNumber(orderData.senderPhone) }}
                  </text>
                </template>
              </up-steps-item>
              <up-steps-item>
                <template #icon>
                  <text class="slot-icon active"></text>
                </template>
                <template #title>
                  <text class="slot-title">
                    {{ orderData.receiverAddress }}
                  </text>
                </template>
                <template #desc>
                  <text class="slot-desc">
                    {{ orderData.receiverName }}
                    {{ formatPhoneNumber(orderData.receiverPhone) }}
                  </text>
                </template>
              </up-steps-item>
            </up-steps>
          </view>
          <view class="cut-off"></view>
          <view class="info-cell">
            <view class="label">下单时间</view>
            <view class="value">{{ orderData.orderTime }}</view>
          </view>
          <view class="info-cell">
            <view class="label">取件时间</view>
            <view class="value">{{
              orderData.appointmentType == 1
                ? "立即取件"
                : orderData.receiveStartTime
            }}</view>
          </view>
          <view class="info-cell">
            <view class="label">物品信息</view>
            <view class="value">
              {{ orderData.goodsName }}/{{ orderCode.totalWeight }}kg
            </view>
          </view>
          <view class="info-cell">
            <view class="label">运营商</view>
            <view class="value">{{ orderData.carrierName }}</view>
          </view>
          <view class="info-cell" @click="copyOrderCode">
            <view class="label">订单编号</view>
            <view class="value">{{ orderData.orderCode }}</view>
            <view class="copy">复制</view>
          </view>
          <view class="info-cell">
            <view class="label">订单金额</view>
            <view class="value">
              {{ formatPaymentAmount(orderData.payPrice) }}元
            </view>
          </view>
          <view class="info-cell">
            <view class="label">支付方式</view>
            <view class="value">微信支付</view>
          </view>
        </view>
        <!-- 运单号 -->
        <view class="logistic-code" v-if="orderData.logisticCode">
          <view class="title">物流单号</view>
          <view class="value" @click="copyLogisticCode">
            {{ orderData.logisticCode }}
          </view>
          <up-image
            :src="copyIcon"
            mode="aspectFit"
            width="32rpx"
            height="32rpx"
            @click="copyLogisticCode"
          ></up-image>
          <view class="btn" @click="copyLogisticCode">复制</view>
        </view>
        <!-- 底部按钮 -->
        <view
          class="bottom-btns"
          v-if="orderData?.status == 1 || orderData?.status == 2"
        >
          <up-button
            type="primary"
            shape="circle"
            :custom-style="cancelBtnStyle"
            text="取消订单"
            @click="isCancelModalShow = true"
          ></up-button>
          <up-button
            v-if="orderData?.status == 1"
            type="primary"
            shape="circle"
            :custom-style="payBtnStyle"
            text="立即付款"
            @click="onPayClick"
          ></up-button>
        </view>
      </view>
    </template>
    <!-- 取消模态窗 -->
    <up-modal
      :show="isCancelModalShow"
      confirmText="确认取消"
      confirmColor="#4785EA"
      showCancelButton
      cancelText="我再想想"
      @cancel="isCancelModalShow = false"
      @confirm="onCancelConfirm"
    >
      <view class="modal-content">
        <up-image
          :src="warnIcon"
          mode="aspectFit"
          width="96rpx"
          height="96rpx"
        ></up-image>
        <view class="title">取消订单</view>
        <view class="tips">
          订单取消后，将无法恢复。请确认您是否不再需要寄件服务？
        </view>
      </view>
    </up-modal>
  </section>
</template>

<script setup>
import wx from "weixin-js-sdk";
import { toast, route } from "@/uni_modules/uview-plus";

import { getOrderDetailApi, cancelOrderApi } from "@/api/express.js";
import { formatPhoneNumber, formatPaymentAmount } from "@/utils/index.js";
import copyIcon from "@/static/icons/page-add.png";
import editIcon from "@/static/icons/edit-white.png";
import warnIcon from "@/static/icons/warn-icon_blue.png";

const orderCode = ref(null);
const isFullLoading = ref(true);
const orderData = ref({});

// 订单整体可用状态
const isOrderUsable = computed(() => {
  let retBoolean = false;
  // 状态：1-待支付，2-已下单，3-已完成，4-已取消，5-已退款
  const status = orderData.value?.status;
  switch (status) {
    case 1:
    case 2:
    case 3:
      retBoolean = true;
      break;
    default:
      retBoolean = "";
      break;
  }
  return retBoolean;
});

// 订单状态
const orderStatus = computed(() => {
  let retStr = "";
  const status = orderData.value?.status;
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

// 订单进度
const stepsIdx = computed(() => {
  let retIdx = 0;
  const status = orderData.value?.status;
  switch (status) {
    case 1:
      retIdx = 0;
      break;
    case 2:
      retIdx = 1;
      break;
    case 3:
      retIdx = 2;
      break;
    default:
      retIdx = 0;
      break;
  }
  return retIdx;
});

// 跳转至评论
const jumpToComment = () => {
  route({
    url: "pages/express-order/order-comment",
    params: {
      orderCode: orderCode.value,
    },
  });
};

// 复制订单号
const copyOrderCode = () => {
  uni.setClipboardData({
    data: orderData.value.orderCode,
    success: () => {
      toast("订单编号复制成功～");
    },
  });
};

// 复制运单号
const copyLogisticCode = () => {
  uni.setClipboardData({
    data: orderData.value.logisticCode,
    success: () => {
      toast("运单号复制成功～");
    },
  });
};

// 底部按钮样式
// 取消按钮
const cancelBtnStyle = computed(() => {
  let retStyle = {
    background: "#E3F0FF",
    width: "670rpx",
    height: "100rpx",
    margin: "0",
    color: "#4785EA",
    borderColor: "#E3F0FF",
  };
  if (orderData.value?.status == 1) retStyle.width = "320rpx";
  return retStyle;
});
// 支付按钮
const payBtnStyle = computed(() => {
  let retStyle = {
    background: "#4785EA",
    width: "320rpx",
    height: "100rpx",
    margin: "0 0 0 30rpx",
  };
  return retStyle;
});

// 检查用户是否能唤起支付
const checkOrderCanPay = async () => {
  return new Promise((resolve, reject) => {
    getOrderDetailApi(orderCode.value)
      .then(res => {
        const status = res?.status;
        if (status == 1) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(() => {
        reject();
      });
  });
};

// 取消模态窗
const isCancelModalShow = ref(false);
// 用户确认取消订单
const onCancelConfirm = () => {
  // 关闭模态窗
  isCancelModalShow.value = false;
  // 取消订单
  uni.showLoading({ title: "取消中" });
  const params = {
    orderCode: orderData.value.orderCode,
    operatorType: 1,
  };
  cancelOrderApi(params)
    .then(() => {
      uni.hideLoading();
      getOrderDetails();
      uni.showToast({
        icon: "success",
        title: "取消成功",
        duration: 2000,
      });
    })
    .catch(() => {
      uni.hideLoading();
      getOrderDetails();
    });
};

// 用户点击支付
const onPayClick = async () => {
  try {
    uni.showLoading({
      title: "唤起支付中",
      mask: true,
    });
    const isUserCanPay = await checkOrderCanPay();
    if (!isUserCanPay) {
      uni.hideLoading();
      toast("订单支付超时");
      // 刷新订单数据
      isFullLoading.value = true;
      getOrderDetails();
      return;
    }
    // 支付配置
    if (typeof wx !== "undefined" && wx.miniProgram) {
      wx.miniProgram.getEnv(res => {
        if (res.miniprogram) {
          uni.hideLoading();
          wx.miniProgram.redirectTo({
            url: `/pages_h5/pages/h5_express_wechat_pay?orderCode=${orderCode.value}`,
          });
        } else {
          uni.hideLoading();
          toast("唤起支付失败");
          // 刷新订单数据
          isFullLoading.value = true;
          getOrderDetails();
        }
      });
    } else {
      uni.hideLoading();
      toast("唤起支付失败");
      // 刷新订单数据
      isFullLoading.value = true;
      getOrderDetails();
    }
  } catch (error) {
    uni.hideLoading();
    toast("唤起支付失败");
    // 刷新订单数据
    isFullLoading.value = true;
    getOrderDetails();
  }
};

// 获取订单详情
const getOrderDetails = () => {
  isFullLoading.value = true;
  getOrderDetailApi(orderCode.value)
    .then(res => {
      orderData.value = res;
      isFullLoading.value = false;
    })
    .catch(() => {
      setTimeout(() => {
        uni.navigateBack({ delta: 1 });
      }, 2000);
    });
};

onLoad(option => {
  orderCode.value = option?.orderCode;
  getOrderDetails();
});
</script>
<style lang="scss" scoped>
page {
  background-color: #f5f7f9;
}
.order-details {
  &::before {
    content: "";
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 180rpx;
  }

  &.blue-top::before {
    background: linear-gradient(236deg, #4a93e1 -6%, #5c7ff4 90%);
  }

  .details-content {
    width: 100vw;
    @include flex-vc;
    position: relative;
    z-index: 2;
  }

  .order-top {
    width: 694rpx;
    height: 112rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left-info {
      height: 90%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .status {
        color: #333333;
        font-size: 32rpx;
        &.white {
          color: #ffffff;
        }
      }

      .time {
        font-size: 24rpx;
        color: #666666;
        &.white {
          color: #ffffff;
          opacity: 0.66;
        }
      }
    }

    .comment-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 24rpx;
      line-height: 34rpx;
      color: #ffffff;
    }
  }

  .step-box {
    width: 702rpx;
    border-radius: 24rpx;
    background: #ffffff;
    padding: 32rpx 0;
  }

  .info-box {
    margin-top: 16rpx;
    width: 702rpx;
    border-radius: 24rpx;
    background: #ffffff;
    padding: 28rpx 24rpx;
    @include borderBox;

    .title {
      font-size: 28rpx;
      line-height: 44px;
      color: #333333;
    }

    .cut-off {
      margin-top: 28rpx;
      border: 2rpx solid #f6f6f6;
      margin-bottom: 28rpx;
    }

    .steps-content {
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

    .info-cell {
      height: 34rpx;
      display: flex;
      align-items: center;
      font-size: 24rpx;
      margin-bottom: 16rpx;

      .label {
        flex-shrink: 0;
        flex-shrink: 0;
        width: 136rpx;
        color: #7b7b7b;
      }

      .value {
        color: #333333;
        @include ellipsis-multiLine(1);
      }

      .copy {
        flex-shrink: 0;
        margin-left: 16rpx;
        width: 66rpx;
        height: 28rpx;
        border-radius: 32rpx;
        border: 1.2rpx solid #d8d8d8;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20rpx;
        color: #7b7b7b;
      }
    }
  }

  .logistic-code {
    margin-top: 16rpx;
    width: 702rpx;
    height: 112rpx;
    border-radius: 24rpx;
    background: #ffffff;
    padding: 0 24rpx;
    @include borderBox;
    display: flex;
    align-items: center;

    .title {
      flex-shrink: 0;
      font-size: 28rpx;
      color: #333333;
      margin-right: 24rpx;
    }

    .value {
      flex-grow: 1;
      font-size: 28rpx;
      color: #333333;
      @include ellipsis-multiLine(1);
      margin-right: 16rpx;
      text-align: right;
    }

    .btn {
      flex-shrink: 0;
      font-size: 24rpx;
      color: #666666;
    }
  }

  .bottom-btns {
    position: fixed;
    width: 100vw;
    z-index: 3;
    left: 0;
    bottom: 0;
    padding-top: 16rpx;
    padding-bottom: 64rpx;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-content {
    @include flex-vhc;

    .title {
      margin-top: 32rpx;
      font-size: 32rpx;
      font-weight: 500;
      line-height: 40rpx;
      color: #333333;
      margin-bottom: 32rpx;
    }

    .tips {
      font-size: 28rpx;
      line-height: 42rpx;
      color: #666666;
      text-align: center;
    }
  }
}
</style>
