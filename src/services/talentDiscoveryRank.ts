import type {
  CuratedTalentProfile,
  RankedCuratedTalent,
  TalentDiscoverySegment,
  TalentIndustryFit,
  TalentPrFilter,
} from '../pulse/types';

/**
 * Segment weights tuned for a "right now" shortlist (not raw popularity):
 * ↑ timing urgency, momentum, press | ↓ static audience-size proxy.
 */
const WEIGHTS: Record<TalentDiscoverySegment, { mo: number; pr: number; bf: number; au: number; ti: number }> = {
  actors: { mo: 0.24, pr: 0.26, bf: 0.17, au: 0.08, ti: 0.25 },
  music: { mo: 0.34, pr: 0.17, bf: 0.15, au: 0.07, ti: 0.27 },
  influencers: { mo: 0.34, pr: 0.15, bf: 0.2, au: 0.09, ti: 0.22 },
};

const INDUSTRY_FILTER_BONUS = 10;
const RISING_BONUS = 8;

/** Blend: weighted composite vs. equal-weight “right now” triad (timing / momentum / press). */
const BASE_BLEND = 0.62;
const NOW_TRIAD_BLEND = 0.32;
/** Max additive “calendar & conversation density” points (knowable windows in roster data). */
const CALENDAR_BONUS_CAP = 8;

function baseComposite(p: CuratedTalentProfile, segment: TalentDiscoverySegment): number {
  const w = WEIGHTS[segment];
  return (
    p.momentumScore * w.mo +
    p.pressVisibilityScore * w.pr +
    p.brandFitScore * w.bf +
    p.audienceRelevanceScore * w.au +
    p.timingUrgencyScore * w.ti
  );
}

/**
 * Knowable-window density in the roster (hooks, tour/festival, press cycle, platform notes).
 * Capped small so it nudges order without collapsing the scale to 100.
 */
function calendarAndConversationDensity(p: CuratedTalentProfile, segment: TalentDiscoverySegment): number {
  let b = 0;

  if (p.upcomingHook?.trim()) {
    b += 2;
  }

  if (segment === 'actors') {
    if (p.premiereWindow?.trim() || p.upcomingFilmTv?.trim()) {
      b += 3;
    }
    if (p.awardOrPressCycle?.trim()) {
      b += 2;
    }
  } else if (segment === 'music') {
    if (p.tourFestival?.trim()) {
      b += 4;
    }
    if (p.liveVisibilityNote?.trim()) {
      b += 2;
    }
    if (p.releaseNote?.trim()) {
      b += 2;
    }
  } else {
    if (p.socialTractionNote?.trim()) {
      b += 2;
    }
    if (p.conversationVolumeNote?.trim()) {
      b += 2;
    }
    if (p.partnershipPotentialNote?.trim()) {
      b += 2;
    }
  }

  if (p.risingTalent) {
    b += 2;
  }

  if (p.timingUrgencyScore >= 88 && p.brandFitScore >= 88) {
    b += 2;
  }

  return Math.min(CALENDAR_BONUS_CAP, b);
}

/** Equal-weight average: emphasizes “this week / this cycle” over static mass appeal. */
function nowTriadAverage(p: CuratedTalentProfile): number {
  return (p.timingUrgencyScore + p.momentumScore + p.pressVisibilityScore) / 3;
}

function blendRightNowScore(
  p: CuratedTalentProfile,
  segment: TalentDiscoverySegment,
): number {
  const base = baseComposite(p, segment);
  const now = nowTriadAverage(p);
  const calendar = calendarAndConversationDensity(p, segment);
  return BASE_BLEND * base + NOW_TRIAD_BLEND * now + calendar;
}

/** Tie-break: prefer hotter “this moment” signals when relevance scores match. */
function nowSignalTotal(p: CuratedTalentProfile): number {
  return p.timingUrgencyScore + p.momentumScore + p.pressVisibilityScore;
}

/**
 * “Right now” shortlist ranking: segment-weighted composite blended with timing/momentum/press average,
 * plus small bonuses for knowable calendar fields—tie-breakers favor urgent timing + momentum + press.
 */
export function rankCuratedTalent(
  pool: CuratedTalentProfile[],
  segment: TalentDiscoverySegment,
  filter: TalentPrFilter,
  query: string,
): RankedCuratedTalent[] {
  let rows = pool.filter((p) => p.segment === segment);
  const q = query.trim().toLowerCase();

  if (q) {
    rows = rows.filter((p) => {
      const blob = [
        p.name,
        p.tiktokHandle,
        p.instagramHandle,
        p.category,
        p.subcategory,
        p.audience,
        p.currentRelevanceReason,
        p.upcomingHook,
        p.contentPersonaStyle,
        p.brandFitTag,
        p.bestFor,
        p.activationStyle,
        p.partnershipStrength,
        p.brandUseCase,
        p.industries.join(' '),
        p.upcomingFilmTv,
        p.premiereWindow,
        p.awardOrPressCycle,
        p.tourFestival,
        p.releaseNote,
        p.socialTractionNote,
        p.partnershipPotentialNote,
        p.conversationVolumeNote,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return blob.includes(q);
    });
  }

  if (filter === 'rising') {
    rows = rows.filter((p) => p.risingTalent);
  } else if (filter !== 'most-relevant') {
    const ind = filter as TalentIndustryFit;
    const tagged = rows.filter((p) => p.industries.includes(ind));
    rows = tagged.length > 0 ? tagged : rows;
  }

  const ranked: RankedCuratedTalent[] = rows.map((p) => {
    let score = blendRightNowScore(p, segment);

    if (filter === 'rising' && p.risingTalent) {
      score += RISING_BONUS;
    }
    if (filter !== 'most-relevant' && filter !== 'rising') {
      const ind = filter as TalentIndustryFit;
      if (p.industries.includes(ind)) {
        score += INDUSTRY_FILTER_BONUS;
      }
    }

    return {
      ...p,
      relevanceScore: Math.min(100, Math.round(score)),
    };
  });

  return ranked.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    const tie = nowSignalTotal(b) - nowSignalTotal(a);
    if (tie !== 0) return tie;
    return b.timingUrgencyScore - a.timingUrgencyScore;
  });
}
