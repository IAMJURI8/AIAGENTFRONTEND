import { useEffect, useMemo, useRef, useState } from "react";
import { SendHorizonal, Loader2, RotateCcw, Trash } from "lucide-react";
import { useChatStore } from "../lib/store";
import { ChatMessage } from "../lib/types";
import MessageBubble from "./MessageBubble";
import { sendToAgent } from "../lib/api";

export default function ChatWindow() {
  const { messages, addMessage, isSending, setIsSending, getSelectedAgent, errorBanner, setErrorBanner, clearChat } =
    useChatStore();

  const [input, setInput] = useState("");
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    const agent = getSelectedAgent();
    if (!agent) {
      setErrorBanner("Please select an agent/webhook first.");
      return;
    }
    setErrorBanner(null);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now()
    };
    addMessage(userMsg);
    setInput("");
    setIsSending(true);

    const res = await sendToAgent(agent, text);
    if (res.ok) {
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: res.reply || "",
        timestamp: Date.now()
      });
    } else {
      addMessage({
        id: crypto.randomUUID(),
        role: "error",
        content: res.error || "Unknown error.",
        timestamp: Date.now()
      });
    }

    setIsSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) handleSend();
    }
  }

  return (
    <div className="grid h-[calc(100vh-160px)] grid-rows-[1fr_auto] rounded-xl2 border border-white/10 bg-card shadow-soft">
      {/* Banner */}
      {errorBanner && (
        <div className="mx-4 mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {errorBanner}
        </div>
      )}

      {/* Messages */}
      <div ref={scrollerRef} className="overflow-y-auto px-4 pt-4 space-y-0">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-subtle">
            Start the conversation — your agent’s reply will appear here.
          </div>
        ) : (
          messages.map(m => <MessageBubble key={m.id} msg={m} />)
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type your message… (Enter to send, Shift+Enter for newline)"
            className="min-h-[44px] max-h-[140px] flex-1 resize-y rounded-xl border border-white/10 bg-bg px-3 py-2 text-sm outline-none placeholder:text-subtle focus:border-brand"
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="inline-flex h-[44px] items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-medium text-bg hover:opacity-90 disabled:opacity-50"
            title="Send"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
            Send
          </button>
          <button
            onClick={clearChat}
            className="inline-flex h-[44px] items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-sm hover:border-white/20"
            title="Clear chat"
          >
            <Trash className="h-4 w-4" />
          </button>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex h-[44px] items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-sm hover:border-white/20"
            title="Reload app"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-1 text-[11px] text-subtle">
          Tip: Add agents via the dropdown in the header. Agents are stored locally.
        </div>
      </div>
    </div>
  );
}
