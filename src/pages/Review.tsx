import { Card, SubPageShell, navigateTo } from "../components/ui";

const reviewLinks = [
  { label: "首页 normal", path: "/dashboard" },
  { label: "首页 loading", path: "/dashboard?state=loading" },
  { label: "首页 empty", path: "/dashboard?state=empty" },
  { label: "首页 error", path: "/dashboard?state=error" },
  { label: "消息 empty", path: "/messages?state=empty" },
  { label: "今日交易 empty", path: "/transactions?state=empty" },
  { label: "今日交易 error", path: "/transactions?state=error" },
  { label: "语音 normal", path: "/voice" },
  { label: "语音 device-error", path: "/voice?state=device-error" },
  { label: "语音 permission-error", path: "/voice?state=permission-error" },
  { label: "切店 empty", path: "/stores?state=empty" },
  { label: "切店 permission-error", path: "/stores?state=permission-error" },
  { label: "切店 failed", path: "/stores?state=failed" },
  { label: "绑定 empty", path: "/bind-role?state=empty" },
  { label: "通知 normal", path: "/message-settings" },
  { label: "通知 success", path: "/message-settings?state=success" },
  { label: "通知 failed", path: "/message-settings?state=failed" }
];

export function Review() {
  return (
    <SubPageShell title="开发验收">
      <Card className="h-full p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-black text-ink">Mock 状态面板</h2>
            <p className="mt-1 text-[13px] text-muted">真实业务页面不展示状态切换按钮，仅通过这里或 URL query 验收。</p>
          </div>
          <code className="rounded-xl bg-[#F2F8FF] px-3 py-2 text-[13px] font-bold text-brand">?state=...</code>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {reviewLinks.map((item) => (
            <button
              key={item.path + item.label}
              onClick={() => navigateTo(item.path)}
              className="h-12 rounded-xl border border-[#DCE7F2] bg-[#F8FBFF] px-3 text-[13px] font-black text-ink hover:border-brand"
            >
              {item.label}
            </button>
          ))}
        </div>
      </Card>
    </SubPageShell>
  );
}
