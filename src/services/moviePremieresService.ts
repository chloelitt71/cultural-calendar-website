import { buildBrandWhy, defaultTimingPriority } from '../calendar/brandWhy';
import type { CalendarIntelEvent } from '../calendar/types';
import { MOVIE_PREMIERES_INTEL_SEED } from '../calendar/seedEvents';

const IMG = 'https://image.tmdb.org/t/p/w500';

function buildMoviePremiereEvent(row: {
  id: string;
  title: string;
  releaseDate: string;
  image?: string;
}): CalendarIntelEvent | null {
  if (!row.releaseDate) return null;
  const startMs = new Date(`${row.releaseDate}T12:00:00Z`).getTime();
  const dateStr = new Date(`${row.releaseDate}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const cat = 'Movie Premieres' as const;
  return {
    id: row.id,
    title: row.title,
    date: dateStr,
    startDate: row.releaseDate,
    endDate: row.releaseDate,
    location: 'United States (verify market)',
    category: cat,
    subcategory: 'Theatrical / streaming window',
    source: 'TMDb',
    image: row.image,
    whyItMattersForBrands: buildBrandWhy({ category: cat, subcategory: 'Theatrical', title: row.title }),
    timingPriorityScore: defaultTimingPriority({ startMs, category: cat }),
  };
}

/** TMDb upcoming movies — merge with {@link MOVIE_PREMIERES_INTEL_SEED} in aggregation. */
export async function fetchMoviePremieresFromTmdb(apiKey: string | undefined): Promise<CalendarIntelEvent[]> {
  if (!apiKey?.trim()) return [];
  try {
    const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = (await res.json()) as {
      results?: Array<{ id: number; title: string; release_date: string; backdrop_path?: string; poster_path?: string }>;
    };
    const out: CalendarIntelEvent[] = [];
    for (const m of data.results ?? []) {
      if (!m.release_date) continue;
      const img = m.poster_path ? `${IMG}${m.poster_path}` : m.backdrop_path ? `${IMG}${m.backdrop_path}` : undefined;
      const ev = buildMoviePremiereEvent({ id: `tmdb-movie-${m.id}`, title: m.title, releaseDate: m.release_date, image: img });
      if (ev) out.push(ev);
    }
    return out.slice(0, 25);
  } catch {
    return [];
  }
}

/** Curated film windows + TMDb upcoming (`VITE_TMDB_API_KEY`). */
export async function loadMoviePremieresIntel(apiKey?: string): Promise<CalendarIntelEvent[]> {
  const key = apiKey ?? (import.meta.env.VITE_TMDB_API_KEY as string | undefined);
  const remote = await fetchMoviePremieresFromTmdb(key);
  return [...MOVIE_PREMIERES_INTEL_SEED, ...remote];
}
