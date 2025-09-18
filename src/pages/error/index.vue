<template>
  <view class="error-page">
    <up-image
      class="error-img"
      src="https://oss.duomixing.com/rls/tracompsimage/public/product/2024/12/05/rUv3nJc7QE6oKtEXMLtv.png"
      mode="widthFix"
      width="80vw"
    ></up-image>
    <view class="error-text" v-if="errTypeStr">{{ errTypeStr }}</view>
  </view>
</template>

<script setup>
// 错误类型
const errType = ref(null);

// 错误类型格式化
const errTypeStr = computed(() => {
  let retStr = null;
  switch (errType.value) {
    case "loginExpired":
      retStr = "登录状态已过期";
      break;
    case "needLogin":
      retStr = "登录状态已失效";
      break;
    case "pathError":
      retStr = "路径链接错误";
      break;
    default:
      retStr = null;
      break;
  }
  return retStr;
});

onLoad(option => {
  errType.value = option?.type || null;
});
</script>
<style lang="scss" scoped>
page {
  background-color: #fff;
}
.error-page {
  height: 100vh;
  @include flex-vhc;

  .error-img {
    margin-bottom: 24rpx;
  }

  .error-text {
    font-size: 28rpx;
    line-height: 40rpx;
    color: #737b80;
    margin-bottom: 20vh;
  }
}
</style>
