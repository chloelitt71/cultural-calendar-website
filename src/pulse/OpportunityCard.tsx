import type { OpportunityItem, OpportunityTiming } from './types';

const timingStyle: Record<OpportunityTiming, string> = {
  Now: 'bg-red-500/20 text-red-300 border-red-500/40',
  'Act Soon': 'bg-amber-500/20 text-amber-200 border-amber-500/40',
  'Plan Now': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
};

export function OpportunityCard({ item, timing }: { item: OpportunityItem; timing: OpportunityTiming }) {
  return (
    <article className="event-tile rounded-[1.35rem] p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-display text-lg text-zinc-100">{item.title}</h3>
        <span className={`rounded-full border px-2 py-1 font-mono text-[11px] font-semibold ${timingStyle[timing]}`}>{timing}</span>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-zinc-300">{item.description}</p>
      <div className="flex flex-wrap gap-2">
        {item.actions.map((action) => (
          <span key={action} className="rounded-full border border-white/12 bg-zinc-900/60 px-2 py-1 font-mono text-[11px] text-zinc-300">
            {action}
          </span>
        ))}
      </div>
    </article>
  );
}
