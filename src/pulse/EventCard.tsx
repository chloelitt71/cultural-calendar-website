import type { EventItem } from './types';
import type { EventStatus } from './types';

const categoryTopLine: Partial<Record<EventItem['category'], string>> = {
  Festivals: 'from-rose-300/70 via-fuchsia-300/30 to-transparent',
  Awards: 'from-indigo-300/70 via-violet-300/30 to-transparent',
  Sports: 'from-emerald-300/70 via-teal-300/30 to-transparent',
  'Movie Premieres': 'from-sky-300/70 via-blue-300/30 to-transparent',
  'TV Premieres': 'from-cyan-300/60 via-blue-300/25 to-transparent',
  Fashion: 'from-purple-300/70 via-pink-300/30 to-transparent',
  'Cultural Moments': 'from-amber-200/80 via-yellow-200/40 to-transparent',
  'Live Events': 'from-orange-300/50 via-rose-300/25 to-transparent',
};

const statusStyles: Record<EventStatus, string> = {
  now: 'bg-red-500/20 text-red-300 border-red-500/40',
  upcoming: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  soon: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
  tbd: 'bg-zinc-600/20 text-zinc-300 border-zinc-500/40',
  past: 'bg-zinc-700/30 text-zinc-300 border-zinc-600/60',
};

const statusLabel: Record<EventStatus, string> = {
  now: 'Now',
  upcoming: 'Upcoming',
  soon: 'Soon',
  tbd: 'TBD',
  past: 'Past',
};

const gradientFallback = 'from-zinc-400/50 via-zinc-500/20 to-transparent';

export function EventCard({
  event,
  status,
  muted = false,
}: {
  event: EventItem;
  status: EventStatus;
  muted?: boolean;
}) {
  const line = categoryTopLine[event.category] ?? gradientFallback;

  return (
    <article
      className={`event-tile group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] p-5 ${
        muted ? 'opacity-60 grayscale hover:translate-y-0' : ''
      }`}
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${line}`} />
      {event.image && (
        <div className="relative -mx-1 mb-3 aspect-[21/9] overflow-hidden rounded-xl border border-white/10">
          <img
            src={event.image}
            alt=""
            className="h-full w-full object-cover object-center opacity-95 transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
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
          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide ${statusStyles[status]}`}
          >
            {statusLabel[status]}
          </span>
        </div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/12 bg-zinc-900/55 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-zinc-200">
            {event.category}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">{event.source}</span>
        </div>
        {event.description && <p className="mb-2 text-sm leading-relaxed text-zinc-400">{event.description}</p>}
        <div className="saas-panel-soft mt-auto rounded-2xl border border-[#c9a96e]/15 bg-black/35 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c9a96e]">Why it matters for brands</p>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-200">{event.whyItMattersForBrands}</p>
        </div>
        {event.industries && event.industries.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {event.industries.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
