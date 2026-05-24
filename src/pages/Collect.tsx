import { useState } from "react";
import { Button, Card, FormRow, Modal, Stepper, SubPageShell, useToast } from "../components/ui";

type Form = { phone: string; region: string; address: string };

export function Collect() {
  const [form, setForm] = useState<Form>({ phone: "18989897788", region: "上海市 黄浦区 某某街道", address: "某某某街道张衡路1399号" });
  const [errors, setErrors] = useState<Partial<Form>>({});
  const [regionOpen, setRegionOpen] = useState(false);
  const [result, setResult] = useState<"success" | "fail" | null>(null);
  const toast = useToast();

  const validate = () => {
    const next: Partial<Form> = {};
    if (!/^1\d{10}$/.test(form.phone)) next.phone = "请输入 11 位手机号";
    if (!form.region) next.region = "请选择所在地区";
    if (form.address.length < 6) next.address = "详细地址至少 6 个字";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return (
    <SubPageShell title="信息采集">
      <div className="grid h-full grid-rows-[72px_1fr] gap-3">
        <Stepper />
        <div className="grid grid-cols-[1fr_210px] gap-3">
          <Card className="p-5">
            <h2 className="mb-4 text-[18px] font-black text-ink">添加收货地址</h2>
            <div className="grid gap-3">
              <FormRow label="手机号" required value={form.phone} error={errors.phone} onChange={(phone) => setForm({ ...form, phone })} />
              <FormRow label="所在地区" required value={form.region} error={errors.region} readOnly onClick={() => setRegionOpen(true)} />
              <FormRow label="详细地址" required value={form.address} error={errors.address} onChange={(address) => setForm({ ...form, address })} />
            </div>
          </Card>
          <Card className="flex flex-col justify-between p-4">
            <div>
              <p className="text-[13px] text-muted">当前步骤</p>
              <p className="mt-1 text-[24px] font-black text-brand">收货地址</p>
              <p className="mt-3 text-[13px] leading-5 text-muted">横屏版步骤条保留三步信息，一屏内完成地址录入、暂存和提交。</p>
            </div>
            <div className="grid gap-2">
              <Button variant="ghost" onClick={() => toast("已返回上一步", "info")}>上一步</Button>
              <Button variant="secondary" onClick={() => toast("暂存成功")}>暂存</Button>
              <Button onClick={() => validate() && setResult("success")}>确认提交</Button>
            </div>
          </Card>
        </div>
      </div>
      <Modal open={regionOpen} title="选择地区" onClose={() => setRegionOpen(false)} onConfirm={() => { setForm({ ...form, region: "上海市 浦东新区 张江镇" }); setRegionOpen(false); }}>
        <div className="grid grid-cols-3 gap-2 text-center text-[14px]">
          {["上海市", "浦东新区", "张江镇", "黄浦区", "徐汇区", "陆家嘴"].map((item) => <button key={item} className="h-11 rounded-xl bg-[#F2F8FF] font-semibold text-slate-700">{item}</button>)}
        </div>
      </Modal>
      <Modal open={result === "success"} title="提交成功" onClose={() => setResult(null)} onConfirm={() => setResult(null)} confirmText="完成">
        <p className="text-center text-[15px] text-slate-600">收货地址已提交，客户端可进入下一业务流程。</p>
      </Modal>
      <Modal open={result === "fail"} title="提交失败" onClose={() => setResult(null)} onConfirm={() => setResult(null)} confirmText="我知道了">
        <p className="text-center text-[15px] text-slate-600">网络异常或字段校验失败，请检查后重新提交。</p>
      </Modal>
    </SubPageShell>
  );
}
