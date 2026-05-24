export type Store = {
  id: string;
  name: string;
  address: string;
  role: UserRole;
  active?: boolean;
};

export type UserRole = "老板" | "财务" | "收银员";

type MockSession = {
  firstLogin: boolean;
  currentRole: UserRole;
  currentStoreId: string;
};

const sessionKey = "ums-terminal-mock-session";
const defaultSession: MockSession = {
  firstLogin: true,
  currentRole: "老板",
  currentStoreId: "S001"
};

export function getMockSession(): MockSession {
  try {
    const stored = window.localStorage.getItem(sessionKey);
    return stored ? { ...defaultSession, ...JSON.parse(stored) } : defaultSession;
  } catch {
    return defaultSession;
  }
}

export function updateMockSession(next: Partial<MockSession>) {
  const current = getMockSession();
  window.localStorage.setItem(sessionKey, JSON.stringify({ ...current, ...next }));
  window.dispatchEvent(new Event("mock-session-change"));
}

export function getCurrentRole() {
  return getMockSession().currentRole;
}

export function isFirstLogin() {
  return getMockSession().firstLogin;
}

export function completeFirstLogin(role: UserRole) {
  updateMockSession({ currentRole: role, firstLogin: false });
}

export type Message = {
  id: string;
  category: "系统公告" | "交易通知";
  title: string;
  summary: string;
  time: string;
  unread: boolean;
  amount?: string;
};

export type Transaction = {
  id: string;
  channel: PaymentChannel;
  status: "成功" | "退款" | "失败";
  type: "收款" | "退款";
  amount: number;
  time: string;
  orderNo: string;
  customer: string;
};

export type PaymentChannel = "云闪付" | "支付宝" | "微信" | "借记卡" | "贷记卡" | "数字人民币";

export const currentStore: Store = {
  id: "S001",
  name: "海上半岛·汤泉养生·韩式SPA(成山路)",
  address: "上海市浦东新区张衡路1399号",
  role: "老板",
  active: true
};

export const stores: Store[] = [
  currentStore,
  { id: "S002", name: "莆田建材超级市场", address: "莆田市荔城区建材路88号", role: "财务" },
  { id: "S003", name: "神农餐饮上海中科路店", address: "浦东新区金科路长泰广场B区一层202号", role: "收银员" },
  { id: "S004", name: "神农餐饮上海世博园店", address: "浦东新区世博大道36号", role: "老板" },
  { id: "S005", name: "神农餐饮上海汇智广场店", address: "浦东新区长泰广场B区一层202号", role: "财务" }
];

export function getCurrentStore() {
  const { currentStoreId } = getMockSession();
  return stores.find((store) => store.id === currentStoreId) ?? currentStore;
}

export function switchCurrentStore(id: string) {
  const nextStore = stores.find((store) => store.id === id);
  if (!nextStore) return;
  updateMockSession({ currentStoreId: id, currentRole: nextStore.role });
}

export const dashboardMetrics = {
  amount: "34,532.00",
  count: "4,863",
  refund: "888.00",
  channels: [
    { label: "云闪付", value: "5,788.00", color: "#0191FF" },
    { label: "支付宝", value: "888.00", color: "#1677FF" },
    { label: "微信", value: "4,532.00", color: "#18A058" },
    { label: "借记卡", value: "5,788.00", color: "#7C3AED" },
    { label: "贷记卡", value: "888.00", color: "#F59E0B" },
    { label: "数字人民币", value: "4,532.00", color: "#EF4444" }
  ]
};

export const messages: Message[] = [
  { id: "M001", category: "交易通知", title: "交易成功", summary: "支付宝交易收款 +1,350.99元", time: "10:20", unread: true, amount: "+1,350.99" },
  { id: "M002", category: "系统公告", title: "服务升级通知", summary: "系统将于今晚 23:30 进行短时升级", time: "09:42", unread: true },
  { id: "M003", category: "交易通知", title: "退款成功", summary: "微信退款 -88.00元", time: "09:18", unread: false, amount: "-88.00" },
  { id: "M004", category: "系统公告", title: "安全提醒", summary: "请定期核对收款设备和账号权限", time: "昨天", unread: false },
  { id: "M005", category: "交易通知", title: "交易成功", summary: "银行卡交易收款 +620.00元", time: "昨天", unread: false, amount: "+620.00" }
];

export const transactions: Transaction[] = [
  { id: "T001", channel: "云闪付", status: "成功", type: "收款", amount: 3680, time: "10:20:00", orderNo: "202605190001", customer: "188****0108" },
  { id: "T002", channel: "支付宝", status: "成功", type: "收款", amount: 1000, time: "10:18:10", orderNo: "202605190002", customer: "26784******0108" },
  { id: "T003", channel: "微信", status: "成功", type: "收款", amount: 1000, time: "10:15:22", orderNo: "202605190003", customer: "o2ab****1889" },
  { id: "T004", channel: "借记卡", status: "退款", type: "退款", amount: -88, time: "09:48:12", orderNo: "202605190004", customer: "6222 **** 7529" },
  { id: "T005", channel: "贷记卡", status: "成功", type: "收款", amount: 688, time: "09:12:33", orderNo: "202605190005", customer: "139****6630" },
  { id: "T006", channel: "数字人民币", status: "失败", type: "收款", amount: 320, time: "08:59:41", orderNo: "202605190006", customer: "180****9821" }
];

export const messageSettings = [
  "新信息通知",
  "财务消息推送",
  "系统消息推送",
  "活动消息推送"
];

export const voiceSettings = [
  "微信收款",
  "支付宝收款",
  "银行卡收款",
  "云闪付收款"
];
