import { MessageSquareText } from "lucide-react";
import ChatWindow from "./components/ChatWindow";
import AgentSelector from "./components/AgentSelector";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-bg text-ink">
      <header className="sticky top-0 z-10 border-b border-white/5 bg-bg/70 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center gap-3">
          <MessageSquareText className="h-6 w-6 text-brand" />
          <h1 className="text-lg font-semibold">AIRA — Chat Interface</h1>
          <div className="ml-auto">
            <AgentSelector />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <ChatWindow />
      </main>

      <footer className="mx-auto max-w-4xl px-4 py-4 text-sm text-subtle">
        Built for modular agents • Switch webhooks anytime • Frontend-only
      </footer>
    </div>
  );
}
