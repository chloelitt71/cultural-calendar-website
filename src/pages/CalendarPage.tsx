import { useMemo, useState } from 'react';
import { EventCard } from '../pulse/EventCard';
import type { DecoratedCalendarEvent } from '../calendar/types';
import type { EventStatus } from '../pulse/types';
import { CATEGORY_PILLS } from '../pulse/data';
import type { CalendarFilter } from '../calendar/types';
import { groupEventsByCalendarMonth } from '../utils/calendarGrouping';
import { isAfterNextTwelveMonthsCalendar } from '../calendar/calendarStatus';
import { useCalendarIntel } from '../hooks/useCalendarIntel';
import { CalendarMonthGrid } from '../components/CalendarMonthGrid';

type SortMode = 'soonest' | 'relevance';
type ViewMode = 'grid' | 'list' | 'calendar';

function filterRows(
  rows: DecoratedCalendarEvent[],
  search: string,
  filter: CalendarFilter,
  status: 'All' | EventStatus,
  showPast: boolean,
): DecoratedCalendarEvent[] {
  const term = search.toLowerCase().trim();
  return rows.filter((event) => {
    const blob = [
      event.title,
      event.description,
      event.location,
      event.category,
      event.subcategory,
      event.source,
      event.whyItMattersForBrands,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesSearch = term.length === 0 || blob.includes(term);
    const matchesCat = filter === 'All' || event.category === filter;
    const matchesStatus = status === 'All' || event.computedStatus === status || (status === 'upcoming' && event.computedStatus === 'soon');
    const pastOk = showPast || event.computedStatus !== 'past';
    return matchesSearch && matchesCat && matchesStatus && pastOk;
  });
}

export function CalendarPage() {
  const { events, slices, loading, error } = useCalendarIntel();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CalendarFilter>('All');
  const [status, setStatus] = useState<'All' | EventStatus>('All');
  const [sort, setSort] = useState<SortMode>('soonest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showPast, setShowPast] = useState(false);
  const [gridMonthOffset, setGridMonthOffset] = useState(0);

  const filtered = useMemo(
    () => filterRows(events, search, filter, status, showPast),
    [events, search, filter, status, showPast],
  );

  const sorted = useMemo(() => {
    const copy = [...filtered];
    if (sort === 'soonest') {
      copy.sort((a, b) => a.sortDate - b.sortDate);
    } else {
      copy.sort((a, b) => b.timingPriorityScore - a.timingPriorityScore || a.sortDate - b.sortDate);
    }
    return copy;
  }, [filtered, sort]);

  const nowRows = sorted.filter((event) => event.computedStatus === 'now');
  const upcomingRows = sorted.filter((event) => event.computedStatus === 'soon' || event.computedStatus === 'upcoming');
  const tbdRows = sorted.filter((event) => event.computedStatus === 'tbd');
  const pastRows = sorted.filter((event) => event.computedStatus === 'past');

  const next12 = upcomingRows.filter((e) => !isAfterNextTwelveMonthsCalendar(e));
  const later = upcomingRows.filter((e) => isAfterNextTwelveMonthsCalendar(e));

  const monthGroups = useMemo(() => groupEventsByCalendarMonth(sorted), [sorted]);

  const isDefaultFilters =
    filter === 'All' && search.trim() === '' && status === 'All' && !showPast;

  const renderRows = (rows: DecoratedCalendarEvent[], muted = false) => {
    if (rows.length === 0) {
      return (
        <p className="rounded-xl border border-white/8 bg-black/20 p-6 text-sm text-zinc-400">No events match these filters.</p>
      );
    }
    return (
      <div className={viewMode === 'list' ? 'space-y-4' : 'grid gap-5 md:grid-cols-2 xl:grid-cols-2'}>
        {rows.map((event) => (
          <EventCard key={event.id} event={event} status={muted ? 'past' : event.computedStatus} muted={muted} />
        ))}
      </div>
    );
  };

  return (
    <div className="page-transition section-shell space-y-10 pb-24 pt-8">
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#c84c2f]">Calendar</p>
        <h1 className="mt-2 font-display text-[2rem] text-zinc-50 md:text-[2.45rem]">Event intelligence</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          One pipeline for live moments, premieres, and cultural tentpoles — curated PR-first copy. Built for activation planning, not generic listings.
        </p>
        {loading && (
          <p className="mt-2 font-mono text-xs text-[#c84c2f]/80">Loading external calendars…</p>
        )}
        {error && <p className="mt-2 text-sm text-[#8f3b2a]">{error}</p>}
      </header>

      <section className="saas-panel-soft space-y-5 rounded-[1.4rem] p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <input
            value={search}
            onChange={(ev) => setSearch(ev.target.value)}
            placeholder="Search title, city, category, or source…"
            className="saas-input w-full max-w-xl rounded-xl px-3 py-2.5 text-sm text-zinc-100"
          />
          <div className="inline-flex flex-wrap gap-2 rounded-xl border border-white/10 bg-white p-1">
            {(
              [
                ['grid', 'Cards'],
                ['list', 'List'],
                ['calendar', 'Month'],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`rounded-lg px-3 py-2 text-xs font-medium ${
                  viewMode === mode ? 'border border-[#e8b8ac] bg-[#fff1ee] text-[#c84c2f]' : 'text-zinc-500 hover:bg-[#f5f5f5]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Sort</span>
          <div className="inline-flex rounded-lg border border-white/10 p-0.5">
            {(
              [
                ['soonest', 'Soonest'],
                ['relevance', 'Most relevant'],
              ] as const
            ).map(([k, lab]) => (
              <button
                key={k}
                type="button"
                onClick={() => setSort(k)}
                className={`rounded-lg px-3 py-1.5 text-xs ${
                  sort === k ? 'bg-[#fff1ee] text-[#c84c2f]' : 'text-zinc-500 hover:text-zinc-100'
                }`}
              >
                {lab}
              </button>
            ))}
          </div>
          <select
            value={status}
            onChange={(ev) => setStatus(ev.target.value as 'All' | EventStatus)}
            className="saas-input rounded-xl px-3 py-2 text-xs text-zinc-100"
          >
            <option value="All">All timing states</option>
            <option value="now">Now</option>
            <option value="soon">Soon</option>
            <option value="upcoming">Upcoming</option>
            <option value="tbd">TBD</option>
            <option value="past">Past</option>
          </select>
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_PILLS.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => setFilter(pill)}
                className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                  filter === pill
                    ? 'border-[#e8b8ac] bg-[#fff1ee] text-[#c84c2f]'
                    : 'border-[#e0ddd8] bg-white text-zinc-400 hover:border-[#d6d1c9] hover:text-zinc-100'
                }`}
              >
                {pill}
              </button>
            ))}
          </div>
        </div>
      </section>

      {viewMode === 'calendar' ? (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setGridMonthOffset((o) => o - 1)}
              className="rounded-lg border border-[#e0ddd8] bg-white px-3 py-1.5 text-sm text-zinc-300 hover:bg-[#f5f5f5]"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setGridMonthOffset((o) => o + 1)}
              className="rounded-lg border border-[#e0ddd8] bg-white px-3 py-1.5 text-sm text-zinc-300 hover:bg-[#f5f5f5]"
            >
              →
            </button>
            <button type="button" onClick={() => setGridMonthOffset(0)} className="text-xs text-[#c84c2f] hover:text-[#c84c2f]">
              This month
            </button>
          </div>
          <CalendarMonthGrid events={sorted} monthOffset={gridMonthOffset} />
          <div>
            <h3 className="mb-4 font-display text-lg text-zinc-100">Events this period</h3>
            {renderRows(sorted)}
          </div>
        </section>
      ) : viewMode === 'list' && isDefaultFilters ? (
        <section className="space-y-10">
          {monthGroups.map((group) => (
            <div key={group.key}>
              <h3 className="mb-4 border-b border-white/10 pb-2 font-display text-[1.3rem] text-zinc-100">{group.label}</h3>
              {renderRows(group.items)}
            </div>
          ))}
        </section>
      ) : isDefaultFilters && viewMode === 'grid' ? (
        <>
          {nowRows.length > 0 && (
            <section className="space-y-4">
              <h3 className="font-display text-[1.35rem] text-zinc-100">Happening now</h3>
              {renderRows(nowRows)}
            </section>
          )}
          <section className="space-y-4">
            <h3 className="font-display text-[1.35rem] text-zinc-100">Upcoming pipeline</h3>
            {renderRows(next12)}
            {later.length > 0 && (
              <div className="space-y-3 pt-4">
                <p className="font-mono text-xs uppercase tracking-wide text-zinc-500">Further out</p>
                {renderRows(later)}
              </div>
            )}
          </section>
          {tbdRows.length > 0 && (
            <section className="space-y-4">
              <h3 className="font-display text-[1.35rem] text-zinc-100">Date TBD</h3>
              {renderRows(tbdRows)}
            </section>
          )}
        </>
      ) : (
        <section className="space-y-4">
          <h3 className="font-display text-[1.35rem] text-zinc-100">Results</h3>
          {renderRows(sorted)}
        </section>
      )}

      <section className="saas-panel-soft space-y-4 rounded-[1.4rem] p-5">
        <button type="button" onClick={() => setShowPast((p) => !p)} className="w-full text-left font-display text-[1.2rem] text-zinc-100">
          {showPast ? 'Past events · hide' : 'Past events · show'}
        </button>
        {showPast && renderRows(pastRows, true)}
      </section>

      <p className="max-w-2xl font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-zinc-600">
        Sources: curated seed + live event feeds + TMDb (movies & TV). Set required API keys in <code className="text-zinc-500">.env</code>. Add new
        providers in <code className="text-zinc-500">src/services/</code>.
      </p>
    </div>
  );
}
