import type { CuratedTalentProfile } from '../pulse/types';
import { TALENT_POOL_ACTORS } from './talentPoolActors';
import { TALENT_POOL_MUSIC } from './talentPoolMusic';
import { TALENT_POOL_INFLUENCERS } from './talentPoolInfluencers';

/**
 * Curated seed roster: high-visibility names PR/brand teams track.
 * Split by segment in dedicated pool files — replace with live data later.
 */
export const CURATED_TALENT_POOL: CuratedTalentProfile[] = [
  ...TALENT_POOL_ACTORS,
  ...TALENT_POOL_MUSIC,
  ...TALENT_POOL_INFLUENCERS,
];
