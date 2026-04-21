/** Editorial “this week” window for the demo homepage snapshot */
const WEEK_START = '2026-04-07';
const WEEK_END = '2026-04-13';

export function isInAnchorWeek(iso?: string): boolean {
  if (!iso) return false;
  return iso >= WEEK_START && iso <= WEEK_END;
}

export function formatLiveStamp(): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date());
}
