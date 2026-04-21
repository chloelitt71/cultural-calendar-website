export type AppTab = 'home' | 'moments' | 'calendar' | 'talent-intel' | 'talent-match' | 'talent';

export type EventStatus = 'past' | 'now' | 'soon' | 'upcoming' | 'tbd';

/** Calendar filter / row category — unified intelligence model (@/calendar/types). */
export type { CalendarFilter as EventCategory, CalendarIntelEvent as EventItem } from '../calendar/types';

export type Region = 'Global' | 'North America' | 'Europe' | 'Asia' | 'LATAM' | 'MENA';

export type Specialty =
  | 'Beauty'
  | 'Fashion'
  | 'Sports'
  | 'Food & Beverage'
  | 'Music'
  | 'Entertainment'
  | 'Wellness'
  | 'Lifestyle';

export interface TalentItem {
  id: string;
  name: string;
  emoji: string;
  type: string;
  specialty: Specialty[];
  audience: string;
  brandFit: string;
  matchScore: number;
  tier: 'Established' | 'Emerging';
  whyTrending?: string;
  growth: number;
}

/** Legacy opportunity rows (data file); not surfaced in main nav. */
export interface OpportunityItem {
  id: string;
  title: string;
  relatedEventId?: string;
  description: string;
  actions: string[];
}

export type OpportunityTiming = 'Now' | 'Act Soon' | 'Plan Now';

/** Curated cultural / social signal for the Moments feed (replaceable with API). */
export type MomentSignalCategory =
  | 'Drama'
  | 'Trend'
  | 'Influencer Momentum'
  | 'Celebrity Moment'
  | 'Internet Conversation';

export interface CulturalMoment {
  id: string;
  headline: string;
  description: string;
  /** Publication or outlet name (e.g. from NewsAPI `source.name`) */
  source: string;
  /** Direct link to the original article — required for items shown in the feed */
  url: string;
  category: MomentSignalCategory;
  whyForBrands: string;
  /** 1–100 — conversation velocity & PR salience */
  signalStrength: number;
  observedAt: string;
}

/** Industry lanes for brand fit & PR filters (Talent tab). */
export type TalentIndustryFit = 'beauty' | 'fashion' | 'lifestyle' | 'entertainment' | 'consumer';

export type TalentPrFilter =
  | 'most-relevant'
  | 'beauty'
  | 'fashion'
  | 'lifestyle'
  | 'entertainment'
  | 'consumer'
  | 'rising';

export type TalentDiscoverySegment = 'actors' | 'music' | 'influencers';

/**
 * Curated talent shortlist (seed data — replace with APIs).
 * Scores are 0–100; used by the ranking engine.
 */
export interface CuratedTalentProfile {
  id: string;
  segment: 'actors' | 'music' | 'influencers';
  name: string;
  /** TikTok username only (no @, no URL). */
  tiktokHandle: string;
  /** Instagram username only (no @, no URL). */
  instagramHandle: string;
  category: string;
  subcategory: string;
  audience: string;
  industries: TalentIndustryFit[];
  contentPersonaStyle: string;
  currentRelevanceReason: string;
  upcomingHook: string;
  brandFitScore: number;
  momentumScore: number;
  pressVisibilityScore: number;
  audienceRelevanceScore: number;
  timingUrgencyScore: number;
  brandFitTag: string;
  /** Campaign types / lanes where this talent is a strong PR bet (shortlist-style). */
  bestFor: string;
  /** How activations tend to land: earned vs digital vs live vs creator-native. */
  activationStyle: string;
  /** What partnerships usually win on (credibility, reach, conversion, prestige, etc.). */
  partnershipStrength: string;
  /** Concrete brand use case: when to brief them and what success looks like. */
  brandUseCase: string;
  /** Spiking trajectory or breakout window — used for “Rising talent” */
  risingTalent: boolean;
  /** Actors */
  upcomingFilmTv?: string;
  premiereWindow?: string;
  awardOrPressCycle?: string;
  /** Music */
  tourFestival?: string;
  releaseNote?: string;
  liveVisibilityNote?: string;
  /** Influencers */
  socialTractionNote?: string;
  partnershipPotentialNote?: string;
  conversationVolumeNote?: string;
}

export interface RankedCuratedTalent extends CuratedTalentProfile {
  /** Weighted composite after segment + filter adjustments */
  relevanceScore: number;
}

/** Curated influencer row for the talent matching engine (local dataset). */
export interface InfluencerProfile {
  id: string;
  name: string;
  shortDescription: string;
  categories: Specialty[];
  audienceTags: string[];
  traits: string[];
  platforms: string[];
}

export interface TalentMatchInput {
  brandName: string;
  category: string;
  audience: string;
  productOrLaunch: string;
  campaignGoal: string;
}

export interface TalentMatchRow {
  name: string;
  description: string;
  whyFit: string;
  activationIdea: string;
  matchScore: number;
}

export interface TalentMatchReport {
  headline: string;
  executiveSummary: string;
  briefContext: string;
  matches: TalentMatchRow[];
}
