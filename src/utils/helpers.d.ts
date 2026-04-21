import type { EventItem, EventStatus } from '../pulse/types';

export function getEventStatus(event: EventItem): EventStatus;
export function getEventSortDate(event: EventItem): number;
export function isAfterNextTwelveMonths(event: EventItem): boolean;
