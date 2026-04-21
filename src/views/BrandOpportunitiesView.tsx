import type { BrandOpportunity } from '../types';
import { eventById } from '../data/sampleData';

const timingLabel: Record<BrandOpportunity['timing'], string> = {
  'plan-now': 'Plan now',
  'act-soon': 'Act soon',
  'happening-now': 'Happening now',
};

const timingClass: Record<BrandOpportunity['timing'], string> = {
  'plan-now': 'cc-timing--plan',
  'act-soon': 'cc-timing--soon',
  'happening-now': 'cc-timing--now',
};

interface Props {
  opportunities: BrandOpportunity[];
}

export function BrandOpportunitiesView({ opportunities }: Props) {
  return (
    <div className="cc-page">
      <div className="cc-pagehead">
        <div>
          <p className="cc-eyebrow">Curated lanes</p>
          <h1 className="cc-title">Brand opportunities</h1>
          <p className="cc-subtitle">
            Sponsorships, creator plays, and cultural moments with timing cues so teams know when to move.
          </p>
        </div>
      </div>
      <div className="cc-grid cc-grid--2">
        {opportunities.map((o) => {
          const ev = o.relatedEventId ? eventById(o.relatedEventId) : undefined;
          return (
            <article key={o.id} className="cc-card cc-card--opp">
              <header className="cc-card__head">
                <div>
                  <p className="cc-kicker">{o.type.replace('-', ' ')}</p>
                  <h3 className="cc-card__title">{o.title}</h3>
                </div>
                <span className={`cc-timing ${timingClass[o.timing]}`}>{timingLabel[o.timing]}</span>
              </header>
              <p className="cc-card__body">{o.summary}</p>
              <div className="cc-insight">
                <span className="cc-insight__label">Suggested angle</span>
                <p>{o.angle}</p>
              </div>
              {ev && (
                <p className="cc-muted">
                  <strong className="cc-strong">Linked moment:</strong> {ev.name} — {ev.dateLabel}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
