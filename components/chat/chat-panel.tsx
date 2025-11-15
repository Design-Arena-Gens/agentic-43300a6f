/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { MessageBubble } from "./message-bubble";
import type { ChatMessage, VisitorProfile } from "@/lib/types";

const INITIAL_ASSISTANT_MESSAGE: ChatMessage = {
  id: nanoid(),
  role: "assistant",
  content:
    "👋 Hi there! I'm Receipsonist, your AI front-desk specialist. Let me know how I can help—are you here to set up a meeting, request a proposal, or something else?",
  createdAt: Date.now()
};

const QUICK_ACTIONS = [
  "I'd like to schedule a discovery call.",
  "Do you handle enterprise onboarding?",
  "I have an issue with my latest invoice.",
  "Can you summarize our current engagement?"
];

interface ChatPanelProps {
  visitorProfile?: VisitorProfile;
}

export function ChatPanel({ visitorProfile }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    INITIAL_ASSISTANT_MESSAGE
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) {
        return;
      }

      const outbound: ChatMessage = {
        id: nanoid(),
        role: "user",
        content: content.trim(),
        createdAt: Date.now()
      };

      setMessages((prev) => [...prev, outbound]);
      setInput("");
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, outbound].map(({ role, content, meta }) => ({
              role,
              content,
              meta
            })),
            visitorProfile
          })
        });

        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`);
        }

        const payload = await res.json();

        const inbound: ChatMessage = {
          id: nanoid(),
          role: "assistant",
          content: payload.reply ?? "I'm here to help with anything you need.",
          createdAt: Date.now(),
          meta: payload.meta
        };

        setMessages((prev) => [...prev, inbound]);
      } catch (err) {
        console.error(err);
        setError(
          "We hit a snag talking to the AI. Try again in a moment or refresh the page."
        );
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, visitorProfile]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void sendMessage(input);
    },
    [input, sendMessage]
  );

  return (
    <div className="glass-panel flex h-full flex-col overflow-hidden p-6 shadow-2xl">
      <header className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-2xl">
          🤖
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Receipsonist</h2>
          <p className="text-sm text-slate-400">
            Concierge AI • Available 24/7
          </p>
        </div>
      </header>

      <div className="relative mb-4 grid grid-cols-2 gap-3">
        {QUICK_ACTIONS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => void sendMessage(prompt)}
            className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-left text-xs font-medium text-slate-300 transition hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-white"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MessageBubble message={message} />
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start text-sm text-slate-500"
          >
            Receipsonist is typing…
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex w-full items-end gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 p-3"
      >
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type your message…"
          className="h-16 w-full resize-none rounded-2xl border border-transparent bg-transparent p-3 text-sm text-slate-100 outline-none focus:border-brand-500/60"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex h-12 items-center justify-center rounded-2xl bg-brand-500 px-6 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
        >
          Send
        </button>
      </form>
    </div>
  );
}
