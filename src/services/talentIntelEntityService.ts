import type { KgEntitySnapshot } from '../talentIntel/types';

type KgApiResult = {
  itemListElement?: Array<{
    result?: {
      name?: string;
      description?: string;
      '@type'?: string | string[];
      detailedDescription?: { articleBody?: string; url?: string };
      url?: string;
      sameAs?: string | string[];
    };
  }>;
};

/**
 * Google Knowledge Graph Search API — Person entities.
 * Uses dev proxy `/kg-api` → `kgsearch.googleapis.com/v1` (enable API + key in Google Cloud).
 */
export async function lookupKnowledgeGraphPerson(
  query: string,
  apiKey: string | undefined,
): Promise<KgEntitySnapshot | null> {
  const key = apiKey?.trim();
  if (!key || !query.trim()) return null;

  try {
    const base = '/kg-api/entities%3Asearch';
    const params = new URLSearchParams({
      query: query.trim(),
      limit: '5',
      types: 'Person',
      key,
    });
    const res = await fetch(`${base}?${params.toString()}`);
    if (!res.ok) return null;
    const data = (await res.json()) as KgApiResult;
    const first = data.itemListElement?.[0]?.result;
    if (!first?.name) return null;

    const types = Array.isArray(first['@type']) ? first['@type'] : first['@type'] ? [first['@type']] : ['Person'];
    const sameAsRaw = first.sameAs;
    const sameAs = Array.isArray(sameAsRaw) ? sameAsRaw : sameAsRaw ? [sameAsRaw] : [];

    return {
      name: first.name,
      description: first.description,
      detailedBody: first.detailedDescription?.articleBody,
      types,
      wikipediaUrl: first.detailedDescription?.url ?? first.url,
      sameAs,
    };
  } catch {
    return null;
  }
}
