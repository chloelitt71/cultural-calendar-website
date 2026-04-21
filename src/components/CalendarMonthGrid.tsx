import type { DecoratedCalendarEvent } from '../calendar/types';

function startOfMonth(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function addMonths(d: Date, n: number): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

/** Simple month grid: events bucketed by start day (UTC date). */
export function CalendarMonthGrid({ events, monthOffset }: { events: DecoratedCalendarEvent[]; monthOffset: number }) {
  const today = new Date();
  const month = addMonths(startOfMonth(today), monthOffset);
  const y = month.getUTCFullYear();
  const m = month.getUTCMonth();
  const label = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const firstDow = new Date(Date.UTC(y, m, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();

  const byDay = new Map<string, DecoratedCalendarEvent[]>();
  for (const ev of events) {
    if (!ev.startDate) continue;
    const k = dayKey(ev.startDate);
    const d = new Date(`${k}T12:00:00Z`);
    if (d.getUTCFullYear() !== y || d.getUTCMonth() !== m) continue;
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k)!.push(ev);
  }

  const cells: Array<{ day: number | null; iso?: string }[]> = [];
  let row: Array<{ day: number | null; iso?: string }> = [];
  for (let i = 0; i < firstDow; i++) row.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    row.push({ day: d, iso });
    if (row.length === 7) {
      cells.push(row);
      row = [];
    }
  }
  if (row.length) {
    while (row.length < 7) row.push({ day: null });
    cells.push(row);
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg text-zinc-100">{label}</h3>
        <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-500">UTC grid · tap list for detail</p>
      </div>
      <div className="grid grid-cols-7 gap-1 border-b border-white/10 pb-2 font-mono text-[10px] uppercase tracking-wide text-zinc-500">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
          <div key={w} className="text-center">
            {w}
          </div>
        ))}
      </div>
      <div className="mt-2 space-y-1">
        {cells.map((r, ri) => (
          <div key={ri} className="grid grid-cols-7 gap-1">
            {r.map((c, ci) => {
              const iso = c.iso;
              const list = iso ? byDay.get(iso) ?? [] : [];
              return (
                <div
                  key={ci}
                  className={`min-h-[92px] rounded-lg border border-white/6 bg-white/[0.02] p-1.5 ${!c.day ? 'opacity-30' : ''}`}
                >
                  {c.day !== null && <div className="mb-1 font-mono text-[11px] text-zinc-500">{c.day}</div>}
                  <div className="space-y-1">
                    {list.slice(0, 2).map((ev) => (
                      <div key={ev.id} className="truncate rounded border border-white/10 bg-black/40 px-1 py-0.5 font-mono text-[9px] leading-tight text-zinc-300" title={ev.title}>
                        {ev.title}
                      </div>
                    ))}
                    {list.length > 2 && <p className="font-mono text-[9px] text-zinc-500">+{list.length - 2}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
