import type { BrandOpportunity, CulturalEvent, TalentProfile } from '../types';

export function eventMatchesQuery(e: CulturalEvent, q: string): boolean {
  if (!q) return true;
  const blob = `${e.name} ${e.description} ${e.whyItMatters} ${e.location} ${e.tags.join(' ')} ${e.category} ${e.audiences.join(' ')}`.toLowerCase();
  return blob.includes(q);
}

export function talentMatchesQuery(t: TalentProfile, q: string): boolean {
  if (!q) return true;
  const blob = `${t.name} ${t.category} ${t.audience} ${t.recentProjects} ${t.brandFit} ${t.culturalRelevance}`.toLowerCase();
  return blob.includes(q);
}

export function opportunityMatchesQuery(o: BrandOpportunity, q: string): boolean {
  if (!q) return true;
  const blob = `${o.title} ${o.summary} ${o.angle}`.toLowerCase();
  return blob.includes(q);
}
