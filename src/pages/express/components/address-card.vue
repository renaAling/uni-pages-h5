<template>
  <section class="address-card">
    <!-- 卡片顶部 -->
    <view class="card-info" @click="onCardClick">
      <view class="info-text">
        <view class="name">{{ data.realName }}</view>
        <view v-if="phoneText" class="phone">{{ phoneText }}</view>
      </view>
      <view class="address-text">{{ addressText }}</view>
    </view>
    <!-- 卡片按钮 -->
    <view class="default-btns">
      <!-- 默认按钮 -->
      <view
        class="default-btn"
        v-if="type == 'mailing'"
        @click="onDefaultClick"
      >
        <view class="icon">
          <up-icon
            v-if="data.isDefault"
            name="checkmark-circle-fill"
            color="#4785EA"
            size="32rpx"
          ></up-icon>
          <view class="unactive" v-else></view>
        </view>
        <view class="text" :class="{ active: data.isDefault }">默认地址</view>
      </view>
      <!-- 操作按钮 -->
      <view class="right-btns">
        <view class="btn-item" @click="onDeleteClick">
          <up-image
            class="icon"
            :src="deleteIcon"
            mode="aspectFit"
            width="32rpx"
            height="32rpx"
            :fade="false"
          ></up-image>
          <view class="text">删除</view>
        </view>
        <view class="btn-item" @click="onEditClick">
          <up-image
            class="icon"
            :src="editIcon"
            mode="aspectFit"
            width="32rpx"
            height="32rpx"
            :fade="false"
          ></up-image>
          <view class="text">编辑</view>
        </view>
      </view>
    </view>
  </section>
</template>

<script setup>
import { route, deepClone } from "@/uni_modules/uview-plus";
import { formatPhoneNumber } from "@/utils/index.js";

import deleteIcon from "@/static/icons/delete-gray.png";
import editIcon from "@/static/icons/book-gray.png";

// 快递状态管理
import { useExpressStore } from "@/store/modules/express";
const expressStore = useExpressStore();

const props = defineProps({
  // 地址数据
  data: {
    type: Object,
    required: true,
  },
  // 枚举说明 mailing: 寄件地址  consignee: 收件地址
  type: {
    type: String,
    required: true,
  },
});

// 手机号脱敏
const phoneText = computed(() => {
  const phone = props.data?.phone || null;
  return formatPhoneNumber(phone);
});

// 地址信息格式化
const addressText = computed(() => {
  let textArr = [];
  if (props.data?.province) textArr.push(props.data.province);
  if (props.data?.city) textArr.push(props.data.city);
  if (props.data?.district) textArr.push(props.data.district);
  if (props.data?.detail) textArr.push(props.data.detail);
  return textArr.join("");
});

// 卡片上半部分点击时间
const onCardClick = () => {
  const addressData = deepClone(props.data);
  addressData._curType = props.type;
  expressStore.updateSelectedAddress(addressData);
  uni.navigateBack({ delta: 1 });
};

// 组件内部更新事件
const emit = defineEmits(["setDefault", "delAddress"]);

// 设置默认地址
const onDefaultClick = () => {
  if (props.data.isDefault) return;
  emit("setDefault", props.data);
};

// 用户点击删除按钮
const onDeleteClick = () => {
  emit("delAddress", props.data.id);
};

// 用户点击编辑按钮
const onEditClick = () => {
  route({
    url: "pages/express/address-editor",
    params: {
      mode: "edit",
      type: props.type,
      id: props.data.id,
    },
  });
};
</script>
<style lang="scss" scoped>
.address-card {
  margin-top: 16rpx;
  width: 702rpx;
  border-radius: 24rpx;
  background: #ffffff;

  .card-info {
    width: 100%;
    padding: 24rpx 28rpx 32rpx;
    @include borderBox;
    border-bottom: 2rpx solid #f6f6f6;

    .info-text {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #999999;

      .name {
        @include ellipsis-multiLine(1);
      }

      .phone {
        flex-shrink: 0;
        margin-left: 8rpx;
      }
    }

    .address-text {
      font-size: 28rpx;
      line-height: 40rpx;
      color: #333333;
      margin-top: 20rpx;
    }
  }

  .default-btns {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 30rpx;
    padding-right: 30rpx;
    @include borderBox;

    .default-btn {
      flex-shrink: 0;
      @include flex-hc;

      .icon {
        width: 32rpx;
        height: 32rpx;
        @include flex-vhc;

        .unactive {
          width: 28rpx;
          height: 28rpx;
          border-radius: 50%;
          border: 2rpx solid #c7c8c9;
          @include borderBox;
        }
      }

      .text {
        font-size: 24rpx;
        color: #7b7b7b;
        margin-left: 6rpx;

        &.active {
          color: #4785ea;
        }
      }
    }

    .right-btns {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 100%;
    }

    .btn-item {
      flex-shrink: 0;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 40rpx;
    }

    .text {
      font-size: 24rpx;
      color: #666666;
      margin-left: 8rpx;
    }
  }
}
</style>
