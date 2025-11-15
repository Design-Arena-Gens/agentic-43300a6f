import { clsx } from "clsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={clsx(
        "flex w-full gap-3",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={clsx(
          "max-w-[80%] rounded-3xl border px-5 py-3 text-sm leading-relaxed shadow-lg transition-all",
          isAssistant
            ? "border-brand-500/30 bg-brand-500/10 text-slate-100 shadow-glow-brand"
            : "border-slate-600/50 bg-slate-800 text-slate-50"
        )}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-invert">
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
