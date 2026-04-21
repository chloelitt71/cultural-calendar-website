import type { CalendarIntelEvent, DecoratedCalendarEvent } from './types';
import { getComputedStatusCalendar, getEventSortDateCalendar } from './calendarStatus';

export function decorateCalendarEvents(events: CalendarIntelEvent[]): DecoratedCalendarEvent[] {
  return events.map((event) => ({
    ...event,
    computedStatus: getComputedStatusCalendar(event),
    sortDate: getEventSortDateCalendar(event),
  }));
}
