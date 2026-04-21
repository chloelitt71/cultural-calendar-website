import { getDecoratedCalendarSeed } from '../services/calendarIntelService';
import type { DecoratedCalendarEvent } from '../calendar/types';

export type DecoratedEvent = DecoratedCalendarEvent;

/** Seed-only decorated rows for Home + static paths. Calendar tab uses async `loadDecoratedCalendarIntel`. */
export const DECORATED_EVENTS: DecoratedCalendarEvent[] = getDecoratedCalendarSeed();

export const EVENT_BY_ID = new Map(DECORATED_EVENTS.map((event) => [event.id, event] as const));
