import { useCallback, useEffect, useState } from 'react';
import {
  flattenDecoratedCalendarSlices,
  getDecoratedCalendarSeedSlices,
  loadDecoratedCalendarIntelSlices,
  type DecoratedCalendarIntelSlices,
} from '../services/calendarAggregationService';
import type { DecoratedCalendarEvent } from '../calendar/types';

export function useCalendarIntel() {
  const [events, setEvents] = useState<DecoratedCalendarEvent[]>(() =>
    flattenDecoratedCalendarSlices(getDecoratedCalendarSeedSlices()),
  );
  const [slices, setSlices] = useState<DecoratedCalendarIntelSlices>(() => getDecoratedCalendarSeedSlices());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nextSlices = await loadDecoratedCalendarIntelSlices();
      setSlices(nextSlices);
      setEvents(flattenDecoratedCalendarSlices(nextSlices));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not refresh events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { events, slices, loading, error, refresh };
}
