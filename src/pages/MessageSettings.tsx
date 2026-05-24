import { useState } from "react";
import { BellRing, Megaphone, ReceiptText, ShieldCheck } from "lucide-react";
import { Card, EmptyState, SubPageShell, getHashParam, useToast } from "../components/ui";
import { messageSettings } from "../data/mock";

const settingIcons: Record<string, typeof BellRing> = {
  新信息通知: BellRing,
  财务消息推送: ReceiptText,
  系统消息推送: ShieldCheck,
  活动消息推送: Megaphone
};

export function MessageSettings() {
  const defaults = Object.fromEntries(messageSettings.map((item) => [item, true]));
  const [values, setValues] = useState<Record<string, boolean>>(defaults);
  const toast = useToast();
  const reviewState = getHashParam("state");
  const notificationsEnabled = values["新信息通知"];

  const updateMainSwitch = (enabled: boolean) => {
    if (enabled) {
      setValues(defaults);
      toast("新信息通知已开启");
      return;
    }
    setValues(Object.fromEntries(messageSettings.map((item) => [item, false])));
    toast("新信息通知已关闭");
  };

  const updateSetting = (item: string, enabled: boolean) => {
    setValues({ ...values, [item]: enabled });
    toast(`${item}已${enabled ? "开启" : "关闭"}`);
  };

  return (
    <SubPageShell title="消息中心管理">
      <div className="h-full">
        <Card className="flex h-full flex-col p-5">
          {reviewState === "success" && <EmptyState title="保存成功" hint="消息提醒配置已同步到当前终端" />}
          {reviewState === "failed" && <EmptyState title="保存失败" hint="网络连接不稳定，请返回后重新保存" />}
          {reviewState !== "success" && reviewState !== "failed" && (
            <div className="flex h-full flex-col">
              <SettingRow
                label="新信息通知"
                desc="开启后接收终端消息和红点提醒"
                checked={notificationsEnabled}
                onChange={updateMainSwitch}
              />
              <p className="mt-3 px-1 text-[13px] font-bold text-muted">消息推送类型</p>
              <div className="mt-2 grid gap-2">
                {messageSettings.slice(1).map((item) => (
                  <SettingRow
                    key={item}
                    label={item}
                    desc={`控制${item}在终端的推送提醒`}
                    checked={notificationsEnabled ? values[item] : false}
                    disabled={!notificationsEnabled}
                    onChange={(v) => updateSetting(item, v)}
                  />
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </SubPageShell>
  );
}

function SettingRow({
  label,
  desc,
  checked,
  disabled = false,
  onChange
}: {
  label: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  const Icon = settingIcons[label] ?? BellRing;
  return (
    <div className={`flex h-[62px] items-center justify-between rounded-2xl bg-[#F8FBFF] px-3 transition ${disabled ? "opacity-55" : ""}`}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF7FF] text-brand">
          <Icon size={19} />
        </span>
        <span className="min-w-0">
          <span className="block text-[15px] font-black text-ink">{label}</span>
          <span className="block truncate text-[12px] text-muted">{desc}</span>
        </span>
      </div>
      <button
        aria-pressed={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-[56px] shrink-0 rounded-full p-1 transition disabled:cursor-not-allowed ${checked ? "bg-brand" : "bg-slate-200"}`}
      >
        <span className={`block h-6 w-6 rounded-full bg-white shadow transition ${checked ? "translate-x-6" : ""}`} />
      </button>
    </div>
  );
}
