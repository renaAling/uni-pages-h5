import { http } from "@/uni_modules/uview-plus";

/**
 * 快递闪送 - 服务类别列表
 */
export const getExpressTypesApi = () =>
  http.get("/express/serve/category/app/list");

/**
 * 快递闪送 - 获取快递列表
 */
export const getExpressListApi = (expressType, params) =>
  http.post(
    expressType == "LOCAL"
      ? "/express/order/instant/price"
      : "/express/order/express/price",
    params,
  );

/**
 * 快递闪送 - 下单
 */
export const createOrderApi = params =>
  http.post("/express/order/create", params);

/**
 * 快递闪送 - 支付后页面
 */
export const getOrderPayDetailApi = orderCode =>
  http.get(`/express/order/app/pay/detail?orderCode=${orderCode}`);

/**
 * 快递闪送 - 订单详情
 */
export const getOrderDetailApi = orderCode =>
  http.get(`/express/order/app/detail?orderCode=${orderCode}`);

/**
 * 快递闪送 - 订单列表
 */
export const getOrderListApi = params =>
  http.get("/express/order/app/page", { params });

/**
 * 快递闪送 - 订单取消
 */
export const cancelOrderApi = params =>
  http.post("/express/order/app/cancel", params);
