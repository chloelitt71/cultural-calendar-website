import { EVENTS } from '../pulse/data';
import type { EventItem } from '../pulse/types';

/** Event-only calendar data — plug in event APIs / ICS / CRM later. */
export function getCalendarEventSource(): EventItem[] {
  return EVENTS;
}
