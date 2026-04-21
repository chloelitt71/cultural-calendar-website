import { useMemo, useState } from 'react';
import { MomentCard } from '../components/MomentCard';
import { useMoments } from '../hooks/useMoments';
import type { MomentSignalCategory } from '../pulse/types';

const FILTERS: Array<'All' | MomentSignalCategory> = [
  'All',
  'Drama',
  'Trend',
  'Influencer Momentum',
  'Celebrity Moment',
  'Internet Conversation',
];

export function MomentsPage() {
  const { moments: allMoments, loading, error } = useMoments();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const moments = useMemo(() => {
    if (filter === 'All') return allMoments;
    return allMoments.filter((m) => m.category === filter);
  }, [allMoments, filter]);

  return (
    <div className="page-transition section-shell pb-20 pt-8">
      <header className="mb-10 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#c9a96e]">Moments</p>
        <h1 className="mt-2 font-display text-[2rem] leading-tight text-zinc-50 md:text-[2.35rem]">Cultural & social signals</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          What is moving online right now—discourse, momentum, and press-adjacent conversation your team can react to. Each card opens the
          original article in a new tab when a URL is available (NewsAPI when configured).
        </p>
        {loading && <p className="mt-2 font-mono text-xs text-[#c9a96e]/80">Loading stories…</p>}
        {error && <p className="mt-2 text-sm text-amber-300/90">{error}</p>}
      </header>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Filter by signal type</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  filter === f ? 'bg-white/12 text-zinc-100 ring-1 ring-[#c9a96e]/40' : 'text-zinc-400 hover:bg-white/6 hover:text-zinc-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-zinc-500">{loading ? '—' : `${moments.length} signal${moments.length === 1 ? '' : 's'}`}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {moments.map((m) => (
          <MomentCard key={m.id} moment={m} />
        ))}
      </div>

      {!loading && moments.length === 0 && (
        <p className="rounded-xl border border-white/10 bg-black/25 p-6 text-sm text-zinc-400">
          No stories with a valid link in this view. Add <span className="font-mono text-zinc-300">VITE_NEWS_API_KEY</span> for live headlines,
          or adjust filters.
        </p>
      )}

      <p className="mt-10 border-t border-white/8 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
        Articles: NewsAPI top headlines (entertainment + technology, US) when <span className="text-zinc-500">VITE_NEWS_API_KEY</span> is set ·
        Dev server proxies <span className="text-zinc-500">/news-api</span> to avoid CORS; production needs a matching host rewrite.
      </p>
    </div>
  );
}
