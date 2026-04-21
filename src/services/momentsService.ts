import { MOCK_MOMENTS } from '../data/moments.mock';
import type { CulturalMoment, MomentSignalCategory } from '../pulse/types';

/**
 * Browser-safe path: Vite dev proxies `/news-api` → `https://newsapi.org/v2`.
 * Production hosts should add a matching rewrite or serverless route.
 */
function newsApiV2Base(): string {
  return '/news-api';
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
};

type NewsApiResponse = {
  status?: string;
  articles?: NewsApiArticle[];
};

function hashUrl(url: string): string {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (Math.imul(31, h) + url.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

function mapArticleToMoment(article: NewsApiArticle, signalStrength: number): CulturalMoment | null {
  const url = article.url?.trim();
  if (!url || !/^https?:\/\//i.test(url)) return null;
  const title = article.title?.trim() || 'Story';
  const description = (article.description?.replace(/<[^>]+>/g, '').trim() || title).slice(0, 480);
  const sourceName = article.source?.name?.trim() || 'News';
  const category = inferCategory(title);
  const observedAt = article.publishedAt?.trim() || new Date().toISOString();
  const id = `newsapi-${hashUrl(url)}`;

  return {
    id,
    headline: title,
    description,
    source: sourceName,
    url,
    category,
    whyForBrands: defaultWhyForBrands(category),
    signalStrength,
    observedAt,
  };
}

async function fetchNewsApiTopHeadlines(apiKey: string): Promise<CulturalMoment[]> {
  const base = newsApiV2Base();
  const buildUrl = (category: string) => {
    const q = new URLSearchParams({
      country: 'us',
      category,
      pageSize: '25',
      apiKey,
    });
    return `${base}/top-headlines?${q.toString()}`;
  };

  const [entRes, techRes] = await Promise.all([
    fetch(buildUrl('entertainment')),
    fetch(buildUrl('technology')),
  ]);

  const merged: NewsApiArticle[] = [];
  for (const res of [entRes, techRes]) {
    if (!res.ok) continue;
    const data = (await res.json()) as NewsApiResponse;
    if (data.status !== 'ok' || !data.articles?.length) continue;
    merged.push(...data.articles);
  }

  const seen = new Set<string>();
  const out: CulturalMoment[] = [];
  for (const article of merged) {
    const strength = Math.max(55, 94 - out.length);
    const m = mapArticleToMoment(article, strength);
    if (!m) continue;
    if (seen.has(m.url)) continue;
    seen.add(m.url);
    out.push(m);
  }

  return out.sort((a, b) => b.signalStrength - a.signalStrength);
}

/** Stories must include a real `url` — used by the feed after API mapping. */
export function filterMomentsWithValidUrl(moments: CulturalMoment[]): CulturalMoment[] {
  return moments.filter((m) => typeof m.url === 'string' && /^https?:\/\//i.test(m.url.trim()));
}

/**
 * Primary feed: NewsAPI top headlines when `VITE_NEWS_API_KEY` is set.
 * Falls back to curated mock rows (each includes a placeholder URL for local UI testing).
 */
export async function fetchCulturalMoments(): Promise<CulturalMoment[]> {
  const key = import.meta.env.VITE_NEWS_API_KEY?.trim();
  if (key) {
    try {
      const fromApi = await fetchNewsApiTopHeadlines(key);
      const withUrl = filterMomentsWithValidUrl(fromApi);
      if (withUrl.length > 0) return withUrl;
    } catch {
      // fall through to mock
    }
  }
  return filterMomentsWithValidUrl([...MOCK_MOMENTS]);
}

/** @deprecated Prefer async `fetchCulturalMoments` — kept for quick sync tests */
export function getMomentsSync(): CulturalMoment[] {
  return filterMomentsWithValidUrl([...MOCK_MOMENTS]).sort((a, b) => b.signalStrength - a.signalStrength);
}
