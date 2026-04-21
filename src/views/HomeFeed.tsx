import type { CulturalEvent } from '../types';
import { EventCard } from '../components/EventCard';
import { isInAnchorWeek } from '../utils/week';

interface Props {
  events: CulturalEvent[];
}

function majorUpcoming(events: CulturalEvent[]): CulturalEvent[] {
  return [...events]
    .filter((e) => e.status === 'upcoming' && e.dateIso)
    .sort((a, b) => (a.dateIso ?? '').localeCompare(b.dateIso ?? ''))
    .slice(0, 6);
}

export function HomeFeed({ events }: Props) {
  const happening = events.filter((e) => e.status === 'now');
  const upcoming = majorUpcoming(events);
  const weekSnap = events.filter((e) => isInAnchorWeek(e.dateIso));

  return (
    <div className="cc-page">
      <section className="cc-hero">
        <p className="cc-eyebrow">Live cultural intelligence</p>
        <h1 className="cc-hero__title">Stay early on the moments that move culture.</h1>
        <p className="cc-hero__lede">
          One curated surface for festivals, awards, sports, drops, and internet velocity — built for
          junior PR coordinators moving fast across fashion, beauty, CPG, entertainment, and sports.
        </p>
        <div className="cc-hero__stats">
          <div className="cc-stat">
            <span className="cc-stat__value">{events.length}</span>
            <span className="cc-stat__label">Tracked moments</span>
          </div>
          <div className="cc-stat">
            <span className="cc-stat__value">{happening.length}</span>
            <span className="cc-stat__label">Live signals</span>
          </div>
          <div className="cc-stat">
            <span className="cc-stat__value">Global</span>
            <span className="cc-stat__label">Scope</span>
          </div>
        </div>
      </section>

      <section className="cc-section">
        <div className="cc-section__head">
          <h2>Happening now</h2>
          <p className="cc-section__sub">Real-time cultural heat — prioritize reactive beats and talent.</p>
        </div>
        <div className="cc-grid cc-grid--3">
          {happening.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </section>

      <section className="cc-section">
        <div className="cc-section__head">
          <h2>Upcoming major moments</h2>
          <p className="cc-section__sub">Anchor the calendar: where press volume and spend concentrate next.</p>
        </div>
        <div className="cc-grid cc-grid--3">
          {upcoming.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </section>

      <section className="cc-section cc-section--tint">
        <div className="cc-section__head">
          <h2>This week in culture</h2>
          <p className="cc-section__sub">Snapshot for the week of Apr 7–13, 2026 — align pitches and stakeholder approvals.</p>
        </div>
        {weekSnap.length === 0 ? (
          <p className="cc-muted">No dated moments in this window — widen search or jump to the calendar.</p>
        ) : (
          <div className="cc-grid cc-grid--2">
            {weekSnap.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
