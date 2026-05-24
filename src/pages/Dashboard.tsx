import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Bell, ChevronRight, Eye, EyeOff, Info, LogOut, Mic2, Settings, Store, TriangleAlert } from "lucide-react";
import { EmptyState, ErrorState, HomeShell, LoadingState, Modal, getHashParam, navigateTo } from "../components/ui";
import { dashboardMetrics, getCurrentRole, getCurrentStore } from "../data/mock";
import { StoresDrawer } from "./Stores";

const bottomEntries = [
  { label: "收款语音播报", icon: Mic2, path: "/voice", tone: "blue" },
  { label: "消息中心管理", icon: Settings, path: "/message-settings", tone: "purple" },
  { label: "关于我们", icon: Info, path: "/about", tone: "green" }
];

const labelTextColor = "text-[#7F8EA5]";

export function Dashboard() {
  const reviewState = getHashParam("state");
  const state = reviewState === "loading" || reviewState === "empty" || reviewState === "error" ? reviewState : "ok";
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [storesOpen, setStoresOpen] = useState(false);
  const [amountVisible, setAmountVisible] = useState(true);
  const [, setSessionVersion] = useState(0);
  const currentRole = getCurrentRole();
  const currentStore = getCurrentStore();

  useEffect(() => {
    const refreshSession = () => setSessionVersion((version) => version + 1);
    window.addEventListener("mock-session-change", refreshSession);
    return () => window.removeEventListener("mock-session-change", refreshSession);
  }, []);

  return (
    <HomeShell>
      <div className="h-full px-[10px]">
      <header className="flex h-[76px] items-center justify-between">
        <button
          onClick={() => setStoresOpen(true)}
          className="flex h-[58px] min-w-0 items-center gap-3 rounded-[18px] px-1 pr-3 text-left transition hover:bg-white/55"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] border border-white bg-white shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-gradient-to-r from-[#19A5FF] to-[#166DFF] text-white">
              <Store size={22} />
            </span>
          </span>
          <span className="min-w-0">
            <span className="flex min-w-0 items-center gap-2">
              <span className="block max-w-[430px] truncate text-[17px] font-black text-[#102042]">{currentStore.name}</span>
              <span className="flex h-[30px] shrink-0 items-center gap-1 rounded-full border border-[#B8D7FF] bg-white/70 px-3 text-[13px] font-bold text-brand shadow-soft">
                管理 <ChevronRight size={13} />
              </span>
            </span>
            <span className="mt-1 flex items-center gap-3 text-[13px] font-semibold text-[#425472]">
              188 **** 8900
              <span className="rounded-full bg-[#E9F3FF] px-2.5 py-0.5 text-[12px] font-bold text-brand">{currentRole}</span>
            </span>
          </span>
        </button>
        <button
          onClick={() => navigateTo("/messages")}
          className="relative grid h-11 w-11 shrink-0 place-items-center rounded-[16px] bg-white/70 text-brand shadow-soft"
          aria-label="消息"
        >
          <Bell size={30} strokeWidth={2.4} />
          <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
      </header>

      <main className="mt-3 h-[175px]">
        <button
          onClick={() => navigateTo("/transactions")}
          className="relative grid h-full w-full grid-cols-[260px_1fr] gap-6 rounded-[22px] bg-white/90 px-7 py-[18px] pr-[54px] text-left shadow-soft ring-1 ring-white/80"
          aria-label="进入今日交易"
        >
          <div className="border-r border-[#D8E5F2] pr-6">
            <p className={`flex items-center gap-1 text-[14px] font-bold ${labelTextColor}`}>
              今日收款金额(元)
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  setAmountVisible((visible) => !visible);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") setAmountVisible((visible) => !visible);
                }}
                className="grid h-7 w-7 place-items-center rounded-full text-[#50627F]"
                aria-label={amountVisible ? "隐藏金额" : "显示金额"}
              >
                {amountVisible ? <Eye size={17} /> : <EyeOff size={17} />}
              </span>
            </p>
            <p className="mt-3 font-[Arial] text-[38px] font-black leading-none text-brand">{amountVisible ? dashboardMetrics.amount : "••••••"}</p>
            <p className={`mt-5 flex items-baseline gap-3 text-[14px] font-bold ${labelTextColor}`}>
              交易笔数(笔)
              <span className="font-[Arial] text-[20px] font-normal text-[#102042]">{dashboardMetrics.count}</span>
            </p>
          </div>
          <div className="min-w-0 self-stretch">
            {state === "loading" && <LoadingState />}
            {state === "empty" && <EmptyState title="暂无经营数据" hint="可稍后刷新或检查门店绑定状态" />}
            {state === "error" && <ErrorState title="首页数据加载失败" onRetry={() => navigateTo("/dashboard")} />}
            {state === "ok" && (
              <div className="grid h-full grid-cols-3 grid-rows-2 text-center">
                {dashboardMetrics.channels.map((item, index) => (
                  <span
                    key={item.label}
                    className={`grid place-items-center ${index < 3 ? "border-b border-[#E4ECF5]" : ""} ${index % 3 !== 2 ? "border-r border-[#E4ECF5]" : ""}`}
                  >
                    <span>
                      <span className={`block text-[14px] font-medium ${labelTextColor}`}>{item.label}</span>
                      <span className="mt-1.5 block font-[Arial] text-[20px] font-bold leading-none text-[#102042]">{amountVisible ? item.value.replace(",", "") : "••••"}</span>
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className="absolute right-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-[#F3F8FF] text-brand shadow-soft ring-1 ring-[#DDEAF7]">
            <ChevronRight size={22} />
          </span>
        </button>
      </main>

      <footer className="mt-3 h-[165px] rounded-[22px] bg-white/90 px-7 py-4 shadow-soft ring-1 ring-white/80">
        <p className="text-[17px] font-black text-[#102042]">商户服务</p>
        <div className="mt-3 grid grid-cols-4 gap-8">
          {bottomEntries.map((item) => (
            <BottomEntry key={item.label} icon={item.icon} label={item.label} tone={item.tone} onClick={() => navigateTo(item.path)} />
          ))}
          <BottomEntry icon={LogOut} label="退出登录" tone="red" onClick={() => setLogoutOpen(true)} />
        </div>
      </footer>

      <Modal
        open={logoutOpen}
        title="退出登录"
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => navigateTo("/login")}
        confirmText="确定退出"
        icon={
          <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-[#FFF0F0] text-[#EF4444]">
            <TriangleAlert size={30} strokeWidth={2.4} />
          </span>
        }
      >
        <p className="text-center text-[15px] text-slate-600">确定要退出当前账号吗？</p>
      </Modal>
      <StoresDrawer open={storesOpen} onClose={() => setStoresOpen(false)} />
      </div>
    </HomeShell>
  );
}

function BottomEntry({
  icon: Icon,
  label,
  tone,
  onClick
}: {
  icon: LucideIcon;
  label: string;
  tone: string;
  onClick: () => void;
}) {
  const tones: Record<string, string> = {
    blue: "bg-[#EEF7FF] text-brand",
    purple: "bg-[#F2EFFF] text-[#7C3AED]",
    green: "bg-[#EBFAF2] text-[#16A35F]",
    red: "bg-[#FFF0F0] text-[#EF4444]"
  };

  return (
    <button
      onClick={onClick}
      className="grid h-[94px] place-items-center rounded-2xl text-center transition hover:bg-[#F8FBFF]"
    >
      <span className={`grid h-12 w-12 place-items-center rounded-[18px] ${tones[tone] ?? tones.blue}`}>
        <Icon size={24} strokeWidth={2.4} />
      </span>
      <span className={`mt-1 block text-[14px] font-semibold ${labelTextColor}`}>{label}</span>
    </button>
  );
}
