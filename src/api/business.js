import { http } from "@/uni_modules/uview-plus";

/**
 * 页面管理列表 - 分页查询(小程序端)
 */
export const getBusinessListApi = params =>
  http.get("/business/biz/config/getList", { params });

/**
 * 详情(小程序端)
 */
export const getBusinessDetailApi = params =>
  http.get("/business/biz/config/app/get", { params });

/**
 * 提交
 */
export const businessAddApi = data =>
  http.post("/business/biz/message/add", data);
