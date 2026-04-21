import type { EventItem, OpportunityItem, Specialty, TalentItem } from './types';
import { CALENDAR_SEED_EVENTS } from '../calendar/seedEvents';

/** Calendar tab filter pills — unified intelligence categories. */
export const CATEGORY_PILLS = [
  'All',
  'Live Events',
  'Movie Premieres',
  'TV Premieres',
  'Festivals',
  'Awards',
  'Sports',
  'Fashion',
  'Cultural Moments',
] as const;
export const SPECIALTY_FILTERS = [
  'All',
  'Beauty',
  'Fashion',
  'Sports',
  'Food & Beverage',
  'Music',
  'Entertainment',
  'Wellness',
  'Lifestyle',
] as const;

/** Legacy export — full pipeline lives in `calendar/seedEvents` (API layers merge in Calendar tab). */
export const EVENTS: EventItem[] = CALENDAR_SEED_EVENTS;

const establishedNames = [
  'Zendaya',
  'Sabrina Carpenter',
  'Caitlin Clark',
  'Bad Bunny',
  'Timothee Chalamet',
  'Olivia Rodrigo',
  'LeBron James',
  'Taylor Swift',
  'Hailey Bieber',
  'Addison Rae',
  'Charli D Amelio',
  'Kylie Jenner',
  'Dua Lipa',
  'Harry Styles',
  'Selena Gomez',
  'Serena Williams',
  'Lionel Messi',
  'Ariana Grande',
  'The Rock',
  'Emma Chamberlain',
] as const;

const emergingNames = [
  'Chappell Roan',
  'Tyla',
  'Paul Mescal',
  'Ice Spice',
  'Doechii',
  'Leon Thomas',
  'Dylan Mulvaney',
  'Raye',
  'Charli xcx',
  'Barry Keoghan',
  'Gracie Abrams',
  'Central Cee',
  'Sabrina Bahsoon',
  'Nara Smith',
  'Drew Starkey',
  'Latto',
] as const;

const specialtyCycle: Specialty[] = [
  'Beauty',
  'Fashion',
  'Sports',
  'Food & Beverage',
  'Music',
  'Entertainment',
  'Wellness',
  'Lifestyle',
];

function specialtyFor(index: number): Specialty[] {
  return [specialtyCycle[index % specialtyCycle.length], specialtyCycle[(index + 3) % specialtyCycle.length]];
}

const emojis = ['⭐', '🎤', '🏀', '🎬', '🔥', '🎧', '📈', '✨', '🌟', '💫'];

export const TALENT: TalentItem[] = [
  ...establishedNames.map((name, i) => ({
    id: `est-${i}`,
    name,
    emoji: emojis[i % emojis.length],
    type: 'Established',
    specialty: specialtyFor(i),
    audience: `${18 + (i % 8)}M cross-platform`,
    brandFit: `${name} aligns with premium storytelling, high engagement moments, and broad press pickup.`,
    matchScore: 68 + (i % 28),
    tier: 'Established' as const,
    growth: 50 + (i % 30),
  })),
  ...emergingNames.map((name, i) => ({
    id: `emg-${i}`,
    name,
    emoji: emojis[(i + 2) % emojis.length],
    type: 'Emerging',
    specialty: specialtyFor(i + 2),
    audience: `${2 + (i % 7)}M and climbing`,
    brandFit: `${name} offers early-stage partnership upside with strong community trust and culture fit.`,
    matchScore: 62 + (i % 35),
    tier: 'Emerging' as const,
    whyTrending: 'Recent breakout moment sparked creator remixes and editorial mentions.',
    growth: 58 + (i % 35),
  })),
];

export const OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'opp-1',
    title: 'Coachella creator seeding',
    relatedEventId: 'coachella',
    description: 'Deploy hydration + beauty kits to micro and mid-tier creators on-site.',
    actions: ['Creator gifting', 'UGC amplification', 'Desert-proof product demos'],
  },
  {
    id: 'opp-2',
    title: 'Met Gala adjacent social studio',
    relatedEventId: 'met-gala',
    description: 'Own pre-red-carpet prep storytelling with stylists and glam teams.',
    actions: ['Stylist partnerships', 'Live social desk', 'Afterparty recap content'],
  },
  {
    id: 'opp-3',
    title: 'Pre-Cannes luxury storytelling',
    relatedEventId: 'cannes-film',
    description: 'Build premium narrative playbook before Cannes press windows open.',
    actions: ['Editorial roundtables', 'Talent fittings', 'Executive thought-leadership'],
  },
  {
    id: 'opp-4',
    title: 'NYFW planning sprint',
    relatedEventId: 'nyfw',
    description: 'Map designer, influencer, and media touchpoints for September runway cycle.',
    actions: ['Invite strategy', 'Backstage integration', 'Street-style capture'],
  },
  {
    id: 'opp-5',
    title: 'NBA athlete content lane',
    relatedEventId: 'nba-finals',
    description: 'Build athlete-led quick-turn content around finals narratives.',
    actions: ['Tunnel fit coverage', 'Game-day stories', 'Community court activation'],
  },
  {
    id: 'opp-6',
    title: 'Pride month creator partnerships',
    relatedEventId: 'pride-month',
    description: 'Partner with LGBTQ+ creators with authentic, community-first programming.',
    actions: ['Creator grants', 'Community events', 'Inclusive story series'],
  },
  {
    id: 'opp-7',
    title: 'Wimbledon prestige hospitality',
    relatedEventId: 'wimbledon',
    description: 'Own a premium hosting lane for clients, creators, and media.',
    actions: ['Court-side hosting', 'Elegance-themed content', 'Press gifting'],
  },
  {
    id: 'opp-8',
    title: 'Internet micro-trend seeding',
    relatedEventId: 'internet-micro-trends',
    description: 'Capitalize on aesthetic trends with lightweight creator test cohorts.',
    actions: ['Micro creator briefs', 'Rapid testing', 'Weekly trend dashboards'],
  },
  {
    id: 'opp-9',
    title: 'Spring beauty push',
    relatedEventId: 'spring-beauty',
    description: 'Align skin reset messaging with spring routines and expert voices.',
    actions: ['Expert reels', 'Before/after format', 'Retail partner storytelling'],
  },
];
