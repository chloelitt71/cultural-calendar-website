import type { CoverageArticle } from '../talentIntel/types';

type NewsEverythingArticle = {
  title: string | null;
  description?: string | null;
  url?: string | null;
  publishedAt?: string | null;
  source?: { name?: string | null };
};

type NewsEverythingResponse = {
  status?: string;
  articles?: NewsEverythingArticle[];
};

const newsBase = () => '/news-api';

const SOURCE_QUALITY: Record<string, number> = {
  Vogue: 3,
  'Business of Fashion': 3,
  WWD: 3,
  Variety: 2,
  People: 2,
  'The Hollywood Reporter': 2,
  Billboard: 2,
  'The Cut': 2,
  Refinery29: 2,
};

export interface RawNewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
}

export interface TalentNewsBundle {
  coverage: CoverageArticle[];
  raw: RawNewsArticle[];
}

function normalizeForMatch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toTimestamp(value: string): number {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function withinLastDays(isoDate: string, days: number): boolean {
  const publishedAtTs = toTimestamp(isoDate);
  if (!publishedAtTs) return false;
  const nowTs = Date.now();
  const lookbackMs = days * 24 * 60 * 60 * 1000;
  return publishedAtTs >= nowTs - lookbackMs && publishedAtTs <= nowTs;
}

/**
 * Single NewsAPI /everything call — coverage for UI + raw rows for brand-deal extraction.
 */
export async function fetchTalentNewsBundle(personName: string, apiKey: string | undefined): Promise<TalentNewsBundle> {
  const key = apiKey?.trim();
  if (!key || !personName.trim()) return { coverage: [], raw: [] };

  try {
    const q = personName.trim();
    const params = new URLSearchParams({
      q,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: '25',
      apiKey: key,
    });
    if (import.meta.env.DEV) {
      console.info('[WhoIsThis] Fetching NewsAPI /everything for:', q);
    }
    const res = await fetch(`${newsBase()}/everything?${params.toString()}`);
    if (!res.ok) return { coverage: [], raw: [] };
    const data = (await res.json()) as NewsEverythingResponse;
    if (data.status !== 'ok' || !data.articles?.length) return { coverage: [], raw: [] };

    const normalizedQuery = normalizeForMatch(q);
    const matched: Array<{
      raw: RawNewsArticle;
      coverage: CoverageArticle;
      score: number;
      sourceQuality: number;
      publishedAtTs: number;
    }> = [];

    for (const a of data.articles) {
      const url = a.url?.trim();
      if (!url || !/^https?:\/\//i.test(url)) continue;
      const titleRaw = a.title?.trim() || '';
      const description = (a.description ?? '').replace(/<[^>]+>/g, '').trim();
      const normalizedCombined = normalizeForMatch(`${titleRaw} ${description}`);
      if (!normalizedCombined.includes(normalizedQuery)) continue;
      const publishedAt = a.publishedAt?.trim() || new Date().toISOString();
      if (!withinLastDays(publishedAt, 30)) continue;
      const source = a.source?.name?.trim() || 'News';
      const title = titleRaw.replace(/\s*[-–—]\s*[^-]+$/i, '').trim() || 'Article';
      const normalizedTitle = normalizeForMatch(titleRaw);
      const normalizedDescription = normalizeForMatch(description);
      const score = normalizedTitle.includes(normalizedQuery) ? 3 : normalizedDescription.includes(normalizedQuery) ? 2 : 1;
      const sourceQuality = SOURCE_QUALITY[source] ?? 1;
      matched.push({
        raw: { title: titleRaw, description, url, publishedAt, source },
        coverage: { title, source, publishedAt, url },
        score,
        sourceQuality,
        publishedAtTs: toTimestamp(publishedAt),
      });
    }

    matched.sort((a, b) => b.publishedAtTs - a.publishedAtTs || b.score - a.score || b.sourceQuality - a.sourceQuality);

    return {
      raw: matched.map((entry) => entry.raw),
      coverage: matched.map((entry) => entry.coverage),
    };
  } catch {
    return { coverage: [], raw: [] };
  }
}
