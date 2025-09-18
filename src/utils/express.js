export function buildTimeArea(timeAreaData, type) {
  // 处理空值情况
  if (!timeAreaData || Object.keys(timeAreaData).length === 0) {
    return [];
  }

  const now = new Date();
  const currentHour = now.getHours();

  /* eslint-disable */
  // 过滤掉空的时间段
  const filteredEntries = Object.entries(timeAreaData).filter(
    ([label, timeSlots]) => Array.isArray(timeSlots) && timeSlots.length > 0,
  );
  /* eslint-enable */

  // 如果所有时间段都为空，返回空数组
  if (filteredEntries.length === 0) {
    return [];
  }

  return filteredEntries.map(([label, timeSlots], parentIndex) => {
    const children = timeSlots.map((slot, childIndex) => {
      const isFirstSlotToday = parentIndex === 0 && childIndex === 0;
      const slotHour = parseInt(
        slot.completeStartTime.split(" ")[1].split(":")[0],
      );

      return {
        label:
          isFirstSlotToday && slotHour === currentHour
            ? "立即取件"
            : `${slot.startTime}-${slot.endTime}`,
        value: `${slot.completeStartTime}|${slot.completeEndTime}`,
        ...slot,
      };
    });

    // 如果 type 为 "LOCAL" 且是"今天"且有数据，在头部插入立即取件选项
    let finalChildren = children;
    if (type === "LOCAL" && label === "今天" && timeSlots.length > 0) {
      finalChildren = [
        {
          label: "立即取件",
          value: "now",
        },
        ...children,
      ];
    }

    return {
      label,
      value: label,
      children: finalChildren,
    };
  });
}

// 处理输入字符串，提取出两个时间点，并格式化为"HH:MM-HH:MM"
export function formatTimeRange(input) {
  // 分割字符串获取两个时间部分
  const times = input.split("|");

  // 提取第一个时间的小时和分钟
  const time1Parts = times[0].split(" ")[1].split(":");
  const hours1 = time1Parts[0].padStart(2, "0");
  const minutes1 = time1Parts[1].padStart(2, "0");

  // 提取第二个时间的小时和分钟
  const time2Parts = times[1].split(" ")[1].split(":");
  const hours2 = time2Parts[0].padStart(2, "0");
  const minutes2 = time2Parts[1].padStart(2, "0");

  // 组合成所需格式
  return `${hours1}:${minutes1}-${hours2}:${minutes2}`;
}

// 获取商品三级类目编码
export function getCategoryThree(id) {
  switch (id) {
    case 1: // 文件
      return 2243;
    case 2: // 电子产品
      return 1981;
    case 8: // 宠物
      return 1468;
    case 10: // 医疗健康
      return 2716;
    case 12: // 服装
      return 1935;
    case 13: // 百货
      return 2078;
    case 99: // 其他
      return 2197;
    default: // 默认返回其他
      return 2197;
  }
}

// 用于获取 「快递获取预估运费 && 即时配送获取预估运费」的接口参数 生成
export function buildPriceParams(
  expressType,
  addressData,
  goodsInfo,
  timesValue,
) {
  // 构建参数
  const params = {
    // 总重量
    totalWeight: goodsInfo.totalWeight,
    // 寄件人
    sender: {
      provinceName: addressData.mailingInfo.province,
      cityName: addressData.mailingInfo.city,
      areaName: addressData.mailingInfo.district,
      address: addressData.mailingInfo.detail,
      name: addressData.mailingInfo.realName,
      mobile: addressData.mailingInfo.phone,
    },
    // 收件人
    receiver: {
      provinceName: addressData.consigneeInfo.province,
      cityName: addressData.consigneeInfo.city,
      areaName: addressData.consigneeInfo.district,
      address: addressData.consigneeInfo.detail,
      name: addressData.consigneeInfo.realName,
      mobile: addressData.consigneeInfo.phone,
    },
  };

  // 如果是同城快递的话
  if (expressType === "LOCAL") {
    // curTime 为 "now" 的话 说明用户选择的是 「立即取件」
    // 用户没选的时候 默认为 "now"
    const curTime = timesValue?.[1] || "now";
    params.appointmentType = curTime == "now" ? 1 : 2;
    if (curTime !== "now") {
      const times = curTime.split("|");
      params.appointmentTime = times[0];
    }
    params.deliveryType = 1;
    params.lbsType = 2;
    params.goodsType = goodsInfo.goodsTypeId;
    params.goodsNum = 1;
    if (
      !!goodsInfo.volumeLength &&
      !!goodsInfo.volumeWidth &&
      !!goodsInfo.volumeHeight
    ) {
      params.totalVolume = (
        goodsInfo.volumeLength *
        goodsInfo.volumeWidth *
        goodsInfo.volumeHeight
      ).toFixed(2);
    } else {
      params.totalVolume = 1;
    }
    params.insured = 0;
    params.orderName = addressData.mailingInfo.realName;
    params.orderMobile = addressData.mailingInfo.phone;
    params.goodsList = [
      {
        categoryThree: getCategoryThree(goodsInfo.goodsTypeId),
        goodsName: goodsInfo.otherTypeStr || goodsInfo.goodsTypeName,
        unit: "个",
        quantity: 1,
        goodsPrice: 1,
      },
    ];
  }
  // 输出
  return params;
}

// 构建生成表单的数据
export function buildSubmitParams(
  addressData,
  goodsInfo,
  curCompany,
  timesValue,
) {
  // 构建参数
  const params = {
    carrierCode: curCompany.carrierCode,
    companyCode: curCompany.companyCode,
    deliveryType: 1,
    lbsType: 2,
    goodsType: goodsInfo.goodsTypeId,
    goodsNum: 1,
    totalWeight: goodsInfo.totalWeight,
    insured: 0,
    orderName: addressData.mailingInfo.realName,
    orderMobile: addressData.mailingInfo.phone,
    // 寄件人
    sender: {
      provinceName: addressData.mailingInfo.province,
      cityName: addressData.mailingInfo.city,
      areaName: addressData.mailingInfo.district,
      address: addressData.mailingInfo.detail,
      name: addressData.mailingInfo.realName,
      mobile: addressData.mailingInfo.phone,
    },
    // 收件人
    receiver: {
      provinceName: addressData.consigneeInfo.province,
      cityName: addressData.consigneeInfo.city,
      areaName: addressData.consigneeInfo.district,
      address: addressData.consigneeInfo.detail,
      name: addressData.consigneeInfo.realName,
      mobile: addressData.consigneeInfo.phone,
    },
    goodsList: [
      {
        categoryThree: getCategoryThree(goodsInfo.goodsTypeId),
        goodsName: goodsInfo.otherTypeStr || goodsInfo.goodsTypeName,
        unit: "个",
        quantity: 1,
        goodsPrice: 1,
      },
    ],
  };
  // curTime 为 "now" 的话 说明用户选择的是 「立即取件」
  // 用户没选的时候 默认为 "now"
  const curTime = timesValue?.[1] || "now";
  params.appointmentType = curTime == "now" ? 1 : 2;
  if (curTime !== "now") {
    const times = curTime.split("|");
    params.appointmentTime = times[0];
    params.receiveStartTime = times[0];
    params.receiveEndTime = times[1];
  }
  if (
    !!goodsInfo.volumeLength &&
    !!goodsInfo.volumeWidth &&
    !!goodsInfo.volumeHeight
  ) {
    params.totalVolume = (
      goodsInfo.volumeLength *
      goodsInfo.volumeWidth *
      goodsInfo.volumeHeight
    ).toFixed(2);
  } else {
    params.totalVolume = 1;
  }
  // 输出
  return params;
}
