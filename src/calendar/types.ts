import type { Region, Specialty } from '../pulse/types';

/** Top-level filters for the unified calendar (single-select + “All”). */
export type CalendarFilter =
  | 'All'
  | 'Live Events'
  | 'Movie Premieres'
  | 'TV Premieres'
  | 'Festivals'
  | 'Awards'
  | 'Sports'
  | 'Fashion'
  | 'Cultural Moments';

/** PR-oriented calendar row — merged from Ticketmaster, TMDb, or curated seed. */
export interface CalendarIntelEvent {
  id: string;
  title: string;
  /** Human-readable date range label */
  date: string;
  startDate?: string;
  endDate?: string;
  location: string;
  category: Exclude<CalendarFilter, 'All'>;
  subcategory: string;
  /** e.g. Ticketmaster, TMDb, Curated */
  source: string;
  /** Poster/backdrop path (TMDb) or full URL; card resolves TMDb paths with base URL */
  image?: string;
  whyItMattersForBrands: string;
  /** Higher = more urgent / more “right now” for comms (0–100) */
  timingPriorityScore: number;
  description?: string;
  region?: Region;
  industries?: Specialty[];
}

export type CalendarEventSourceType = 'ticketmaster' | 'tmdb_movie' | 'tmdb_tv' | 'curated';

export interface DecoratedCalendarEvent extends CalendarIntelEvent {
  computedStatus: import('../pulse/types').EventStatus;
  sortDate: number;
}

