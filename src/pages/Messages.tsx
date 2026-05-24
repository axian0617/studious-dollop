import { useMemo, useState } from "react";
import { Megaphone, ReceiptText } from "lucide-react";
import { Button, Card, Drawer, EmptyState, PageTabs, SubPageShell, getHashParam } from "../components/ui";
import { Message, messages as sourceMessages } from "../data/mock";

export function Messages() {
  const [tab, setTab] = useState("全部");
  const [category, setCategory] = useState("全部");
  const [items, setItems] = useState(sourceMessages);
  const [selected, setSelected] = useState<Message | null>(sourceMessages[0]);
  const empty = getHashParam("state") === "empty";
  const filtered = useMemo(() => {
    if (empty) return [];
    return items.filter((item) => (tab === "未读" ? item.unread : true)).filter((item) => (category === "全部" ? true : item.category === category));
  }, [items, tab, category, empty]);

  const markRead = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)));
  };

  return (
    <SubPageShell title="消息中心">
      <div className="grid h-full grid-cols-[190px_1fr] gap-3">
        <Card className="p-3">
          <PageTabs value={tab} onChange={setTab} options={["全部", "未读"]} />
          <div className="mt-3 grid gap-2">
            {["全部", "系统公告", "交易通知"].map((item) => (
              <Button key={item} variant={category === item ? "primary" : "ghost"} onClick={() => setCategory(item)}>{item}</Button>
            ))}
          </div>
        </Card>
        <Card className="p-3">
          {filtered.length === 0 ? <EmptyState title="暂无消息" hint="系统公告和交易通知会在此展示" /> : (
            <div className="grid gap-2">
              {filtered.slice(0, 5).map((item) => {
                const Icon = item.category === "系统公告" ? Megaphone : ReceiptText;
                return (
                <button key={item.id} onClick={() => { setSelected(item); markRead(item.id); }} className="flex h-[62px] items-center justify-between rounded-2xl bg-[#F8FBFF] px-4 text-left hover:bg-[#F2F8FF]">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EAF7FF] text-brand">
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-[15px] font-black text-ink">{item.unread && <span className="h-2 w-2 rounded-full bg-red-500" />}{item.title}</p>
                      <p className="mt-1 truncate text-[13px] text-muted">{item.summary}</p>
                    </div>
                  </div>
                  <span className="text-[12px] text-muted">{item.time}</span>
                </button>
                );
              })}
            </div>
          )}
        </Card>
      </div>
      <Drawer open={!!selected} title="消息详情" onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-3">
            <p className="rounded-xl bg-[#F2F8FF] px-3 py-2 text-[13px] font-bold text-brand">{selected.category}</p>
            <h3 className="text-[20px] font-black text-ink">{selected.title}</h3>
            <p className="text-[13px] text-muted">{selected.time}</p>
            <p className="rounded-2xl bg-[#F8FBFF] p-4 text-[15px] leading-7 text-slate-700">{selected.summary}。请核对门店流水和支付平台记录，必要时联系服务商处理。</p>
            <Button className="w-full" onClick={() => selected && markRead(selected.id)}>标记已读</Button>
          </div>
        )}
      </Drawer>
    </SubPageShell>
  );
}
