<template>
  <view class="common-loading" :style="loadingStyle">
    <view class="healthy-loader">
      <view class="center-circle"></view>
      <view class="leaf leaf-1"></view>
      <view class="leaf leaf-2"></view>
      <view class="leaf leaf-3"></view>
      <view class="leaf leaf-4"></view>
      <view class="water-drop drop-1"></view>
      <view class="water-drop drop-2"></view>
      <view class="water-drop drop-3"></view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  // 加载状态的占高
  mTop: {
    type: [Number, String],
    default: "200rpx",
  },
  // 加载状态的占高
  mBottom: {
    type: [Number, String],
    default: "200rpx",
  },
});

// 计算属性 生成 样式
const loadingStyle = computed(() => {
  return {
    marginTop: uni.$u.addUnit(props.mTop),
    marginBottom: uni.$u.addUnit(props.mBottom),
  };
});
</script>

<style lang="scss" scoped>
.common-loading {
  position: relative;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* 核心健康元素加载器 */
  .healthy-loader {
    position: relative;
    width: 240rpx;
    height: 240rpx;
    transform: scale(1.2);
  }

  /* 中心圆 - 呼吸效果 */
  .center-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90rpx;
    height: 90rpx;
    background: #4785ea; /* 主色调 */
    border-radius: 50%;
    animation: pulse 1.8s infinite ease-in-out;
    z-index: 10;
    box-shadow: 0 0 30px rgba(71, 133, 234, 0.6); /* 蓝色光晕效果 */
  }

  /* 叶子元素 */
  .leaf {
    position: absolute;
    transform-origin: center;
  }

  .leaf-1 {
    top: 20rpx;
    left: 90rpx;
    width: 60rpx;
    height: 60rpx;
    background: #62b6ff; /* 浅蓝色1 */

    border-radius: 0 100%;
    transform: rotate(0deg);
    animation: leafFloat1 1.8s infinite ease-in-out;
  }

  .leaf-2 {
    top: 84rpx;
    right: 30rpx;
    width: 24rpx;
    height: 24rpx;
    background: #3a7bd5; /* 深蓝色1 */
    border-radius: 100% 0;
    transform: rotate(30deg);
    animation: leafFloat2 1.8s infinite ease-in-out;
  }

  .leaf-3 {
    bottom: 30rpx;
    left: 100rpx;
    width: 46rpx;
    height: 46rpx;
    background: #9ec5ff; /* 浅蓝色2 */
    border-radius: 100% 0;
    transform: rotate(245deg);
    animation: leafFloat3 1.8s infinite ease-in-out;
  }

  .leaf-4 {
    top: 100rpx;
    left: 20rpx;
    width: 44rpx;
    height: 44rpx;
    background: #2d62b3; /* 深蓝色2 */
    border-radius: 0 100%;
    transform: rotate(150deg);
    animation: leafFloat4 1.8s infinite ease-in-out;
  }

  /* 水滴元素 */
  .water-drop {
    position: absolute;
    width: 16rpx;
    height: 16rpx;
    background: #00b4d8; /* 青色点缀 */
    border-radius: 50% 15% 50% 50%;
    transform: rotate(-45deg);
    opacity: 0;
  }

  .drop-1 {
    top: 30rpx;
    left: 120rpx;
    animation: dropFall 2s infinite ease-in-out;
    animation-delay: 0.2s;
  }

  .drop-2 {
    top: 100rpx;
    left: 170rpx;
    animation: dropFall 2s infinite ease-in-out;
    animation-delay: 0.7s;
  }

  .drop-3 {
    top: 160rpx;
    left: 110rpx;
    animation: dropFall 2s infinite ease-in-out;
    animation-delay: 1.2s;
  }
}
@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 0 0 rgba(71, 133, 234, 0.4);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 0 0 10px rgba(71, 133, 234, 0);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 0 0 rgba(71, 133, 234, 0);
  }
}

@keyframes leafFloat1 {
  0%,
  100% {
    transform: rotate(0deg) translateY(0);
  }
  50% {
    transform: rotate(10deg) translateY(-5px);
  }
}

@keyframes leafFloat2 {
  0%,
  100% {
    transform: rotate(30deg) translateY(0);
  }
  50% {
    transform: rotate(20deg) translateY(5px);
  }
}

@keyframes leafFloat3 {
  0%,
  100% {
    transform: rotate(245deg) translateY(0);
  }
  50% {
    transform: rotate(255deg) translateY(5px);
  }
}

@keyframes leafFloat4 {
  0%,
  100% {
    transform: rotate(150deg) translateY(0);
  }
  50% {
    transform: rotate(160deg) translateY(-5px);
  }
}

@keyframes dropFall {
  0% {
    opacity: 0;
    transform: rotate(-45deg) translateY(-20px);
  }
  30% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(-45deg) translateY(40px);
  }
}
</style>
