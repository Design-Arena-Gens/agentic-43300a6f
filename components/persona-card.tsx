import { Clock, Notebook, Stars } from "lucide-react";

export function PersonaCard() {
  return (
    <div className="mt-12 grid gap-6 rounded-3xl border border-slate-800/60 bg-slate-900/40 p-6 text-sm text-slate-300 lg:max-w-xl">
      <h2 className="text-base font-semibold text-white">Agent persona</h2>
      <p>
        Receipsonist blends hospitality with operations. It greets visitors by name, captures the
        reason they stopped by, and turns every interaction into a clean handoff for your team.
      </p>
      <ul className="grid gap-4 text-sm text-slate-300 sm:grid-cols-3">
        <li className="flex flex-col gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Stars className="h-4 w-4 text-brand-400" /> Tone
          </span>
          <span className="text-slate-100">Warm, concierge-level service with crisp summaries.</span>
        </li>
        <li className="flex flex-col gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Clock className="h-4 w-4 text-brand-400" /> Responsiveness
          </span>
          <span className="text-slate-100">Understands urgency, escalates hot leads instantly.</span>
        </li>
        <li className="flex flex-col gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Notebook className="h-4 w-4 text-brand-400" /> Deliverables
          </span>
          <span className="text-slate-100">
            Provides contact sheets, meeting agendas, and next-step briefs automatically.
          </span>
        </li>
      </ul>
    </div>
  );
}
