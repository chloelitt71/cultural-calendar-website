import { CURATED_TALENT_POOL } from '../data/talentDiscovery.mock';
import type { CuratedTalentProfile, RankedCuratedTalent, TalentDiscoverySegment, TalentPrFilter } from '../pulse/types';
import { rankCuratedTalent } from './talentDiscoveryRank';
export type { TalentDiscoverySegment } from '../pulse/types';

/** Curated pool + ranked shortlist — swap `CURATED_TALENT_POOL` for API merge later. */
export function getCuratedTalentPool(): CuratedTalentProfile[] {
  return CURATED_TALENT_POOL;
}

export function getRankedDiscoveryTalent(
  segment: TalentDiscoverySegment,
  filter: TalentPrFilter,
  query: string,
): RankedCuratedTalent[] {
  return rankCuratedTalent(CURATED_TALENT_POOL, segment, filter, query);
}

/** Home hero / legacy call sites: top N by segment using “most relevant” model. */
export function getTalentBySegment(segment: TalentDiscoverySegment, n = 50): RankedCuratedTalent[] {
  return getRankedDiscoveryTalent(segment, 'most-relevant', '').slice(0, n);
}
