import type { CalendarIntelEvent } from './types';
import type { EventStatus } from '../pulse/types';

function parseISODate(s?: string): Date | null {
  if (!s) return null;
  const d = new Date(`${s}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function utcDayStart(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function getEventSortDateCalendar(e: CalendarIntelEvent): number {
  const start = parseISODate(e.startDate);
  return start ? start.getTime() : Number.POSITIVE_INFINITY;
}

export function getComputedStatusCalendar(e: CalendarIntelEvent): EventStatus {
  const start = parseISODate(e.startDate);
  const end = parseISODate(e.endDate || e.startDate);
  const today = utcDayStart(new Date());

  if (!start || !end) {
    return 'tbd';
  }
  const s = utcDayStart(start);
  const ed = utcDayStart(end);
  if (ed < today) {
    return 'past';
  }
  if (s <= today && today <= ed) {
    return 'now';
  }
  const daysUntil = Math.ceil((s.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  if (daysUntil <= 60) {
    return 'soon';
  }
  return 'upcoming';
}

export function isAfterNextTwelveMonthsCalendar(e: CalendarIntelEvent): boolean {
  const start = parseISODate(e.startDate);
  if (!start) return false;
  const cutoff = new Date();
  cutoff.setUTCMonth(cutoff.getUTCMonth() + 12);
  return start >= cutoff;
}
