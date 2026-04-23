import type { OpportunityItem, OpportunityTiming } from './types';

const timingStyle: Record<OpportunityTiming, string> = {
  Now: 'bg-[#f5f5f5] text-[#1c1c1c] border-[#d9d4cc]',
  'Act Soon': 'bg-[#f5f5f5] text-[#1c1c1c] border-[#d9d4cc]',
  'Plan Now': 'bg-[#f5f5f5] text-[#1c1c1c] border-[#d9d4cc]',
};

export function OpportunityCard({ item, timing }: { item: OpportunityItem; timing: OpportunityTiming }) {
  return (
    <article className="event-tile rounded-[1.35rem] p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-display text-lg text-zinc-100">{item.title}</h3>
        <span className={`rounded-lg border px-2 py-1 font-mono text-[11px] font-semibold ${timingStyle[timing]}`}>{timing}</span>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-zinc-300">{item.description}</p>
      <div className="flex flex-wrap gap-2">
        {item.actions.map((action) => (
          <span key={action} className="rounded-lg border border-[#e0ddd8] bg-[#f5f5f5] px-2 py-1 font-mono text-[11px] text-[#1c1c1c]">
            {action}
          </span>
        ))}
      </div>
    </article>
  );
}
