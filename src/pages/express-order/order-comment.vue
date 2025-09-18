<template>
  <section class="order-comment">
    <view class="page-content">
      <!-- 顶部 -->
      <view class="top-tips">
        <view class="tips-item" v-for="(tip, idx) in rateTips" :key="idx">
          <up-image
            :src="tip.icon"
            mode="aspectFit"
            width="28rpx"
            height="28rpx"
          ></up-image>
          <view class="text">{{ tip.text }}</view>
        </view>
      </view>
      <!-- 评分 -->
      <up-rate
        :count="5"
        v-model="value"
        :size="60"
        activeColor="#EA9B25"
        allowHalf
        :gutter="10"
      ></up-rate>
    </view>
  </section>
</template>

<script setup>
import rate1Icon from "@/static/icons/rate-1.png";
import rate2Icon from "@/static/icons/rate-2.png";
import rate3Icon from "@/static/icons/rate-3.png";
import rate4Icon from "@/static/icons/rate-4.png";
import rate5Icon from "@/static/icons/rate-5.png";

// tips
const rateTips = ref([
  {
    icon: rate1Icon,
    text: "很糟糕",
  },
  {
    icon: rate2Icon,
    text: "较差",
  },
  {
    icon: rate3Icon,
    text: "一般",
  },
  {
    icon: rate4Icon,
    text: "还可以",
  },
  {
    icon: rate5Icon,
    text: "超预期",
  },
]);

// 评分
const value = ref(5);
</script>
<style lang="scss" scoped>
page {
  background-color: #f5f7f9;
}
.order-comment {
  &::before {
    content: "";
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 692rpx;
    background: linear-gradient(
      179deg,
      #c4daff -4%,
      rgba(241, 245, 253, 0.76) 86%,
      rgba(233, 248, 248, 0.17) 154%
    );
  }
  .page-content {
    width: 100vw;
    @include flex-vc;
    position: relative;
    z-index: 2;
  }

  .top-tips {
    margin-top: 40rpx;
    width: 600rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40rpx;

    .tips-item {
      display: flex;
      align-items: center;
    }
    .text {
      line-height: 28rpx;
      font-size: 26rpx;
      color: #333;
      position: relative;
      top: 5rpx;
    }
  }
}
</style>
