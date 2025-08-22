import { useState } from "react";
import { useChatStore } from "../lib/store";
import { AgentConfig } from "../lib/types";
import { ChevronDown, Plus, Trash2, Save } from "lucide-react";
import clsx from "clsx";

export default function AgentSelector() {
  const {
    agents, selectedAgentId, selectAgent,
    addAgent, removeAgent, updateAgent
  } = useChatStore();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AgentConfig | null>(null);
  const selected = agents.find(a => a.id === selectedAgentId);

  function startAdd() {
    const id = crypto.randomUUID();
    setEditing({ id, name: "", webhookUrl: "" });
  }
  function startEdit(a: AgentConfig) {
    setEditing({ ...a });
  }
  function cancelEdit() {
    setEditing(null);
  }
  function saveEdit() {
    if (!editing) return;
    if (!editing.name || !editing.webhookUrl) return;
    const exists = agents.some(a => a.id === editing.id);
    if (exists) updateAgent(editing); else addAgent(editing);
    setEditing(null);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-2 rounded-xl2 border border-white/10 bg-card px-3 py-2 text-sm shadow-soft hover:border-white/20"
        title="Switch Agent/Webhook"
      >
        <span className="truncate max-w-[180px]">{selected?.name ?? "Select agent"}</span>
        <ChevronDown className="h-4 w-4 text-subtle" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[320px] rounded-xl2 border border-white/10 bg-card shadow-soft">
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs uppercase tracking-wide text-subtle">Agents</span>
              <button
                onClick={startAdd}
                className="text-xs inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 hover:border-white/20"
                title="Add Agent"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>

            <ul className="max-h-64 overflow-auto">
              {agents.map(a => (
                <li key={a.id}
                  className={clsx(
                    "group flex items-center justify-between gap-2 px-2 py-2 text-sm hover:bg-white/5",
                    selectedAgentId === a.id && "bg-white/5"
                  )}
                >
                  <button
                    className="text-left truncate"
                    onClick={() => selectAgent(a.id)}
                    title={a.webhookUrl}
                  >
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-subtle truncate">{a.webhookUrl}</div>
                  </button>

                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100">
                    <button
                      onClick={() => startEdit(a)}
                      className="text-xs rounded-lg border border-white/10 px-2 py-1 hover:border-white/20"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeAgent(a.id)}
                      className="rounded-lg p-1 hover:bg-white/10"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-subtle" />
                    </button>
                  </div>
                </li>
              ))}
              {agents.length === 0 && (
                <li className="px-2 py-3 text-sm text-subtle">No agents yet.</li>
              )}
            </ul>

            {editing && (
              <div className="mt-2 rounded-xl2 border border-white/10 p-2">
                <div className="text-xs uppercase tracking-wide text-subtle px-1">Edit Agent</div>
                <label className="block mt-2 text-xs text-subtle px-1">Display Name</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-bg px-3 py-2 text-sm outline-none focus:border-brand"
                  value={editing.name}
                  onChange={e => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g., AIRA (Prod)"
                />
                <label className="block mt-2 text-xs text-subtle px-1">Webhook URL</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-bg px-3 py-2 text-sm outline-none focus:border-brand"
                  value={editing.webhookUrl}
                  onChange={e => setEditing({ ...editing, webhookUrl: e.target.value })}
                  placeholder="https://n8n.example.com/webhook/..."
                />
                <div className="mt-2 flex items-center justify-end gap-2">
                  <button className="rounded-lg px-3 py-1.5 text-sm hover:bg-white/10" onClick={cancelEdit}>
                    Cancel
                  </button>
                  <button
                    className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-sm text-bg hover:opacity-90"
                    onClick={saveEdit}
                  >
                    <Save className="h-4 w-4" /> Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
