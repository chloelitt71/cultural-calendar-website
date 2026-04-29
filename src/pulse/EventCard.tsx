import { useState } from 'react';
import type { EventItem } from './types';
import type { EventStatus } from './types';

const statusStyles: Record<EventStatus, string> = {
  now: 'bg-[#f5f5f5] text-[#1c1c1c] border-[#d9d4cc]',
  upcoming: 'bg-[#f5f5f5] text-[#1c1c1c] border-[#d9d4cc]',
  soon: 'bg-[#f5f5f5] text-[#1c1c1c] border-[#d9d4cc]',
  tbd: 'bg-[#f5f5f5] text-[#1c1c1c] border-[#d9d4cc]',
  past: 'bg-[#f5f5f5] text-[#6f6f6f] border-[#d9d4cc]',
};

const statusLabel: Record<EventStatus, string> = {
  now: 'NOW',
  upcoming: 'COMING',
  soon: 'SOON',
  tbd: 'COMING',
  past: 'NOW',
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
  const savedKey = 'calendarSavedIds';
  const seenKey = 'calendarSeenIds';
  const cardId = event.id || `${event.title}-${event.startDate ?? event.date}`;
  const [saved, setSaved] = useState<boolean>(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(savedKey) ?? '[]') as string[];
      return parsed.includes(cardId);
    } catch {
      return false;
    }
  });
  const [seen, setSeen] = useState<boolean>(() => {
    if (typeof event.seen === 'boolean') return event.seen;
    try {
      const parsed = JSON.parse(localStorage.getItem(seenKey) ?? '[]') as string[];
      return parsed.includes(cardId);
    } catch {
      return false;
    }
  });
  const why = conciseBrandWhy(event.whyItMattersForBrands);
  const [expanded, setExpanded] = useState(false);
  const hasExtendedDetails =
    Boolean(event.platformOrStudio) ||
    Boolean(event.mainCast && event.mainCast.length > 0) ||
    Boolean(event.genre) ||
    typeof event.animated === 'boolean' ||
    Boolean(event.suggestedActivationIdea) ||
    Boolean(event.audienceAppeal) ||
    Boolean(event.talentPartnershipOpportunity) ||
    Boolean(event.bestBrandFitCategories && event.bestBrandFitCategories.length > 0);

  function toggleSaved() {
    setSaved((current) => {
      const next = !current;
      const parsed = JSON.parse(localStorage.getItem(savedKey) ?? '[]') as string[];
      const updated = next ? Array.from(new Set([...parsed, cardId])) : parsed.filter((id) => id !== cardId);
      localStorage.setItem(savedKey, JSON.stringify(updated));
      return next;
    });
  }

  function toggleSeen() {
    setSeen((current) => {
      const next = !current;
      const parsed = JSON.parse(localStorage.getItem(seenKey) ?? '[]') as string[];
      const updated = next ? Array.from(new Set([...parsed, cardId])) : parsed.filter((id) => id !== cardId);
      localStorage.setItem(seenKey, JSON.stringify(updated));
      return next;
    });
  }

  return (
    <article
      className={`event-tile group relative flex flex-col overflow-hidden rounded-[1.35rem] p-5 ${
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
            {seen && (
              <span className="mb-1 inline-flex rounded-full border border-[#e8b8ac] bg-[#fff1ee] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-[#c0432a]">
                SEEN
              </span>
            )}
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
            <button
              type="button"
              onClick={toggleSaved}
              className={`rounded-lg border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide ${
                saved ? 'border-[#e8b8ac] bg-[#fff1ee] text-[#c0432a]' : 'border-[#d9d4cc] bg-[#f5f5f5] text-[#1c1c1c]'
              }`}
            >
              + SAVE
            </button>
          </div>
        </div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-lg border border-[#e0ddd8] bg-[#f5f5f5] px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-[#1c1c1c]">
            {event.category}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">{event.source}</span>
        </div>
        {event.description && <p className="mb-2 text-sm leading-relaxed text-zinc-400">{event.description}</p>}
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          {event.mediaType && <span>{event.mediaType}</span>}
          {event.genre && <span>· {event.genre}</span>}
          {event.platformOrStudio && <span>· {event.platformOrStudio}</span>}
          {event.season && <span>· {event.season}</span>}
          {typeof event.animated === 'boolean' && <span>· Animated: {event.animated ? 'Yes' : 'No'}</span>}
        </div>
        <div className="saas-panel-soft mt-auto rounded-2xl border border-[#c84c2f]/15 bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c84c2f]">Why it matters for brands</p>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-200">{why}</p>
        </div>
        {hasExtendedDetails && (
          <div className="mt-3">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setExpanded((v) => !v)} className="text-xs font-medium text-[#c84c2f]">
                {expanded ? 'Hide details' : 'View details'}
              </button>
              <button type="button" onClick={toggleSeen} className="text-xs font-medium text-zinc-500 hover:text-zinc-900">
                {seen ? 'Mark unseen' : 'Mark seen'}
              </button>
            </div>
            {expanded && (
              <div className="mt-2 space-y-2 rounded-xl border border-[#eae7e2] bg-[#fcfbf9] p-3 text-xs text-zinc-500">
                {event.mainCast && event.mainCast.length > 0 && (
                  <p>
                    <span className="font-semibold text-zinc-700">Main cast:</span> {event.mainCast.join(', ')}
                  </p>
                )}
                {event.bestBrandFitCategories && event.bestBrandFitCategories.length > 0 && (
                  <p>
                    <span className="font-semibold text-zinc-700">Best brand fit:</span> {event.bestBrandFitCategories.join(' • ')}
                  </p>
                )}
                {event.suggestedActivationIdea && (
                  <p>
                    <span className="font-semibold text-zinc-700">Suggested activation:</span> {event.suggestedActivationIdea}
                  </p>
                )}
                {event.audienceAppeal && (
                  <p>
                    <span className="font-semibold text-zinc-700">Audience appeal:</span> {event.audienceAppeal}
                  </p>
                )}
                {event.talentPartnershipOpportunity && (
                  <p>
                    <span className="font-semibold text-zinc-700">Talent partnership:</span> {event.talentPartnershipOpportunity}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
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
