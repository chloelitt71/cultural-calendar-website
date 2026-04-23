import { useEffect, useMemo, useRef, useState } from 'react';
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
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreTimerRef = useRef<number | null>(null);

  const moments = useMemo(() => {
    if (filter === 'All') return allMoments;
    return allMoments.filter((m) => m.category === filter);
  }, [allMoments, filter]);

  const visibleMoments = useMemo(() => moments.slice(0, visibleCount), [moments, visibleCount]);
  const canLoadMore = visibleCount < moments.length;

  useEffect(() => {
    setVisibleCount(20);
  }, [filter]);

  useEffect(
    () => () => {
      if (loadMoreTimerRef.current !== null) {
        window.clearTimeout(loadMoreTimerRef.current);
      }
    },
    [],
  );

  async function onLoadMore() {
    setIsLoadingMore(true);
    setVisibleCount((current) => current + 20);
    if (loadMoreTimerRef.current !== null) {
      window.clearTimeout(loadMoreTimerRef.current);
    }
    loadMoreTimerRef.current = window.setTimeout(() => {
      setIsLoadingMore(false);
      loadMoreTimerRef.current = null;
    }, 180);
  }

  return (
    <div className="page-transition section-shell pb-20 pt-8">
      <header className="mb-10 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#c84c2f]">Moments</p>
        <h1 className="mt-2 font-display text-[2rem] leading-tight text-zinc-50 md:text-[2.35rem]">Cultural & social signals</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          What is moving online right now—discourse, momentum, and press-adjacent conversation your team can react to. Each card opens the
          original article in a new tab when a URL is available (NewsAPI when configured).
        </p>
        {loading && <p className="mt-2 font-mono text-xs text-[#c84c2f]/80">Loading stories…</p>}
        {error && <p className="mt-2 text-sm text-[#8f3b2a]">{error}</p>}
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
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  filter === f
                    ? 'border border-[#e8b8ac] bg-[#fff1ee] text-[#c84c2f]'
                    : 'border border-transparent text-zinc-400 hover:bg-[#f5f5f5] hover:text-zinc-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-zinc-500">{loading ? '—' : `${moments.length} signal${moments.length === 1 ? '' : 's'} this month`}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {visibleMoments.map((m) => (
          <MomentCard key={m.id} moment={m} />
        ))}
      </div>

      {!loading && canLoadMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="rounded-lg border border-[#e0ddd8] bg-white px-5 py-2 text-sm font-medium text-zinc-100 transition hover:border-[#c84c2f]/35 hover:bg-[#fff8f6] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}

      {!loading && moments.length === 0 && (
        <p className="rounded-xl border border-white/10 bg-white p-6 text-sm text-zinc-400">
          No stories with a valid link in this view. Add <span className="font-mono text-zinc-300">VITE_NEWS_API_KEY</span> for live headlines,
          or adjust filters.
        </p>
      )}

    </div>
  );
}
