export type Role = "user" | "assistant" | "system" | "error";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: number; // ms
}

export interface AgentConfig {
  id: string;        // internal id
  name: string;      // display name
  webhookUrl: string;
  isDefault?: boolean;
}

export interface SendResult {
  ok: boolean;
  reply?: string;
  error?: string;
}
