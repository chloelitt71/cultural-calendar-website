import { useEffect, useState } from 'react';
import type { CulturalMoment } from '../pulse/types';
import { fetchCulturalMoments } from '../services/momentsService';

export function useMoments() {
  const [moments, setMoments] = useState<CulturalMoment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCulturalMoments()
      .then((rows) => {
        if (!cancelled) {
          setMoments(rows);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load moments');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { moments, loading, error };
}
