<template>
  <section class="common-empty" :style="emptyConfig.style">
    <up-image
      class="empty-image"
      :class="type"
      :src="emptyConfig.imgSrc"
      mode="aspectFit"
      :width="emptyConfig.imgWidth"
      :height="emptyConfig.imgHeight"
      fade
    ></up-image>
    <view class="text" :class="type">{{ text || emptyConfig.text }}</view>
  </section>
</template>

<script setup>
const props = defineProps({
  // 空占位类型
  // 枚举 default:暂无数据 business:暂无商务合作
  type: {
    type: String,
    default: "default",
  },
  text: {
    type: String,
    default: () => null,
  },
});

// 空状态图片
import defaultImg from "@/static/images/default-empty.png";

// 计算属性 生成 占位组件配置
const emptyConfig = computed(() => {
  let retConfig = {};
  switch (props.type) {
    case "business":
      retConfig = {
        text: "暂无商务合作",
        imgSrc: defaultImg,
        imgWidth: "560rpx",
        imgHeight: "464rpx",
        style: {
          marginTop: "360rpx",
        },
      };
      break;
    default:
      retConfig = {
        text: "暂无数据",
        imgSrc: defaultImg,
        imgWidth: "560rpx",
        imgHeight: "464rpx",
        style: {
          marginTop: "360rpx",
        },
      };
      break;
  }
  return retConfig;
});
</script>
<style lang="scss" scoped>
.common-empty {
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .empty-image.stadium,
  .empty-image.order {
    mask-image: linear-gradient(to bottom, black 10%, transparent 100%);
  }

  .text {
    font-size: 28rpx;
    line-height: 40rpx;
    color: #737b80;

    &.stadium,
    &.order {
      position: relative;
      top: -160rpx;
    }

    &.place,
    &.date,
    &.placeErr {
      margin-top: 24rpx;
    }
  }
}
</style>
