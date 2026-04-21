import type { CalendarIntelEvent } from '../calendar/types';
import { CULTURAL_MOMENTS_INTEL_SEED } from '../calendar/seedEvents';

/**
 * Tentpole cultural calendar: festivals, awards, sports, fashion, seasonal moments, and PR-facing dates.
 * Additional providers (e.g. holiday APIs, fashion calendars) can be wired into {@link loadCulturalMomentsIntel} later.
 */
export async function loadCulturalMomentsIntel(): Promise<CalendarIntelEvent[]> {
  return [...CULTURAL_MOMENTS_INTEL_SEED];
}
