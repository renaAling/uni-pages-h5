<template>
  <section class="express-index">
    <!-- 全局加载 -->
    <common-loading v-if="isLoading" mTop="36vh"></common-loading>
    <!-- 加载完毕 -->
    <template v-else>
      <template v-if="entryOptions.length">
        <view
          class="entry-item"
          v-for="entry in entryOptions"
          :key="entry.type"
          @click="jumpToExpress(entry)"
        >
          <up-image
            class="cover"
            :src="entry.cover"
            mode="aspectFit"
            width="702rpx"
            height="468rpx"
            :fade="false"
          >
            <template #error>
              <view class="cover-error">
                <view class="text">{{ entry.name }}</view>
              </view>
            </template>
          </up-image>
        </view>
      </template>
      <!-- 空状态 -->
      <up-empty
        v-else
        mode="data"
        text="系统对接中，敬请期待～"
        marginTop="36vh"
      ></up-empty>
      <!-- 浮动按钮 -->
      <view class="float-order" @click="jumpToOrder">
        <up-image
          :src="orderIcon"
          mode="aspectFit"
          width="48rpx"
          height="48rpx"
        ></up-image>
        <view class="text">订单</view>
      </view>
    </template>
  </section>
</template>

<script setup>
import { route } from "@/uni_modules/uview-plus";
import { getExpressTypesApi } from "@/api/express.js";

import localEntry from "@/static/images/local-entry.png";
import normalEntry from "@/static/images/normal-entry.png";
import orderIcon from "@/static/icons/order-white.png";

// 快递状态管理
import { useExpressStore } from "@/store/modules/express";
const expressStore = useExpressStore();

// 快递入口配置
const entryOptions = ref([]);

// 调整至快递页面
const jumpToExpress = entry => {
  // 全局状态储存「快递类型」
  expressStore.updateExpressType(entry.code);
  route({
    url: "pages/express/create",
  });
};

// 跳转至订单页
const jumpToOrder = () => {
  route({
    url: "pages/express-order/list",
  });
};

// 页面初始化
const isLoading = ref(false);
// 获取快递类型
const getExpressTypes = () => {
  isLoading.value = true;
  getExpressTypesApi()
    .then(res => {
      const List = res || [];
      entryOptions.value = List.map(item => {
        let retItem = item;
        switch (item.code) {
          case "LOCAL":
            retItem.cover = localEntry;
            break;
          case "LOGISTICS":
            retItem.cover = normalEntry;
            break;
          default:
            retItem.cover = "errorCover";
            break;
        }
        return retItem;
      });
      // 同步缓存
      expressStore.updateExpressTypes(entryOptions.value);
      isLoading.value = false;
    })
    .catch(() => {
      // 如果获取失败 那么就给默认的设置
      const defaultTypes = [
        {
          id: "1",
          code: "LOCAL",
          name: "同城快递",
          cover: localEntry,
        },
        {
          id: "2",
          code: "LOGISTICS",
          name: "普通快递",
          cover: normalEntry,
        },
      ];
      // 同步缓存
      entryOptions.value = defaultTypes;
      expressStore.updateExpressTypes(defaultTypes);
      isLoading.value = false;
    });
};

// 用户每次在小程序进入「快递闪送」的时候 重置网站中本地缓存的选项数据
onLoad(() => {
  // 获取快递类型
  getExpressTypes();
  // 重置 省市区选择器选项
  expressStore.clearAreaTree();
});
</script>

<style lang="scss" scoped>
page {
  background-color: #f5f7f9;
}

.express-index {
  @include flex-vc;
  padding-top: 32rpx;
  padding-bottom: 200rpx;

  .entry-item {
    width: 702rpx;
    height: 468rpx;
    border-radius: 24rpx;
    margin-bottom: 32rpx;
    border-radius: 24rpx;
    overflow: hidden;
    @include flex-vhc;
    box-shadow: 0 20rpx 20rpx -10rpx rgba(0, 0, 0, 0.1);

    .cover-error {
      width: 100%;
      height: 100%;
      @include flex-vhc;

      background: rgba(71, 133, 234, 0.8);
      padding: 24rpx;
      @include borderBox;

      .text {
        font-size: 68rpx;
        letter-spacing: 20rpx;
        font-weight: 500;
        color: #ffffff;
        @include ellipsis-multiLine(1);
      }
    }
  }

  .float-order {
    position: fixed;
    right: 34rpx;
    bottom: 86rpx;
    width: 128rpx;
    height: 128rpx;
    @include flex-vhc;
    background: rgba(71, 133, 234, 0.8);
    box-shadow: 0px 8px 20px 0px #4785ea;
    border-radius: 50%;
    .text {
      font-size: 20rpx;
      color: #ffffff;
      font-weight: bold;
      margin-top: 6rpx;
    }
  }
}
</style>
