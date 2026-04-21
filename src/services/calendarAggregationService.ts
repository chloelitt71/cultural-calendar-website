import { decorateCalendarEvents } from '../calendar/decorate';
import type { CalendarIntelEvent, DecoratedCalendarEvent } from '../calendar/types';
import {
  CULTURAL_MOMENTS_INTEL_SEED,
  LIVE_EVENTS_INTEL_SEED,
  MOVIE_PREMIERES_INTEL_SEED,
  TV_PREMIERES_INTEL_SEED,
} from '../calendar/seedEvents';
import { loadLiveEventsIntel } from './liveEventsService';
import { loadMoviePremieresIntel } from './moviePremieresService';
import { loadTvPremieresIntel } from './tvPremieresService';
import { loadCulturalMomentsIntel } from './culturalMomentsService';

/** Raw rows per pillar — combined only through {@link mergeCalendarIntelSlices}. */
export interface CalendarIntelSlices {
  live: CalendarIntelEvent[];
  moviePremieres: CalendarIntelEvent[];
  tvPremieres: CalendarIntelEvent[];
  culturalMoments: CalendarIntelEvent[];
}

export interface DecoratedCalendarIntelSlices {
  live: DecoratedCalendarEvent[];
  moviePremieres: DecoratedCalendarEvent[];
  tvPremieres: DecoratedCalendarEvent[];
  culturalMoments: DecoratedCalendarEvent[];
}

/** Explicit merge order: live discovery → film → television → cultural tentpoles. */
export function mergeCalendarIntelSlices(slices: CalendarIntelSlices): CalendarIntelEvent[] {
  return [...slices.live, ...slices.moviePremieres, ...slices.tvPremieres, ...slices.culturalMoments];
}

function dedupeById(events: DecoratedCalendarEvent[]): DecoratedCalendarEvent[] {
  const seen = new Set<string>();
  return events.filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });
}

function decorateSlice(events: CalendarIntelEvent[]): DecoratedCalendarEvent[] {
  return decorateCalendarEvents(events).sort((a, b) => a.sortDate - b.sortDate);
}

/** Flatten pillar-decorated rows into one timeline (deduped). */
export function flattenDecoratedCalendarSlices(slices: DecoratedCalendarIntelSlices): DecoratedCalendarEvent[] {
  const merged = [...slices.live, ...slices.moviePremieres, ...slices.tvPremieres, ...slices.culturalMoments];
  return dedupeById(merged).sort((a, b) => a.sortDate - b.sortDate);
}

/** Parallel fetch — each pillar uses its own service (Ticketmaster vs TMDb vs curated). */
export async function loadCalendarIntelSlices(): Promise<CalendarIntelSlices> {
  const [live, moviePremieres, tvPremieres, culturalMoments] = await Promise.all([
    loadLiveEventsIntel(),
    loadMoviePremieresIntel(),
    loadTvPremieresIntel(),
    loadCulturalMomentsIntel(),
  ]);
  return { live, moviePremieres, tvPremieres, culturalMoments };
}

export function getCalendarIntelSeedSlices(): CalendarIntelSlices {
  return {
    live: LIVE_EVENTS_INTEL_SEED,
    moviePremieres: MOVIE_PREMIERES_INTEL_SEED,
    tvPremieres: TV_PREMIERES_INTEL_SEED,
    culturalMoments: CULTURAL_MOMENTS_INTEL_SEED,
  };
}

export function getDecoratedCalendarSeedSlices(): DecoratedCalendarIntelSlices {
  const s = getCalendarIntelSeedSlices();
  return {
    live: decorateSlice(s.live),
    moviePremieres: decorateSlice(s.moviePremieres),
    tvPremieres: decorateSlice(s.tvPremieres),
    culturalMoments: decorateSlice(s.culturalMoments),
  };
}

/** Home / static paths — seed pillars merged and decorated. */
export function getDecoratedCalendarSeed(): DecoratedCalendarEvent[] {
  return flattenDecoratedCalendarSlices(getDecoratedCalendarSeedSlices());
}

export async function loadDecoratedCalendarIntelSlices(): Promise<DecoratedCalendarIntelSlices> {
  const raw = await loadCalendarIntelSlices();
  return {
    live: decorateSlice(raw.live),
    moviePremieres: decorateSlice(raw.moviePremieres),
    tvPremieres: decorateSlice(raw.tvPremieres),
    culturalMoments: decorateSlice(raw.culturalMoments),
  };
}

/** Calendar tab — merged feed with stable ordering after pillar composition. */
export async function loadDecoratedCalendarIntel(): Promise<DecoratedCalendarEvent[]> {
  const slices = await loadDecoratedCalendarIntelSlices();
  return flattenDecoratedCalendarSlices(slices);
}
