import { INFLUENCER_DATASET } from './pulse/influencerDataset';
import type { InfluencerProfile, Specialty, TalentMatchInput, TalentMatchReport, TalentMatchRow } from './pulse/types';

function collapse(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

const USER_BLOB = (input: TalentMatchInput): string =>
  `${input.brandName} ${input.category} ${input.audience} ${input.productOrLaunch} ${input.campaignGoal}`.toLowerCase();

/** Map free-text category to specialties for overlap scoring. */
function categoryToSpecialties(text: string): Specialty[] {
  const t = text.toLowerCase();
  const out = new Set<Specialty>();
  const add = (s: Specialty) => out.add(s);
  if (/(beauty|makeup|skincare|cosmetic|fragrance|spf|serum)/.test(t)) add('Beauty');
  if (/(fashion|apparel|streetwear|runway|luxury|style|sneaker)/.test(t)) add('Fashion');
  if (/(sport|athlete|fitness|nba|stadium|workout)/.test(t)) add('Sports');
  if (/(food|beverage|drink|snack|culinary|restaurant|grocery)/.test(t)) add('Food & Beverage');
  if (/(music|festival|entertainment|film|tv|celebrity)/.test(t)) add('Entertainment');
  if (/(music|concert|artist)/.test(t)) add('Music');
  if (/(wellness|sleep|recovery|supplement|mental health)/.test(t)) add('Wellness');
  if (out.size === 0) add('Lifestyle');
  return [...out];
}

function audienceOverlapScore(userAudience: string, inf: InfluencerProfile): number {
  const ua = userAudience.toLowerCase();
  let score = 0;
  for (const tag of inf.audienceTags) {
    const key = tag.toLowerCase();
    if (ua.includes(key) || key.split(/\s+/).every((w) => w.length > 2 && ua.includes(w))) score += 12;
  }
  const buckets = [
    { re: /gen\s*z|gen-z/i, keys: ['gen z'] },
    { re: /millennial/i, keys: ['millennial'] },
    { re: /affluent|luxury|premium/i, keys: ['affluent', 'luxury'] },
    { re: /latinx|latina|latino|hispanic/i, keys: ['latinx', 'latina'] },
    { re: /men|menswear|male/i, keys: ['menswear', 'gen z men'] },
    { re: /women|female/i, keys: ['women'] },
    { re: /europe|eu\b|uk\b|asia|apac|mena|latam|us\b/i, keys: ['europe', 'uk', 'asia', 'us', 'global', 'mena', 'latam'] },
  ];
  for (const b of buckets) {
    if (b.re.test(ua)) {
      for (const k of b.keys) {
        if (inf.audienceTags.some((t) => t.toLowerCase().includes(k))) score += 8;
      }
    }
  }
  return score;
}

function traitAndGoalScore(blob: string, inf: InfluencerProfile, goal: string, product: string): number {
  let score = 0;
  const g = goal.toLowerCase();
  const p = product.toLowerCase();
  const combined = `${g} ${p} ${blob}`;

  for (const trait of inf.traits) {
    const tr = trait.toLowerCase();
    if (combined.includes(tr)) score += 10;
  }

  const pairs: Array<{ re: RegExp; boostTraits: string[] }> = [
    { re: /grwm|get ready|morning routine|prep/i, boostTraits: ['grwm', 'get-ready'] },
    { re: /review|test|honest|first impression|wear test/i, boostTraits: ['product testing', 'stress tests', 'field tests'] },
    { re: /awareness|buzz|reach|visibility/i, boostTraits: ['reactive social', 'event coverage', 'interviews'] },
    { re: /partnership|collab|co-create|sponsor/i, boostTraits: ['brand collaborations', 'sponsor integrations', 'brand partnerships'] },
    { re: /launch|drop|debut|new product/i, boostTraits: ['limited drops', 'sponsored series', 'tutorials'] },
    { re: /retail|store|shelf|omnichannel/i, boostTraits: ['retail tie-ins', 'retail storytelling', 'travel retail'] },
    { re: /tiktok/i, boostTraits: [] },
  ];

  for (const { re, boostTraits } of pairs) {
    if (re.test(combined)) {
      score += 8;
      for (const bt of boostTraits) {
        if (inf.traits.some((t) => t.toLowerCase().includes(bt))) score += 6;
      }
    }
  }

  for (const plat of inf.platforms) {
    if (combined.includes(plat.toLowerCase())) score += 7;
  }

  return score;
}

function categoryAlignmentScore(userCategory: string, inf: InfluencerProfile): number {
  const inferred = categoryToSpecialties(userCategory);
  let score = 0;
  for (const spec of inferred) {
    if (inf.categories.includes(spec)) score += 28;
  }
  const catLower = userCategory.toLowerCase();
  for (const c of inf.categories) {
    if (catLower.includes(c.toLowerCase())) score += 18;
  }
  return score;
}

function buildWhyFit(inf: InfluencerProfile, input: TalentMatchInput, score: number): string {
  const brand = collapse(input.brandName);
  const product = collapse(input.productOrLaunch);
  const aud = collapse(input.audience);
  const goal = collapse(input.campaignGoal);
  const traitPick = inf.traits.slice(0, 2).join(' and ');
  const plat = inf.platforms.slice(0, 2).join(' and ');

  const strength =
    score >= 85 ? 'a primary-tier' : score >= 65 ? 'a strong' : 'a credible';

  return `${inf.name} is ${strength} match for ${brand}’s ${collapse(input.category)} push: ${inf.shortDescription} Their audience skew (${inf.audienceTags.slice(0, 3).join(', ')}) overlaps how ${aud} evaluates ${product}, and their proof mechanics—${traitPick}—map directly to “${goal}.” Distribution on ${plat} is where this partnership would compound fastest for earned + owned.`;
}

function buildActivation(inf: InfluencerProfile, input: TalentMatchInput): string {
  const brand = collapse(input.brandName);
  const product = collapse(input.productOrLaunch);
  const g = input.campaignGoal.toLowerCase();
  const primary = inf.platforms[0] ?? 'Instagram';

  if (/(partnership|collab|co-brand|sponsor)/.test(g)) {
    return `Structure a 4-week co-authored arc with ${inf.name}: Week 1—${inf.traits[0] ?? 'proof-led'} hook featuring ${product}; Week 2—behind-the-scenes or expert layer (press-ready quotes); Week 3—community participation (challenge or duet/stitch format on ${primary}); Week 4—retail or CTA beat with ${brand}-owned landing. Package B-roll and stills for trade and consumer pitching.`;
  }
  if (/(awareness|buzz|reach|visibility)/.test(g)) {
    return `Lead with velocity on ${primary}: a three-part “credibility ladder” for ${product}—fast proof, cultural context, then a shareable finale (before/after, styling payoff, or challenge). Bookend with one earned-media asset (quote + imagery) ${inf.name} can stand behind so editors can lift it cleanly.`;
  }
  if (/(convert|sales|performance|roi|acquisition|purchase)/.test(g)) {
    return `Pair ${inf.name} with a performance spine: creator-exclusive offer or bundled trial of ${product}, UTM-tagged links, and a live or short-window shopping moment on ${primary}. Add one long-form proof asset (${inf.traits.includes('product testing') ? 'honest wear test' : 'tutorial'}) to de-risk consideration before the CTA.`;
  }
  if (/(launch|introduce|debut|drop)/.test(g)) {
    return `Treat ${product} as a narrative drop: teaser → full reveal → “how I’d use this IRL” chapter with ${inf.name}, optimized for ${primary}. Capture vertical-first cutdowns plus a horizontal hero for site and PR. Time embargoed press assets the day after creator publish for second-wave coverage.`;
  }
  return `Anchor ${brand} x ${inf.name} on ${primary} with a repeatable format (${inf.traits[0] ?? 'story-led'} episodes) that ladders ${product} to ${collapse(input.campaignGoal)}. Add one press-facing proof point (data, expert, or visual) so the story travels beyond the feed.`;
}

/**
 * Rule-based talent matching: no external APIs.
 * Returns top 3–5 ranked influencer recommendations.
 */
export function matchTalentForLaunch(input: TalentMatchInput): TalentMatchReport {
  const brand = collapse(input.brandName);
  const category = collapse(input.category);
  const audience = collapse(input.audience);
  const product = collapse(input.productOrLaunch);
  const goal = collapse(input.campaignGoal);
  const blob = USER_BLOB(input);

  const scored = INFLUENCER_DATASET.map((inf) => {
    const s =
      categoryAlignmentScore(input.category, inf) +
      audienceOverlapScore(input.audience, inf) +
      traitAndGoalScore(blob, inf, input.campaignGoal, input.productOrLaunch);
    return { inf, score: s };
  }).sort((a, b) => b.score - a.score);

  const limit = Math.min(5, Math.max(3, Math.min(5, scored.length)));
  const selected = scored.slice(0, limit);
  const maxScore = Math.max(1, selected[0]?.score ?? 1);

  const matches: TalentMatchRow[] = selected.map(({ inf, score }) => ({
    name: inf.name,
    description: inf.shortDescription,
    whyFit: buildWhyFit(inf, input, score),
    activationIdea: buildActivation(inf, input),
    matchScore: Math.min(99, Math.round(72 + (score / maxScore) * 26)),
  }));

  const headline = `Talent recommendation: ${brand} × ${product}`;
  const executiveSummary = `Based on ${category} positioning, ${audience} targeting, and the stated goal—“${goal}”—these creators offer the cleanest overlap between category credibility, audience language, and activation mechanics. Rankings reflect specialty fit, audience proximity, and trait alignment (e.g. GRWM, testing, event coverage) against your brief—not generic popularity.`;

  const briefContext = `Brief on file: ${brand} · ${category} · ${audience} · ${product} · ${goal}. Matches below are ordered strongest first; use the activation line as a starting PO for talent management and comms.`;

  return {
    headline,
    executiveSummary,
    briefContext,
    matches,
  };
}
