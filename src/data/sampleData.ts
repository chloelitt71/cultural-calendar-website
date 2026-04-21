import type {
  Audience,
  BrandOpportunity,
  CulturalEvent,
  EventCategory,
  IndustryTag,
  Region,
  TalentProfile,
} from '../types';

export const EVENTS: CulturalEvent[] = [
  {
    id: 'coachella',
    name: 'Coachella Valley Music & Arts Festival',
    dateLabel: 'Apr 11–13 & 18–20, 2026',
    dateIso: '2026-04-11',
    location: 'Indio, CA',
    category: 'festival',
    description: 'Two-weekend desert festival blending music, art installs, and creator culture.',
    whyItMatters:
      'High-density tastemaker audience; beauty, fashion, and beverage brands win on experiential seeding and UGC.',
    tags: ['fashion', 'beauty', 'consumer', 'entertainment'],
    status: 'now',
    region: 'north-america',
    audiences: ['gen-z', 'millennials', 'creators', 'affluent'],
    brandIdeas: ['VIP lounge partnerships', 'Creator caravan', 'Heat-proof beauty bar'],
  },
  {
    id: 'met-gala',
    name: 'Met Gala',
    dateLabel: 'May 4, 2026',
    dateIso: '2026-05-04',
    location: 'New York, NY',
    category: 'fashion',
    description: 'Fashion’s biggest red carpet tied to the Costume Institute exhibition theme.',
    whyItMatters:
      'Sets the tone for luxury narratives for the year; timing aligns with couture and jewelery storytelling.',
    tags: ['luxury', 'fashion', 'beauty', 'entertainment'],
    status: 'upcoming',
    region: 'north-america',
    audiences: ['affluent', 'millennials', 'cinephiles'],
    brandIdeas: ['Theme-reactive capsule', 'Stylist co-labs', 'After-party micro-activations'],
  },
  {
    id: 'oscars',
    name: 'Academy Awards',
    dateLabel: 'Mar 15, 2026',
    dateIso: '2026-03-15',
    location: 'Los Angeles, CA',
    category: 'awards',
    description: 'Global spotlight on film, talent, and red-carpet glam.',
    whyItMatters:
      'Prime moment for prestige beauty, spirits, and streaming adjacency — social commentary peaks.',
    tags: ['entertainment', 'luxury', 'beauty', 'consumer'],
    status: 'upcoming',
    region: 'north-america',
    audiences: ['mass', 'millennials', 'affluent'],
    brandIdeas: ['Predictive ballots', 'Talent dressing room integrations'],
  },
  {
    id: 'super-bowl',
    name: 'Super Bowl LX',
    dateLabel: 'Feb 8, 2026',
    dateIso: '2026-02-08',
    location: 'Santa Clara, CA',
    category: 'sports',
    description: 'The largest single-day U.S. media moment — sport, music, and ads collide.',
    whyItMatters:
      'Mass reach + cultural watercooler; CPG, auto, and tech use it to anchor Q1 awareness.',
    tags: ['consumer', 'sports', 'entertainment', 'tech'],
    status: 'upcoming',
    region: 'north-america',
    audiences: ['mass', 'sports-fans', 'millennials'],
    brandIdeas: ['Halftime creator room', 'Regional tailgate series'],
  },
  {
    id: 'cannes-lions',
    name: 'Cannes Lions',
    dateLabel: 'Jun 22–26, 2026',
    dateIso: '2026-06-22',
    location: 'Cannes, France',
    category: 'culture',
    description: 'Global creative industries converge — awards, beach houses, and deal-making.',
    whyItMatters:
      'B2B brand-building for agencies and platforms; thought leadership and partner pipelines.',
    tags: ['tech', 'luxury', 'entertainment', 'consumer'],
    status: 'upcoming',
    region: 'europe',
    audiences: ['affluent', 'millennials', 'creators'],
    brandIdeas: ['Sunrise briefings', 'AI ethics salon', 'Creator economy dock talks'],
  },
  {
    id: 'paris-fw',
    name: 'Paris Fashion Week',
    dateLabel: 'Sep 29 – Oct 7, 2026',
    dateIso: '2026-09-29',
    location: 'Paris, France',
    category: 'fashion',
    description: 'Ready-to-wear shows defining silhouettes, casting, and cultural mood.',
    whyItMatters:
      'Luxury and beauty calendars sync here; street style drives organic reach for accessible brands too.',
    tags: ['fashion', 'luxury', 'beauty'],
    status: 'upcoming',
    region: 'europe',
    audiences: ['affluent', 'gen-z', 'creators'],
    brandIdeas: ['Show note newsletters', 'Casting-first partnerships'],
  },
  {
    id: 'us-open',
    name: 'US Open Tennis',
    dateLabel: 'Aug 31 – Sep 13, 2026',
    dateIso: '2026-08-31',
    location: 'Flushing, NY',
    category: 'sports',
    description: 'Two-week NYC sports and lifestyle moment with global broadcast.',
    whyItMatters:
      'Strong overlap with fashion week tail; athleisure, watches, and spirits perform well courtside.',
    tags: ['sports', 'fashion', 'luxury', 'consumer'],
    status: 'upcoming',
    region: 'north-america',
    audiences: ['affluent', 'sports-fans', 'millennials'],
    brandIdeas: ['Player tunnel content', 'Recovery tech suites'],
  },
  {
    id: 'sxsw',
    name: 'SXSW',
    dateLabel: 'Mar 13–21, 2026',
    dateIso: '2026-03-13',
    location: 'Austin, TX',
    category: 'culture',
    description: 'Music, film, and interactive tracks — launchpad for product drops.',
    whyItMatters:
      'Early adopter crowd for emerging tech and experiential brand narratives.',
    tags: ['tech', 'entertainment', 'consumer'],
    status: 'upcoming',
    region: 'north-america',
    audiences: ['gen-z', 'millennials', 'creators'],
    brandIdeas: ['House takeover', 'AI demo rooms'],
  },
  {
    id: 'grammys',
    name: 'Grammy Awards',
    dateLabel: 'Feb 1, 2026',
    dateIso: '2026-02-01',
    location: 'Los Angeles, CA',
    category: 'awards',
    description: 'Music’s biggest night — performances drive real-time social spikes.',
    whyItMatters:
      'Audio brands, beauty glam, and youth culture moments spike around performance aesthetics.',
    tags: ['entertainment', 'beauty', 'consumer'],
    status: 'upcoming',
    region: 'north-america',
    audiences: ['gen-z', 'millennials', 'mass'],
    brandIdeas: ['Listening parties', 'Mic-drop reactive social'],
  },
  {
    id: 'f1-miami',
    name: 'Formula 1 Miami Grand Prix',
    dateLabel: 'May 3, 2026',
    dateIso: '2026-05-03',
    location: 'Miami, FL',
    category: 'sports',
    description: 'Luxury-forward F1 weekend with hospitality and nightlife adjacency.',
    whyItMatters:
      'High-net-worth and creator attendance; strong for automotive, spirits, and fashion collabs.',
    tags: ['luxury', 'sports', 'consumer', 'tech'],
    status: 'upcoming',
    region: 'north-america',
    audiences: ['affluent', 'creators', 'millennials'],
    brandIdeas: ['Paddock storytelling', 'Night race glam kits'],
  },
  {
    id: 'dune-3',
    name: 'Dune: Part Three — Global Premiere',
    dateLabel: 'Dec 18, 2026',
    dateIso: '2026-12-18',
    location: 'London / Global',
    category: 'entertainment',
    description: 'Sci-fi blockbuster premiere cycle with costume and sound design discourse.',
    whyItMatters:
      'Genre fandom + design-forward aesthetics — opportunity for limited editions and sound partnerships.',
    tags: ['entertainment', 'consumer', 'tech'],
    status: 'upcoming',
    region: 'global',
    audiences: ['cinephiles', 'millennials', 'gen-z'],
    brandIdeas: ['Premiere after-dark', 'Sand-texture beauty capsule'],
  },
  {
    id: 'art-basel-miami',
    name: 'Art Basel Miami Beach',
    dateLabel: 'Dec 4–7, 2026',
    dateIso: '2026-12-04',
    location: 'Miami Beach, FL',
    category: 'culture',
    description: 'Contemporary art fair week with satellite parties and brand houses.',
    whyItMatters:
      'Luxury adjacency and collector networks; experiential budgets concentrate here.',
    tags: ['luxury', 'fashion', 'consumer'],
    status: 'upcoming',
    region: 'north-america',
    audiences: ['affluent', 'creators', 'millennials'],
    brandIdeas: ['Collector breakfast series', 'NFT-meets-IRL lounges'],
  },
  {
    id: 'tiktok-trend',
    name: '“Clean Girl 2.0” Aesthetic Wave',
    dateLabel: 'Trending this week',
    dateIso: '2026-04-12',
    location: 'Global — TikTok / IG',
    category: 'internet',
    description: 'Creator-led minimal glam + wellness cues recombining into a new visual shorthand.',
    whyItMatters:
      'Fast-cycle earned media; beauty and accessories can lead with tutorials, not ads.',
    tags: ['beauty', 'fashion', 'consumer'],
    status: 'now',
    region: 'global',
    audiences: ['gen-z', 'creators'],
    brandIdeas: ['GRWM seeding kits', 'Dermatologist duets'],
  },
  {
    id: 'eurovision',
    name: 'Eurovision Song Contest',
    dateLabel: 'May 16, 2026',
    dateIso: '2026-05-16',
    location: 'Vienna, Austria',
    category: 'entertainment',
    description: 'Camp-forward live TV moment with massive European live threads.',
    whyItMatters:
      'Real-time social commentary — snackable CPG and beauty glam angles.',
    tags: ['entertainment', 'consumer'],
    status: 'upcoming',
    region: 'europe',
    audiences: ['mass', 'gen-z', 'millennials'],
    brandIdeas: ['Live scorecards', 'Camp glam tutorials'],
  },
  {
    id: 'nba-finals',
    name: 'NBA Finals (projected window)',
    dateLabel: 'Jun 2026 (TBD)',
    location: 'United States',
    category: 'sports',
    description: 'Culmination of the NBA season — talent storylines peak.',
    whyItMatters:
      'Athlete endorsements and regional retail activations align with playoff narratives.',
    tags: ['sports', 'consumer', 'fashion'],
    status: 'tbd',
    region: 'north-america',
    audiences: ['sports-fans', 'mass', 'gen-z'],
    brandIdeas: ['Player tunnel fits', 'Post-game recovery pop-ups'],
  },
  {
    id: 'glastonbury',
    name: 'Glastonbury Festival',
    dateLabel: 'Jun 24–28, 2026',
    dateIso: '2026-06-24',
    location: 'Pilton, UK',
    category: 'festival',
    description: 'Legendary UK festival with mud-core fashion and sustainability discourse.',
    whyItMatters:
      'Global music headlines; strong for outdoor, beverage, and circular fashion stories.',
    tags: ['entertainment', 'consumer', 'fashion'],
    status: 'upcoming',
    region: 'europe',
    audiences: ['millennials', 'gen-z', 'creators'],
    brandIdeas: ['Rain-ready kits', 'Refill stations'],
  },
  {
    id: 'cannes-film',
    name: 'Cannes Film Festival',
    dateLabel: 'May 12–23, 2026',
    dateIso: '2026-05-12',
    location: 'Cannes, France',
    category: 'entertainment',
    description: 'Prestige film market with yacht-side brand storytelling.',
    whyItMatters:
      'Luxury jewelry and spirits dominate; streamers compete for talent-driven buzz.',
    tags: ['luxury', 'entertainment', 'beauty'],
    status: 'upcoming',
    region: 'europe',
    audiences: ['affluent', 'cinephiles'],
    brandIdeas: ['Croisette sunrise screenings', 'Jewelry loan tracker'],
  },
  {
    id: 'olympics',
    name: 'Milano Cortina 2026 — Winter Olympics',
    dateLabel: 'Feb 6–22, 2026',
    dateIso: '2026-02-06',
    location: 'Italy',
    category: 'sports',
    description: 'Winter sports pinnacle with national pride cycles.',
    whyItMatters:
      'Global sponsorship architecture; athlete stories for Q1-Q2 always-on PR.',
    tags: ['sports', 'consumer', 'luxury'],
    status: 'upcoming',
    region: 'global',
    audiences: ['mass', 'sports-fans', 'millennials'],
    brandIdeas: ['Train-like-athlete challenges', 'Cold-climate skincare'],
  },
  {
    id: 'prime-day',
    name: 'Amazon Prime Day (rumored)',
    dateLabel: 'Jul 2026 (TBD)',
    location: 'Global — e-comm',
    category: 'culture',
    description: 'Retail tentpole shaping deal narratives and creator hauls.',
    whyItMatters:
      'DTC brands need counter-programming and earned reviews, not only discounts.',
    tags: ['consumer', 'tech'],
    status: 'tbd',
    region: 'global',
    audiences: ['mass', 'millennials'],
    brandIdeas: ['Honest hauls', 'Editor picks vs algorithm'],
  },
];

export const TALENT_ESTABLISHED: TalentProfile[] = [
  {
    id: 't1',
    name: 'Ayo Edebiri',
    category: 'Actor / Writer',
    audience: 'Culture-forward millennials + Gen Z',
    recentProjects: 'The Bear (S4), upcoming studio comedy slate',
    brandFit: 'Smart, comedic authenticity — strong for food, fashion collabs with wit.',
    culturalRelevance: 'Red carpet risk-taking; voice-of-a-generation interviews.',
  },
  {
    id: 't2',
    name: 'Victor Wembanyama',
    category: 'Athlete — NBA',
    audience: 'Global sports fans, sneaker culture, design nerds',
    recentProjects: 'All-Star weekend presence, sci-fi adjacent personal brand',
    brandFit: 'Scale + futurism — tech, automotive, luxury watches.',
    culturalRelevance: '“Alien” narrative drives visual storytelling opportunities.',
  },
  {
    id: 't3',
    name: 'Zendaya',
    category: 'Actor / Fashion muse',
    audience: 'Broad premium + Gen Z',
    recentProjects: 'Dune press cycle, Louis Vuitton house moments',
    brandFit: 'High fashion + accessible beauty bridges.',
    culturalRelevance: 'Premiere looks set search spikes for weeks.',
  },
];

export const TALENT_EMERGING: TalentProfile[] = [
  {
    id: 'e1',
    name: 'Maya Lin (creator alias)',
    category: 'Rising creator — beauty science',
    audience: 'Skincare obsessives, derms-adjacent TikTok',
    recentProjects: '10-part “lab notes” series on barrier repair',
    brandFit: 'Clinical-credible tone for derm brands without feeling pharma.',
    culturalRelevance: 'Explaining ingredients without fear-mongering.',
    emerging: true,
    trendingWhy: 'Clips repurposed into IG carousels by major editors.',
    momentum: '+340% saves WoW (simulated signal)',
    actEarly: 'Lock educational partnerships before Q3 review season.',
  },
  {
    id: 'e2',
    name: 'Jordan Reyes',
    category: 'Breakout TV — streaming drama',
    audience: 'Global drama fans 18–34',
    recentProjects: 'Lead in Neon Tides (S1 cliffhanger)',
    brandFit: 'Moody premium — fragrance, sound, automotive night drives.',
    culturalRelevance: 'Fan-cam editing style crossing into fashion editorials.',
    emerging: true,
    trendingWhy: 'Scene-stealing monologue clipped across platforms.',
    momentum: 'Casting inquiries up (simulated)',
    actEarly: 'Event seating + styling loans while fees are approachable.',
  },
  {
    id: 'e3',
    name: 'Theo & Sam (duo)',
    category: 'Viral personalities — food + comedy',
    audience: 'Mass, family co-viewing on short video',
    recentProjects: '“Michelin on a budget” street series',
    brandFit: 'CPG tastings, kitchen tools, travel boards.',
    culturalRelevance: 'Repeatable format = consistent integration windows.',
    emerging: true,
    trendingWhy: 'Restaurant waitlists spike after episodes.',
    momentum: 'Regional restaurant collabs queue (simulated)',
    actEarly: 'Own a city chapter before competitors sponsor the arc.',
  },
];

export const OPPORTUNITIES: BrandOpportunity[] = [
  {
    id: 'o1',
    title: 'Coachella creator caravan',
    type: 'event',
    timing: 'happening-now',
    summary: 'Desert heat + long days = hero moment for durable beauty and hydration.',
    angle: 'Seed heat-proof kits to mid-tier creators; track UGC by stage.',
    relatedEventId: 'coachella',
  },
  {
    id: 'o2',
    title: 'Oscars glam squad integrations',
    type: 'creator',
    timing: 'plan-now',
    summary: 'Book glam teams and stylists now for social-first “getting ready” arcs.',
    angle: 'Co-create timelapse content rights in contracts.',
    relatedEventId: 'oscars',
  },
  {
    id: 'o3',
    title: 'Eurovision live thread desk',
    type: 'moment',
    timing: 'act-soon',
    summary: 'Assign a junior to own meme literacy for real-time brand commentary.',
    angle: 'Pre-brief legal on humor guardrails; use quote-tweets, not hard sells.',
    relatedEventId: 'eurovision',
  },
  {
    id: 'o4',
    title: 'F1 Miami hospitality storytelling',
    type: 'sponsor',
    timing: 'plan-now',
    summary: 'Paddock passes scarce — build narrative without ticket dependency.',
    angle: 'City-wide satellite events tied to race weekend energy.',
    relatedEventId: 'f1-miami',
  },
];

export function eventById(id: string): CulturalEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}

export function filterByCategory(events: CulturalEvent[], cat: EventCategory): CulturalEvent[] {
  return events.filter((e) => e.category === cat);
}

export function filterByIndustry(events: CulturalEvent[], tag: IndustryTag): CulturalEvent[] {
  return events.filter((e) => e.tags.includes(tag));
}

const categoryMap: Record<string, EventCategory | 'all'> = {
  sports: 'sports',
  entertainment: 'entertainment',
  fashion: 'fashion',
  internet: 'internet',
  awards: 'awards',
  festivals: 'festival',
};

export function eventsForView(view: string): CulturalEvent[] {
  const cat = categoryMap[view];
  if (!cat || cat === 'all') return EVENTS;
  return filterByCategory(EVENTS, cat);
}

export function matchesRegion(event: CulturalEvent, region: Region | 'all'): boolean {
  if (region === 'all') return true;
  return event.region === region || event.region === 'global';
}

export function matchesIndustryFilter(event: CulturalEvent, tag: IndustryTag | 'all'): boolean {
  if (tag === 'all') return true;
  return event.tags.includes(tag);
}

export function matchesAudienceFilter(event: CulturalEvent, aud: Audience | 'all'): boolean {
  if (aud === 'all') return true;
  return event.audiences.includes(aud);
}
