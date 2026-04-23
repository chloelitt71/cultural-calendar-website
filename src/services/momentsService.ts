import { MOCK_MOMENTS } from '../data/moments.mock';
import type { CulturalMoment, MomentSignalCategory } from '../pulse/types';

/**
 * Browser-safe path:
 * - local dev uses Vite proxy (`/news-api` -> newsapi.org)
 * - production uses serverless proxy (`/api/newsapi`)
 */
function newsApiV2Base(): string {
  return import.meta.env.DEV ? '/news-api' : '/api/newsapi';
}

function inferCategory(title: string): MomentSignalCategory {
  const t = title.toLowerCase();
  if (/breakup|split|rumor|feud|lawsuit|scandal|drama|exit|fired/.test(t)) return 'Drama';
  if (/tiktok|viral|meme|internet|thread|reddit|creator|influencer|youtube|instagram/.test(t)) return 'Internet Conversation';
  if (/actor|actress|celebrity|film|oscar|grammy|premiere|red carpet|star\b|singer|album|tour|festival/.test(t)) return 'Celebrity Moment';
  if (/growth|engagement|followers|brand|campaign|creator economy|analytics/.test(t)) return 'Influencer Momentum';
  return 'Trend';
}

function defaultWhyForBrands(category: MomentSignalCategory): string {
  switch (category) {
    case 'Drama':
      return 'Monitor tone for brand safety; align reactive commentary with counsel and values before posting.';
    case 'Celebrity Moment':
      return 'Short window for earned-style tie-ins—confirm talent and approvals before pitching adjacent angles.';
    case 'Influencer Momentum':
      return 'Use for briefs on partnership formats and cohort tests; prioritize narrative arcs over one-off posts.';
    case 'Internet Conversation':
      return 'Brief social and PR on platform-native framing; avoid template voiceover or generic reactive posts.';
    case 'Trend':
    default:
      return 'Use as a planning signal for creative and talent briefs—validate with your category data before scaling.';
  }
}

type NewsApiArticle = {
  source?: { id?: string | null; name?: string | null };
  title?: string | null;
  description?: string | null;
  url?: string | null;
  publishedAt?: string | null;
  language?: string | null;
};

type NewsApiResponse = {
  status?: string;
  articles?: NewsApiArticle[];
};

const SOURCE_ALIAS_TO_CANONICAL: Record<string, string> = {
  vogue: 'Vogue',
  'business of fashion': 'Business of Fashion',
  bof: 'Business of Fashion',
  wwd: 'WWD',
  people: 'People',
  variety: 'Variety',
  'the cut': 'The Cut',
  refinery29: 'Refinery29',
  billboard: 'Billboard',
  'hollywood reporter': 'Hollywood Reporter',
  'the hollywood reporter': 'Hollywood Reporter',
};

const SOURCE_TIER: Record<string, 1 | 2 | 3 | 4> = {
  Vogue: 1,
  'Business of Fashion': 1,
  WWD: 1,
  Variety: 1,
  'The Cut': 1,
  'Hollywood Reporter': 1,
  People: 2,
  Refinery29: 2,
  Billboard: 2,
};

function canonicalizeSourceName(name?: string | null): string | null {
  const normalized = name?.trim().toLowerCase();
  if (!normalized) return null;
  return SOURCE_ALIAS_TO_CANONICAL[normalized] ?? name?.trim() ?? null;
}

function hashUrl(url: string): string {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (Math.imul(31, h) + url.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

function isMostlyNonLatin(text: string): boolean {
  const cleaned = text.replace(/\s+/g, '');
  if (!cleaned) return false;
  const latinLikeChars = cleaned.match(/[A-Za-z0-9.,!?'"()\-/:;&]/g)?.length ?? 0;
  const ratio = latinLikeChars / cleaned.length;
  return cleaned.length >= 12 && ratio < 0.45;
}

function passesEnglishFallback(article: NewsApiArticle): boolean {
  const explicitLanguage = article.language?.trim().toLowerCase();
  if (explicitLanguage && explicitLanguage !== 'en') return false;
  const title = article.title?.trim() ?? '';
  const description = article.description?.trim() ?? '';
  if (isMostlyNonLatin(title)) return false;
  if (description && isMostlyNonLatin(description)) return false;
  return true;
}

function mapArticleToMoment(article: NewsApiArticle, signalStrength: number): CulturalMoment | null {
  const url = article.url?.trim();
  if (!url || !/^https?:\/\//i.test(url)) return null;
  const canonicalSource = canonicalizeSourceName(article.source?.name) ?? 'News';
  const title = article.title?.trim() || 'Story';
  const description = (article.description?.replace(/<[^>]+>/g, '').trim() || title).slice(0, 480);
  const category = inferCategory(title);
  const observedAt = article.publishedAt?.trim() || new Date().toISOString();
  const id = `newsapi-${hashUrl(url)}`;

  return {
    id,
    headline: title,
    description,
    source: canonicalSource,
    url,
    category,
    whyForBrands: defaultWhyForBrands(category),
    signalStrength,
    observedAt,
  };
}

function isWithinLastDays(isoDate?: string | null, days = 30): boolean {
  const parsed = Date.parse(isoDate ?? '');
  if (Number.isNaN(parsed)) return false;
  const now = Date.now();
  const lookbackMs = days * 24 * 60 * 60 * 1000;
  return parsed >= now - lookbackMs && parsed <= now;
}

function toNewsApiDate(daysAgo: number): string {
  const d = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

async function fetchNewsApiEverything(apiKey?: string): Promise<CulturalMoment[]> {
  const baseUrl = newsApiV2Base();
  const q = new URLSearchParams({
    q: '(celebrity OR influencer OR fashion OR beauty OR entertainment OR music OR film OR tv OR tiktok OR instagram)',
    language: 'en',
    sortBy: 'publishedAt',
    from: toNewsApiDate(30),
    pageSize: '50',
  });
  if (apiKey?.trim()) q.set('apiKey', apiKey.trim());

  const res = await fetch(`${baseUrl}/everything?${q.toString()}`);
  if (!res.ok) return [];
  const data = (await res.json()) as NewsApiResponse;
  if (data.status !== 'ok' || !data.articles?.length) return [];
  const merged: NewsApiArticle[] = data.articles.filter(
    (article) => isWithinLastDays(article.publishedAt, 30) && passesEnglishFallback(article),
  );

  const seen = new Set<string>();
  const out: CulturalMoment[] = [];
  for (const article of merged) {
    const canonicalSource = canonicalizeSourceName(article.source?.name) ?? 'News';
    const tier = SOURCE_TIER[canonicalSource] ?? 4;
    // Keep broad source volume while still prioritizing curated PR publications.
    const strengthBase = tier === 1 ? 96 : tier === 2 ? 89 : tier === 3 ? 78 : 68;
    const strength = Math.max(55, strengthBase - out.length);
    const m = mapArticleToMoment(article, strength);
    if (!m) continue;
    if (seen.has(m.url)) continue;
    seen.add(m.url);
    out.push(m);
  }

  return out.sort((a, b) => {
    const dateDelta = Date.parse(b.observedAt) - Date.parse(a.observedAt);
    if (!Number.isNaN(dateDelta) && dateDelta !== 0) return dateDelta;
    const tierA = SOURCE_TIER[a.source] ?? 4;
    const tierB = SOURCE_TIER[b.source] ?? 4;
    if (tierA !== tierB) return tierA - tierB;
    return b.signalStrength - a.signalStrength;
  });
}

/** Stories must include a real `url` — used by the feed after API mapping. */
export function filterMomentsWithValidUrl(moments: CulturalMoment[]): CulturalMoment[] {
  return moments.filter((m) => typeof m.url === 'string' && /^https?:\/\//i.test(m.url.trim()));
}

/**
 * Primary feed: NewsAPI everything query when `VITE_NEWS_API_KEY` is set.
 * Falls back to curated mock rows (each includes a placeholder URL for local UI testing).
 */
export async function fetchCulturalMoments(): Promise<CulturalMoment[]> {
  const key = import.meta.env.VITE_NEWS_API_KEY?.trim();
  try {
    const fromApi = await fetchNewsApiEverything(key);
    const withUrl = filterMomentsWithValidUrl(fromApi);
    if (withUrl.length > 0) return withUrl;
  } catch {
    // fall through to mock
  }
  return filterMomentsWithValidUrl([...MOCK_MOMENTS]);
}

/** @deprecated Prefer async `fetchCulturalMoments` — kept for quick sync tests */
export function getMomentsSync(): CulturalMoment[] {
  return filterMomentsWithValidUrl([...MOCK_MOMENTS]).sort((a, b) => b.signalStrength - a.signalStrength);
}
