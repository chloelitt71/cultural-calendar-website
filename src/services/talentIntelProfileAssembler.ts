import type { BrandDealMention, TalentIntelProfile } from '../talentIntel/types';
import { fetchTalentNewsBundle, type RawNewsArticle } from './talentIntelNewsService';

const DEAL_HINT =
  /\b(partnership|signs?\s+with|deal\s+with|ambassador|endors|campaign\s+with|collaboration|faces?\s+of|brand\s+deal|sponsor|teams?\s+up\s+with|joins?\s+forces\s+with|named\s+.*\s+ambassador|collection\s+with|launches?\s+with)\b/i;

function extractBrandDeals(articles: RawNewsArticle[]): BrandDealMention[] {
  const out: BrandDealMention[] = [];
  const seen = new Set<string>();
  for (const a of articles) {
    const text = `${a.title} ${a.description}`;
    if (!DEAL_HINT.test(text)) continue;
    const evidence = text.slice(0, 240).trim();
    let label = 'Brand or partnership mention (see article)';
    const withBrand = text.match(
      /\b(?:with|for)\s+([A-Z][A-Za-z0-9&]+(?:\s+(?:&|and)\s+[A-Z][A-Za-z]+)?(?:\s+[A-Z][a-z]+){0,2})\b/,
    );
    if (withBrand?.[1] && withBrand[1].length < 48) label = withBrand[1];
    const key = `${a.url}::${label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      label,
      evidence,
      sourceUrl: a.url,
      sourceTitle: a.title,
      publishedAt: a.publishedAt,
    });
    if (out.length >= 8) break;
  }
  return out;
}

function sectorFromNews(articles: RawNewsArticle[]): string {
  const blob = articles
    .slice(0, 8)
    .map((a) => `${a.title} ${a.description}`)
    .join(' ')
    .toLowerCase();
  if (!blob) return 'Celebrity';
  if (/influencer|social media star|viral personality|beauty influencer|fashion influencer/.test(blob)) return 'Influencer';
  if (/creator|content creator|youtuber|streamer|podcast host/.test(blob)) return 'Creator';
  if (/actor|actress|film|movie|series|streaming|box office/.test(blob)) return 'Actor';
  if (/singer|album|single|tour|music|record label/.test(blob)) return 'Music Artist';
  if (/athlete|nba|nfl|mlb|fifa|olympic|tennis|formula 1|ufc/.test(blob)) return 'Athlete';
  if (/youtube|tiktok|instagram|podcast/.test(blob)) return 'Creator';
  if (/model|runway|fashion week|red carpet|style icon/.test(blob)) return 'Celebrity';
  return 'Celebrity';
}

function buildOnlinePersonality(news: RawNewsArticle[]): string {
  if (!news.length) return 'Not clearly defined in recent coverage.';
  const blob = news
    .slice(0, 12)
    .map((a) => `${a.title} ${a.description}`.toLowerCase())
    .join(' ');
  if (/comedic|comedy|funny|satire/.test(blob)) return 'Comedic, internet-native personality';
  if (/beauty|makeup|skincare|glam/.test(blob)) return 'Polished beauty-focused personality';
  if (/fashion|style|runway|red carpet/.test(blob)) return 'Style-led, fashion-forward public persona';
  if (/lifestyle|wellness|daily|vlog/.test(blob)) return 'Lifestyle-first personality with broad mainstream tone';
  if (/activist|advocacy|social impact|philanthropy/.test(blob)) return 'Cause-aware public voice with advocacy cues';
  return 'Not clearly defined in recent coverage.';
}

function buildAudienceStyle(news: RawNewsArticle[], sector: string): string {
  if (!news.length) return 'Audience profile is not clearly defined in current coverage.';
  const newsCount = news.length;
  const blob = news
    .slice(0, 12)
    .map((a) => `${a.title} ${a.description}`.toLowerCase())
    .join(' ');
  if (sector === 'Actor' || /premiere|streaming|box office|cast|series/.test(blob)) {
    return 'Entertainment audiences and culture press, strongest around releases and appearances.';
  }
  if (sector === 'Music Artist' || /tour|single|album|festival|fans/.test(blob)) {
    return 'Music and fan-community audiences, strongest around release and tour cycles.';
  }
  if (sector === 'Creator' || /youtube|tiktok|instagram|followers|creator/.test(blob)) {
    return 'Digital-native audiences reached through creator and social-first storytelling.';
  }
  if (newsCount >= 10) return 'Broad mainstream audience with active press momentum.';
  if (newsCount >= 3) return 'Mid-level visibility with selective but recurring coverage.';
  return 'Audience profile is not clearly defined in current coverage.';
}

function inferLocation(news: RawNewsArticle[]): string {
  if (!news.length) return 'Location not confirmed in recent coverage.';
  const blob = news
    .slice(0, 12)
    .map((a) => `${a.title} ${a.description}`)
    .join(' ');
  const place =
    blob.match(/\b(?:in|from|based in)\s+([A-Z][a-z]+(?:,\s*[A-Z][a-z]+)?)/)?.[1] ??
    blob.match(/\b(New York|Los Angeles|London|Paris|Miami|Toronto|Chicago|Nashville|Atlanta|Tokyo|Seoul)\b/i)?.[1];
  return place ? place : 'Location not confirmed in recent coverage.';
}

export type TalentIntelRequestStatus = 'success' | 'no_results';

export interface TalentIntelAssemblyResult {
  profile: TalentIntelProfile | null;
  debug: {
    searchTerm: string;
    requestStatus: TalentIntelRequestStatus;
    articleCount: number;
    firstThreeTitles: string[];
  };
}

/**
 * NewsAPI-only pipeline for resilient PR lookup.
 */
export async function assembleTalentIntelProfile(
  rawQuery: string,
): Promise<TalentIntelAssemblyResult> {
  const q = rawQuery.trim();
  const newsKey = import.meta.env.VITE_NEWS_API_KEY as string | undefined;
  if (!newsKey?.trim()) {
    throw new Error('NewsAPI key not detected. Add VITE_NEWS_API_KEY to your environment.');
  }

  const newsBundle = await fetchTalentNewsBundle(q, newsKey);
  const titles = newsBundle.raw.map((a) => a.title).filter(Boolean);
  if (import.meta.env.DEV) {
    console.info('[WhoIsThis] Lookup request fired for:', q);
    console.info('[WhoIsThis] NewsAPI articles returned:', newsBundle.raw.length);
  }
  if (newsBundle.raw.length === 0) {
    return {
      profile: null,
      debug: {
        searchTerm: q,
        requestStatus: 'no_results',
        articleCount: 0,
        firstThreeTitles: [],
      },
    };
  }

  const displayName = q;
  const sector = sectorFromNews(newsBundle.raw);
  const location = inferLocation(newsBundle.raw);

  const brandDeals = extractBrandDeals(newsBundle.raw);
  const onlinePersonality = buildOnlinePersonality(newsBundle.raw);
  const audienceStyle = buildAudienceStyle(newsBundle.raw, sector);

  const draft: TalentIntelProfile = {
    name: displayName,
    sector,
    location,
    onlinePersonality,
    audienceStyle,
    brandDeals,
    recentCoverage: newsBundle.coverage.slice(0, 15),
  };
  return {
    profile: draft,
    debug: {
      searchTerm: q,
      requestStatus: 'success',
      articleCount: newsBundle.raw.length,
      firstThreeTitles: titles.slice(0, 3),
    },
  };
}
