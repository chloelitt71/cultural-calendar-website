import { useMemo } from 'react';
import { MomentCard } from './MomentCard';
import { useMoments } from '../hooks/useMoments';

export function MomentsPreview({ limit = 4 }: { limit?: number }) {
  const { moments, loading } = useMoments();
  const items = useMemo(() => moments.slice(0, limit), [moments, limit]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: Math.min(limit, 4) }).map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-[1.15rem] border border-white/8 bg-white/[0.03]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((m) => (
        <MomentCard key={m.id} moment={m} />
      ))}
    </div>
  );
}
