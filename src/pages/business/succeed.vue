<template>
  <section class="order-succeed">
    <view class="succeed-info">
      <up-image
        :src="succeedImg"
        mode="aspectFit"
        width="289rpx"
        height="290rpx"
      ></up-image>
      <view class="title">提交成功</view>
      <view class="msg">工作人员将尽快与您联系，请保持通话畅通</view>
      <view class="page-btns">
        <up-button
          type="primary"
          shape="circle"
          :custom-style="indexBtnStyle"
          text="知道了"
          @click="backToIndex"
        ></up-button>
      </view>
    </view>
  </section>
</template>

<script setup>
import { route } from "@/uni_modules/uview-plus";
import succeedImg from "@/static/images/succeed-img.png";

// 首页按钮样式
const indexBtnStyle = reactive({
  background: "#E3F0FF",
  borderColor: "#E3F0FF",
  color: "#4785EA",
  height: "88rpx",
  marginTop: "32rpx",
});

const backToIndex = () => {
  route({
    type: "reLaunch",
    url: "pages/business/list",
  });
};
</script>
<style lang="scss" scoped>
page {
  background-color: #fff;
}

.order-succeed {
  &::before {
    content: "";
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(
      180deg,
      rgba(71, 133, 234, 0.4) 0%,
      rgba(245, 247, 249, 0) 32%
    );
  }

  .succeed-info {
    position: relative;
    z-index: 2;
    padding-top: 92rpx;
    @include flex-vc;
  }

  .title {
    margin-top: 64rpx;
    font-size: 56rpx;
    font-weight: 500;
    line-height: 62rpx;
  }

  .msg {
    margin-top: 24rpx;
    font-size: 28rpx;
    line-height: 44rpx;
    text-align: center;
  }
  .page-btns {
    position: fixed;
    left: 50%;
    bottom: 100rpx;
    width: 560rpx;
    margin-left: -280rpx;
    ::v-deep .u-button__text {
      font-size: 32rpx !important;
      font-weight: 500;
    }
  }
}
</style>
