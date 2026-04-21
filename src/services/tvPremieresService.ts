import { buildBrandWhy, defaultTimingPriority } from '../calendar/brandWhy';
import type { CalendarIntelEvent } from '../calendar/types';
import { TV_PREMIERES_INTEL_SEED } from '../calendar/seedEvents';

const IMG = 'https://image.tmdb.org/t/p/w500';

function buildTvPremiereEvent(row: {
  id: string;
  title: string;
  firstAir: string;
  image?: string;
}): CalendarIntelEvent | null {
  if (!row.firstAir) return null;
  const startMs = new Date(`${row.firstAir}T12:00:00Z`).getTime();
  const dateStr = new Date(`${row.firstAir}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const cat = 'TV Premieres' as const;
  return {
    id: row.id,
    title: row.title,
    date: dateStr,
    startDate: row.firstAir,
    endDate: row.firstAir,
    location: 'Streaming / broadcast (verify)',
    category: cat,
    subcategory: 'Discover TV',
    source: 'TMDb',
    image: row.image,
    whyItMattersForBrands: buildBrandWhy({ category: cat, subcategory: 'Series', title: row.title }),
    timingPriorityScore: defaultTimingPriority({ startMs, category: cat }),
  };
}

/** TMDb discover TV with first-air-date filter — merge with {@link TV_PREMIERES_INTEL_SEED} in aggregation. */
export async function fetchTvPremieresFromTmdb(apiKey: string | undefined): Promise<CalendarIntelEvent[]> {
  if (!apiKey?.trim()) return [];
  try {
    const today = new Date().toISOString().slice(0, 10);
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=en-US&sort_by=first_air_date.asc&first_air_date.gte=${today}&page=1&vote_count.gte=15`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = (await res.json()) as {
      results?: Array<{ id: number; name: string; first_air_date: string; poster_path?: string }>;
    };
    const out: CalendarIntelEvent[] = [];
    for (const t of data.results ?? []) {
      if (!t.first_air_date) continue;
      const ev = buildTvPremiereEvent({
        id: `tmdb-tv-${t.id}`,
        title: `${t.name} · premiere window`,
        firstAir: t.first_air_date,
        image: t.poster_path ? `${IMG}${t.poster_path}` : undefined,
      });
      if (ev) out.push(ev);
    }
    return out.slice(0, 25);
  } catch {
    return [];
  }
}

/** Curated series ladder + TMDb discover TV (`VITE_TMDB_API_KEY`). */
export async function loadTvPremieresIntel(apiKey?: string): Promise<CalendarIntelEvent[]> {
  const key = apiKey ?? (import.meta.env.VITE_TMDB_API_KEY as string | undefined);
  const remote = await fetchTvPremieresFromTmdb(key);
  return [...TV_PREMIERES_INTEL_SEED, ...remote];
}
