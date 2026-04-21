import type { CalendarIntelEvent } from './types';
import type { CalendarFilter } from './types';

const CATEGORY_COPY: Record<Exclude<CalendarFilter, 'All'>, string> = {
  'Live Events': 'Strong for local activations, hospitality, influencer hosting, and crowd-energy social when geography aligns.',
  'Movie Premieres': 'Prime for entertainment partnerships, talent gifting, press junkets, premium digital stunts, and fandom communities.',
  'TV Premieres': 'Ideal for platform partnerships, recap culture, talent social takeovers, and appointment-viewing conversation.',
  Festivals: 'Strong for sponsorship, creator hosting, experiential activations, sampling, and UGC at scale.',
  Awards: 'High earned-media and red-carpet lanes for beauty, fashion, spirits, and talent-forward storytelling.',
  Sports: 'Mass reach for beverages, betting-adjacent (where legal), athlete narratives, and city-specific retail.',
  Fashion: 'Concentrated press, luxury adjacency, beauty, styling partnerships, and creator front-row beats.',
  'Cultural Moments': 'Seasonal planning windows, inclusivity narratives, and internet-native creative tests with clear tone guardrails.',
};

const SUB_HINTS: Array<{ test: RegExp; line: string }> = [
  { test: /tour|concert|live/i, line: 'Tour-adjacent: strong for market-by-market activations, local retail, and creator travel content.' },
  { test: /premiere|opening night|red carpet/i, line: 'Premiere window: lean into talent glam, limited junket access, and night-of social velocity.' },
  { test: /fashion week|runway|couture/i, line: 'Fashion week: prioritize style authority, backstage access, and beauty-house alignment.' },
  { test: /championship|finals|bowl|world cup|olympic/i, line: 'Championship cycle: spike reactive creative and high-attention media adjacency.' },
  { test: /streaming|series|season/i, line: 'Streaming beat: clip-forward creative, platform partnerships, and spoiler-aware messaging.' },
];

/**
 * Rule-based “why it matters for brands” — used when APIs omit copy or to enrich seed data.
 */
export function buildBrandWhy(ev: Pick<CalendarIntelEvent, 'category' | 'subcategory' | 'title'>): string {
  const base = CATEGORY_COPY[ev.category];
  const extra = SUB_HINTS.find((h) => h.test.test(`${ev.subcategory} ${ev.title}`))?.line;
  return extra ? `${base} ${extra}` : base;
}

/** Heuristic priority: sooner + culturally “heavy” categories score higher. */
export function defaultTimingPriority(params: {
  startMs: number;
  category: Exclude<CalendarFilter, 'All'>;
}): number {
  const now = Date.now();
  const days = Math.max(0, (params.startMs - now) / (24 * 60 * 60 * 1000));
  let score = 72;
  if (days <= 14) score += 18;
  else if (days <= 45) score += 12;
  else if (days <= 120) score += 6;
  const bump: Partial<Record<Exclude<CalendarFilter, 'All'>, number>> = {
    Awards: 4,
    Fashion: 4,
    Festivals: 3,
    Sports: 3,
    'Movie Premieres': 2,
    'TV Premieres': 2,
    'Cultural Moments': 2,
    'Live Events': 2,
  };
  score += bump[params.category] ?? 0;
  return Math.min(98, Math.round(score));
}
