// ========== 格式化工具函数 ==========
// 提取各组件中重复的格式化逻辑，便于复用

/**
 * 格式化金额为人民币格式
 * @param {number} num - 金额
 * @returns {string} 格式化后的金额
 */
export function formatMoney(num) {
  return num.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' });
}

/**
 * 格式化日期为月日格式
 * @param {string} dateStr - 日期字符串 YYYY-MM-DD
 * @returns {string} 月日格式 如 "3月25日"
 */
export function formatDateShort(dateStr) {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

/**
 * 获取今天的日期字符串
 * @returns {string} YYYY-MM-DD
 */
export function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

/**
 * 格式化日期为 YYYY-MM-DD
 * @param {Date} date - Date对象
 * @returns {string} YYYY-MM-DD
 */
export function formatDateISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 比较两个日期字符串
 * @param {string} date1 - YYYY-MM-DD
 * @param {string} date2 - YYYY-MM-DD
 * @returns {number} -1 (之前), 0 (同天), 1 (之后)
 */
export function compareDates(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = d1.getTime() - d2.getTime();
  if (diff < 0) return -1;
  if (diff > 0) return 1;
  return 0;
}

/**
 * 判断日期是否在范围内
 * @param {string} target - 目标日期 YYYY-MM-DD
 * @param {string} start - 开始日期
 * @param {string} end - 结束日期
 * @returns {boolean}
 */
export function isDateInRange(target, start, end) {
  return target >= start && target <= end;
}

/**
 * 计算两个日期之间的天数
 * @param {string} start - 开始日期 YYYY-MM-DD
 * @param {string} end - 结束日期 YYYY-MM-DD
 * @returns {number} 天数
 */
export function getDaysBetween(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = (endDate - startDate) / (1000 * 60 * 60 * 24);
  return Math.floor(diff) + 1;
}
