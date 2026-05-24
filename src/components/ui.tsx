import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Loader2,
  RotateCw,
  Store,
  TriangleAlert,
  X,
  UserRoundCheck
} from "lucide-react";

type ToastItem = { id: number; text: string; tone?: "success" | "error" | "info" };

const ToastContext = createContext<(text: string, tone?: ToastItem["tone"]) => void>(() => undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = (text: string, tone: ToastItem["tone"] = "success") => {
    const id = Date.now();
    setItems((prev) => [...prev, { id, text, tone }]);
    window.setTimeout(() => setItems((prev) => prev.filter((item) => item.id !== id)), 1800);
  };
  return (
    <ToastContext.Provider value={push}>
      <div className="relative h-[480px] w-[854px]">
        {children}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="min-w-[210px] rounded-xl bg-black/80 px-4 py-3 text-center text-sm font-semibold text-white shadow-soft"
            >
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

export function getHashPath() {
  return window.location.hash.replace(/^#/, "").split("?")[0] || "/login";
}

export function getHashParam(key: string) {
  const query = window.location.hash.split("?")[1] ?? "";
  return new URLSearchParams(query).get(key);
}

export function navigateTo(path: string) {
  window.location.hash = path;
}

export function showSystemKeyboard(element?: HTMLElement | null) {
  element?.focus({ preventScroll: true });
  (navigator as Navigator & { virtualKeyboard?: { show?: () => void } }).virtualKeyboard?.show?.();
  window.setTimeout(() => element?.scrollIntoView({ block: "center", behavior: "smooth" }), 80);
}

export function useHashPath() {
  const [path, setPath] = useState(getHashPath());
  useEffect(() => {
    const update = () => setPath(getHashPath());
    window.addEventListener("hashchange", update);
    update();
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return path;
}

export function HomeShell({ children }: { children: ReactNode }) {
  return <div className="terminal-frame bg-surface p-3">{children}</div>;
}

export function SubPageShell({
  children,
  title,
  right,
  backTo = "/dashboard",
  onBack
}: {
  children: ReactNode;
  title: string;
  right?: ReactNode;
  backTo?: string;
  onBack?: () => void;
}) {
  return (
    <div className="terminal-frame flex flex-col bg-surface">
      <header className="relative flex h-14 items-center justify-center border-b border-[#DCEAF6] bg-white px-3">
        <button
          onClick={onBack ?? (() => navigateTo(backTo))}
          className="absolute left-3 grid h-11 w-11 place-items-center rounded-xl bg-[#F0F7FF] text-slate-700"
          aria-label="返回"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-[18px] font-black text-ink">{title}</h1>
        <div className="absolute right-3 flex min-h-11 items-center">{right}</div>
      </header>
      <section className="page-fade h-[424px] overflow-hidden p-3">{children}</section>
    </div>
  );
}

export function AppShell({ children, title }: { children: ReactNode; title: string }) {
  return <SubPageShell title={title}>{children}</SubPageShell>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white shadow-soft ${className}`}>{children}</div>;
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  const styles = {
    primary: "bg-gradient-to-r from-brand2 to-brand text-white shadow-insetBlue",
    secondary: "bg-[#EDF6FF] text-brand border border-[#C9E8FF]",
    ghost: "bg-white text-slate-600 border border-[#DCE7F2]",
    danger: "bg-red-500 text-white"
  };
  return (
    <button
      className={`min-h-11 rounded-xl px-4 text-[14px] font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function MetricCard({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <Card className="h-[104px] p-3">
      <p className="text-[13px] text-muted">{label}</p>
      <div className="mt-2 flex items-end gap-1">
        <span className="text-[28px] font-black leading-none text-brand">{value}</span>
        {suffix && <span className="pb-1 text-[13px] text-muted">{suffix}</span>}
      </div>
    </Card>
  );
}

export function ActionTile({ icon: Icon, label, onClick }: { icon: typeof Store; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex h-[74px] items-center gap-3 rounded-2xl bg-white px-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:bg-[#F9FCFF]">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-r from-[#EAF7FF] to-[#D9F0FF] text-brand shadow-insetBlue">
        <Icon size={21} />
      </span>
      <span className="text-[15px] font-bold text-ink">{label}</span>
    </button>
  );
}

export function LoadingState({ text = "数据加载中" }: { text?: string }) {
  return (
    <div className="grid h-full place-items-center rounded-2xl bg-white text-muted shadow-soft">
      <div className="flex items-center gap-2 text-[15px]">
        <Loader2 size={20} className="animate-spin text-brand" />
        {text}
      </div>
    </div>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="grid h-full place-items-center rounded-2xl bg-white text-center shadow-soft">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#EEF7FF] text-brand">
          <UserRoundCheck size={28} />
        </div>
        <p className="mt-3 text-[16px] font-bold text-ink">{title}</p>
        {hint && <p className="mt-1 text-[13px] text-muted">{hint}</p>}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}

export function ErrorState({ title, onRetry }: { title: string; onRetry: () => void }) {
  return (
    <div className="grid h-full place-items-center rounded-2xl bg-white text-center shadow-soft">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-500">
          <TriangleAlert size={28} />
        </div>
        <p className="mt-3 text-[16px] font-bold text-ink">{title}</p>
        <Button className="mt-4" onClick={onRetry}>
          重新加载
        </Button>
      </div>
    </div>
  );
}

export function Modal({
  open,
  title,
  icon,
  children,
  onClose,
  onConfirm,
  confirmText = "确定",
  cancelText = "取消"
}: {
  open: boolean;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}) {
  if (!open) return null;
  return (
    <div className="absolute left-0 top-0 z-40 grid h-full w-full place-items-center bg-slate-900/40">
      <div className="w-[360px] rounded-2xl bg-white p-5 shadow-2xl">
        {icon && <div className="mb-2 flex justify-center">{icon}</div>}
        <h2 className="text-center text-[18px] font-bold text-ink">{title}</h2>
        <div className="py-5">{children}</div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="ghost" onClick={onClose}>{cancelText}</Button>
          <Button onClick={onConfirm ?? onClose}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
}

export function Drawer({
  open,
  title,
  children,
  onClose
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="absolute left-0 top-0 z-30 h-full w-full bg-slate-900/25">
      <div className="absolute right-0 top-0 h-full w-[350px] rounded-l-2xl bg-white p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl bg-[#F0F7FF] text-slate-600 shadow-soft"
            aria-label="关闭"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ToggleRow({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex h-[58px] items-center justify-between border-b border-[#EDF2F7] last:border-0">
      <div>
        <p className="text-[15px] font-semibold text-ink">{label}</p>
        {desc && <p className="text-[12px] text-muted">{desc}</p>}
      </div>
      <button
        aria-pressed={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-[56px] rounded-full p-1 transition ${checked ? "bg-brand" : "bg-slate-200"}`}
      >
        <span className={`block h-6 w-6 rounded-full bg-white shadow transition ${checked ? "translate-x-6" : ""}`} />
      </button>
    </div>
  );
}

export function FormRow({
  label,
  required,
  value,
  onChange,
  placeholder,
  readOnly,
  showReadOnlyIcon = true,
  onClick,
  error
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  showReadOnlyIcon?: boolean;
  onClick?: () => void;
  error?: string;
}) {
  return (
    <label className="block">
      <div className={`flex h-[54px] items-center rounded-xl border bg-white px-3 transition focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(1,145,255,0.10)] ${error ? "border-red-300" : "border-[#DCE7F2]"}`} onClick={onClick}>
        <span className="w-[82px] text-[14px] font-semibold text-slate-700">
          {label}{required && <span className="text-red-500"> *</span>}
        </span>
        <input
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          onFocus={(event) => showSystemKeyboard(event.currentTarget)}
          onPointerDown={(event) => showSystemKeyboard(event.currentTarget)}
          onClick={(event) => showSystemKeyboard(event.currentTarget)}
          placeholder={placeholder}
          readOnly={readOnly}
          className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:text-slate-300"
        />
        {readOnly && showReadOnlyIcon && <ChevronRight size={17} className="text-muted" />}
      </div>
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </label>
  );
}

export function Stepper({ current = 2 }: { current?: number }) {
  const steps = ["商品信息", "发票信息", "收货地址"];
  return (
    <div className="flex h-[72px] items-center rounded-2xl bg-gradient-to-r from-brand to-[#38B6FF] px-5 text-white shadow-insetBlue">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-1 items-center">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 text-[14px] font-bold ring-1 ring-white/30">
            {index + 1}
          </div>
          <div className="ml-2">
            <p className="text-[15px] font-bold">{step}</p>
            <p className="text-[11px] text-white/80">{index < current ? "已完成" : index === current ? "进行中" : "待填写"}</p>
          </div>
          {index < steps.length - 1 && <div className="mx-4 h-px flex-1 border-t border-dashed border-white/60" />}
        </div>
      ))}
    </div>
  );
}

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="flex h-[52px] items-center gap-2 rounded-2xl bg-white px-3 shadow-soft">{children}</div>;
}

export function SelectPill({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative">
      <button
        className="flex h-10 min-w-[72px] items-center justify-between gap-2 rounded-xl border border-[#DCE7F2] bg-[#F8FBFF] px-3 text-[14px] font-semibold text-slate-700"
        onClick={() => setOpen((current) => !current)}
      >
        {value}
        <ChevronRight size={14} className={`transition ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <span className="absolute left-0 top-11 z-20 grid min-w-full gap-1 rounded-xl border border-[#DCE7F2] bg-white p-1 shadow-soft">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`h-9 whitespace-nowrap rounded-lg px-3 text-left text-[13px] font-bold ${value === option ? "bg-[#EAF7FF] text-brand" : "text-slate-600"}`}
            >
              {option}
            </button>
          ))}
        </span>
      )}
    </span>
  );
}

export function RefreshButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="secondary" onClick={onClick} className="flex items-center gap-2">
      <RotateCw size={16} /> 刷新
    </Button>
  );
}

export function PageTabs({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex rounded-xl bg-[#EEF5FC] p-1">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`h-10 min-w-[72px] rounded-lg px-3 text-[14px] font-bold ${value === option ? "bg-white text-brand shadow-sm" : "text-muted"}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function useNowText() {
  return useMemo(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  }, []);
}
