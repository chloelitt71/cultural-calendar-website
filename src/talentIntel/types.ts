export interface BrandDealMention {
  /** Brand or deal label — only when article text supports it */
  label: string;
  /** Short evidence from the article (quoted or paraphrased) */
  evidence: string;
  sourceUrl: string;
  sourceTitle?: string;
  publishedAt?: string;
}

export interface CoverageArticle {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
}

export interface TalentIntelProfile {
  name: string;
  sector: string;
  location: string;
  onlinePersonality: string;
  audienceStyle: string;
  brandDeals: BrandDealMention[];
  recentCoverage: CoverageArticle[];
}

export interface KgEntitySnapshot {
  name: string;
  description?: string;
  detailedBody?: string;
  types: string[];
  wikipediaUrl?: string;
  sameAs: string[];
}

