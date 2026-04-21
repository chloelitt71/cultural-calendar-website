import type { CulturalMoment } from '../pulse/types';

/**
 * Mock cultural & social signals — swap for social listening / trend APIs later.
 * Focus: discourse, momentum, viral conversation — not generic marketing trade pieces.
 */
export const MOCK_MOMENTS: CulturalMoment[] = [
  {
    id: 'mom-1',
    headline: 'Creator breakup discourse spills into brand comment sections',
    description:
      'A mid-tier lifestyle duo’s public split is driving quote-posts and stitch videos across TikTok and X, with fans dissecting sponsorship history.',
    source: 'Social listening · aggregated',
    url: 'https://example.com/moments/mom-1',
    category: 'Drama',
    whyForBrands:
      'Partnership vetting and comment moderation matter this week; avoid reactive posts that look opportunistic unless brand values clearly align.',
    signalStrength: 88,
    observedAt: '2026-04-18T14:00:00Z',
  },
  {
    id: 'mom-2',
    headline: '“Clean girl” fatigue → “undone polish” aesthetic climbing fast',
    description:
      'Hair, nails, and outfit TikToks tagged #undonepolish are up week-over-week; creators pivoting from ultra-minimal glam to intentional imperfection.',
    source: 'Trend radar · mock',
    url: 'https://example.com/moments/mom-2',
    category: 'Trend',
    whyForBrands:
      'Beauty and fashion can refresh campaign visuals and talent briefs—authentic “finished but human” beats sterile minimalism for spring shoots.',
    signalStrength: 82,
    observedAt: '2026-04-17T11:30:00Z',
  },
  {
    id: 'mom-3',
    headline: 'Micro-creator in skincare sees 4× comment velocity after routine reset series',
    description:
      'A formerly mid-reach creator doubled engagement by posting “same shelf, new order” weekly—audiences responding to structure over hauls.',
    source: 'Creator analytics · mock',
    url: 'https://example.com/moments/mom-3',
    category: 'Influencer Momentum',
    whyForBrands:
      'Seeding strategies should prioritize narrative arcs (ritual, not one-off unboxings) when matching skincare and wellness launches.',
    signalStrength: 79,
    observedAt: '2026-04-16T09:00:00Z',
  },
  {
    id: 'mom-4',
    headline: 'Award-season talent’s press tour looks driving secondary search spikes',
    description:
      'Red-carpet and late-night appearances for a streaming drama lead are generating Pinterest and shopping intent for specific designers.',
    source: 'Press + search · mock',
    url: 'https://example.com/moments/mom-4',
    category: 'Celebrity Moment',
    whyForBrands:
      'Short window for earned-style associations—jewelry, tailoring, beauty—if approvals and talent access move within 48–72 hours.',
    signalStrength: 91,
    observedAt: '2026-04-18T20:00:00Z',
  },
  {
    id: 'mom-5',
    headline: 'Platform debate: “authenticity” vs over-edited GRWMs',
    description:
      'Thread-heavy conversation on whether heavily lit get-ready content still converts; audiences favor voiceover honesty in top comments.',
    source: 'X / Threads · mock',
    url: 'https://example.com/moments/mom-5',
    category: 'Internet Conversation',
    whyForBrands:
      'Brief talent on lo-fi B-roll and voice-led hooks for Q2; premium lighting alone is getting skepticism in comments.',
    signalStrength: 76,
    observedAt: '2026-04-15T16:20:00Z',
  },
  {
    id: 'mom-6',
    headline: 'Festival fit-check volume up ahead of desert week',
    description:
      'Early outfit planning content is circulating; hydration and sun-care mentions embedded in “survival kit” posts.',
    source: 'TikTok / IG · mock',
    url: 'https://example.com/moments/mom-6',
    category: 'Trend',
    whyForBrands:
      'Beverage, beauty, and accessories can own “prep week” before on-site activations—think kits, not only stage moments.',
    signalStrength: 85,
    observedAt: '2026-04-14T12:00:00Z',
  },
  {
    id: 'mom-7',
    headline: 'Sports tunnel fits resurfacing as meme template',
    description:
      'Player arrival clips remixed with ironic captions; non-sports brands experimenting with the format for product drops.',
    source: 'Social remix · mock',
    url: 'https://example.com/moments/mom-7',
    category: 'Internet Conversation',
    whyForBrands:
      'Culture-jacking works when the product has a credible “arrival” or reveal beat—avoid forced sports tie-ins.',
    signalStrength: 72,
    observedAt: '2026-04-13T08:45:00Z',
  },
  {
    id: 'mom-8',
    headline: 'Rising DJ added to two major festival lineups same day',
    description:
      'Announcements clustered; fan overlap with fashion and streetwear communities high based on comment graphs.',
    source: 'Festival PR · mock',
    url: 'https://example.com/moments/mom-8',
    category: 'Influencer Momentum',
    whyForBrands:
      'Music + lifestyle partnerships: consider satellite events, afterparties, and creator co-hosts around set times.',
    signalStrength: 80,
    observedAt: '2026-04-17T18:00:00Z',
  },
  {
    id: 'mom-9',
    headline: 'Legacy house creative director exit rumors churn trade and fan accounts',
    description:
      'Unconfirmed leadership chatter moving faster on fan fashion Twitter than traditional outlets; brands staying quiet in replies.',
    source: 'Fashion discourse · mock',
    url: 'https://example.com/moments/mom-9',
    category: 'Drama',
    whyForBrands:
      'Luxury adjacency requires tight corporate comms; influencer posts should avoid speculation unless briefed by client.',
    signalStrength: 86,
    observedAt: '2026-04-18T07:30:00Z',
  },
  {
    id: 'mom-10',
    headline: '“BookTok” crossover pushing one thriller adaptation into mainstream FYP',
    description:
      'Clips from a streaming premiere paired with creator reactions; non-book audiences discovering cast.',
    source: 'TikTok · mock',
    url: 'https://example.com/moments/mom-10',
    category: 'Celebrity Moment',
    whyForBrands:
      'Entertainment tie-ins for CPG and travel can ride cast-driven curiosity—short talent quotes for earned pitches.',
    signalStrength: 77,
    observedAt: '2026-04-16T21:00:00Z',
  },
  {
    id: 'mom-11',
    headline: 'AI voiceover parody trend peaks; brands called out for lazy use',
    description:
      'Creators satirizing generic AI scripts; top comments reward human VO and specific product facts.',
    source: 'TikTok · mock',
    url: 'https://example.com/moments/mom-11',
    category: 'Internet Conversation',
    whyForBrands:
      'Paid social QA: reject template scripts; PR should stress human proof points and talent-led sound.',
    signalStrength: 74,
    observedAt: '2026-04-12T10:00:00Z',
  },
  {
    id: 'mom-12',
    headline: 'Coastal grandmother → “coastal punk” micro-trend in swim',
    description:
      'Niche aesthetic mashup surfacing in small creator clusters; not yet mass—early signal for swim and jewelry.',
    source: 'Trend seed · mock',
    url: 'https://example.com/moments/mom-12',
    category: 'Trend',
    whyForBrands:
      'Niche aesthetics are useful for test-and-learn cohorts before mainstream saturation.',
    signalStrength: 63,
    observedAt: '2026-04-11T14:00:00Z',
  },
];
