import { useState } from "react";
import { BadgeCheck, Crown, ScanLine, WalletCards } from "lucide-react";
import { Button, Card, EmptyState, FormRow, SubPageShell, getHashParam, navigateTo, showSystemKeyboard, useToast } from "../components/ui";
import { completeFirstLogin, type UserRole } from "../data/mock";

const roles: Array<{ id: UserRole; label: UserRole; desc: string; icon: typeof Crown | typeof CashierIcon }> = [
  { id: "老板", label: "老板", desc: "查看经营数据与门店信息", icon: Crown },
  { id: "财务", label: "财务", desc: "交易对账与消息通知管理", icon: WalletCards },
  { id: "收银员", label: "收银员", desc: "收款、退款与交易查询", icon: CashierIcon }
];

export function BindRole() {
  const [role, setRole] = useState<UserRole>("老板");
  const [step, setStep] = useState<"role" | "form" | "success">("role");
  const [hasLicense, setHasLicense] = useState(true);
  const reviewState = getHashParam("state");
  const [form, setForm] = useState({
    licenseNo: "91310000MA1K000000",
    merchantNo: "10091012297100430009415140",
    storeNo: "UMS 301 001 7529",
    settlementNo: "6222 8888 0000 7529",
    settlementName: "上海银联商务示例户",
    operator: "18889008888",
    terminalNo: "T-POS-0866"
  });
  const toast = useToast();
  const RoleIcon = roles.find((item) => item.id === role)?.icon ?? Crown;

  if (reviewState === "empty") {
    return (
      <SubPageShell title="绑定身份角色" backTo="/login">
        <EmptyState
          title="暂无可绑定角色"
          hint="当前账号未分配终端角色，请联系门店负责人处理"
          action={<Button onClick={() => navigateTo("/bind-role")}>返回绑定</Button>}
        />
      </SubPageShell>
    );
  }

  if (step === "success") {
    return (
      <SubPageShell title="绑定身份角色" backTo="/login">
        <Card className="grid h-full place-items-center text-center">
          <div>
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-[24px] bg-[#EAF7FF] text-brand shadow-insetBlue">
              <BadgeCheck size={42} />
            </div>
            <h2 className="mt-4 text-[24px] font-black text-ink">绑定成功</h2>
            <p className="mt-2 text-[14px] text-muted">当前身份：{role}，已完成商户信息绑定。</p>
            <Button className="mt-5" onClick={() => navigateTo("/dashboard")}>进入首页</Button>
          </div>
        </Card>
      </SubPageShell>
    );
  }

  return (
    <SubPageShell title="绑定身份角色" backTo="/login" onBack={step === "form" ? () => setStep("role") : undefined}>
      {step === "role" ? (
        <Card className="h-full p-5">
          <h2 className="text-[20px] font-black text-ink">选择身份角色</h2>
          <p className="mt-1 text-[13px] text-muted">请选择本终端登录后使用的身份。</p>
          <div className="mt-5 grid grid-cols-3 gap-4">
            {roles.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setRole(item.id)}
                  className={`h-[178px] rounded-2xl border p-4 text-left ${
                    role === item.id ? "border-brand bg-[#F0F8FF]" : "border-[#E2ECF5] bg-[#FAFDFF]"
                  }`}
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EAF7FF] text-brand">
                    <Icon size={25} />
                  </span>
                  <span className="mt-4 block text-[22px] font-black text-ink">{item.label}</span>
                  <span className="mt-2 block text-[13px] leading-5 text-muted">{item.desc}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex justify-end">
            <Button className="w-[180px]" onClick={() => setStep("form")}>下一步</Button>
          </div>
        </Card>
      ) : (
        <div className="grid h-full grid-cols-[190px_1fr] gap-3">
          <Card className="p-4">
            <p className="flex items-center gap-2 text-[13px] text-muted">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#EAF7FF] text-brand">
                <RoleIcon size={16} />
              </span>
              当前身份
            </p>
            <p className="mt-2 text-[26px] font-black text-brand">{role}</p>
            <p className="mt-4 rounded-xl bg-[#F2F8FF] p-3 text-[13px] leading-5 text-muted">
              核对商户信息，扫码完成后即可绑定并进入首页。
            </p>
          </Card>
          <Card className="p-4">
            <div className="grid gap-2">
              {role === "老板" && (
                <>
                  <div className="flex h-[54px] items-center rounded-xl border border-[#DCE7F2] bg-white px-3 transition focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(1,145,255,0.10)]">
                    <span className="w-[82px] shrink-0 text-[14px] font-semibold text-slate-700">营业执照 <span className="text-red-500">*</span></span>
                    <input
                      value={hasLicense ? form.licenseNo : ""}
                      onChange={(event) => setForm({ ...form, licenseNo: event.target.value })}
                      onFocus={(event) => showSystemKeyboard(event.currentTarget)}
                      onPointerDown={(event) => showSystemKeyboard(event.currentTarget)}
                      onClick={(event) => showSystemKeyboard(event.currentTarget)}
                      placeholder={hasLicense ? "请输入营业执照号" : "小微商户无需录入执照号"}
                      readOnly={!hasLicense}
                      className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:text-slate-300"
                    />
                    <div className="ml-2 grid grid-cols-2 gap-1">
                      {[
                        { label: "有营业执照", value: true },
                        { label: "未录入营业执照", value: false }
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => setHasLicense(item.value)}
                          className={`h-8 w-[94px] rounded-lg text-[12px] font-black ${hasLicense === item.value ? "bg-brand text-white" : "bg-[#EEF5FC] text-slate-600"}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <FormRow label="商户号" required value={form.merchantNo} onChange={(merchantNo) => setForm({ ...form, merchantNo })} />
                </>
              )}
              {role !== "老板" && <FormRow label="商户号" required value={form.merchantNo} onChange={(merchantNo) => setForm({ ...form, merchantNo })} />}
              {role === "老板" && (
                <>
                  <FormRow label="结算账号" required value={form.settlementNo} onChange={(settlementNo) => setForm({ ...form, settlementNo })} />
                  <FormRow label="结算用户名" required value={form.settlementName} onChange={(settlementName) => setForm({ ...form, settlementName })} />
                </>
              )}
              {role === "财务" && (
                <>
                  <FormRow label="结算账号" required value={form.settlementNo} onChange={(settlementNo) => setForm({ ...form, settlementNo })} />
                  <FormRow label="结算户名" required value={form.settlementName} onChange={(settlementName) => setForm({ ...form, settlementName })} />
                </>
              )}
              {role === "收银员" && (
                <>
                  <FormRow label="终端号" required value={form.terminalNo} onChange={(terminalNo) => setForm({ ...form, terminalNo })} />
                </>
              )}
              {role === "老板" && <FormRow label="法人证件" required value={form.operator} onChange={(operator) => setForm({ ...form, operator })} />}
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  className="inline-flex w-[132px] items-center justify-center gap-2 !border-brand !text-brand"
                  onClick={() => {
                    toast("扫码绑定功能仅作演示", "info");
                  }}
                >
                  <ScanLine size={18} /> 扫码绑定
                </Button>
                <Button
                  className="w-[132px]"
                  onClick={() => {
                    completeFirstLogin(role);
                    setStep("success");
                  }}
                >
                  完成绑定
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </SubPageShell>
  );
}

function CashierIcon({ size = 25 }: { size?: number }) {
  return <span style={{ fontSize: size, lineHeight: 1 }} className="font-[Arial] font-black">¥</span>;
}
