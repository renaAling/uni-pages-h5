// 日期格式化
export function formatDate(input) {
  const date = new Date(
    typeof input === "number"
      ? input.toString().length === 10
        ? input * 1000
        : input
      : input,
  );
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}-${day}`;
}

// 日期格式化
export function formatDateCn(input) {
  const date = new Date(
    typeof input === "number"
      ? input.toString().length === 10
        ? input * 1000
        : input
      : input,
  );
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}

// 日期格式化 - 转化为周几
export function formatDateToWeekday(input) {
  const date = new Date(
    typeof input === "number"
      ? input.toString().length === 10
        ? input * 1000
        : input
      : input,
  );
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const dayIndex = date.getDay();
  return `周${weekdays[dayIndex]}`;
}

// 24小时时间格式化 去掉秒 12:00:00 => 12:00
export function removeSeconds(timeStr) {
  if (!timeStr || typeof timeStr !== "string") {
    return timeStr;
  }
  const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
  const match = timeStr.match(timeRegex);
  if (match) {
    return match[3] ? `${match[1]}:${match[2]}` : timeStr;
  }
  return timeStr;
}

// 处理时间加法并自动处理24小时循环
export function addMinutesToTime(timeStr, minutesToAdd) {
  if (!timeStr || typeof timeStr !== "string") {
    throw new Error("时间格式无效");
  }
  if (typeof minutesToAdd !== "number" || isNaN(minutesToAdd)) {
    throw new Error("分钟数必须是数字");
  }
  const timeWithoutSeconds = timeStr.split(":").slice(0, 2).join(":");
  const [hoursStr, minutesStr] = timeWithoutSeconds.split(":");
  if (!hoursStr || !minutesStr) {
    throw new Error("时间格式无效，应为 HH:MM 或 HH:MM:SS");
  }
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error("时间格式无效");
  }
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const totalMinutesInDay = 24 * 60;
  const normalizedMinutes =
    ((totalMinutes % totalMinutesInDay) + totalMinutesInDay) %
    totalMinutesInDay;
  const newHours = Math.floor(normalizedMinutes / 60);
  const newMinutes = normalizedMinutes % 60;
  return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;
}

// 手机号脱敏
export function formatPhoneNumber(phone) {
  // 非字符串或非11位直接返回原值
  if (typeof phone !== "string" || phone.length !== 11) {
    return phone;
  }
  // 使用正则表达式匹配前3位和后4位，中间用4个星号替换
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

// 金额格式化
export function formatPaymentAmount(amount = 0) {
  const num = parseFloat(amount);
  if (isNaN(num)) return "0.00";
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
