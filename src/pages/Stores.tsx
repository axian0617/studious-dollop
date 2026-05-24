import { useMemo, useState } from "react";
import { Check, Search, Store, X } from "lucide-react";
import { Card, EmptyState, HomeShell, getHashParam, navigateTo, useToast } from "../components/ui";
import { getCurrentStore, stores, switchCurrentStore } from "../data/mock";

export function Stores() {
  return (
    <HomeShell>
      <StoresDrawer open onClose={() => navigateTo("/dashboard")} />
    </HomeShell>
  );
}

export function StoresDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-30 bg-slate-900/30">
      <div className="absolute right-0 top-0 h-full w-[530px] rounded-l-[24px] bg-[#F3F7FB] p-4 shadow-2xl">
        <div className="mb-3 flex h-12 items-center justify-between">
          <h2 className="text-[18px] font-black text-ink">切换店铺 / 角色</h2>
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-600 shadow-soft"
            aria-label="关闭"
          >
            <X size={20} />
          </button>
        </div>
        <StoreSwitcherContent />
      </div>
    </div>
  );
}

function StoreSwitcherContent() {
  const [query, setQuery] = useState("");
  const reviewState = getHashParam("state");
  const mode = reviewState === "empty" ? "noStore" : reviewState === "permission-error" ? "noRole" : reviewState === "failed" ? "fail" : "normal";
  const [active, setActive] = useState(getCurrentStore().id);
  const toast = useToast();
  const list = useMemo(() => stores.filter((store) => store.name.includes(query) || store.role.includes(query)), [query]);

  const switchStore = (id: string) => {
    if (mode === "fail") {
      toast("切换失败，请检查网络后重试", "error");
      return;
    }
    switchCurrentStore(id);
    setActive(id);
    toast("切换成功");
  };

  return (
    <Card className="h-[400px] p-4">
      <div className="flex h-12 items-center rounded-xl border border-[#DCE7F2] bg-[#F8FBFF] px-3">
        <Search size={18} className="text-muted" />
        <input
          type="text"
          inputMode="text"
          autoComplete="off"
          value={query}
          onFocus={(event) => {
            (navigator as Navigator & { virtualKeyboard?: { show?: () => void } }).virtualKeyboard?.show?.();
            event.currentTarget.scrollIntoView({ block: "center", behavior: "smooth" });
          }}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索店铺或角色"
          className="ml-2 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:font-normal placeholder:text-slate-400"
        />
      </div>
      <div className="mt-3 h-[305px] overflow-hidden">
        {mode === "noStore" && <EmptyState title="暂无可切换店铺" hint="请联系门店负责人分配门店权限" />}
        {mode === "noRole" && <EmptyState title="暂无可用角色" hint="当前账号未绑定收银终端角色" />}
        {mode !== "noStore" && mode !== "noRole" && (
          <div className="grid gap-2">
            {list.slice(0, 4).map((store) => (
              <button
                key={store.id}
                onClick={() => switchStore(store.id)}
                className={`flex h-[70px] items-center gap-3 rounded-2xl border-2 px-3 text-left transition ${
                  active === store.id ? "border-brand bg-[#F0F8FF]" : "border-transparent bg-[#F8FBFF]"
                }`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#EAF7FF] text-brand">
                  <Store size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-black leading-5 text-ink">{store.name}</span>
                  <span className="mt-1 flex min-w-0 items-center gap-2 text-[12px] text-muted">
                    <span className="shrink-0 rounded-full bg-white px-2 py-0.5 font-semibold">{store.role}</span>
                    <span className="truncate">商户号 XXXXXXXXXXXXXXXX</span>
                  </span>
                </span>
                {active === store.id ? (
                  <span className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-white px-3 text-[13px] font-bold text-brand">
                    <Check size={16} />当前
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[13px] font-bold text-slate-600">切换</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
