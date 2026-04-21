import type { AppView } from '../types';

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: 'home', label: 'Feed' },
  { id: 'moments', label: 'Moments' },
  { id: 'calendar', label: 'Cultural Calendar' },
  { id: 'talent-match', label: 'Talent Match' },
  { id: 'talent', label: 'Talent Tracker' },
  { id: 'emerging', label: 'Emerging Talent' },
  { id: 'sports', label: 'Sports' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'internet', label: 'Internet Moments' },
  { id: 'awards', label: 'Awards' },
  { id: 'festivals', label: 'Festivals' },
];

interface Props {
  active: AppView;
  onChange: (view: AppView) => void;
  query: string;
  onQuery: (q: string) => void;
}

export function TopNav({ active, onChange, query, onQuery }: Props) {
  return (
    <header className="cc-topnav">
      <div className="cc-topnav__brand">
        <div className="cc-logo" aria-hidden>
          <span />
        </div>
        <div>
          <p className="cc-brand-name">Culture Signal</p>
          <p className="cc-brand-tag">Cultural calendar & intelligence</p>
        </div>
      </div>
      <div className="cc-topnav__search">
        <label className="visually-hidden" htmlFor="global-search">
          Search moments, talent, regions
        </label>
        <input
          id="global-search"
          className="cc-input cc-input--search"
          placeholder="Search culture… (no login required)"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
      </div>
      <nav className="cc-tabs" aria-label="Primary">
        <div className="cc-tabs__scroll">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`cc-tab${active === item.id ? ' cc-tab--active' : ''}`}
              onClick={() => onChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
