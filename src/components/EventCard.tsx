import { useId, useState } from 'react';
import type { CulturalEvent } from '../types';

const statusLabel: Record<CulturalEvent['status'], string> = {
  upcoming: 'Upcoming',
  now: 'Happening now',
  tbd: 'Date TBD',
};

const statusClass: Record<CulturalEvent['status'], string> = {
  upcoming: 'cc-status--upcoming',
  now: 'cc-status--now',
  tbd: 'cc-status--tbd',
};

interface EventCardProps {
  event: CulturalEvent;
  showBrandIdeasDefault?: boolean;
}

export function EventCard({ event, showBrandIdeasDefault = false }: EventCardProps) {
  const [showIdeas, setShowIdeas] = useState(showBrandIdeasDefault);
  const ideasId = useId();

  return (
    <article className="cc-card">
      <header className="cc-card__head">
        <div>
          <h3 className="cc-card__title">{event.name}</h3>
          <p className="cc-card__meta">
            <span>{event.dateLabel}</span>
            <span className="cc-dot" aria-hidden />
            <span>{event.location}</span>
          </p>
        </div>
        <span className={`cc-status ${statusClass[event.status]}`}>{statusLabel[event.status]}</span>
      </header>
      <p className="cc-card__cat">{event.category.replace('-', ' ')}</p>
      <p className="cc-card__body">{event.description}</p>
      <div className="cc-insight">
        <span className="cc-insight__label">Why it matters</span>
        <p>{event.whyItMatters}</p>
      </div>
      <div className="cc-tags">
        <span className="cc-tags__label">Industries</span>
        <div className="cc-tags__row">
          {event.tags.map((t) => (
            <span key={t} className="cc-chip cc-chip--industry">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="cc-tags">
        <span className="cc-tags__label">Audience</span>
        <div className="cc-tags__row">
          {event.audiences.map((a) => (
            <span key={a} className="cc-chip">
              {a.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>
      {event.brandIdeas && event.brandIdeas.length > 0 && (
        <div className="cc-toggle-block">
          <label className="cc-toggle" htmlFor={`${ideasId}-${event.id}`}>
            <input
              id={`${ideasId}-${event.id}`}
              type="checkbox"
              checked={showIdeas}
              onChange={(ev) => setShowIdeas(ev.target.checked)}
            />
            <span>Show brand opportunity ideas</span>
          </label>
          {showIdeas && (
            <ul className="cc-ideas">
              {event.brandIdeas.map((idea) => (
                <li key={idea}>{idea}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}
