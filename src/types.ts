export type EventStatus = 'upcoming' | 'now' | 'tbd';

export type EventCategory =
  | 'festival'
  | 'sports'
  | 'awards'
  | 'entertainment'
  | 'fashion'
  | 'internet'
  | 'culture'
  | 'food';

export type IndustryTag =
  | 'fashion'
  | 'beauty'
  | 'consumer'
  | 'entertainment'
  | 'food'
  | 'sports'
  | 'luxury'
  | 'tech';

export type Region = 'global' | 'north-america' | 'europe' | 'asia' | 'latam' | 'mena';

export type Audience =
  | 'gen-z'
  | 'millennials'
  | 'affluent'
  | 'mass'
  | 'creators'
  | 'sports-fans'
  | 'cinephiles';

export interface CulturalEvent {
  id: string;
  name: string;
  dateLabel: string;
  /** ISO date when known, for sorting/filter */
  dateIso?: string;
  location: string;
  category: EventCategory;
  description: string;
  whyItMatters: string;
  tags: IndustryTag[];
  status: EventStatus;
  region: Region;
  audiences: Audience[];
  brandIdeas?: string[];
}

export interface TalentProfile {
  id: string;
  name: string;
  category: string;
  audience: string;
  recentProjects: string;
  brandFit: string;
  culturalRelevance: string;
  emerging?: boolean;
  trendingWhy?: string;
  momentum?: string;
  actEarly?: string;
}

export interface BrandOpportunity {
  id: string;
  title: string;
  type: 'event' | 'moment' | 'sponsor' | 'creator';
  timing: 'plan-now' | 'act-soon' | 'happening-now';
  summary: string;
  angle: string;
  relatedEventId?: string;
}

export type AppView =
  | 'home'
  | 'moments'
  | 'calendar'
  | 'talent-match'
  | 'talent'
  | 'emerging'
  | 'sports'
  | 'entertainment'
  | 'fashion'
  | 'internet'
  | 'awards'
  | 'festivals';
