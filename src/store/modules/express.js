import { defineStore } from "pinia";
import { getAreaTreeApi } from "@/api/address.js";

export const useExpressStore = defineStore("express", {
  state: () => {
    return {
      // 当前快递类型 LOCAL: 同城快递 LOGISTICS: 普通快递
      expressType: null,
      expressTypes: [],
      // 地址选择器 数据
      areaTree: [],
      // 是否需要刷新「地址簿」
      needRefreshAddressList: false,
      // 用户选择的地址
      selectedAddress: null,
    };
  },
  getters: {
    // 快递类型 默认返回 「LOCAL」
    getExpressType: state => {
      return state.expressType || "LOCAL";
    },
    // 快递类型 title 默认返回「同城快递」
    getExpressTypeTitle: state => {
      let retTitle = "同城快递";
      const curType = state.expressTypes.find(
        item => item.code == state.expressType,
      );
      if (curType?.name) retTitle = curType.name;
      return retTitle;
    },
  },
  actions: {
    // 更新「当前快递类型」
    updateExpressType(expressType) {
      this.expressType = expressType;
    },
    // 更新「快递类型列表」
    updateExpressTypes(expressTypes = []) {
      this.expressTypes = expressTypes;
    },
    // 重置地址信息
    clearAreaTree() {
      this.areaTree = [];
    },
    // 获取地址信息
    fetchAreaTree() {
      return new Promise(resolve => {
        getAreaTreeApi()
          .then(res => {
            const tree = res && res.length ? res : [];
            this.areaTree = tree;
            resolve();
          })
          .catch(() => {
            resolve();
          });
      });
    },
    // 更新「是否需要刷新「地址簿」
    updateNeedRefreshAddressList(needRefreshAddressList) {
      this.needRefreshAddressList = needRefreshAddressList;
    },
    // 更新「用户选择的地址」
    updateSelectedAddress(selectedAddress) {
      this.selectedAddress = selectedAddress;
    },
  },
  // 开启后对 state 的数据读写都将持久化
  unistorage: true,
});
