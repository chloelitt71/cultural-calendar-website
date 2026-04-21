import type { CulturalEvent, TalentProfile } from '../types';
import { EVENTS, TALENT_ESTABLISHED, TALENT_EMERGING } from '../data/sampleData';

export interface BrandMatchInput {
  brandName: string;
  industry: string;
  audience: string;
  campaign: string;
  goal: string;
}

export interface RankedMoment {
  event: CulturalEvent;
  score: number;
  whyFit: string;
  suggestedAngle: string;
}

export interface TalentMatch {
  talent: TalentProfile;
  whyFit: string;
  suggestedAngle: string;
}

export interface ActivationMatch {
  title: string;
  detail: string;
  suggestedAngle: string;
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter(Boolean);
}

function scoreEvent(e: CulturalEvent, tokens: string[], industry: string): number {
  let score = 0;
  const blob = `${e.name} ${e.description} ${e.whyItMatters} ${e.tags.join(' ')} ${e.category}`.toLowerCase();
  for (const t of tokens) {
    if (t.length < 3) continue;
    if (blob.includes(t)) score += 2;
  }
  const ind = industry.toLowerCase();
  if (ind && blob.includes(ind)) score += 4;
  for (const tag of e.tags) {
    if (ind.includes(tag)) score += 3;
  }
  if (e.status === 'now') score += 1;
  return score;
}

function explainWhy(e: CulturalEvent, industry: string, campaign: string): string {
  const overlap = e.tags.filter((t) => industry.toLowerCase().includes(t)).join(', ');
  const hook = overlap
    ? `Overlap with your stated industry focus (${overlap || 'adjacent sectors'}).`
    : `The moment’s audience and press volume align with "${campaign || 'your launch'}" awareness goals.`;
  return `${e.whyItMatters} ${hook}`;
}

function angleFor(goal: string, e: CulturalEvent): string {
  const g = goal.toLowerCase();
  if (g.includes('partnership')) return `Pursue co-branded touchpoints around ${e.name} — side events often outperform logo placements.`;
  if (g.includes('buzz')) return `Social-first beat coverage: reactive content, talent quotes, and meme-literate threads tied to ${e.name}.`;
  if (g.includes('awareness')) return `Top-funnel storytelling: founder POV, behind-the-scenes, and creator seeding timed to ${e.dateLabel}.`;
  return `Blend experiential and digital: own a clear “chapter” of ${e.name} with a repeatable content format.`;
}

export function generateBrandMatch(input: BrandMatchInput): {
  moments: RankedMoment[];
  talents: TalentMatch[];
  activations: ActivationMatch[];
} {
  const tokens = tokenize(`${input.industry} ${input.campaign} ${input.audience} ${input.goal}`);
  const scored = EVENTS.map((e) => ({
    event: e,
    score: scoreEvent(e, tokens, input.industry),
    whyFit: explainWhy(e, input.industry, input.campaign),
    suggestedAngle: angleFor(input.goal, e),
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const talentPool = [...TALENT_ESTABLISHED, ...TALENT_EMERGING];
  const talents: TalentMatch[] = talentPool
    .map((talent) => {
      const blob = `${talent.brandFit} ${talent.category} ${talent.culturalRelevance}`.toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (t.length >= 3 && blob.includes(t)) score += 2;
      }
      if (input.industry && blob.includes(input.industry.toLowerCase())) score += 5;
      return { talent, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ talent }) => ({
      talent,
      whyFit: `${talent.brandFit} Fits "${input.brandName || 'your brand'}" narrative for ${input.industry || 'your industry'}.`,
      suggestedAngle:
        talent.emerging === true
          ? 'Early partnership: product seeding + educational co-create before fee step-up.'
          : 'Premium integration: red carpet adjacency, limited capsule, or owned interview series.',
    }));

  const activations: ActivationMatch[] = scored.slice(0, 3).map((m) => ({
    title: `${m.event.name} — activation lane`,
    detail: `Where to show up: ${m.event.location} during ${m.event.dateLabel}.`,
    suggestedAngle: m.suggestedAngle,
  }));

  return { moments: scored, talents, activations };
}
