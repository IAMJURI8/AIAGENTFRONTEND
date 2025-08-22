import { AgentConfig, SendResult } from "./types";

/**
 * Single place to send the user message to the selected agent.
 * Adjust payload/shape later to match your n8n webhook.
 *
 * IMPORTANT: Browser CORS may block this if your webhook doesn't set CORS headers.
 * For testing, set USE_MOCK to true (below) to bypass network calls.
 */
const USE_MOCK = false;

export async function sendToAgent(
  agent: AgentConfig,
  userText: string
): Promise<SendResult> {
  if (!agent?.webhookUrl) {
    return { ok: false, error: "No webhook configured for this agent." };
  }

  if (USE_MOCK) {
    // Simulate a small delay and echo back
    await new Promise((r) => setTimeout(r, 600));
    return {
      ok: true,
      reply:
        `Mock (${agent.name}): I received: “${userText}”.\n\n` +
        `This is a placeholder. Wire me to n8n in src/lib/api.ts.`
    };
  }

  try {
    const res = await fetch(agent.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      // TODO: adjust to your webhook schema
      body: JSON.stringify({
        agentId: agent.id,
        message: userText
      })
    });

    if (!res.ok) {
      const text = await safeText(res);
      return {
        ok: false,
        error: `HTTP ${res.status}: ${text?.slice(0, 400) || "Request failed"}`
      };
    }

    // Expecting JSON with { reply: string }
    const data = await res.json().catch(() => ({}));
    const reply = data?.reply ?? (typeof data === "string" ? data : "");
    if (!reply) {
      return { ok: false, error: "No 'reply' found in response." };
    }
    return { ok: true, reply };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Network error." };
  }
}

async function safeText(res: Response): Promise<string | null> {
  try {
    return await res.text();
  } catch {
    return null;
  }
}
