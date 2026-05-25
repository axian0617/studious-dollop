import { useMemo, useState } from "react";
import { Check, CheckCircle2, ChevronDown, CreditCard, XCircle } from "lucide-react";
import { Button, Card, Drawer, EmptyState, ErrorState, FilterBar, SubPageShell, getHashParam, navigateTo } from "../components/ui";
import { PaymentChannel, Transaction, transactions } from "../data/mock";
import alipayIcon from "../assets/payment/alipay.svg";
import ecnyIcon from "../assets/payment/ecny.svg";
import unionpayIcon from "../assets/payment/unionpay.svg";
import wechatIcon from "../assets/payment/wechat.svg";

const paymentMethods: Array<{ label: PaymentChannel; color: string; mark: string; icon?: string }> = [
  { label: "云闪付", color: "#0191FF", mark: "云", icon: unionpayIcon },
  { label: "支付宝", color: "#1677FF", mark: "支", icon: alipayIcon },
  { label: "微信", color: "#18A058", mark: "微", icon: wechatIcon },
  { label: "借记卡", color: "#7C3AED", mark: "借" },
  { label: "贷记卡", color: "#F59E0B", mark: "贷" },
  { label: "数字人民币", color: "#EF4444", mark: "数", icon: ecnyIcon }
];

const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"));

export function Transactions() {
  const reviewState = getHashParam("state");
  const mode = reviewState === "empty" || reviewState === "error" ? reviewState : "ok";
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [openFilter, setOpenFilter] = useState<"payment" | "time" | "amount" | null>(null);
  const [payments, setPayments] = useState<PaymentChannel[]>(paymentMethods.map((item) => item.label));
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");
  const [activeTimeField, setActiveTimeField] = useState<"start" | "end">("start");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [activeAmountField, setActiveAmountField] = useState<"min" | "max" | null>(null);

  const rows = useMemo(() => {
    if (mode !== "ok") return [];
    return transactions
      .filter((item) => payments.includes(item.channel))
      .filter((item) => item.time.slice(0, 5) >= startTime && item.time.slice(0, 5) <= endTime)
      .filter((item) => {
        const amount = Math.abs(item.amount);
        const min = minAmount ? Number(minAmount) : 0;
        const max = maxAmount ? Number(maxAmount) : Number.POSITIVE_INFINITY;
        return amount >= min && amount <= max;
      });
  }, [endTime, maxAmount, minAmount, mode, payments, startTime]);

  const totalAmount = rows.reduce((sum, item) => sum + item.amount, 0);

  const setTimePart = (type: "hour" | "minute", value: string) => {
    const target = activeTimeField === "start" ? startTime : endTime;
    const [hour, minute] = target.split(":");
    const next = type === "hour" ? `${value}:${minute}` : `${hour}:${value}`;
    if (activeTimeField === "start") {
      setStartTime(next);
    } else {
      setEndTime(next);
    }
  };

  const inputAmount = (key: string) => {
    if (!activeAmountField) return;
    const setter = activeAmountField === "min" ? setMinAmount : setMaxAmount;
    const current = activeAmountField === "min" ? minAmount : maxAmount;
    if (key === "delete") {
      setter(current.slice(0, -1));
      return;
    }
    let next = `${current}${key}`;
    if (key === ".") {
      if (current.includes(".")) return;
      next = current ? `${current}.` : "0.";
    }
    if (isValidAmount(next)) {
      setter(next);
    }
  };

  return (
    <SubPageShell title="今日交易">
      <div className="relative space-y-3">
        <FilterBar>
          <FilterButton
            label="支付方式"
            value={payments.length === 6 ? "全部" : `${payments.length}项`}
            active={openFilter === "payment"}
            onClick={() => setOpenFilter(openFilter === "payment" ? null : "payment")}
          />
          <FilterButton
            label="时间"
            value={`${startTime}-${endTime}`}
            active={openFilter === "time"}
            onClick={() => {
              setOpenFilter(openFilter === "time" ? null : "time");
              setActiveAmountField(null);
            }}
          />
          <FilterButton
            label="金额"
            value={minAmount || maxAmount ? `${minAmount || "0"}-${maxAmount || "不限"}` : "全部"}
            active={openFilter === "amount"}
            onClick={() => {
              const nextOpen = openFilter !== "amount";
              setOpenFilter(nextOpen ? "amount" : null);
              setActiveAmountField(nextOpen ? "min" : null);
            }}
          />
        </FilterBar>

        {openFilter && (
          <div className="absolute -left-3 -right-3 -bottom-3 top-[52px] z-30 bg-slate-900/25" />
        )}

        {openFilter === "payment" && (
          <div className="absolute left-3 top-[58px] z-40 w-[560px] rounded-2xl bg-white p-4 shadow-soft ring-1 ring-[#EDF4FB]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[13px] font-bold text-muted">
                {payments.length === 6 ? "已全选" : `已选择 ${payments.length} 项`}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setPayments(paymentMethods.map((item) => item.label))} className="h-8 rounded-lg bg-[#EAF7FF] px-3 text-[12px] font-bold text-brand">全选</button>
                <button onClick={() => setPayments([])} className="h-8 rounded-lg bg-[#F4F8FC] px-3 text-[12px] font-bold text-muted">清空</button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map((item) => {
                const checked = payments.includes(item.label);
                return (
                  <button
                    key={item.label}
                    onClick={() => setPayments((current) => checked ? current.filter((value) => value !== item.label) : [...current, item.label])}
                    className={`flex h-14 items-center gap-2 rounded-xl border px-3 text-left transition ${checked ? "border-brand bg-[#F8FBFF]" : "border-transparent bg-[#F8FBFF]"}`}
                  >
                    <PaymentIcon channel={item.label} />
                    <span className="text-[13px] font-black text-ink">{item.label}</span>
                    {checked && <Check size={15} className="ml-auto text-brand" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {openFilter === "time" && (
          <div className="absolute left-[118px] top-[58px] z-40 w-[460px] rounded-2xl bg-white p-4 shadow-soft ring-1 ring-[#EDF4FB]">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-bold text-muted">选择交易时间段</p>
              <div className="flex gap-2">
                <button onClick={() => { setStartTime("00:00"); setEndTime("23:59"); }} className="h-8 rounded-lg bg-[#F4F8FC] px-3 text-[12px] font-bold text-muted">重置</button>
                <button onClick={() => setOpenFilter(null)} className="h-8 rounded-lg bg-[#EAF7FF] px-3 text-[12px] font-bold text-brand">确定</button>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <TimeTarget label="开始时间" value={startTime} active={activeTimeField === "start"} onClick={() => setActiveTimeField("start")} />
              <TimeTarget label="结束时间" value={endTime} active={activeTimeField === "end"} onClick={() => setActiveTimeField("end")} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <TimeColumn title="时" values={hours} current={(activeTimeField === "start" ? startTime : endTime).split(":")[0]} onPick={(value) => setTimePart("hour", value)} />
              <TimeColumn title="分" values={minutes} current={(activeTimeField === "start" ? startTime : endTime).split(":")[1]} onPick={(value) => setTimePart("minute", value)} />
            </div>
          </div>
        )}

        {openFilter === "amount" && (
          <div className="absolute left-[278px] top-[58px] z-40 w-[390px] rounded-2xl bg-white p-4 shadow-soft ring-1 ring-[#EDF4FB]">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-bold text-muted">选择交易金额</p>
              <div className="flex gap-2">
                <button onClick={() => { setMinAmount(""); setMaxAmount(""); setActiveAmountField("min"); }} className="h-8 rounded-lg bg-[#F4F8FC] px-3 text-[12px] font-bold text-muted">重置</button>
                <button onClick={() => { setActiveAmountField(null); setOpenFilter(null); }} className="h-8 rounded-lg bg-[#EAF7FF] px-3 text-[12px] font-bold text-brand">确定</button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <AmountInput label="最小金额" value={minAmount} placeholder="0" active={activeAmountField === "min"} onClick={() => setActiveAmountField("min")} />
              <AmountInput label="最大金额" value={maxAmount} placeholder="不限" active={activeAmountField === "max"} onClick={() => setActiveAmountField("max")} />
            </div>
            <NumberKeyboard onInput={inputAmount} />
          </div>
        )}

        <div className="grid h-[338px] grid-cols-[210px_1fr] gap-3">
          <Card className="p-4">
            <p className="text-[13px] text-muted">交易金额</p>
            <p className="mt-1 font-[Arial] text-[30px] font-bold text-brand">{totalAmount.toLocaleString()}.00</p>
            <p className="mt-4 text-[13px] text-muted">交易笔数</p>
            <p className="mt-1 font-[Arial] text-[28px] font-bold text-ink">{rows.length}</p>
            <p className="mt-4 rounded-xl bg-[#F2F8FF] p-3 text-[13px] leading-5 text-muted">更多交易查询，请在手机应用市场下载“银联商务APP”</p>
          </Card>
          <Card className="overflow-hidden p-3">
            {mode === "empty" && <EmptyState title="暂无交易记录" hint="可调整筛选条件后重新查询" />}
            {mode === "error" && <ErrorState title="交易查询失败" onRetry={() => navigateTo("/transactions")} />}
            {mode === "ok" && (
              <div className="h-full overflow-y-auto pr-1">
                <div className="grid gap-2 pb-1">
                  {rows.map((item) => (
                    <button key={item.id} onClick={() => setSelected(item)} className="grid h-[70px] grid-cols-[126px_1fr_98px] items-center rounded-xl bg-[#F8FBFF] px-3 text-left transition hover:bg-[#F2F8FF]">
                      <div className="flex items-center gap-2">
                        <PaymentIcon channel={item.channel} />
                        <div>
                          <p className="text-[14px] font-black text-ink">{item.channel}</p>
                          <p className="text-[12px] text-muted">{item.time}</p>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-bold text-ink">{item.customer}</p>
                        <p className="mt-1 truncate text-[12px] text-muted">{item.orderNo}</p>
                      </div>
                      <p className={`text-right font-[Arial] text-[15px] font-bold ${item.amount < 0 ? "text-red-500" : "text-ink"}`}>{item.amount > 0 ? "+" : ""}{item.amount.toLocaleString()}.00</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      <Drawer open={!!selected} title="交易详情" onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-2.5 pb-4 text-[14px]">
            <div className="grid place-items-center px-4 pb-2 pt-0 text-center">
              <span className={`grid h-14 w-14 place-items-center ${selected.status === "成功" ? "text-[#16A35F]" : "text-[#EF4444]"}`}>
                {selected.status === "成功" ? (
                  <CheckCircle2 size={34} strokeWidth={2.25} />
                ) : (
                  <XCircle size={34} strokeWidth={2.25} />
                )}
              </span>
              <p className={`mt-1 font-[Arial] text-[28px] font-bold ${selected.amount < 0 ? "text-red-500" : "text-brand"}`}>{selected.amount > 0 ? "+" : ""}{selected.amount.toLocaleString()}.00</p>
              <p className="mt-1 text-[13px] font-bold text-muted">{selected.status}</p>
            </div>
            {[
              ["支付方式", selected.channel],
              ["交易类型", selected.type],
              ["交易时间", selected.time],
              ["订单号", selected.orderNo],
              ["付款账号", selected.customer]
            ].map(([label, value]) => (
              <div key={label} className="flex min-h-9 items-center rounded-xl bg-[#F8FBFF] px-3 py-1.5 text-left">
                <span className="w-[72px] shrink-0 text-left text-[13px] text-muted">{label}</span>
                <span className="min-w-0 flex-1 text-left font-semibold text-ink">{value}</span>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </SubPageShell>
  );
}

function FilterButton({ label, value, active, onClick }: { label: string; value: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex h-10 items-center gap-2 rounded-xl border px-3 text-left transition ${active ? "border-brand bg-[#F8FBFF]" : "border-transparent bg-[#F8FBFF]"}`}>
      <span className="text-[13px] font-bold text-muted">{label}</span>
      <span className="text-[14px] font-black text-ink">{value}</span>
      <ChevronDown size={15} className={active ? "text-brand" : "text-muted"} />
    </button>
  );
}

function TimeTarget({ label, value, active, onClick }: { label: string; value: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex h-12 items-center justify-between rounded-xl border px-3 text-left ${active ? "border-brand bg-[#F8FBFF] text-brand" : "border-transparent bg-[#F8FBFF] text-ink"}`}>
      <span className="text-[12px] font-bold text-muted">{label}</span>
      <span className="font-[Arial] text-[17px] font-bold">{value}</span>
    </button>
  );
}

function TimeColumn({ title, values, current, onPick }: { title: string; values: string[]; current: string; onPick: (value: string) => void }) {
  return (
    <div>
      <p className="mb-1 text-center text-[12px] font-bold text-muted">{title}</p>
      <div className="h-[96px] overflow-y-auto rounded-xl bg-[#F8FBFF] p-1">
        <div className="grid grid-cols-4 gap-1">
          {values.map((value) => (
            <button key={value} onClick={() => onPick(value)} className={`h-8 rounded-lg font-[Arial] text-[13px] font-bold ${current === value ? "bg-brand text-white" : "text-ink"}`}>
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AmountInput({ label, value, placeholder, active, onClick }: { label: string; value: string; placeholder: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex h-12 items-center justify-between rounded-xl bg-[#F8FBFF] px-3 text-left ring-1 ${active ? "ring-brand" : "ring-[#EAF1F8]"}`}>
      <span className="text-[12px] font-bold text-muted">{label}</span>
      <span className={`font-[Arial] text-[18px] font-bold ${value ? "text-ink" : "text-muted"}`}>{value || placeholder}</span>
    </button>
  );
}

function NumberKeyboard({ onInput }: { onInput: (key: string) => void }) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "delete"];
  return (
    <div className="mt-3 rounded-2xl bg-[#F8FBFF] p-2">
      <div className="grid grid-cols-3 gap-2">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => onInput(key)}
            className="h-9 rounded-xl bg-[#F4F8FC] text-[14px] font-black text-ink"
          >
            {key === "delete" ? "删除" : key}
          </button>
        ))}
      </div>
    </div>
  );
}

function PaymentIcon({ channel }: { channel: PaymentChannel }) {
  const meta = paymentMethods.find((item) => item.label === channel) ?? paymentMethods[0];
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center">
      {meta.icon ? (
        <img src={meta.icon} alt={meta.label} className={`h-7 w-7 object-contain`} />
      ) : (
        <span className="grid h-7 w-7 place-items-center rounded-lg text-white" style={{ backgroundColor: meta.color }}>
          <CreditCard size={16} />
        </span>
      )}
    </span>
  );
}

function isValidAmount(value: string) {
  if (!/^\d*\.?\d*$/.test(value)) return false;
  const [integer, decimal = ""] = value.split(".");
  if (decimal.length > 2) return false;
  if (integer.length > 6) return false;
  return value.length <= 9;
}
