import { http } from "@/uni_modules/uview-plus";

/**
 * 快递闪送 - 用户地址分页列表(实际上并没有分页)
 */
export const getAddressListApi = () =>
  http.get("/tracomps-front/api/front/address/list");

/**
 * 快递闪送 - 获取默认地址
 */
export const getAddressDefaultApi = () =>
  http.get("/tracomps-front/api/front/address/get/default");

/**
 * 快递闪送 - 设置默认地址
 */
export const setAddressDefaultApi = id =>
  http.post(`/tracomps-front/api/front/address/set/default/${id}`);

/**
 * 快递闪送 - 地址选择器tree
 */
export const getAreaTreeApi = () =>
  http.get("/tracomps-front/api/front/city/list/tree/noStreet");

/**
 * 快递闪送 - 地址详情
 */
export const getAddressDetailApi = id =>
  http.get(`/tracomps-front/api/front/address/detail/${id}`);

/**
 * 快递闪送 - 用户地址添加
 */
export const addAddressApi = params =>
  http.post("/tracomps-front/api/front/address/add", params);

/**
 * 快递闪送 - 用户地址编辑
 */
export const editAddressApi = params =>
  http.post("/tracomps-front/api/front/address/edit", params);

/**
 * 快递闪送 - 地址删除
 */
export const deleteAddressApi = id =>
  http.post(`/tracomps-front/api/front/address/delete/${id}`);
