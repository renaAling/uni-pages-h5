<template>
  <view class="business-detail">
    <common-loading v-if="isFullLoading" mTop="36vh"></common-loading>
    <template v-else>
      <div class="html-content" v-html="BusinessDetail"></div>
      <!-- <up-parse :content="BusinessDetail"></up-parse> -->
    </template>
    <view class="fixed-btn">
      <up-button
        type="primary"
        text="提交合作"
        shape="circle"
        @click="show = true"
      ></up-button>
    </view>
    <up-popup v-model:show="show" :round="20" mode="bottom" :closeable="true">
      <view class="form-card">
        <view class="form-title">合作留言</view>
        <up-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="100"
        >
          <up-form-item label="客户姓名" prop="contact" required border-bottom>
            <up-input
              v-model="formData.contact"
              maxlength="10"
              placeholder="请输入客户姓名"
              border="none"
            ></up-input>
          </up-form-item>

          <up-form-item
            label="联系电话"
            prop="contactPhone"
            required
            border-bottom
          >
            <up-input
              v-model="formData.contactPhone"
              maxlength="15"
              placeholder="请输入联系电话"
              border="none"
            ></up-input>
          </up-form-item>

          <up-form-item
            label="企业名称"
            prop="companyName"
            required
            border-bottom
          >
            <up-input
              v-model="formData.companyName"
              maxlength="20"
              placeholder="请输入企业名称"
              border="none"
            ></up-input>
          </up-form-item>

          <up-form-item label="备注说明" border-bottom>
            <up-textarea
              v-model="formData.remark"
              maxlength="200"
              placeholder="请输入备注说明"
              border="none"
              count
            ></up-textarea>
          </up-form-item>
        </up-form>

        <up-button
          class="submit-btn"
          type="primary"
          text="确认提交"
          shape="circle"
          :disabled="
            !formData.contact || !formData.contactPhone || !formData.companyName
          "
          @click="submitForm"
        ></up-button>
      </view>
    </up-popup>
  </view>
</template>

<script setup>
import { toast, route } from "@/uni_modules/uview-plus";
import { getBusinessDetailApi, businessAddApi } from "@/api/business.js";

const bizCode = ref();
const formData = ref({
  contact: "",
  contactPhone: "",
  companyName: "",
  remark: "",
  bizCode: "",
});

const rules = ref({
  contact: [{ required: true, message: "请输入客户姓名", trigger: "blur" }],
  contactPhone: [
    { required: true, message: "请输入联系电话", trigger: "blur" },
  ],
  companyName: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
});

const formRef = ref();
const submitForm = () => {
  const params = { ...formData.value, bizCode: bizCode.value };
  formRef.value
    .validate()
    .then(async valid => {
      if (!valid) return;
      const res = await businessAddApi(params);
      if (res) {
        route({
          type: "reLaunch",
          url: "pages/business/succeed",
        });
      } else {
        toast(res.msg);
      }
    })
    .catch(error => {
      console.log(error);
    });
};

const show = ref(false);
const isFullLoading = ref(true);
const BusinessDetail = ref("");
const getBusinessDetail = code => {
  isFullLoading.value = true;
  getBusinessDetailApi(code)
    .then(res => {
      BusinessDetail.value = res?.desc;
      isFullLoading.value = false;
      uni.setNavigationBarTitle({
        title: res?.name,
      });
    })
    .catch(() => {
      isFullLoading.value = false;
    });
};

onLoad(option => {
  bizCode.value = option.code;
  getBusinessDetail({ code: option.code });
});
</script>

<style lang="scss" scoped>
.business-detail {
  padding: 20rpx;
  padding-bottom: 120rpx;

  :deep(.u-form-item__body__left) {
    align-items: start;
    margin-top: 20rpx;
  }

  :deep(.u-form-item__body__right) {
    background: #f5f7f9;
    padding: 20rpx;
    border-radius: 10rpx;
  }

  :deep(.u-textarea) {
    background: #f5f7f9;
    padding: 0;
  }

  :deep(.u-textarea__count) {
    background: #f5f7f9 !important;
  }
}

.form-card {
  padding: 40rpx;
}

.form-title {
  font-size: 34rpx;
  font-weight: bold;
  margin-bottom: 40rpx;
}

.submit-btn {
  margin-top: 40rpx;
}

.fixed-btn {
  width: 90%;
  position: fixed;
  bottom: 20rpx;
  left: 50%;
  transform: translate(-50%);
}

.html-content {
  :deep(p) {
    width: 100%;
    word-break: break-all;
  }
  :deep(img) {
    width: 100%;
    display: block;
  }
}
</style>
