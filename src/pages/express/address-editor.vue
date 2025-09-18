<template>
  <section class="address-editor">
    <!-- 全局加载 -->
    <common-loading v-if="isLoading" mTop="36vh"></common-loading>
    <!-- 加载完成 -->
    <template v-else>
      <!-- 地址表单 -->
      <view class="page-box form-box">
        <up-form
          :model="addressForm"
          :rules="rules"
          ref="formRef"
          labelPosition="left"
          labelWidth="94"
        >
          <view class="box-title">
            {{ editorType == "mailing" ? "寄件" : "收件" }}人信息
          </view>
          <up-form-item label="姓名" prop="realName">
            <up-input
              v-model.trim="addressForm.realName"
              :maxlength="15"
              border="none"
              placeholder="请输入姓名"
            ></up-input>
          </up-form-item>
          <up-form-item label="手机号" prop="phone">
            <up-input
              v-model.trim="addressForm.phone"
              :maxlength="11"
              type="tel"
              border="none"
              placeholder="请输入手机号码"
            ></up-input>
          </up-form-item>
          <up-form-item
            label="省市区"
            prop="areaText"
            @click="isCascaderShow = true"
          >
            <up-input
              v-model="addressForm.areaText"
              disabled
              disabledColor="#fff"
              border="none"
              placeholder="请选择省、市、区"
            ></up-input>
            <template #right>
              <view style="margin-left: 24rpx">
                <up-icon name="arrow-right" color="#171A1D"></up-icon>
              </view>
            </template>
          </up-form-item>
          <up-form-item label="详细地址" prop="detail">
            <up-textarea
              v-model="addressForm.detail"
              autoHeight
              height="44rpx"
              :maxlength="30"
              border="none"
              placeholder="精确到楼栋、门牌号等"
            ></up-textarea>
          </up-form-item>
        </up-form>
      </view>
      <!-- 是否保存到地址簿 -->
      <view class="page-box minor-box" v-if="editorMode == 'create'">
        <view class="left-save" @click="isSaveToBook = !isSaveToBook">
          <view class="icon">
            <up-icon
              v-if="isSaveToBook"
              name="checkmark-circle-fill"
              color="#4785EA"
              size="40rpx"
            ></up-icon>
            <view class="unactive" v-else></view>
          </view>
          <view class="text">保存到地址簿</view>
        </view>
        <view class="right-btn" @click="clearAddressForm">清空地址</view>
      </view>
      <!-- 底部按钮 -->
      <view class="page-bottom">
        <up-button
          type="primary"
          shape="circle"
          :custom-style="btnStyle"
          text="确定"
          @click="onSubmitClick"
        ></up-button>
      </view>
    </template>
    <!-- 地址选择器 -->
    <up-cascader
      v-model:show="isCascaderShow"
      v-model="areaValue"
      :data="areaTree"
      value-key="regionId"
      label-key="regionName"
      children-key="child"
      @confirm="onCascaderConfirm"
    ></up-cascader>
  </section>
</template>

<script setup>
import { toast } from "@/uni_modules/uview-plus";
import {
  getAddressDetailApi,
  addAddressApi,
  editAddressApi,
} from "@/api/address.js";

// 快递状态管理
import { useExpressStore } from "@/store/modules/express";
const expressStore = useExpressStore();

// 全局加载
const isLoading = ref(false);
// 编辑器模式
const editorMode = ref("create");
// 编辑器地址 来源 mailing: 寄件地址  consignee: 收件地址
const editorType = ref("mailing");
// 当前编辑的地址的 id
const editorId = ref(null);

// 地区选择器
const areaTree = computed(() => {
  return expressStore.areaTree || [];
});

// 地区选择器
const isCascaderShow = ref(false);
const areaValue = ref([]);

// 用户选择的地区
const curArea = reactive({
  province: "",
  provinceId: null,
  city: "",
  cityId: null,
  district: "",
  districtId: null,
});

// 地址选择器确认
const onCascaderConfirm = event => {
  // province 省
  const province = areaTree.value.find(item => item.regionId == event[0]);
  curArea.province = province.regionName;
  curArea.provinceId = province.regionId;
  // city 市
  const cityList = province?.child || [];
  const city = cityList.find(item => item.regionId == event[1]);
  curArea.city = city.regionName;
  curArea.cityId = city.regionId;
  // district 区
  const districtList = city?.child || [];
  const district = districtList.find(item => item.regionId == event[2]);
  curArea.district = district.regionName;
  curArea.districtId = district.regionId;
  // 表单数据中的areaText
  const areaTextArr = [];
  if (province.regionName) areaTextArr.push(province.regionName);
  if (city.regionName) areaTextArr.push(city.regionName);
  if (district.regionName) areaTextArr.push(district.regionName);
  if (areaTextArr.length) addressForm.areaText = areaTextArr.join("");
};

// 表单 ref
const formRef = ref();

// 表单数据
const addressForm = reactive({
  realName: "",
  phone: "",
  areaText: "",
  detail: "",
  isDefault: false,
});

// 表单跪着
const rules = {
  realName: [
    {
      required: true,
      message: "请输入姓名",
      trigger: ["blur", "change"],
    },
  ],
  phone: [
    {
      required: true,
      message: "请输入手机号",
      trigger: ["blur", "change"],
    },
    {
      validator: (rule, value) => {
        return uni.$u.test.mobile(value);
      },
      message: "请输入正确的手机号",
      trigger: ["change", "blur"],
    },
  ],
  areaText: [
    {
      required: true,
      message: "请选择省、市、区",
      trigger: ["blur", "change"],
    },
  ],
  detail: [
    {
      required: true,
      message: "请输入详细地址",
      trigger: ["blur", "change"],
    },
  ],
};

// 是否保存至「地址簿」
const isSaveToBook = ref(false);

// 清空地址
const clearAddressForm = () => {
  // 表格数据
  addressForm.realName = "";
  addressForm.phone = "";
  addressForm.areaText = "";
  addressForm.detail = "";
  // 地区
  curArea.province = "";
  curArea.provinceId = null;
  curArea.city = "";
  curArea.cityId = null;
  curArea.district = "";
  curArea.districtId = null;
  // 移除验证结果
  formRef.value.clearValidate();
  // toast
  toast("地址数据已清空～");
};

// 底部按钮样式
const btnStyle = {
  background: "#4785EA",
  height: "100rpx",
  width: "670rpx",
};

// 用户点击底部的「提交」
const onSubmitClick = () => {
  formRef.value
    .validate()
    .then(valid => {
      if (valid) {
        if (editorMode.value == "create") {
          creatAddressFn(); // 新增地址
        } else {
          editAddressFn(); // 编辑地址
        }
      }
    })
    .catch(() => {});
};

// 构建提交数据
const buildSubmitData = () => {
  return {
    realName: addressForm.realName,
    phone: addressForm.phone,
    province: curArea.province,
    provinceId: curArea.provinceId,
    city: curArea.city,
    cityId: curArea.cityId,
    district: curArea.district,
    districtId: curArea.districtId,
    detail: addressForm.detail,
    isDefault: addressForm.isDefault,
  };
};

// 新增地址
const creatAddressFn = () => {
  const submitData = buildSubmitData();
  if (isSaveToBook.value) {
    // 需要保存至「地址簿」
    uni.showLoading({ title: "提交中" });
    addAddressApi(submitData)
      .then(() => {
        // 回退2个页面
        submitData._curType = editorType.value;
        expressStore.updateSelectedAddress(submitData);
        uni.hideLoading();
        uni.showToast({
          title: "添加成功",
          icon: "success",
          mask: true,
          duration: 2000,
          success() {
            uni.navigateBack({ delta: 2 });
          },
        });
      })
      .catch(() => {
        uni.hideLoading();
      });
  } else {
    // 不需要保存至「地址簿」
    submitData._curType = editorType.value;
    expressStore.updateSelectedAddress(submitData);
    uni.showToast({
      title: "添加成功",
      icon: "success",
      mask: true,
      duration: 2000,
      success() {
        uni.navigateBack({ delta: 2 });
      },
    });
  }
};

// 编辑地址
const editAddressFn = () => {
  const submitData = buildSubmitData();
  submitData.id = editorId.value;
  uni.showLoading({ title: "提交中" });
  editAddressApi(submitData)
    .then(() => {
      expressStore.updateNeedRefreshAddressList(true);
      uni.hideLoading();
      uni.showToast({
        title: "编辑成功",
        icon: "success",
        mask: true,
        duration: 2000,
        success() {
          uni.navigateBack({ delta: 1 });
        },
      });
    })
    .catch(() => {
      uni.hideLoading();
    });
};

// 编辑数据回填
const getEditData = () => {
  return new Promise((resolve, reject) => {
    getAddressDetailApi(editorId.value)
      .then(res => {
        // 表格数据
        addressForm.realName = res?.realName || "";
        addressForm.phone = res?.phone || "";
        addressForm.detail = res?.detail || "";
        addressForm.isDefault = res?.isDefault || false;
        // 地区
        curArea.province = res?.province || "";
        curArea.provinceId = res?.provinceId || null;
        curArea.city = res?.city || "";
        curArea.cityId = res?.cityId || null;
        curArea.district = res?.district || "";
        curArea.districtId = res?.districtId || null;
        // 地区文案
        const areaTextArr = [];
        if (curArea.province) areaTextArr.push(curArea.province);
        if (curArea.city) areaTextArr.push(curArea.city);
        if (curArea.district) areaTextArr.push(curArea.district);
        if (areaTextArr.length) addressForm.areaText = areaTextArr.join("");
        resolve();
      })
      .catch(() => {
        setTimeout(() => {
          uni.navigateBack({ delta: 1 });
        }, 2000);
        reject();
      });
  });
};

// 页面标题
const pageTitle = computed(() => {
  let editorModeStr = editorMode.value == "create" ? "添加" : "编辑";
  let editorTypeStr = editorType.value == "mailing" ? "寄件地址" : "收件地址";
  return `${editorTypeStr}${editorModeStr}`;
});

onLoad(async option => {
  // 页面参数
  editorMode.value = option?.mode || "create";
  editorType.value = option?.type || "mailing";
  editorId.value = option?.id || null;
  // 如果用户没有加载过 地区数据 那么缓存数据
  if (areaTree.value.length === 0) {
    isLoading.value = true;
    await expressStore.fetchAreaTree();
  }
  // 编辑模式
  if (editorMode.value == "edit" || editorId.value) {
    isLoading.value = true;
    isSaveToBook.value = true;
    await getEditData();
  }
  // 动态页面 title
  uni.setNavigationBarTitle({ title: pageTitle.value });

  isLoading.value = false;
});
</script>
<style lang="scss" scoped>
page {
  background-color: #f4f5f5;
}
.address-editor {
  padding-top: 16rpx;
  padding-bottom: 180rpx;
  @include flex-vc;

  .page-box {
    width: 702rpx;
    border-radius: 24rpx;
    background: #ffffff;
    padding: 32rpx 24rpx;
    @include borderBox;

    .box-title {
      font-size: 32rpx;
      font-weight: 500;
      line-height: 44rpx;
      color: #333333;
      margin-bottom: 12rpx;
    }

    ::v-deep {
      .u-textarea {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    }

    &.form-box {
      padding-bottom: 12rpx;
    }

    &.minor-box {
      margin-top: 16rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left-save {
        @include flex-hc;

        .icon {
          width: 48rpx;
          height: 48rpx;
          @include flex-vhc;

          .unactive {
            width: 38rpx;
            height: 38rpx;
            border-radius: 50%;
            border: 4rpx solid #c7c8c9;
            @include borderBox;
          }
        }

        .text {
          font-size: 28rpx;
          color: #333333;
          margin-left: 12rpx;
        }
      }

      .right-btn {
        padding: 4rpx 0 4rpx 12rpx;
        font-size: 28rpx;
        color: #999999;
      }
    }
  }

  .page-bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100vw;
    height: 180rpx;
    display: flex;
    justify-content: center;
    background: #fff;
    padding-top: 16rpx;
    @include borderBox;
  }
}
</style>
