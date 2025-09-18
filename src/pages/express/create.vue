<template>
  <section class="express-create">
    <!-- 地址选择器 -->
    <address-selector ref="addressSelectorRef" @confirm="onAddressConfirm" />
    <!-- 物品信息 -->
    <view class="goods-info">
      <view class="left-title">
        <view class="title">物品信息</view>
        <view class="required">必填</view>
      </view>
      <view class="right-data" @click="onGoodsCellClick">
        <view v-if="goodsInfoBrief" class="data-text">
          {{ goodsInfoBrief }}
        </view>
        <view class="arrow-icon">
          <up-icon name="arrow-right" color="#aaaaaa" size="24rpx"></up-icon>
        </view>
      </view>
    </view>
    <!-- 快递公司&时间 -->
    <view class="company-time">
      <!-- 快递列表 -->
      <template v-if="isCompanyShow">
        <view class="company-loading" v-if="isCompanyLoading">
          <up-loading-icon mode="circle" color="#4785EA"></up-loading-icon>
        </view>
        <template v-else>
          <template v-if="companyList.length">
            <scroll-view
              scroll-x
              :scroll-into-view="curCompanyScrollId"
              scroll-with-animation
            >
              <view class="company-list">
                <view
                  class="company-item"
                  :class="{
                    active:
                      curCompany &&
                      curCompany.companyCode == company.companyCode,
                  }"
                  :id="company._id"
                  v-for="company in companyList"
                  :key="company.companyCode"
                  @click="onCompanyClick(company)"
                >
                  <view class="top-info">
                    <view class="cover-img" v-if="company.icon">
                      <up-image
                        :src="company.icon"
                        mode="aspectFit"
                        width="34rpx"
                        height="34rpx"
                        :fade="false"
                      ></up-image>
                    </view>
                    <view class="name">{{ company.companyName }}</view>
                    <view class="tick-icon">
                      <up-image
                        v-if="
                          curCompany &&
                          curCompany.companyCode == company.companyCode
                        "
                        :src="tickIcon"
                        mode="aspectFit"
                        width="24rpx"
                        height="24rpx"
                      ></up-image>
                    </view>
                  </view>
                  <view class="bottom-price">
                    <view class="text">¥{{ company.price }}</view>
                  </view>
                </view>
              </view>
            </scroll-view>
          </template>
          <!--如果返回的公司为空的话 -->
          <template v-else>
            <view class="company-empty">暂无可用快递</view>
          </template>
          <!-- 分割线 -->
          <view class="cut-off"></view>
        </template>
      </template>
      <!-- 上门时间 -->
      <view class="time-bar">
        <view class="left-title">
          <view class="title">期望上门时间</view>
        </view>
        <view class="right-data" @click="openTimesCascader">
          <view v-if="timesValueStr" class="data-text">
            {{ timesValueStr }}
          </view>
          <view class="data-holder" v-else>{{ timesCascaderTriggerStr }}</view>
          <view class="arrow-icon">
            <up-icon name="arrow-right" color="#aaaaaa" size="24rpx"></up-icon>
          </view>
        </view>
      </view>
    </view>
    <!-- 服务协议 -->
    <view class="service-agreement">
      <view class="service-check" @click="isServiceAgree = !isServiceAgree">
        <view class="active" v-if="isServiceAgree">
          <up-icon name="checkbox-mark" color="#fff" size="24rpx"></up-icon>
        </view>
        <view class="default" v-else></view>
      </view>
      <view @click="isServiceAgree = !isServiceAgree">我已阅读并同意</view>
      <view class="service" @click="openServicePopup">《服务协议》</view>
    </view>
    <!-- 底部按钮 -->
    <view class="bottom-box">
      <view class="left-info">
        <view class="freight-price">
          <view class="title">运费</view>
          <view class="symbol-number">
            <span class="symbol">￥</span>
            <span>
              {{
                isSubmitBtnUsable ? formatPaymentAmount(curCompany.price) : "--"
              }}
            </span>
          </view>
        </view>
        <view class="tips">费用以快递员核实为准</view>
      </view>
      <up-button
        type="primary"
        shape="circle"
        :custom-style="btnStyle"
        :disabled="!isSubmitBtnUsable"
        @click="onSubmitClick"
        text="提交订单"
      ></up-button>
    </view>
    <!-- 物品编辑器 -->
    <goods-editor ref="goodsEditorRef" @confirm="updateGoodsInfo" />
    <!-- 上门时间 -->
    <up-cascader
      v-model:show="isTimeCascaderShow"
      v-model="timesValue"
      :data="timesTree"
      @confirm="onCascaderConfirm"
    ></up-cascader>
    <!-- 服务协议 -->
    <service-popup
      ref="servicePopupRef"
      @changeServiceAgree="changeServiceAgree"
    />
    <!-- 确认支付popup -->
    <pay-popup
      ref="payPopupRef"
      :company="curCompany"
      :orderCode="payOrderCode"
    />
  </section>
</template>

<script setup>
import { deepClone, test, toast } from "@/uni_modules/uview-plus";
import { getExpressListApi, createOrderApi } from "@/api/express.js";
import {
  buildPriceParams,
  buildSubmitParams,
  buildTimeArea,
  formatTimeRange,
} from "@/utils/express.js";
import { formatPaymentAmount } from "@/utils/index.js";

import tickIcon from "@/static/icons/tick-white.png";

import addressSelector from "./components/address-selector.vue";
import goodsEditor from "./components/goods-editor.vue";
import servicePopup from "./components/service-popup.vue";
import payPopup from "./components/pay-popup.vue";

// 快递状态管理
import { useExpressStore } from "@/store/modules/express";
const expressStore = useExpressStore();

// 快递类型
const expressType = computed(() => {
  return expressStore.getExpressType;
});

// 快递类型 页面标题
const expressTypeTitle = computed(() => {
  return expressStore.getExpressTypeTitle;
});

// 地址选择器 实例
const addressSelectorRef = ref();

// 地址信息
const addressData = computed(() => {
  return addressSelectorRef.value?.exposeData || {};
});

// 地址选择器 选择地址回调
const onAddressConfirm = () => {
  // 尝试获取「快递公司」列表
  tryToGetCompanyList();
};

// 物品信息
const goodsInfo = reactive({
  goodsTypeId: null,
  goodsTypeName: "",
  otherTypeStr: "",
  totalWeight: 1,
  volumeLength: null,
  volumeWidth: null,
  volumeHeight: null,
});

// 物品信息 简介
const goodsInfoBrief = computed(() => {
  let retStr = "";
  if (goodsInfo.goodsTypeId) {
    return `${goodsInfo.goodsTypeName}，${goodsInfo.totalWeight}kg`;
  }
  return retStr;
});

// 物品编辑器 相关
const goodsEditorRef = ref();
const onGoodsCellClick = () => {
  const data = deepClone(goodsInfo);
  goodsEditorRef.value.openGoodsEditor(data);
};

// 编辑器更新「物品信息」
const updateGoodsInfo = data => {
  goodsInfo.goodsTypeId = data.goodsTypeId;
  goodsInfo.goodsTypeName = data.goodsTypeName;
  goodsInfo.otherTypeStr = data.otherTypeStr;
  goodsInfo.totalWeight = data.totalWeight;
  goodsInfo.volumeLength = data.volumeLength;
  goodsInfo.volumeWidth = data.volumeWidth;
  goodsInfo.volumeHeight = data.volumeHeight;
  // 尝试获取「快递公司」列表
  tryToGetCompanyList();
};

// 「上门时间」选择器数据
const isTimeCascaderShow = ref(false);
const timesTree = ref([]);
const timesValue = ref([]);
// 「上门时间」选择器的值
const timesValueStr = computed(() => {
  let retStr = null;
  // 有值
  if (timesValue.value.length == 2) {
    let dayStr = timesValue.value[0],
      timeVal = timesValue.value[1],
      timeStr = "";
    if (timeVal == "now") {
      timeStr = "立即取件";
    } else {
      timeStr = formatTimeRange(timeVal);
    }
    retStr = `${dayStr} ${timeStr}`;
  }
  return retStr;
});

// timesCascader 触发器文案
const timesCascaderTriggerStr = computed(() => {
  if (curCompany.value) {
    if (timesTree.value.length) {
      return "请选择上门时间";
    } else {
      return "当前快递暂无可选时段";
    }
  } else {
    // 当前未选择公司
    if (isCompanyShow.value) {
      if (companyList.value.length) {
        return "请选择快递服务";
      } else {
        return isCompanyLoading.value ? "请选择快递服务" : "暂无可用快递";
      }
    } else {
      return "请选择地址并完善物品信息";
    }
  }
});

// 打开「上门日期」级联选择器
const openTimesCascader = () => {
  // 当前选择了 快递公司
  if (curCompany.value) {
    if (timesTree.value.length) {
      isTimeCascaderShow.value = true;
    } else {
      toast("当前快递暂无可选时段");
    }
  } else {
    // 当前未选择公司
    if (isCompanyShow.value) {
      if (companyList.value.length) {
        toast("请选择快递服务");
      } else {
        toast("暂无可用快递");
      }
    } else {
      toast("请选择地址并完善物品信息");
    }
  }
};

// 用户确认时间
const onCascaderConfirm = () => {
  // 刷新快递价格
  refreshExpressPrice();
};

// 是否到时机显示「快递列表」
const isCompanyShow = computed(() => {
  // 寄件人信息
  const hasMailingInfo = addressData.value?.hasMailingInfo || false;
  // 收件人信息
  const hasConsigneeInfo = addressData.value?.hasConsigneeInfo || false;
  // 物品信息
  const hasGoodsInfo = Boolean(goodsInfo.goodsTypeId);
  // 地址簿和物品信息填好后，才出现快递公司
  return hasMailingInfo && hasConsigneeInfo && hasGoodsInfo;
});

// 快递列表
const curCompany = ref(null);
const isCompanyLoading = ref(false);
const companyList = ref([]);
// 尝试获取「快递公司」列表
const tryToGetCompanyList = () => {
  // 条件齐全 获取列表
  if (isCompanyShow.value) {
    // 每次获取 「服务商」列表之前 重置「当前选择的服务商 」和「选择的时间」
    curCompany.value = null;
    timesValue.value = [];
    isCompanyLoading.value = true;
    // 构建参数
    const params = buildPriceParams(
      expressType.value,
      addressData.value,
      goodsInfo,
      timesValue.value,
    );
    getExpressListApi(expressType.value, params)
      .then(res => {
        const list = res || [];
        // 过滤掉 timeArea 为空的数据
        const filterList = list.filter(item => {
          return !test.isEmpty(item.timeArea);
        });
        filterList.forEach(
          item => (item._id = `scroll-into-${item.companyCode}`),
        );
        companyList.value = filterList;
        isCompanyLoading.value = false;
        // 没查出来
        if (filterList.length == 0) toast("暂无可用快递");
      })
      .catch(() => {
        companyList.value = [];
        isCompanyLoading.value = false;
      });
  } else {
    // 条件缺失 不获取列表
    curCompany.value = null;
    companyList.value = [];
    timesValue.value = [];
  }
};

// 刷新快递价格
const refreshExpressPrice = () => {
  // 构建参数
  const params = buildPriceParams(
    expressType.value,
    addressData.value,
    goodsInfo,
    timesValue.value,
  );
  getExpressListApi(expressType.value, params)
    .then(res => {
      const list = res || [];
      // 查找用户当前选择的公司
      const matchCompany = list.find(item => {
        return item.companyCode == curCompany.value.companyCode;
      });
      // 把价格刷新了
      if (matchCompany) {
        curCompany.value.price = matchCompany.price;
      }
    })
    .catch(() => {});
};

// 快递列表 scroll-view 的 scroll-into-view
const curCompanyScrollId = computed(() => {
  return curCompany.value
    ? `scroll-into-${curCompany.value.companyCode}`
    : null;
});

// 用户选择公司
const onCompanyClick = company => {
  // 当前公司未改变
  if (curCompany.value && curCompany.value.companyCode == company.companyCode)
    return;
  // 选择的快递公司 不用存全部 存关键的数据就好
  curCompany.value = {
    carrierCode: company.carrierCode,
    companyCode: company.companyCode,
    companyName: company.companyName,
    icon: company.icon,
    isSynchronous: company.isSynchronous,
    price: company.price,
  };
  // 读取&设置 timeArea
  const formatTimeArea = buildTimeArea(company.timeArea, expressType.value);
  timesTree.value = formatTimeArea;
  // 重置用户当前选择的 时间
  timesValue.value = [];
};

// 用户确认《服务协议》
const isServiceAgree = ref(false);
const servicePopupRef = ref();
const openServicePopup = () => {
  servicePopupRef.value.openPayPopup();
};
const changeServiceAgree = isAgree => {
  isServiceAgree.value = isAgree;
};

// 底部提交 相关
// 底部按钮样式
const btnStyle = {
  background: "#4785EA",
  width: "256rpx",
  height: "80rpx",
  margin: "0",
};

// 底部提交按钮是否可用
const isSubmitBtnUsable = computed(() => {
  return Boolean(
    isCompanyShow.value && curCompany.value && timesValue.value.length,
  );
});

// 确认支付 popup
const payPopupRef = ref();
const payOrderCode = ref(null);

// 用户提交订单
const onSubmitClick = () => {
  // 检查用户是否 「同意《服务协议》」
  if (!isServiceAgree.value) {
    uni.showToast({
      title: "请阅读并同意《服务协议》",
      icon: "none",
      duration: 2000,
    });
    return;
  }
  uni.showLoading({
    title: "提交中",
    mask: true,
  });
  // 构建参数
  const params = buildSubmitParams(
    addressData.value,
    goodsInfo,
    curCompany.value,
    timesValue.value,
  );
  createOrderApi(params)
    .then(async res => {
      uni.hideLoading();
      const orderCode = res;
      if (!!orderCode && orderCode.length) {
        payOrderCode.value = orderCode;
        await nextTick();
        // 开始支付弹窗
        payPopupRef.value.openPayPopup();
      }
      uni.hideLoading();
    })
    .catch(() => {
      uni.hideLoading();
    });
};

// 页面回退刷新
onShow(async () => {
  // 用户选择地址
  const selectedAddress = expressStore.selectedAddress;
  if (selectedAddress) {
    addressSelectorRef.value.setAddressData(selectedAddress);
    expressStore.updateSelectedAddress(null);
  }
});

onLoad(async () => {
  // 动态设置 title
  uni.setNavigationBarTitle({ title: expressTypeTitle.value });
});

onReady(() => {
  // 获取默认地址
  addressSelectorRef.value.getDefaultAddress();
});
</script>
<style lang="scss" scoped>
page {
  background-color: #f4f5f5;
}

.express-create {
  padding-top: 16rpx;
  @include flex-vc;
  padding-bottom: 180rpx;

  .left-title {
    flex-shrink: 0;
    @include flex-hc;

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

  .right-data {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: 24rpx;

    .data-text {
      font-size: 28rpx;
      font-weight: 500;
      color: #333333;
      @include ellipsis-multiLine(1);
    }

    .data-holder {
      font-size: 28rpx;
      color: #999999;
    }

    .arrow-icon {
      flex-shrink: 0;
      margin-left: 8rpx;
    }
  }

  .goods-info {
    margin-top: 16rpx;
    width: 702rpx;
    height: 112rpx;
    border-radius: 24rpx;
    background: #ffffff;
    padding-left: 24rpx;
    padding-right: 24rpx;
    @include borderBox;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .company-time {
    margin-top: 16rpx;
    width: 702rpx;
    padding: 24rpx;
    @include borderBox;
    border-radius: 24rpx;
    background: #ffffff;
    .company-loading {
      height: 210rpx;
      @include flex-vhc;
    }

    .company-list {
      @include flex-hc;

      .company-item {
        flex-shrink: 0;
        width: 232rpx;
        height: 144rpx;
        border-radius: 8rpx;
        border: 2rpx solid #e5e5e5;
        margin-right: 24rpx;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        &.active {
          border-color: #4785ea;
          .top-info {
            background: #4785ea;
            .name {
              color: #fff;
            }
          }
        }

        .top-info {
          flex-shrink: 0;
          height: 48rpx;
          background: #e5e5e5;
          @include flex-hc;
          padding-left: 16rpx;
          padding-right: 16rpx;
          @include borderBox;

          .cover-img {
            flex-shrink: 0;
            width: 34rpx;
            height: 34rpx;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 6rpx;
          }

          .name {
            flex-grow: 1;
            font-size: 24rpx;
            color: #333333;
            @include ellipsis-multiLine(1);
          }

          .tick-icon {
            flex-shrink: 0;
            position: relative;
            top: -8rpx;
          }
        }

        .bottom-price {
          flex-grow: 1;
          display: flex;
          align-items: center;
          padding-left: 16rpx;
          padding-right: 16rpx;
          @include borderBox;

          .text {
            font-size: 32rpx;
            font-weight: 500;
            color: #333333;
            @include ellipsis-multiLine(1);
          }
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .company-empty {
      padding-top: 20rpx;
      height: 40rpx;
      color: #999999;
      @include flex-vhc;
    }

    .cut-off {
      margin-top: 40rpx;
      border-bottom: 2rpx solid #f5f5f5;
      margin-bottom: 20rpx;
    }

    .time-bar {
      height: 64rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .service-agreement {
    margin-top: 34rpx;
    @include flex-hc;
    font-size: 28rpx;
    color: #999999;

    .service-check {
      width: 36rpx;
      height: 36rpx;
      @include flex-vhc;
      margin-right: 8rpx;
    }

    .active {
      width: 32rpx;
      height: 32rpx;
      border-radius: 8rpx;
      border: 2rpx solid #6cbe84;
      background: #6cbe84;
      @include borderBox;
      @include flex-vhc;
    }

    .default {
      width: 32rpx;
      height: 32rpx;
      border-radius: 8rpx;
      border: 2rpx solid #999999;
      @include borderBox;
    }

    .service {
      color: #4785ea;
    }
  }

  .bottom-box {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 2;
    width: 100vw;
    background: #ffffff;
    padding: 28rpx 24rpx 72rpx;
    @include borderBox;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left-info {
      flex-shrink: 0;

      .freight-price {
        @include flex-hc;

        .title {
          font-size: 28rpx;
          font-weight: 500;
          color: #333333;
          margin-right: 4rpx;
        }

        .symbol-number {
          position: relative;
          top: -2rpx;
          font-size: 40rpx;
          font-weight: 500;
          color: #f36d2f;

          .symbol {
            position: relative;
            top: -1rpx;
            font-size: 28rpx;
          }
        }
      }
      .tips {
        font-size: 20rpx;
        color: #9e9e9e;
      }
    }
  }
}
</style>
