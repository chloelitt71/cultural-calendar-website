import { buildBrandWhy, defaultTimingPriority } from '../calendar/brandWhy';
import type { CalendarIntelEvent } from '../calendar/types';
import { LIVE_EVENTS_INTEL_SEED } from '../calendar/seedEvents';

/**
 * Public Ticketmaster Discovery — concerts, sports, arts, and other ticketed live moments (US).
 * Composed with curated live seed rows in {@link loadLiveEventsIntel}.
 */
export async function fetchLiveEventsFromTicketmaster(apiKey: string | undefined): Promise<CalendarIntelEvent[]> {
  if (!apiKey?.trim()) return [];
  try {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    const startIso = start.toISOString().replace(/\.\d{3}Z$/, 'Z');
    const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
    url.searchParams.set('apikey', apiKey);
    url.searchParams.set('size', '50');
    url.searchParams.set('sort', 'date,asc');
    url.searchParams.set('startDateTime', startIso);
    url.searchParams.set('countryCode', 'US');

    const res = await fetch(url.toString());
    if (!res.ok) return [];
    const data = (await res.json()) as {
      _embedded?: {
        events?: Array<{
          id: string;
          name: string;
          dates?: { start?: { localDate?: string; dateTime?: string } };
          _embedded?: { venues?: Array<{ name?: string; city?: { name?: string }; state?: { stateCode?: string } }> };
          classifications?: Array<{ segment?: { name?: string }; genre?: { name?: string } }>;
        }>;
      };
    };
    const events = data._embedded?.events ?? [];
    const out: CalendarIntelEvent[] = [];

    for (const ev of events) {
      const localDate = ev.dates?.start?.localDate;
      if (!localDate) continue;
      const venue = ev._embedded?.venues?.[0];
      const loc = venue
        ? [venue.city?.name, venue.state?.stateCode].filter(Boolean).join(', ') || venue.name || 'US'
        : 'United States';
      const seg = ev.classifications?.[0]?.segment?.name;
      const { category, subcategory } = classifyLiveSegment(seg);
      const title = ev.name;
      const startMs = new Date(`${localDate}T12:00:00Z`).getTime();
      const intel: CalendarIntelEvent = {
        id: `tm-${ev.id}`,
        title,
        date: new Date(`${localDate}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        startDate: localDate,
        endDate: localDate,
        location: loc,
        category,
        subcategory,
        source: 'Ticketmaster',
        whyItMattersForBrands: buildBrandWhy({ category, subcategory, title }),
        timingPriorityScore: defaultTimingPriority({ startMs, category }),
        description: seg ? `${seg}${ev.classifications?.[0]?.genre?.name ? ` · ${ev.classifications[0].genre.name}` : ''}` : undefined,
      };
      out.push(intel);
    }
    return out;
  } catch {
    return [];
  }
}

function classifyLiveSegment(segment?: string): { category: CalendarIntelEvent['category']; subcategory: string } {
  const s = (segment ?? '').toLowerCase();
  if (s.includes('music')) return { category: 'Live Events', subcategory: 'Concert' };
  if (s.includes('sports')) return { category: 'Sports', subcategory: 'Live sports' };
  if (s.includes('arts') || s.includes('theatre') || s.includes('theater')) {
    return { category: 'Live Events', subcategory: 'Arts & theater' };
  }
  if (s.includes('film')) return { category: 'Movie Premieres', subcategory: 'Screening / special event' };
  return { category: 'Live Events', subcategory: 'Live event' };
}

/** Curated live rows + Ticketmaster (when `VITE_TICKETMASTER_API_KEY` is set). */
export async function loadLiveEventsIntel(apiKey?: string): Promise<CalendarIntelEvent[]> {
  const key = apiKey ?? (import.meta.env.VITE_TICKETMASTER_API_KEY as string | undefined);
  const remote = await fetchLiveEventsFromTicketmaster(key);
  return [...LIVE_EVENTS_INTEL_SEED, ...remote];
}
