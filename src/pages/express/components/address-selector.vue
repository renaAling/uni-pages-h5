<template>
  <section class="address-selector">
    <!-- 寄件人 -->
    <view class="selector-item">
      <!-- 左边 -->
      <view class="left-info">
        <view class="top-info">
          <view class="flag"><view>寄</view></view>
          <up-skeleton
            :rows="1"
            :title="false"
            rowsHeight="38rpx"
            :rowsWidth="['50%']"
            :loading="isMailingLoading"
          >
            <view class="name-phone" v-if="hasMailingInfo">
              <view class="name">{{ mailingInfo.realName }}</view>
              <view v-if="mailingPhoneText" class="phone">
                {{ mailingPhoneText }}
              </view>
            </view>
            <view class="title" v-else>寄件人信息</view>
          </up-skeleton>
        </view>
        <up-skeleton
          class="bottom-address"
          :rows="1"
          :title="false"
          rowsHeight="34rpx"
          :rowsWidth="['100%']"
          :loading="isMailingLoading"
        >
          <view class="address-text" v-if="hasMailingInfo">
            {{ addressTextFormat(mailingInfo) }}
          </view>
          <view class="address-text" v-else>请输入您的寄件地址信息</view>
        </up-skeleton>
      </view>
      <!-- 右边 -->
      <view class="right-btn" @click="jumpToAddress('mailing')">
        <view>地址簿</view>
      </view>
    </view>
    <!-- 分割线 -->
    <view class="cut-off"></view>
    <!-- 收件人 -->
    <view class="selector-item">
      <!-- 左边 -->
      <view class="left-info">
        <view class="top-info">
          <view class="flag yellow"><view>收</view></view>
          <up-skeleton
            :rows="1"
            :title="false"
            rowsHeight="38rpx"
            :rowsWidth="['50%']"
            :loading="isConsigneeLoading"
          >
            <view class="name-phone" v-if="hasConsigneeInfo">
              <view class="name">{{ consigneeInfo.realName }}</view>
              <view v-if="consigneePhoneText" class="phone">
                {{ consigneePhoneText }}
              </view>
            </view>
            <view class="title" v-else>收件人信息</view>
          </up-skeleton>
        </view>
        <up-skeleton
          class="bottom-address"
          :rows="1"
          :title="false"
          rowsHeight="34rpx"
          :rowsWidth="['100%']"
          :loading="isConsigneeLoading"
        >
          <view class="address-text" v-if="hasConsigneeInfo">
            {{ addressTextFormat(consigneeInfo) }}
          </view>
          <view class="address-text" v-else>请输入您的收件地址信息</view>
        </up-skeleton>
      </view>
      <!-- 右边 -->
      <view class="right-btn" @click="jumpToAddress('consignee')">
        <view>地址簿</view>
      </view>
    </view>
  </section>
  <!-- 同城快递提示 -->
  <up-modal
    :show="isModalShow"
    confirmText="我知道了"
    confirmColor="#4785EA"
    width="560rpx"
    @confirm="onLocalTipsConfirm"
  >
    <view class="local-tips">
      当前仅支持同城寄件，请确认寄件人与收件人城市一致哦～
    </view>
  </up-modal>
</template>

<script setup>
import { route, test } from "@/uni_modules/uview-plus";
import { formatPhoneNumber } from "@/utils/index.js";

import { getAddressDefaultApi } from "@/api/address.js";

// 快递状态管理
import { useExpressStore } from "@/store/modules/express";
const expressStore = useExpressStore();

// 寄件人信息
const isMailingLoading = ref(false);
const mailingInfo = ref(null);
const hasMailingInfo = computed(() => {
  return !test.isEmpty(mailingInfo.value);
});
const mailingPhoneText = computed(() => {
  const phone = mailingInfo.value?.phone || null;
  return formatPhoneNumber(phone);
});

// 收件人信息
const isConsigneeLoading = ref(false);
const consigneeInfo = ref(null);
const hasConsigneeInfo = computed(() => {
  return !test.isEmpty(consigneeInfo.value);
});
const consigneePhoneText = computed(() => {
  const phone = consigneeInfo.value?.phone || null;
  return formatPhoneNumber(phone);
});

// 跳转至「地址簿」
const jumpToAddress = type => {
  route({
    url: "pages/express/address",
    params: {
      type,
    },
  });
};

// 地址格式化
const addressTextFormat = data => {
  let textArr = [];
  if (data?.province) textArr.push(data.province);
  if (data?.city) textArr.push(data.city);
  if (data?.district) textArr.push(data.district);
  if (data?.detail) textArr.push(data.detail);
  return textArr.join("");
};

// 同城提示
const isModalShow = ref(false);
const errAddressType = ref(null);

// 用户确认同城地址失败提示
const onLocalTipsConfirm = () => {
  // 移除当前设置的错误地址
  switch (errAddressType.value) {
    case "mailing":
      isMailingLoading.value = true;
      mailingInfo.value = null;
      setTimeout(() => (isMailingLoading.value = false), 300);
      break;
    case "consignee":
      isConsigneeLoading.value = true;
      consigneeInfo.value = null;
      setTimeout(() => (isConsigneeLoading.value = false), 300);
      break;
    default:
      break;
  }
  errAddressType.value = null;
  isModalShow.value = false;
};

// 组件内部更新事件
const emit = defineEmits(["confirm"]);

// 设置地址
const setAddressData = data => {
  // 当前设置的地址类型 mailing: 寄件人  consignee: 收件人
  const curType = data?._curType || null;
  // 设置地址
  switch (curType) {
    case "mailing":
      isMailingLoading.value = true;
      mailingInfo.value = data;
      setTimeout(() => (isMailingLoading.value = false), 300);
      break;
    case "consignee":
      isConsigneeLoading.value = true;
      consigneeInfo.value = data;
      setTimeout(() => (isConsigneeLoading.value = false), 300);
      break;
    default:
      break;
  }
  // 检验 快递类型 同城快递
  const expressType = expressStore.getExpressType;
  // 当前是「同城地址」
  if (expressType == "LOCAL") {
    let isNotSameCityForLocal = false;
    const curCityId = data?.cityId || null;
    // 当前用户设置的是「寄件地址」
    if (curType == "mailing") {
      const consigneeCityId = consigneeInfo.value?.cityId || null;
      if (consigneeCityId && curCityId !== consigneeCityId) {
        isNotSameCityForLocal = true;
      }
    }
    // 当前用户设置的是「收件地址」
    if (curType == "consignee") {
      const mailingCityId = mailingInfo.value?.cityId || null;
      if (mailingCityId && curCityId !== mailingCityId) {
        isNotSameCityForLocal = true;
      }
    }
    // 如果用户选着的是「同城快递」但是选择了不同的城市
    if (isNotSameCityForLocal) {
      errAddressType.value = curType;
      isModalShow.value = true;
    } else {
      // 通过 「同城快递」 地址验证
      emit("confirm");
    }
  } else {
    // 普通快递
    emit("confirm");
  }
};

// 获取默认地址
const getDefaultAddress = () => {
  isMailingLoading.value = true;
  getAddressDefaultApi()
    .then(res => {
      mailingInfo.value = res || null;
      isMailingLoading.value = false;
    })
    .catch(() => {
      isMailingLoading.value = false;
    });
};

// 暴露给外部组件的数据
const exposeData = computed(() => {
  return {
    hasMailingInfo: hasMailingInfo.value,
    mailingInfo: mailingInfo.value,
    hasConsigneeInfo: hasConsigneeInfo.value,
    consigneeInfo: consigneeInfo.value,
  };
});

// 暴露方法给父组件
defineExpose({
  exposeData,
  getDefaultAddress,
  setAddressData,
});
</script>
<style lang="scss" scoped>
.address-selector {
  width: 702rpx;
  padding: 32rpx;
  @include borderBox;
  background: #ffffff;
  border-radius: 24rpx;

  .selector-item {
    @include flex-hc;

    .left-info {
      flex-grow: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .top-info {
      height: 42rpx;
      @include flex-hc;

      .flag {
        flex-shrink: 0;
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background: #4785ea;
        @include flex-vhc;
        font-size: 20rpx;
        color: #ffffff;
        margin-right: 16rpx;

        &.yellow {
          background: #ea9b25;
        }
      }

      .name-phone {
        display: flex;
        align-items: center;

        .name {
          font-size: 32rpx;
          font-weight: 500;
          color: #333333;
          @include ellipsis-multiLine(1);
        }

        .phone {
          font-size: 24rpx;
          color: #999999;
          flex-shrink: 0;
          margin-left: 8rpx;
        }
      }

      .title {
        font-size: 32rpx;
        font-weight: 500;
        color: #333333;
      }
    }

    .bottom-address {
      margin-top: 10rpx;
      flex-grow: 0;
      margin-left: 56rpx;
    }

    .address-text {
      line-height: 34rpx;
      font-size: 24rpx;
      color: #666666;
    }

    .right-btn {
      flex-shrink: 0;
      padding-left: 24rpx;
      margin-left: 24rpx;
      height: 48rpx;
      border-left: 2rpx solid #f0f0f0;
      @include flex-vhc;
      font-size: 24rpx;
      font-weight: 500;
      color: #333333;
    }
  }

  .cut-off {
    margin: 32rpx 0 32rpx 56rpx;
    width: calc(100% - 56rpx);
    border-bottom: 2rpx solid #f5f5f5;
  }

  .local-tips {
    font-size: 32rpx;
    font-weight: 500;
    line-height: 40rpx;
    color: #333333;
    text-align: center;
  }
}
</style>
