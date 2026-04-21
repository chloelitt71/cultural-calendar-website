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
    const res = await fetch(`${newsBase()}/everything?${params.toString()}`);
    if (!res.ok) return { coverage: [], raw: [] };
    const data = (await res.json()) as NewsEverythingResponse;
    if (data.status !== 'ok' || !data.articles?.length) return { coverage: [], raw: [] };

    const raw: RawNewsArticle[] = [];
    const coverage: CoverageArticle[] = [];

    for (const a of data.articles) {
      const url = a.url?.trim();
      if (!url || !/^https?:\/\//i.test(url)) continue;
      const titleRaw = a.title?.trim() || '';
      const description = (a.description ?? '').replace(/<[^>]+>/g, '').trim();
      const publishedAt = a.publishedAt?.trim() || new Date().toISOString();
      const source = a.source?.name?.trim() || 'News';
      raw.push({ title: titleRaw, description, url, publishedAt, source });
      const title = titleRaw.replace(/\s*[-–—]\s*[^-]+$/i, '').trim() || 'Article';
      coverage.push({ title, source, publishedAt, url });
    }
    return { coverage, raw };
  } catch {
    return { coverage: [], raw: [] };
  }
}
