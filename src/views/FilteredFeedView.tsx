import type { AppView, CulturalEvent } from '../types';
import { EventCard } from '../components/EventCard';

const TITLES: Record<Exclude<AppView, 'home' | 'moments' | 'calendar' | 'talent-match' | 'talent' | 'emerging'>, { title: string; sub: string }> = {
  sports: { title: 'Sports', sub: 'Broadcast tentpoles, leagues, and fandom velocity.' },
  entertainment: { title: 'Entertainment', sub: 'Premieres, festivals, and IP moments with press gravity.' },
  fashion: { title: 'Fashion', sub: 'Runways, houses, and style narratives shaping search.' },
  internet: { title: 'Internet moments', sub: 'Platform-native trends with fast earned-media cycles.' },
  awards: { title: 'Awards', sub: 'Ceremonies and voting seasons that concentrate glam stories.' },
  festivals: { title: 'Festivals', sub: 'Music and culture weekends built for experiential brands.' },
};

interface Props {
  view: keyof typeof TITLES;
  events: CulturalEvent[];
}

export function FilteredFeedView({ view, events }: Props) {
  const meta = TITLES[view];
  return (
    <div className="cc-page">
      <div className="cc-pagehead">
        <div>
          <p className="cc-eyebrow">Filtered dataset</p>
          <h1 className="cc-title">{meta.title}</h1>
          <p className="cc-subtitle">{meta.sub}</p>
        </div>
      </div>
      {events.length === 0 ? (
        <p className="cc-muted">No moments match your search — try a broader term or switch back to the main feed.</p>
      ) : (
        <div className="cc-grid cc-grid--2">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
