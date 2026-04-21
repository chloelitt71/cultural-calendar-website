import type { DecoratedCalendarEvent } from '../calendar/types';

export function groupEventsByCalendarMonth(events: DecoratedCalendarEvent[]): {
  key: string;
  label: string;
  items: DecoratedCalendarEvent[];
}[] {
  const buckets = new Map<string, DecoratedCalendarEvent[]>();

  for (const event of events) {
    const raw = event.startDate;
    const key = raw && raw.length >= 7 ? raw.slice(0, 7) : 'tbd';
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(event);
  }

  const sortedKeys = [...buckets.keys()].sort((a, b) => {
    if (a === 'tbd') return 1;
    if (b === 'tbd') return -1;
    return a.localeCompare(b);
  });

  return sortedKeys.map((key) => {
    const items = (buckets.get(key) ?? []).sort((a, b) => a.sortDate - b.sortDate);
    const label =
      key === 'tbd'
        ? 'Date TBD'
        : new Date(`${key}-01T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return { key, label, items };
  });
}
