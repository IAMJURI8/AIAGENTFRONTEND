import { ChatMessage } from "../lib/types";
import clsx from "clsx";

export default function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  const isError = msg.role === "error";

  return (
    <div className={clsx("mb-3 flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-soft",
          isError && "border border-red-500/40",
          isUser
            ? "bg-brand text-bg rounded-br-sm"
            : "bg-card text-ink border border-white/5 rounded-bl-sm"
        )}
      >
        <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
        <div className={clsx(
          "mt-1.5 text-[10px] uppercase tracking-wide",
          isUser ? "text-bg/75" : "text-subtle"
        )}>
          {new Date(msg.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
