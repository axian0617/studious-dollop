import { FileText, Phone } from "lucide-react";
import umsLogo from "../assets/ums-logo.png";
import { Button, Card, SubPageShell, useToast } from "../components/ui";

export function About() {
  const toast = useToast();
  return (
    <SubPageShell title="关于我们">
      <div className="grid h-full grid-cols-[320px_1fr] gap-3">
        <Card className="grid place-items-center p-6 text-center">
          <div className="grid place-items-center">
            <img src={umsLogo} alt="银联商务 UMS" className="h-[76px] w-[76px] rounded-[22px] shadow-insetBlue" />
            <h2 className="mt-3 text-[24px] font-black text-ink">银联商务终端版</h2>
            <p className="mt-2 rounded-full bg-[#F0F8FF] px-4 py-1.5 text-[14px] font-bold text-brand">V4.6.9 · 854×480 横屏适配</p>
          </div>
        </Card>
        <Card className="p-5">
          <div className="grid gap-3">
            <InfoRow icon={<Phone size={18} />} label="客服电话" value="95534 / 400-000-0000" />
            <InfoRow icon={<FileText size={18} />} label="公司官网" value="www.chinaums.com" />
            <button onClick={() => toast("已打开用户服务协议", "info")} className="flex h-14 items-center justify-between rounded-2xl bg-[#F8FBFF] px-4 text-left">
              <span className="font-bold text-ink">用户服务协议</span>
              <span className="text-brand">查看</span>
            </button>
            <button onClick={() => toast("已打开隐私政策", "info")} className="flex h-14 items-center justify-between rounded-2xl bg-[#F8FBFF] px-4 text-left">
              <span className="font-bold text-ink">隐私政策</span>
              <span className="text-brand">查看</span>
            </button>
          </div>
        </Card>
      </div>
    </SubPageShell>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex h-14 items-center gap-3 rounded-2xl bg-[#F8FBFF] px-4">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF7FF] text-brand">{icon}</span>
      <span className="w-24 text-[14px] font-bold text-muted">{label}</span>
      <span className="text-[15px] font-black text-ink">{value}</span>
    </div>
  );
}
