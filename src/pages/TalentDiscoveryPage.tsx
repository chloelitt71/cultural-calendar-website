import { useMemo, useState } from 'react';
import { DiscoveryTalentCard } from '../components/DiscoveryTalentCard';
import { getRankedDiscoveryTalent } from '../services/talentDiscoveryService';
import type { TalentDiscoverySegment, TalentPrFilter } from '../pulse/types';

const SEGMENTS: Array<{ id: TalentDiscoverySegment; label: string; sub: string }> = [
  { id: 'actors', label: 'Actors / Actresses', sub: 'Film, TV, award & press cycles' },
  { id: 'music', label: 'Singers / DJs / Music', sub: 'Tours, festivals, live visibility' },
  { id: 'influencers', label: 'Influencers', sub: 'Conversation, partnerships, category power' },
];

const PR_FILTERS: Array<{ id: TalentPrFilter; label: string }> = [
  { id: 'most-relevant', label: 'Most relevant now' },
  { id: 'beauty', label: 'Best for beauty' },
  { id: 'fashion', label: 'Best for fashion' },
  { id: 'lifestyle', label: 'Best for lifestyle' },
  { id: 'entertainment', label: 'Best for entertainment' },
  { id: 'consumer', label: 'Best for consumer' },
  { id: 'rising', label: 'Rising talent' },
];

export function TalentDiscoveryPage() {
  const [segment, setSegment] = useState<TalentDiscoverySegment>('influencers');
  const [prFilter, setPrFilter] = useState<TalentPrFilter>('most-relevant');
  const [search, setSearch] = useState('');

  const rows = useMemo(
    () => getRankedDiscoveryTalent(segment, prFilter, search),
    [segment, prFilter, search],
  );

  return (
    <div className="page-transition section-shell pb-20 pt-8">
      <header className="mb-8 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#c9a96e]">Talent</p>
        <h1 className="mt-2 font-display text-[2rem] text-zinc-50 md:text-[2.35rem]">Right now shortlist</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Ranked for timeliness—not generic reach: timing urgency, momentum, and press cycle weight heavily, with extra lift when hooks show a knowable window (tour, release, junkets, conversation). Swap pool and scores for live data when ready.
        </p>
      </header>

      <div className="mb-6 space-y-4 rounded-[1.25rem] border border-white/8 bg-black/20 p-4 md:p-5">
        <div className="inline-flex flex-wrap gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
          {SEGMENTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSegment(s.id)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                segment === s.id ? 'bg-white/10 text-zinc-100' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
              }`}
            >
              <span className="block font-medium">{s.label}</span>
              <span className="block font-mono text-[10px] text-zinc-500">{s.sub}</span>
            </button>
          ))}
        </div>
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">PR lens</p>
          <div className="flex flex-wrap gap-2">
            {PR_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setPrFilter(f.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  prFilter === f.id ? 'bg-white/12 text-zinc-100 ring-1 ring-[#c9a96e]/35' : 'text-zinc-500 hover:bg-white/6 hover:text-zinc-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search names, projects, or industries…"
          className="saas-input w-full rounded-xl px-3 py-2.5 text-sm text-zinc-100"
        />
      </div>

      <p className="mb-4 font-mono text-xs text-zinc-500">
        {rows.length} profile{rows.length === 1 ? '' : 's'} · sorted by PR relevance score
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((p) => (
          <DiscoveryTalentCard key={p.id} profile={p} />
        ))}
      </div>

      {rows.length === 0 && (
        <p className="rounded-xl border border-white/10 bg-black/25 p-6 text-sm text-zinc-400">
          No matches for this segment and filter. Try “Most relevant now” or another industry lens.
        </p>
      )}

      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
        Curated roster with illustrative scores — replace with live social, press, and brand-safety data via talentDiscoveryService
      </p>
    </div>
  );
}
