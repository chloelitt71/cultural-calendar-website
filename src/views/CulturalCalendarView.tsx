import { useMemo, useState } from 'react';
import type { Audience, CulturalEvent, EventCategory, IndustryTag, Region } from '../types';
import { EventCard } from '../components/EventCard';
import { matchesAudienceFilter, matchesIndustryFilter, matchesRegion } from '../data/sampleData';

type CalMode = 'list' | 'calendar';

interface Props {
  events: CulturalEvent[];
}

const CATEGORIES: (EventCategory | 'all')[] = [
  'all',
  'festival',
  'sports',
  'awards',
  'entertainment',
  'fashion',
  'internet',
  'culture',
  'food',
];

const REGIONS: (Region | 'all')[] = ['all', 'global', 'north-america', 'europe', 'asia', 'latam', 'mena'];

const INDUSTRIES: (IndustryTag | 'all')[] = [
  'all',
  'fashion',
  'beauty',
  'consumer',
  'entertainment',
  'food',
  'sports',
  'luxury',
  'tech',
];

const AUDIENCES: (Audience | 'all')[] = [
  'all',
  'gen-z',
  'millennials',
  'affluent',
  'mass',
  'creators',
  'sports-fans',
  'cinephiles',
];

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

function parseMonthKey(key: string): { y: number; m: number } {
  const [ys, ms] = key.split('-');
  return { y: Number(ys), m: Number(ms) };
}

function daysInMonth(y: number, m: number): number {
  return new Date(y, m, 0).getDate();
}

function firstWeekday(y: number, m: number): number {
  // 0 Sunday .. 6 Saturday → shift to Monday-first grid offset
  const wd = new Date(y, m - 1, 1).getDay();
  return (wd + 6) % 7;
}

export function CulturalCalendarView({ events }: Props) {
  const [mode, setMode] = useState<CalMode>('list');
  const [month, setMonth] = useState(monthKey(new Date('2026-04-01')));
  const [category, setCategory] = useState<EventCategory | 'all'>('all');
  const [region, setRegion] = useState<Region | 'all'>('all');
  const [industry, setIndustry] = useState<IndustryTag | 'all'>('all');
  const [audience, setAudience] = useState<Audience | 'all'>('all');

  const filtered = useMemo(() => {
    return events.filter(
      (e) =>
        (category === 'all' || e.category === category) &&
        matchesRegion(e, region) &&
        matchesIndustryFilter(e, industry) &&
        matchesAudienceFilter(e, audience),
    );
  }, [events, category, region, industry, audience]);

  const { upcoming, now, tbd } = useMemo(() => {
    const u = filtered.filter((e) => e.status === 'upcoming');
    const n = filtered.filter((e) => e.status === 'now');
    const t = filtered.filter((e) => e.status === 'tbd');
    return { upcoming: u, now: n, tbd: t };
  }, [filtered]);

  const { y, m } = parseMonthKey(month);
  const dim = daysInMonth(y, m);
  const offset = firstWeekday(y, m);

  const byDay = useMemo(() => {
    const ym = parseMonthKey(month);
    const map = new Map<number, CulturalEvent[]>();
    for (const e of filtered) {
      if (!e.dateIso) continue;
      const d = new Date(e.dateIso);
      if (d.getFullYear() !== ym.y || d.getMonth() + 1 !== ym.m) continue;
      const day = d.getDate();
      const arr = map.get(day) ?? [];
      arr.push(e);
      map.set(day, arr);
    }
    return map;
  }, [filtered, month]);

  const blanks = Array.from({ length: offset }, (_, i) => <div key={`b-${i}`} className="cc-cal__cell cc-cal__cell--empty" />);
  const cells = Array.from({ length: dim }, (_, i) => {
    const day = i + 1;
    const list = byDay.get(day) ?? [];
    return (
      <div key={day} className="cc-cal__cell">
        <div className="cc-cal__day">{day}</div>
        <div className="cc-cal__events">
          {list.map((e) => (
            <span key={e.id} className="cc-cal__pill" title={e.name}>
              {e.name}
            </span>
          ))}
        </div>
      </div>
    );
  });

  return (
    <div className="cc-page">
      <div className="cc-pagehead">
        <div>
          <p className="cc-eyebrow">Master view</p>
          <h1 className="cc-title">Cultural calendar</h1>
          <p className="cc-subtitle">
            Structured dashboard with list and month grid — filter by date context, category, region, industry, and
            audience.
          </p>
        </div>
        <div className="cc-seg">
          <button type="button" className={mode === 'list' ? 'cc-seg__btn cc-seg__btn--on' : 'cc-seg__btn'} onClick={() => setMode('list')}>
            List view
          </button>
          <button
            type="button"
            className={mode === 'calendar' ? 'cc-seg__btn cc-seg__btn--on' : 'cc-seg__btn'}
            onClick={() => setMode('calendar')}
          >
            Calendar view
          </button>
        </div>
      </div>

      <div className="cc-filters">
        <label className="cc-field">
          <span>Month</span>
          <input className="cc-input" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </label>
        <label className="cc-field">
          <span>Category</span>
          <select className="cc-input" value={category} onChange={(e) => setCategory(e.target.value as EventCategory | 'all')}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All categories' : c}
              </option>
            ))}
          </select>
        </label>
        <label className="cc-field">
          <span>Region</span>
          <select className="cc-input" value={region} onChange={(e) => setRegion(e.target.value as Region | 'all')}>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r === 'all' ? 'Global (all regions)' : r.replace('-', ' ')}
              </option>
            ))}
          </select>
        </label>
        <label className="cc-field">
          <span>Industry relevance</span>
          <select className="cc-input" value={industry} onChange={(e) => setIndustry(e.target.value as IndustryTag | 'all')}>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i === 'all' ? 'All industries' : i}
              </option>
            ))}
          </select>
        </label>
        <label className="cc-field">
          <span>Audience</span>
          <select className="cc-input" value={audience} onChange={(e) => setAudience(e.target.value as Audience | 'all')}>
            {AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {a === 'all' ? 'All audiences' : a.replace('-', ' ')}
              </option>
            ))}
          </select>
        </label>
      </div>

      {mode === 'calendar' ? (
        <section className="cc-section">
          <div className="cc-cal">
            <div className="cc-cal__dow">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="cc-cal__grid">
              {blanks}
              {cells}
            </div>
          </div>
        </section>
      ) : null}

      <section className="cc-section">
        <div className="cc-section__head">
          <h2>Happening now</h2>
        </div>
        <div className="cc-grid cc-grid--2">
          {now.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </section>

      <section className="cc-section">
        <div className="cc-section__head">
          <h2>Upcoming</h2>
        </div>
        <div className="cc-grid cc-grid--2">
          {upcoming.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </section>

      <section className="cc-section">
        <div className="cc-section__head">
          <h2>Date TBD</h2>
          <p className="cc-section__sub">Hold lanes on the calendar and pre-wire teams before dates firm up.</p>
        </div>
        <div className="cc-grid cc-grid--2">
          {tbd.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </section>
    </div>
  );
}
