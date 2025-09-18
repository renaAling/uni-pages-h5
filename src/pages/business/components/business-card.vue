<template>
  <view class="business-card" @click="jumpToBusiness">
    <up-image
      class="top-img"
      show-loading
      fade
      :src="props.data.coverImageUrl"
      bgColor="#DAE6FB"
      mode="aspectFill"
      width="100%"
      height="100%"
    ></up-image>
  </view>
</template>

<script setup>
import { route } from "@/uni_modules/uview-plus";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
const jumpToBusiness = () => {
  route({
    url: "pages/business/details",
    params: {
      code: props.data.code,
    },
  });
};
</script>
<style lang="scss" scoped>
.business-card {
  width: 100%;
  height: 300rpx;
  border-radius: 14rpx;
  margin-bottom: 24rpx;
  background: #fff;
  position: relative;

  .top-img {
    flex-shrink: 0;
  }
}
</style>
