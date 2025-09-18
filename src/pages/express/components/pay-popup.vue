<template>
  <up-popup :show="isPopupShow" closeable @close="onPopupClose">
    <view class="pay-popup">
      <template v-if="payPrice">
        <view class="popop-title">支付金额</view>
        <view class="symbol-price">
          <span class="symbol">￥</span>
          <span class="money">{{ formatPaymentAmount(payPrice) }}</span>
        </view>
      </template>
      <view class="pay-cell">
        <view class="cell-left">
          <up-image
            :src="weChatIcon"
            mode="aspectFit"
            width="48rpx"
            height="48rpx"
          ></up-image>
          <view class="name">微信支付</view>
        </view>
        <up-icon
          name="checkmark-circle-fill"
          color="#4785EA"
          size="38rpx"
        ></up-icon>
      </view>
      <view class="cut-off"></view>
      <view class="pay-cell">
        <view class="cell-left">
          <up-image
            :src="cloudIcon"
            mode="aspectFit"
            width="48rpx"
            height="48rpx"
          ></up-image>
          <view class="name disable">云闪付</view>
        </view>
        <view class="holder">敬请期待</view>
      </view>
      <up-button
        type="primary"
        shape="circle"
        :custom-style="btnStyle"
        :loading="isPaying"
        loadingText="支付中"
        @click="onPayClick"
        :text="payBtnStr"
      ></up-button>
    </view>
  </up-popup>
  <!-- 同城快递提示 -->
  <up-modal
    :show="isModalShow"
    content="确认取消当前快递的支付？"
    confirmText="继续支付"
    showCancelButton
    cancelText="取消支付"
    confirmColor="#4785EA"
    width="560rpx"
    @confirm="onModalConfirm"
    @cancel="onModalCancel"
  >
    <view class="modal-tips">确认取消当前快递的支付？</view>
  </up-modal>
</template>

<script setup>
import wx from "weixin-js-sdk";

import { route, toast } from "@/uni_modules/uview-plus";
import { getOrderDetailApi } from "@/api/express.js";
import { formatPaymentAmount } from "@/utils/index.js";

const props = defineProps({
  // 用户选的公司数据
  company: {
    type: Object,
    default: () => {},
  },
  // 快递订单
  orderCode: {
    type: String,
    default: () => "",
  },
});

import weChatIcon from "@/static/icons/weChat-pay.png";
import cloudIcon from "@/static/icons/cloud-pay.png";

const isPopupShow = ref(false);

// 订单实际支付金额
const payPrice = ref();

// 底部按钮样式
const btnStyle = {
  background: "#4785EA",
  width: "670rpx",
  height: "100rpx",
  margin: "170rpx 0 0",
};

// 取消支付弹窗
const isModalShow = ref(false);
// 用户确认取消支付
const onModalConfirm = () => {
  isModalShow.value = false;
};
const onModalCancel = () => {
  isModalShow.value = false;
  route({
    type: "reLaunch",
    url: "pages/express-order/list",
  });
};

// 支付文案
const payBtnStr = computed(() => {
  return `确认支付${payPrice.value ? ` ¥${formatPaymentAmount(payPrice.value)}` : ""}`;
});

// 检查用户是否能唤起支付
const checkOrderCanPay = async () => {
  return new Promise((resolve, reject) => {
    getOrderDetailApi(props.orderCode)
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

// 用户确认支付
const isPaying = ref(false);

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
      // 跳转至订单页面
      setTimeout(() => {
        route({
          type: "reLaunch",
          url: "pages/express-order/list",
        });
      }, 2000);
      return;
    }
    // 支付配置
    if (typeof wx !== "undefined" && wx.miniProgram) {
      wx.miniProgram.getEnv(res => {
        if (res.miniprogram) {
          isPaying.value = true;
          uni.hideLoading();
          isPaying.value = false;
          wx.miniProgram.redirectTo({
            url: `/pages_h5/pages/h5_express_wechat_pay?orderCode=${props.orderCode}`,
          });
        } else {
          uni.hideLoading();
          toast("唤起支付失败");
        }
      });
    } else {
      uni.hideLoading();
      toast("唤起支付失败");
    }
  } catch (error) {
    uni.hideLoading();
    isPaying.value = false;
    toast("唤起支付失败");
  }
};

// 打开编辑器
const isLoading = ref(true);
const openPayPopup = () => {
  // 给个默认价格
  payPrice.value = props.company?.price || null;
  isPopupShow.value = true;
  isLoading.value = true;
  getOrderDetailApi(props.orderCode)
    .then(res => {
      payPrice.value = res?.payPrice || null;
    })
    .catch(() => {
      payPrice.value = null;
    });
};

// 关闭编辑器
const onPopupClose = () => {
  isModalShow.value = true;
};

// 暴露方法给父组件
defineExpose({
  openPayPopup,
});
</script>
<style lang="scss" scoped>
.pay-popup {
  padding: 112rpx 0 140rpx;
  @include flex-vhc;

  .popop-title {
    font-size: 24rpx;
    line-height: 34rpx;
    color: #333333;
    margin-bottom: 8rpx;
  }

  .symbol-price {
    height: 112px;
    @include flex-hc;
    color: #1a1a1a;
    margin-bottom: 120rpx;

    .symbol {
      font-size: 32rpx;
      position: relative;
      top: 14rpx;
    }

    .money {
      font-size: 80rpx;
    }
  }

  .pay-cell {
    width: 638rpx;
    @include flex-hcb;

    .cell-left {
      @include flex-hc;
      .name {
        font-size: 32rpx;
        color: #1a1a1a;
        margin-left: 20rpx;

        &.disable {
          opacity: 0.4;
        }
      }
    }

    .holder {
      font-size: 28rpx;
      color: #f36d2f;
    }
  }

  .cut-off {
    width: 566rpx;
    border-bottom: 1px solid #eeeeee;
    margin: 40rpx 0;
  }

  .modal-tips {
    font-size: 32rpx;
    font-weight: 500;
    line-height: 40rpx;
    color: #333333;
    text-align: center;
  }
}
</style>
