import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import umsLogo from "../assets/ums-logo.png";
import { Button, Modal, navigateTo, useToast } from "../components/ui";

type InputTarget = "phone" | "code";

export function Login() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [activeInput, setActiveInput] = useState<InputTarget | null>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [hasVisualViewport, setHasVisualViewport] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [expired, setExpired] = useState(new URLSearchParams(window.location.hash.split("?")[1]).get("expired") === "1");
  const phoneRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    const viewport = window.visualViewport;
    if ("virtualKeyboard" in navigator) {
      (navigator as Navigator & { virtualKeyboard?: { overlaysContent?: boolean } }).virtualKeyboard!.overlaysContent = true;
    }
    setHasVisualViewport(Boolean(viewport));
    if (!viewport) return undefined;
    const initialHeight = viewport.height;
    const syncKeyboardState = () => {
      setKeyboardOpen(viewport.height < initialHeight - 80);
    };
    syncKeyboardState();
    viewport.addEventListener("resize", syncKeyboardState);
    viewport.addEventListener("scroll", syncKeyboardState);
    return () => {
      viewport.removeEventListener("resize", syncKeyboardState);
      viewport.removeEventListener("scroll", syncKeyboardState);
    };
  }, []);

  const focusInput = (target: InputTarget) => {
    setActiveInput(target);
    const element = target === "phone" ? phoneRef.current : codeRef.current;
    element?.focus({ preventScroll: true });
    (navigator as Navigator & { virtualKeyboard?: { show?: () => void } }).virtualKeyboard?.show?.();
    window.setTimeout(() => element?.scrollIntoView({ block: "center", behavior: "smooth" }), 80);
  };

  const compact = keyboardOpen || (!hasVisualViewport && activeInput !== null);

  const sendCode = () => {
    setError("");
    if (phone.length !== 11) {
      setError("请输入 11 位手机号");
      setActiveInput("phone");
      return;
    }
    setCodeSent(true);
    setActiveInput("code");
    toast("验证码已发送", "info");
  };

  const submit = () => {
    setError("");
    if (phone.length !== 11) {
      setError("请输入 11 位手机号");
      setActiveInput("phone");
      return;
    }
    if (!codeSent || code.length < 4) {
      setError("请输入验证码");
      setActiveInput("code");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      navigateTo("/bind-role");
    }, 500);
  };

  return (
    <div className="terminal-frame login-page overflow-hidden p-5">
      <div className={`relative z-10 mx-auto grid w-[650px] place-items-center px-8 transition duration-200 ${compact ? "h-[372px] -translate-y-3 py-4" : "h-[380px] translate-y-[18px] py-5"}`}>
        <div className="w-[390px]">
        <div className={`grid place-items-center transition-all duration-200 ${compact ? "mb-3" : "mb-5"}`}>
          <img src={umsLogo} alt="银联商务 UMS" className={`${compact ? "h-[50px] w-[50px] rounded-2xl" : "h-[60px] w-[60px] rounded-[18px]"} shadow-sm transition-all duration-200`} />
          <h1 className={`${compact ? "mt-1 text-[22px]" : "mt-2 text-[25px]"} text-center font-black leading-none text-ink transition-all duration-200`}>银联商务</h1>
        </div>

        <div className={`${compact ? "space-y-2.5" : "space-y-3.5"}`}>
          <label className="grid grid-cols-[68px_1fr] items-center gap-2">
            <span className="text-left text-[15px] font-bold text-slate-700">手机号</span>
            <input
              ref={phoneRef}
              type="tel"
              inputMode="numeric"
              enterKeyHint="next"
              autoComplete="tel"
              pattern="[0-9]*"
              className={`h-12 w-full rounded-xl border bg-white px-4 text-[16px] font-normal outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-brand focus:shadow-[0_0_0_3px_rgba(1,145,255,0.10)] ${activeInput === "phone" ? "border-brand" : "border-[#DCE7F2]"}`}
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 11))}
              onFocus={() => focusInput("phone")}
              onPointerDown={() => focusInput("phone")}
              onClick={() => focusInput("phone")}
              onBlur={() => window.setTimeout(() => setActiveInput(null), 120)}
              placeholder="请输入手机号"
            />
          </label>

          <label className="grid grid-cols-[68px_1fr] items-center gap-2">
            <span className="text-left text-[15px] font-bold text-slate-700">验证码</span>
            <div className={`flex h-12 items-center rounded-xl border bg-white transition focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(1,145,255,0.10)] ${activeInput === "code" ? "border-brand" : "border-[#DCE7F2]"}`}>
              <input
                ref={codeRef}
                type="tel"
                inputMode="numeric"
                enterKeyHint="done"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                className="min-w-0 flex-1 bg-transparent px-4 text-[16px] font-normal outline-none placeholder:font-normal placeholder:text-slate-400"
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                onFocus={() => focusInput("code")}
                onPointerDown={() => focusInput("code")}
                onClick={() => focusInput("code")}
                onBlur={() => window.setTimeout(() => setActiveInput(null), 120)}
                placeholder="请输入验证码"
              />
              <button
                type="button"
                onClick={sendCode}
                className="mr-2 h-9 shrink-0 rounded-lg bg-[#EAF7FF] px-3 text-[13px] font-bold text-brand"
              >
                {codeSent ? "重新发送" : "发送验证码"}
              </button>
            </div>
          </label>

          <label className="flex items-center gap-2 text-[13px] text-muted">
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-brand" />
            <span>阅读并同意</span>
            <button
              type="button"
              onClick={() => setAgreementOpen(true)}
              className="font-bold text-brand underline underline-offset-2"
            >
              《银联商务用户隐私协议》
            </button>
          </label>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-500">{error}</p>}
          <Button className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px]" onClick={submit} disabled={loading}>
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "登录中" : "确认登录"}
          </Button>
        </div>
        </div>
      </div>

      <Modal open={expired} title="会话已过期" onClose={() => setExpired(false)} onConfirm={() => setExpired(false)} confirmText="重新登录">
        <p className="text-center text-[15px] text-slate-600">为了保障资金安全，请重新登录后继续操作。</p>
      </Modal>
      {agreementOpen && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-slate-900/40">
          <div className="w-[380px] rounded-2xl bg-white p-5 shadow-2xl">
            <h2 className="text-center text-[18px] font-bold text-ink">银联商务用户隐私协议</h2>
            <div className="my-5 rounded-2xl bg-[#F8FBFF] p-4 text-[14px] leading-6 text-slate-600">
              本协议为 Demo mock 文案。我们仅用于展示终端登录流程，会保护商户账号、终端设备和交易查询所需的必要信息，不会在 Demo 中提交真实数据。
            </div>
            <Button className="w-full" onClick={() => setAgreementOpen(false)}>知道了</Button>
          </div>
        </div>
      )}
    </div>
  );
}
