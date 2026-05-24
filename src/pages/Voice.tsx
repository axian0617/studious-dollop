import { useState } from "react";
import { CheckCircle2, CreditCard, QrCode, Volume2 } from "lucide-react";
import { Card, EmptyState, SubPageShell, getHashParam, useToast } from "../components/ui";

const modes = [
  {
    id: "standard",
    title: "标准模式",
    sample: "播报案例：银联商务为您收款6元",
    icon: Volume2
  },
  {
    id: "qr",
    title: "二维码名称播报",
    sample: "播报案例：银联商务为您收款6元，101包厢",
    icon: QrCode
  },
  {
    id: "channel",
    title: "支付途径名称播报",
    sample: "播报案例：银联商务为您收款6元，支付宝交易",
    icon: CreditCard
  }
] as const;

type VoiceMode = typeof modes[number]["id"];

export function Voice() {
  const [enabled, setEnabled] = useState(true);
  const [mode, setMode] = useState<VoiceMode>("standard");
  const toast = useToast();
  const state = getHashParam("state");
  const reviewMode = state === "device-error" ? "device" : state === "permission-error" ? "permission" : "ok";

  const updateEnabled = (value: boolean) => {
    setEnabled(value);
    toast(value ? "收款语音播报已开启" : "收款语音播报已关闭");
  };

  return (
    <SubPageShell title="收款语音播报">
      <Card className="h-full p-4">
        {reviewMode === "device" && <EmptyState title="设备异常" hint="未检测到可用扬声器，请检查终端音量和硬件状态" />}
        {reviewMode === "permission" && <EmptyState title="权限异常" hint="当前账号无权修改语音播报设置" />}
        {reviewMode === "ok" && (
          <div className="h-full">
            <div className="flex h-[64px] items-center justify-between rounded-2xl bg-[#F8FBFF] px-4">
              <div>
                <p className="text-[16px] font-black text-ink">收款语音播报设置</p>
                <p className="mt-1 text-[12px] text-muted">开启后可管理收款成功后的播报方式</p>
              </div>
              <Switch checked={enabled} onChange={updateEnabled} />
            </div>
            <div className="mt-3 px-1">
              <p className="text-[13px] font-bold text-muted">语音播报模式</p>
            </div>
            {!enabled ? (
              <div className="mt-3 rounded-2xl bg-[#F8FBFF] px-4 py-6 text-[14px] leading-6 text-muted">
                打开收款语音播报设置，即可对语音播报的模式进行管理
              </div>
            ) : (
              <div className="mt-3 grid gap-2">
                {modes.map((item) => (
                  <VoiceModeRow
                    key={item.id}
                    item={item}
                    selected={mode === item.id}
                    onClick={() => setMode(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </SubPageShell>
  );
}

function VoiceModeRow({
  item,
  selected,
  onClick
}: {
  item: (typeof modes)[number];
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className="flex h-[68px] w-full items-center gap-3 rounded-2xl bg-[#F8FBFF] px-4 text-left"
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF7FF] text-brand">
        <Icon size={19} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-black text-ink">{item.title}</p>
        <p className="mt-1 truncate text-[13px] text-muted">{item.sample}</p>
      </div>
      {selected ? (
        <CheckCircle2 size={22} className="text-brand" />
      ) : (
        <span className="h-[18px] w-[18px] rounded-full ring-2 ring-[#B7C4D4]" />
      )}
    </button>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-[56px] rounded-full p-1 transition ${checked ? "bg-brand" : "bg-slate-200"}`}
      aria-label="收款语音播报设置"
    >
      <span className={`block h-6 w-6 rounded-full bg-white shadow transition ${checked ? "translate-x-6" : ""}`} />
    </button>
  );
}
