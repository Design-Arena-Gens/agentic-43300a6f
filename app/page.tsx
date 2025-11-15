import { ChatPanel } from "@/components/chat/chat-panel";
import { PersonaCard } from "@/components/persona-card";

const differentiators = [
  {
    title: "Visitor intake",
    body: "Capture names, emails, intent, and priority in a structured brief that your team can act on instantly."
  },
  {
    title: "Scheduling-ready",
    body: "Offer calendar slots, confirm details, and draft follow-up emails within the same conversation."
  },
  {
    title: "Context aware",
    body: "Pull in knowledge base snippets, service tiers, and pricing cues to answer visitors on-brand."
  }
];

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 pb-16 pt-20 lg:flex-row">
      <section className="flex flex-1 flex-col justify-between">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-brand-500/50 bg-brand-500/10 px-4 py-1 text-xs font-semibold tracking-wide text-brand-200">
            Receipsonist AI Concierge
          </span>
          <header className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Delight visitors with an AI receptionist that never forgets a detail.
            </h1>
            <p className="text-lg text-slate-300">
              Receipsonist greets every guest, qualifies leads, and hands over clean summaries
              to your team. Deploy it on your website or support desk and respond faster than ever.
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            {differentiators.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-800/60 bg-slate-900/40 p-5 shadow-lg"
              >
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-xs text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <PersonaCard />
      </section>

      <section className="flex flex-1 max-w-xl flex-col">
        <ChatPanel />
      </section>
    </main>
  );
}
