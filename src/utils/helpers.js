const TODAY = new Date('2026-04-13T00:00:00Z');
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseDate(value) {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getEventStatus(event) {
  const start = parseDate(event.startDate);
  const end = parseDate(event.endDate || event.startDate);

  if (!start || !end) return 'tbd';
  if (end < TODAY) return 'past';
  if (start <= TODAY && TODAY <= end) return 'now';

  const daysUntilStart = Math.ceil((start.getTime() - TODAY.getTime()) / MS_PER_DAY);
  if (daysUntilStart <= 60) return 'soon';
  return 'upcoming';
}

export function getEventSortDate(event) {
  const start = parseDate(event.startDate);
  return start ? start.getTime() : Number.POSITIVE_INFINITY;
}

export function isAfterNextTwelveMonths(event) {
  const start = parseDate(event.startDate);
  if (!start) return false;
  const cutoff = new Date('2027-04-13T00:00:00Z');
  return start >= cutoff;
}
