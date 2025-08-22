import { create } from "zustand";
import { ChatMessage, AgentConfig } from "./types";

const AGENTS_KEY = "aira_agents_v1";
const SELECTED_KEY = "aira_selected_agent_v1";

const initialAgents: AgentConfig[] = [
  {
    id: "aira-dev",
    name: "AIRA (Dev Mock)",
    webhookUrl: "https://example.com/mock",
    isDefault: true
  },
  {
    id: "ops-helper",
    name: "Ops Helper",
    webhookUrl: "https://example.com/ops-webhook"
  }
];

function loadAgents(): AgentConfig[] {
  const raw = localStorage.getItem(AGENTS_KEY);
  if (!raw) return initialAgents;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return initialAgents;
}

function saveAgents(agents: AgentConfig[]) {
  localStorage.setItem(AGENTS_KEY, JSON.stringify(agents));
}

function loadSelected(): string | null {
  return localStorage.getItem(SELECTED_KEY);
}

function saveSelected(id: string) {
  localStorage.setItem(SELECTED_KEY, id);
}

export interface ChatState {
  agents: AgentConfig[];
  selectedAgentId: string | null;
  messages: ChatMessage[];
  isSending: boolean;
  errorBanner: string | null;

  addMessage: (m: ChatMessage) => void;
  setIsSending: (v: boolean) => void;
  setErrorBanner: (msg: string | null) => void;

  addAgent: (a: AgentConfig) => void;
  removeAgent: (id: string) => void;
  updateAgent: (a: AgentConfig) => void;
  selectAgent: (id: string) => void;
  getSelectedAgent: () => AgentConfig | null;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => {
  const agents = loadAgents();
  const selectedSaved = loadSelected();
  const selected = selectedSaved || agents.find(a => a.isDefault)?.id || agents[0]?.id || null;

  if (selected) saveSelected(selected);

  return {
    agents,
    selectedAgentId: selected,
    messages: [],
    isSending: false,
    errorBanner: null,

    addMessage(m) {
      set(s => ({ messages: [...s.messages, m] }));
    },
    setIsSending(v) {
      set({ isSending: v });
    },
    setErrorBanner(msg) {
      set({ errorBanner: msg });
    },
    addAgent(a) {
      set(s => {
        const updated = [...s.agents, a];
        saveAgents(updated);
        return { agents: updated };
      });
    },
    removeAgent(id) {
      set(s => {
        const updated = s.agents.filter(x => x.id !== id);
        saveAgents(updated);
        if (s.selectedAgentId === id) {
          const fallback = updated[0]?.id ?? null;
          if (fallback) saveSelected(fallback);
          return { agents: updated, selectedAgentId: fallback };
        }
        return { agents: updated };
      });
    },
    updateAgent(a) {
      set(s => {
        const updated = s.agents.map(x => (x.id === a.id ? a : x));
        saveAgents(updated);
        return { agents: updated };
      });
    },
    selectAgent(id) {
      saveSelected(id);
      set({ selectedAgentId: id });
    },
    getSelectedAgent() {
      const s = get();
      return s.agents.find(a => a.id === s.selectedAgentId) || null;
    },
    clearChat() {
      set({ messages: [] });
    }
  };
});
