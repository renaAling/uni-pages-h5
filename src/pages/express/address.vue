<template>
  <section class="express-address">
    <!-- 全局加载 -->
    <common-loading v-if="isLoading" mTop="36vh"></common-loading>
    <!-- 加载完成 -->
    <template v-else>
      <view class="page-list" v-if="pageList.length">
        <address-card
          v-for="address in pageList"
          :key="address.id"
          :type="addressType"
          :data="address"
          @setDefault="setDefault"
          @delAddress="delAddress"
        ></address-card>
      </view>
      <!-- 空状态 -->
      <up-empty
        v-else
        mode="address"
        text="暂无收货地址"
        marginTop="36vh"
      ></up-empty>
      <!-- 底部按钮 -->
      <view class="page-bottom">
        <up-button
          type="primary"
          shape="circle"
          :custom-style="btnStyle"
          text="新增地址"
          @click="jumpToAdd"
        ></up-button>
      </view>
    </template>
    <!-- 删除模态窗 -->
    <up-modal
      :show="isModalShow"
      confirmText="确认删除"
      confirmColor="#4785EA"
      showCancelButton
      cancelText="暂不删除"
      @cancel="isModalShow = false"
      @confirm="onDelConfirm"
    >
      <view class="modal-content">
        <up-image
          :src="warnIcon"
          mode="aspectFit"
          width="96rpx"
          height="96rpx"
        ></up-image>
        <view class="title">确认删除地址吗？</view>
      </view>
    </up-modal>
  </section>
</template>

<script setup>
import { route } from "@/uni_modules/uview-plus";
import {
  getAddressListApi,
  setAddressDefaultApi,
  deleteAddressApi,
} from "@/api/address.js";

import addressCard from "./components/address-card.vue";

import warnIcon from "@/static/icons/warn-icon.png";

// 快递状态管理
import { useExpressStore } from "@/store/modules/express";
const expressStore = useExpressStore();

// 地址类型
// 枚举说明 mailing: 寄件地址  consignee: 收件地址
const addressType = ref("mailing");

// 地址列表
const isLoading = ref(true);
const pageList = ref([]);

// 设置默认
const setDefault = address => {
  const addressId = address.id;
  setAddressDefaultApi(addressId)
    .then(() => {
      pageList.value.forEach(item => {
        if (item.id == addressId) {
          item.isDefault = true;
        } else {
          item.isDefault = false;
        }
      });
    })
    .catch(async () => {
      isLoading.value = true;
      await getPageList();
      isLoading.value = false;
    });
};

// 删除相关
const isModalShow = ref(false);
const delAddressId = ref(null);

// 删除地址
const delAddress = delId => {
  delAddressId.value = delId;
  isModalShow.value = true;
};

// 用户确认删除
const onDelConfirm = () => {
  // 关闭模态窗
  isModalShow.value = false;
  uni.showLoading({ title: "删除中" });
  deleteAddressApi(delAddressId.value)
    .then(async () => {
      uni.hideLoading();
      uni.showToast({
        title: "删除成功",
        icon: "success",
        duration: 2000,
      });
      isLoading.value = true;
      await getPageList();
      isLoading.value = false;
    })
    .catch(async () => {
      uni.hideLoading();
      isLoading.value = true;
      await getPageList();
      isLoading.value = false;
    });
};

// 获取页面数据
const getPageList = () => {
  return new Promise(resolve => {
    getAddressListApi()
      .then(res => {
        pageList.value = res || [];
        resolve();
      })
      .catch(() => {
        pageList.value = [];
        resolve();
      });
  });
};

// 底部按钮样式
const btnStyle = {
  background: "#4785EA",
  height: "100rpx",
  width: "670rpx",
};

// 新增地址
const jumpToAdd = () => {
  route({
    url: "pages/express/address-editor",
    params: {
      mode: "create",
      type: addressType.value,
    },
  });
};

// 页面回退刷新
onShow(async () => {
  if (expressStore.needRefreshAddressList) {
    isLoading.value = true;
    await getPageList();
    expressStore.updateNeedRefreshAddressList(false);
    isLoading.value = false;
  }
});

// 下拉刷新
onPullDownRefresh(async () => {
  isLoading.value = true;
  await getPageList();
  isLoading.value = false;
  uni.stopPullDownRefresh();
});

onLoad(async options => {
  isLoading.value = true;
  // 地址簿类型
  addressType.value = options?.type || "mailing";
  // 获取地址簿
  await getPageList();
  isLoading.value = false;
});
</script>
<style lang="scss" scoped>
page {
  background-color: #f4f5f5;
}

.express-address {
  @include flex-vc;
  padding-bottom: 180rpx;

  .page-bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100vw;
    height: 180rpx;
    display: flex;
    justify-content: center;
    background: #fff;
    padding-top: 16rpx;
    @include borderBox;
  }

  .modal-content {
    @include flex-vhc;

    .title {
      margin-top: 32rpx;
      font-size: 32rpx;
      font-weight: 500;
      line-height: 40rpx;
      color: #333333;
    }
  }
}
</style>
