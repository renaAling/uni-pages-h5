<template>
  <up-popup :show="isPopupShow" @close="onPopupClose">
    <section class="goods-editor">
      <!-- 编辑器顶部 -->
      <view class="editor-top">
        <view class="title">物品信息</view>
        <view class="close-btn" @click="isPopupShow = false">
          <up-icon name="close" color="#999999" size="24rpx"></up-icon>
        </view>
      </view>
      <!-- 编辑器内部 -->
      <scroll-view class="editor-content" scroll-y>
        <view class="flex-vhc">
          <!-- 物品类型 -->
          <view class="part-title first-title">
            <view class="title">物品类型</view>
            <view class="required">必填</view>
          </view>
          <view class="type-list" v-if="goodsTypes.length">
            <view
              class="type-item"
              :class="{ active: curTypeId == type.id }"
              v-for="type in goodsTypes"
              :key="type.id"
              @click="onTypeClick(type)"
            >
              {{ type.name }}
            </view>
          </view>
          <!-- 其他类型 -->
          <view class="other-type" v-if="curTypeId == 99">
            <up-input
              v-model.trim="otherTypeStr"
              :maxlength="15"
              border="none"
              :cursorSpacing="70"
              placeholder="请输入其他物品名称"
            ></up-input>
          </view>
          <!-- 包裹重量 -->
          <view class="weight-bar">
            <view class="left-title">包裹重量(kg)</view>
            <up-number-box
              v-model="totalWeight"
              :min="1"
              :max="999"
              :inputWidth="70"
              buttonRadius="4rpx"
            ></up-number-box>
          </view>
          <!-- 设置体积 -->
          <view class="part-title">
            <view class="title">设置体积</view>
          </view>
          <view class="volume-input">
            <view class="input">
              <up-input
                v-model.trim="volumeData._length"
                type="digit"
                :maxlength="8"
                :cursorSpacing="70"
                border="none"
                inputAlign="center"
                placeholder="长   cm"
              ></up-input>
            </view>
            <up-icon name="close" color="#333333" size="20rpx"></up-icon>
            <view class="input">
              <up-input
                v-model.trim="volumeData._width"
                type="digit"
                :maxlength="8"
                :cursorSpacing="70"
                border="none"
                inputAlign="center"
                placeholder="宽   cm"
              ></up-input>
            </view>
            <up-icon name="close" color="#333333" size="20rpx"></up-icon>
            <view class="input">
              <up-input
                v-model.trim="volumeData._height"
                type="digit"
                :maxlength="8"
                :cursorSpacing="70"
                border="none"
                inputAlign="center"
                placeholder="高   cm"
              ></up-input>
            </view>
          </view>
          <!-- 底部 tips -->
          <view class="tips-text">
            注：实际重量以快递员最后核实为准，请当面与快递员核实，物品包装后重量增加，重量小体积大时，会按体积重量收费。
          </view>
        </view>
      </scroll-view>
      <!-- 底部按钮 -->
      <view class="bottom-btn">
        <up-button
          type="primary"
          shape="circle"
          :custom-style="btnStyle"
          text="确定"
          @click="onConfirmClick"
        ></up-button>
      </view>
    </section>
  </up-popup>
</template>

<script setup>
import { test, toast } from "@/uni_modules/uview-plus";

// 编辑器开关
const isPopupShow = ref(false);

// 物品类型 相关
const curTypeId = ref(null);
const curTypeName = ref("");
const onTypeClick = type => {
  curTypeId.value = type.id;
  curTypeName.value = type.name;
};
// 其他类型 文本
const otherTypeStr = ref("");
// 物品类型
const goodsTypes = [
  { id: 1, name: "文件" },
  { id: 2, name: "电子产品" },
  { id: 8, name: "宠物" },
  { id: 10, name: "医疗健康" },
  { id: 12, name: "服装" },
  { id: 13, name: "百货" },
  { id: 99, name: "其他" },
];

// 重量
const totalWeight = ref(1);
// 体积
const volumeData = reactive({
  _length: null,
  _width: null,
  _height: null,
});

// 底部按钮样式
const btnStyle = {
  background: "#4785EA",
  height: "100rpx",
  width: "670rpx",
};

// 验证体积函数
const validateVolumeData = volumeData => {
  const { _length, _width, _height } = volumeData;
  // 三个都为空，直接通过
  if (!_length && !_width && !_height) return true;
  // 如果有一个有值，则要求三个都有值
  const values = [_length, _width, _height];
  return values.every(v => v != null && v !== "");
};

// 组件内部更新事件
const emit = defineEmits(["confirm"]);

// 用户点击确认
const onConfirmClick = () => {
  // 验证「物品类型」
  if (test.isEmpty(curTypeId.value)) {
    toast("请选择物品类型");
    return;
  }
  // 他物品名称
  if (curTypeId.value == 99 && test.isEmpty(otherTypeStr.value)) {
    toast("请输入其他物品名称");
    return;
  }
  // 验证「体积」
  const isVolumePass = validateVolumeData(volumeData);
  if (!isVolumePass) {
    toast("请完善设置体积");
    return;
  }
  // 格式化数据
  const goodsData = {
    goodsTypeId: curTypeId.value,
    goodsTypeName: curTypeName.value,
    otherTypeStr: curTypeId.value == 99 ? otherTypeStr.value : "",
    totalWeight: totalWeight.value,
    volumeLength: volumeData._length,
    volumeWidth: volumeData._width,
    volumeHeight: volumeData._height,
  };
  emit("confirm", goodsData);
  // 关闭编辑器
  isPopupShow.value = false;
};

// 打开编辑器
const openGoodsEditor = data => {
  // 数据回显
  curTypeId.value = data.goodsTypeId;
  curTypeName.value = data.goodsTypeName;
  otherTypeStr.value = data.otherTypeStr;
  totalWeight.value = data.totalWeight;
  volumeData._length = data.volumeLength;
  volumeData._width = data.volumeWidth;
  volumeData._height = data.volumeHeight;
  // 展开 popup
  isPopupShow.value = true;
};

// 关闭编辑器
const onPopupClose = () => {
  isPopupShow.value = false;
};

// 暴露方法给父组件
defineExpose({
  openGoodsEditor,
});
</script>
<style lang="scss" scoped>
.goods-editor {
  @include flex-vhc;

  .editor-top {
    width: 670rpx;
    height: 104rpx;
    @include flex-hcb;
    border-bottom: 2rpx solid #f5f5f5;

    .title {
      font-size: 28rpx;
      font-weight: 500;
      color: #333333;
    }

    .close-btn {
      padding: 16rpx 0 16rpx 16rpx;
    }
  }

  .editor-content {
    width: 100vw;
    max-height: 62vh;

    .flex-vhc {
      width: 100%;
      @include flex-vhc;
    }
  }

  .part-title {
    width: 670rpx;
    height: 44rpx;
    @include flex-hc;
    margin-bottom: 16rpx;

    &.first-title {
      padding-top: 32rpx;
    }

    .title {
      font-size: 28rpx;
      color: #333333;
    }

    .required {
      width: 66rpx;
      height: 32rpx;
      border-radius: 64rpx;
      background: #fff2f2;
      font-size: 20rpx;
      color: #fa5151;
      @include flex-vhc;
      margin-left: 8rpx;
    }
  }

  .type-list {
    width: 670rpx;
    display: flex;
    flex-wrap: wrap;

    .type-item {
      padding-left: 52rpx;
      padding-right: 52rpx;
      height: 62rpx;
      border-radius: 32rpx;
      background: #f5f5f5;
      @include borderBox;
      @include flex-vhc;
      font-size: 24rpx;
      color: #333333;
      margin-right: 20rpx;
      margin-bottom: 20rpx;
      border: 2rpx solid #f5f5f5;

      &.active {
        border-color: #4785ea;
        background: #ebf2ff;
        color: #4785ea;
      }
    }
  }

  .other-type {
    margin-top: 12rpx;
    width: 670rpx;
    height: 68rpx;
    border-radius: 34rpx;
    background: #f5f5f5;
    padding-left: 32rpx;
    padding-right: 32rpx;
    @include borderBox;
    @include flex-hc;
    margin-bottom: 48rpx;
  }

  .weight-bar {
    width: 670rpx;
    @include flex-hcb;
    margin-bottom: 48rpx;

    .left-title {
      flex-shrink: 0;
      font-size: 28rpx;
      color: #333333;
    }
  }

  .volume-input {
    width: 670rpx;
    height: 96rpx;
    border-radius: 4rpx;
    background: #f2f3f5;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-left: 24rpx;
    padding-right: 24rpx;
    @include borderBox;
    margin-bottom: 20rpx;

    .input {
      width: 164rpx;
      height: 56rpx;
      background: #ffffff;
      @include flex-vhc;
      padding-left: 24rpx;
      padding-right: 24rpx;
      @include borderBox;
    }

    ::v-deep {
      .uni-input-placeholder.input-placeholder {
        text-align: center;
      }
    }
  }

  .tips-text {
    width: 670rpx;
    font-size: 24rpx;
    color: #999999;
    line-height: 38rpx;
    padding-bottom: 24rpx;
  }

  .bottom-btn {
    width: 100vw;
    padding: 24rpx 0;
    @include flex-vhc;
  }
}
</style>
