import type { EventItem } from './types';
import type { EventStatus } from './types';
import { SaveToProjectButton } from '../components/SaveToProjectButton';

const statusStyles: Record<EventStatus, string> = {
  now: 'bg-[#f5f5f5] text-[#1c1c1c] border-[#d9d4cc]',
  upcoming: 'bg-[#f5f5f5] text-[#1c1c1c] border-[#d9d4cc]',
  soon: 'bg-[#f5f5f5] text-[#1c1c1c] border-[#d9d4cc]',
  tbd: 'bg-[#f5f5f5] text-[#1c1c1c] border-[#d9d4cc]',
  past: 'bg-[#f5f5f5] text-[#6f6f6f] border-[#d9d4cc]',
};

const statusLabel: Record<EventStatus, string> = {
  now: 'Now',
  upcoming: 'Upcoming',
  soon: 'Soon',
  tbd: 'TBD',
  past: 'Past',
};

function conciseBrandWhy(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const sentences = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const picked = sentences.slice(0, 2).join(' ');
  if (picked.length <= 185) return picked;
  return `${picked.slice(0, 182).trim()}...`;
}

export function EventCard({
  event,
  status,
  muted = false,
}: {
  event: EventItem;
  status: EventStatus;
  muted?: boolean;
}) {
  const why = conciseBrandWhy(event.whyItMattersForBrands);

  return (
    <article
      className={`event-tile group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] p-5 ${
        muted ? 'opacity-60 grayscale hover:translate-y-0' : ''
      }`}
    >
      {event.image && (
        <div className="relative -mx-1 mb-3 aspect-[21/9] overflow-hidden rounded-xl border border-white/10">
          <img
            src={event.image}
            alt=""
            className="h-full w-full object-cover object-center opacity-95 transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1c1c1c]/25 via-transparent to-transparent" />
        </div>
      )}
      <div className="mb-2 flex flex-1 flex-col">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[1.15rem] leading-snug text-zinc-100">{event.title}</h3>
            <p className="mt-0.5 text-xs text-zinc-400">
              {event.date}
              {event.location ? ` · ${event.location}` : ''}
            </p>
          </div>
          <div className="flex shrink-0 items-start gap-2">
            <span
              className={`rounded-lg border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide ${statusStyles[status]}`}
            >
              {statusLabel[status]}
            </span>
            <SaveToProjectButton
              item={{
                type: 'event',
                sourceId: event.id,
                originPage: 'calendar',
                title: event.title,
                subtitle: `${event.date}${event.location ? ` • ${event.location}` : ''}`,
                description: why,
                metadata: {
                  category: event.category,
                  source: event.source,
                },
              }}
            />
          </div>
        </div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-lg border border-[#e0ddd8] bg-[#f5f5f5] px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-[#1c1c1c]">
            {event.category}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">{event.source}</span>
        </div>
        {event.description && <p className="mb-2 text-sm leading-relaxed text-zinc-400">{event.description}</p>}
        <div className="saas-panel-soft mt-auto rounded-2xl border border-[#c84c2f]/15 bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c84c2f]">Why it matters for brands</p>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-200">{why}</p>
        </div>
        {event.industries && event.industries.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {event.industries.map((tag) => (
              <span key={tag} className="rounded-lg border border-[#e0ddd8] bg-[#f5f5f5] px-2 py-0.5 font-mono text-[10px] text-[#1c1c1c]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
