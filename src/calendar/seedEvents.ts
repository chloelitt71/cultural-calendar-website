import { buildBrandWhy, defaultTimingPriority } from './brandWhy';
import type { CalendarIntelEvent } from './types';
import type { Region } from '../pulse/types';

function ms(iso?: string): number {
  if (!iso) return Date.now() + 86400000 * 60;
  return new Date(`${iso}T12:00:00Z`).getTime();
}

function e(
  row: Omit<CalendarIntelEvent, 'whyItMattersForBrands' | 'timingPriorityScore'> & {
    whyItMattersForBrands?: string;
    timingPriorityScore?: number;
  },
): CalendarIntelEvent {
  const why = row.whyItMattersForBrands ?? buildBrandWhy(row);
  const score = row.timingPriorityScore ?? defaultTimingPriority({ startMs: ms(row.startDate), category: row.category });
  return { ...row, whyItMattersForBrands: why, timingPriorityScore: score };
}

type Raw = Omit<CalendarIntelEvent, 'whyItMattersForBrands' | 'timingPriorityScore'>;

// —— Domain 1: Live Events (concerts, theater, SXSW-style live culture) ——————————————

const LIVE_EXTRA: Raw[] = [
  { id: 'sxsw', title: 'SXSW', date: 'Mar 6–15, 2026', startDate: '2026-03-06', endDate: '2026-03-15', location: 'Austin, TX', category: 'Live Events', subcategory: 'Film · music · tech', source: 'Curated', region: 'North America', industries: ['Entertainment', 'Music', 'Lifestyle'] },
  { id: 'broadway-week', title: 'Broadway Week (pricing moment)', date: 'Sep 2026', startDate: '2026-09-01', endDate: '2026-09-14', location: 'New York, NY', category: 'Live Events', subcategory: 'Theater / ticketing', source: 'Curated', region: 'North America', industries: ['Entertainment', 'Lifestyle', 'Food & Beverage'] },
  { id: 'west-end-season', title: 'West End new season spotlight', date: 'Oct 2026', startDate: '2026-10-01', endDate: '2026-10-31', location: 'London, UK', category: 'Live Events', subcategory: 'Theater', source: 'Curated', region: 'Europe', industries: ['Entertainment', 'Lifestyle', 'Fashion'] },
];

const liveTours = [
  ['Apr 25, 2026', '2026-04-25', 'Arena pop residency — spring leg', 'Chicago, IL'],
  ['May 10, 2026', '2026-05-10', 'Stadium country tour — two-night stand', 'Nashville, TN'],
  ['Jun 1, 2026', '2026-06-01', 'Global K-pop arena run — US date', 'Los Angeles, CA'],
  ['Jun 18, 2026', '2026-06-18', 'Rock reunion tour — amphitheater', 'Denver, CO'],
  ['Jul 5, 2026', '2026-07-05', 'Latin urban stadium show', 'Miami, FL'],
  ['Jul 22, 2026', '2026-07-22', 'R&B arena tour — premium VIP lane', 'Atlanta, GA'],
  ['Aug 14, 2026', '2026-08-14', 'Electronic NYE-style arena build (summer)', 'Las Vegas, NV'],
  ['Sep 1, 2026', '2026-09-01', 'Comedy stadium special — taping', 'New York, NY'],
] as const;

const LIVE_TOUR_RAWS: Raw[] = liveTours.map(([date, iso, title, loc], i) => ({
  id: `live-tour-${i}`,
  title,
  date,
  startDate: iso,
  endDate: iso,
  location: loc,
  category: 'Live Events' as const,
  subcategory: 'Concert / comedy / residency',
  source: 'Curated',
  region: 'North America' as Region,
}));

const LIVE_EVENTS_RAW: Raw[] = [...LIVE_EXTRA, ...LIVE_TOUR_RAWS];

// —— Domain 2: Movie Premieres (theatrical / festival premieres) —————————————————————

const MOVIE_FEST_RAWS: Raw[] = [
  { id: 'cannes-film', title: 'Cannes Film Festival', date: 'May 12–23, 2026', startDate: '2026-05-12', endDate: '2026-05-23', location: 'Cannes, France', category: 'Movie Premieres', subcategory: 'Festival premieres', source: 'Curated', region: 'Europe', industries: ['Entertainment', 'Fashion', 'Beauty'], description: 'Market debuts and prestige acquisitions.' },
  { id: 'sundance', title: 'Sundance Film Festival', date: 'Jan 22–Feb 1, 2026', startDate: '2026-01-22', endDate: '2026-02-01', location: 'Park City, UT', category: 'Movie Premieres', subcategory: 'Indie premieres', source: 'Curated', region: 'North America', industries: ['Entertainment', 'Lifestyle', 'Fashion'] },
  { id: 'tiff', title: 'Toronto International Film Festival', date: 'Sep 10–19, 2026', startDate: '2026-09-10', endDate: '2026-09-19', location: 'Toronto, ON', category: 'Movie Premieres', subcategory: 'Oscar season launch', source: 'Curated', region: 'North America', industries: ['Entertainment', 'Fashion', 'Beauty'] },
  { id: 'venice-biennale-film', title: 'Venice Film Festival', date: 'Sep 2–12, 2026', startDate: '2026-09-02', endDate: '2026-09-12', location: 'Venice, Italy', category: 'Movie Premieres', subcategory: 'Golden Lion cycle', source: 'Curated', region: 'Europe', industries: ['Entertainment', 'Fashion', 'Lifestyle'] },
];

const movieRows = [
  ['Apr 24, 2026', '2026-04-24', 'Thunderstrike: Bone Orchard — wide release', 'North America'],
  ['May 1, 2026', '2026-05-01', 'Neon Riders (IMAX event)', 'North America'],
  ['May 15, 2026', '2026-05-15', 'The Last Lighthouse — opening weekend', 'North America'],
  ['Jun 12, 2026', '2026-06-12', 'Untitled spy sequel — global day-and-date', 'Global'],
  ['Jul 3, 2026', '2026-07-03', 'Summer franchise tentpole — opening', 'North America'],
  ['Jul 17, 2026', '2026-07-17', 'Streaming window · prestige thriller — platform film', 'Global'],
  ['Aug 7, 2026', '2026-08-07', 'Animation event film — family opening', 'North America'],
  ['Aug 21, 2026', '2026-08-21', 'Horror universe chapter — midnight premieres', 'North America'],
  ['Sep 4, 2026', '2026-09-04', 'Award-centric drama — limited theatrical', 'North America'],
  ['Sep 18, 2026', '2026-09-18', 'Sci-fi epic part II — premium formats', 'Global'],
  ['Oct 9, 2026', '2026-10-09', 'Superhero crossover event — opening frame', 'North America'],
  ['Oct 23, 2026', '2026-10-23', 'Prestige book adaptation — fan premieres', 'Global'],
  ['Nov 6, 2026', '2026-11-06', 'Holiday tentpole kickoff weekend', 'North America'],
  ['Nov 20, 2026', '2026-11-20', 'Animation / musical event — family travel', 'North America'],
  ['Dec 18, 2026', '2026-12-18', 'Christmas corridor blockbuster', 'North America'],
  ['Dec 25, 2026', '2026-12-25', 'Day-of prestige release — awards play', 'North America'],
  ['Jan 15, 2027', '2027-01-15', 'New Year genre film — wide', 'North America'],
] as const;

const MOVIE_WIDE_RAWS: Raw[] = movieRows.map(([date, iso, title, loc], i) => ({
  id: `movie-wide-${i}`,
  title,
  date,
  startDate: iso,
  endDate: iso,
  location: loc,
  category: 'Movie Premieres' as const,
  subcategory: 'Wide / day-and-date',
  source: 'Curated',
  region: (loc === 'Global' ? 'Global' : 'North America') as Region,
}));

const MOVIE_PREMIERES_RAW: Raw[] = [...MOVIE_FEST_RAWS, ...MOVIE_WIDE_RAWS];

// —— Domain 3: TV Premieres ————————————————————————————————————————————————————————

const tvPremieres = [
  ['Apr 20, 2026', '2026-04-20', 'The Lineage — S1 launch (streamer)', 'Streaming'],
  ['Apr 27, 2026', '2026-04-27', 'Harbor Blue — limited series debut', 'HBO'],
  ['May 4, 2026', '2026-05-04', 'Empire of Dust — returning drama S4', 'Cable + SVOD'],
  ['May 18, 2026', '2026-05-18', 'Satellite Kids — anthology premiere', 'Streaming'],
  ['Jun 8, 2026', '2026-06-08', 'Night Courier — sci-fi weekly rollout', 'Streaming'],
  ['Jun 22, 2026', '2026-06-22', 'Boardroom Wives — cultural breakout watch', 'Streaming'],
  ['Jul 6, 2026', '2026-07-06', 'OlympicStories — docuseries drop', 'Broadcast + SVOD'],
  ['Jul 20, 2026', '2026-07-20', 'Quarterlife — Gen Z returning comedy S2', 'Streaming'],
  ['Aug 10, 2026', '2026-08-10', 'Stormglass — prestige miniseries', 'Cable'],
  ['Aug 24, 2026', '2026-08-24', 'Mask & Crown — reality-comp premiere', 'Broadcast'],
  ['Sep 7, 2026', '2026-09-07', 'Sunday prestige block — flagship drama return', 'Cable'],
  ['Sep 21, 2026', '2026-09-21', 'True North — anthology S2 launch', 'Streaming'],
  ['Oct 5, 2026', '2026-10-05', 'Hauntology — horror event series', 'Streaming'],
  ['Oct 19, 2026', '2026-10-19', 'Westbridge — returning procedural S12', 'Network TV'],
  ['Nov 2, 2026', '2026-11-02', 'Gratitude — holiday limited series', 'Streaming'],
  ['Nov 16, 2026', '2026-11-16', 'Cold Open — industry satire premiere', 'Streaming'],
  ['Dec 4, 2026', '2026-12-04', 'Solstice murders — winter mystery event', 'Streaming'],
] as const;

const TV_PREMIERES_RAW: Raw[] = tvPremieres.map(([date, iso, title, net], i) => ({
  id: `tv-prem-${i}`,
  title: `${title}`,
  date,
  startDate: iso,
  endDate: iso,
  location: `${net} · US focus`,
  category: 'TV Premieres' as const,
  subcategory: 'Series / limited',
  source: 'Curated',
  region: 'North America' as Region,
}));

// —— Domain 4: Cultural tentpoles (festivals, awards, sports, fashion, seasonal) ————

const CULTURAL_TENTPOLE_RAW: Raw[] = [
  { id: 'coachella', title: 'Coachella Valley Music & Arts', date: 'Apr 10–19, 2026', startDate: '2026-04-10', endDate: '2026-04-19', location: 'Indio, CA', category: 'Festivals', subcategory: 'Multi-gen festival', source: 'Curated', region: 'North America', industries: ['Music', 'Beauty', 'Lifestyle'] },
  { id: 'lolla-chi', title: 'Lollapalooza Chicago', date: 'Jul 30–Aug 2, 2026', startDate: '2026-07-30', endDate: '2026-08-02', location: 'Chicago, IL', category: 'Festivals', subcategory: 'City festival', source: 'Curated', region: 'North America', industries: ['Music', 'Food & Beverage', 'Lifestyle'] },
  { id: 'bonnaroo', title: 'Bonnaroo', date: 'Jun 11–14, 2026', startDate: '2026-06-11', endDate: '2026-06-14', location: 'Manchester, TN', category: 'Festivals', subcategory: 'Camping festival', source: 'Curated', region: 'North America', industries: ['Music', 'Lifestyle', 'Wellness'] },
  { id: 'gov-ball', title: 'Governors Ball', date: 'Jun 5–7, 2026', startDate: '2026-06-05', endDate: '2026-06-07', location: 'Queens, NY', category: 'Festivals', subcategory: 'Metro festival', source: 'Curated', region: 'North America', industries: ['Music', 'Food & Beverage', 'Entertainment'] },
  { id: 'outside-lands', title: 'Outside Lands', date: 'Aug 7–9, 2026', startDate: '2026-08-07', endDate: '2026-08-09', location: 'San Francisco, CA', category: 'Festivals', subcategory: 'Food & music', source: 'Curated', region: 'North America', industries: ['Music', 'Food & Beverage', 'Lifestyle'] },
  { id: 'acl', title: 'Austin City Limits', date: 'Oct 2–4 & 9–11, 2026', startDate: '2026-10-02', endDate: '2026-10-11', location: 'Austin, TX', category: 'Festivals', subcategory: 'Dual weekend', source: 'Curated', region: 'North America', industries: ['Music', 'Lifestyle', 'Entertainment'] },
  { id: 'edc-vegas', title: 'EDC Las Vegas', date: 'May 16–18, 2026', startDate: '2026-05-16', endDate: '2026-05-18', location: 'Las Vegas, NV', category: 'Festivals', subcategory: 'Electronic', source: 'Curated', region: 'North America', industries: ['Music', 'Lifestyle', 'Entertainment'] },
  { id: 'tomorrowland', title: 'Tomorrowland', date: 'Jul 17–19 & 24–26, 2026', startDate: '2026-07-17', endDate: '2026-07-26', location: 'Boom, Belgium', category: 'Festivals', subcategory: 'Electronic · global', source: 'Curated', region: 'Europe', industries: ['Music', 'Lifestyle', 'Entertainment'] },
  { id: 'glasto', title: 'Glastonbury', date: 'Jun 24–28, 2026', startDate: '2026-06-24', endDate: '2026-06-28', location: 'Somerset, UK', category: 'Festivals', subcategory: 'Legendary UK', source: 'Curated', region: 'Europe', industries: ['Music', 'Entertainment', 'Lifestyle'] },
  { id: 'summerfest', title: 'Summerfest', date: 'Jun 19–Jul 3, 2026', startDate: '2026-06-19', endDate: '2026-07-03', location: 'Milwaukee, WI', category: 'Festivals', subcategory: 'Long-run city', source: 'Curated', region: 'North America', industries: ['Music', 'Food & Beverage', 'Sports'] },
  { id: 'grammys', title: 'Grammy Awards', date: 'Feb 1, 2026', startDate: '2026-02-01', endDate: '2026-02-01', location: 'Los Angeles, CA', category: 'Awards', subcategory: 'Music awards · live ceremony', source: 'Curated', region: 'North America', industries: ['Music', 'Entertainment', 'Beauty'] },
  { id: 'oscars', title: 'Academy Awards', date: 'Mar 15, 2026', startDate: '2026-03-15', endDate: '2026-03-15', location: 'Los Angeles, CA', category: 'Awards', subcategory: 'Film · prestige', source: 'Curated', region: 'North America', industries: ['Entertainment', 'Beauty', 'Fashion'] },
  { id: 'golden-globes', title: 'Golden Globe Awards', date: 'Jan 11, 2026', startDate: '2026-01-11', endDate: '2026-01-11', location: 'Beverly Hills, CA', category: 'Awards', subcategory: 'Film & TV', source: 'Curated', region: 'North America', industries: ['Entertainment', 'Fashion', 'Lifestyle'] },
  { id: 'sag-awards', title: 'SAG Awards', date: 'Feb 22, 2026', startDate: '2026-02-22', endDate: '2026-02-22', location: 'Santa Monica, CA', category: 'Awards', subcategory: 'Performance peer vote', source: 'Curated', region: 'North America', industries: ['Entertainment', 'Fashion', 'Beauty'] },
  { id: 'bafta-film', title: 'BAFTA Film Awards', date: 'Feb 15, 2026', startDate: '2026-02-15', endDate: '2026-02-15', location: 'London, UK', category: 'Awards', subcategory: 'UK film', source: 'Curated', region: 'Europe', industries: ['Entertainment', 'Fashion', 'Lifestyle'] },
  { id: 'cannes-palms', title: 'Cannes Film Festival — awards night', date: 'May 23, 2026', startDate: '2026-05-23', endDate: '2026-05-23', location: 'Cannes, France', category: 'Awards', subcategory: 'Palme cycle', source: 'Curated', region: 'Europe', industries: ['Entertainment', 'Fashion', 'Lifestyle'] },
  { id: 'emmys', title: 'Primetime Emmy Awards', date: 'Sep 14, 2026', startDate: '2026-09-14', endDate: '2026-09-14', location: 'Los Angeles, CA', category: 'Awards', subcategory: 'Television', source: 'Curated', region: 'North America', industries: ['Entertainment', 'Lifestyle', 'Beauty'] },
  { id: 'vmas', title: 'MTV Video Music Awards', date: 'Aug 30, 2026', startDate: '2026-08-30', endDate: '2026-08-30', location: 'New York, NY', category: 'Awards', subcategory: 'Music · viral moments', source: 'Curated', region: 'North America', industries: ['Music', 'Entertainment', 'Lifestyle'] },
  { id: 'bet-awards', title: 'BET Awards', date: 'Jun 28, 2026', startDate: '2026-06-28', endDate: '2026-06-28', location: 'Los Angeles, CA', category: 'Awards', subcategory: 'Culture & music', source: 'Curated', region: 'North America', industries: ['Music', 'Entertainment', 'Beauty'] },
  { id: 'cfda', title: 'CFDA Fashion Awards', date: 'Nov 3, 2026', startDate: '2026-11-03', endDate: '2026-11-03', location: 'New York, NY', category: 'Awards', subcategory: 'American fashion', source: 'Curated', region: 'North America', industries: ['Fashion', 'Beauty', 'Lifestyle'] },
  { id: 'brits', title: 'BRIT Awards', date: 'Mar 1, 2026', startDate: '2026-03-01', endDate: '2026-03-01', location: 'London, UK', category: 'Awards', subcategory: 'UK music', source: 'Curated', region: 'Europe', industries: ['Music', 'Entertainment', 'Fashion'] },
  { id: 'superbowl', title: 'Super Bowl LX', date: 'Feb 8, 2026', startDate: '2026-02-08', endDate: '2026-02-08', location: 'Santa Clara, CA', category: 'Sports', subcategory: 'NFL championship', source: 'Curated', region: 'North America', industries: ['Sports', 'Food & Beverage', 'Entertainment'] },
  { id: 'march-madness', title: 'NCAA March Madness — Final Four', date: 'Apr 4–6, 2026', startDate: '2026-04-04', endDate: '2026-04-06', location: 'San Antonio, TX', category: 'Sports', subcategory: 'College basketball', source: 'Curated', region: 'North America', industries: ['Sports', 'Food & Beverage', 'Lifestyle'] },
  { id: 'nba-finals', title: 'NBA Finals', date: 'Jun 3–21, 2026', startDate: '2026-06-03', endDate: '2026-06-21', location: 'US (rotating)', category: 'Sports', subcategory: 'Basketball finals', source: 'Curated', region: 'North America', industries: ['Sports', 'Lifestyle', 'Food & Beverage'] },
  { id: 'world-cup', title: 'FIFA World Cup 2026 — group stage NA', date: 'Jun 11–Jul 3, 2026', startDate: '2026-06-11', endDate: '2026-07-03', location: 'USA / Mexico / Canada', category: 'Sports', subcategory: 'Global football', source: 'Curated', region: 'Global', industries: ['Sports', 'Food & Beverage', 'Lifestyle'] },
  { id: 'wimbledon', title: 'The Championships · Wimbledon', date: 'Jun 29–Jul 12, 2026', startDate: '2026-06-29', endDate: '2026-07-12', location: 'London, UK', category: 'Sports', subcategory: 'Tennis · heritage', source: 'Curated', region: 'Europe', industries: ['Sports', 'Fashion', 'Lifestyle'] },
  { id: 'us-open', title: 'US Open Tennis', date: 'Aug 31–Sep 13, 2026', startDate: '2026-08-31', endDate: '2026-09-13', location: 'New York, NY', category: 'Sports', subcategory: 'Tennis · hard court', source: 'Curated', region: 'North America', industries: ['Sports', 'Lifestyle', 'Wellness'] },
  { id: 'masters', title: 'The Masters', date: 'Apr 9–12, 2026', startDate: '2026-04-09', endDate: '2026-04-12', location: 'Augusta, GA', category: 'Sports', subcategory: 'Golf · prestige', source: 'Curated', region: 'North America', industries: ['Sports', 'Lifestyle', 'Wellness'] },
  { id: 'indy-500', title: 'Indianapolis 500', date: 'May 24, 2026', startDate: '2026-05-24', endDate: '2026-05-24', location: 'Speedway, IN', category: 'Sports', subcategory: 'Motorsport', source: 'Curated', region: 'North America', industries: ['Sports', 'Entertainment', 'Lifestyle'] },
  { id: 'f1-miami', title: 'Formula 1 Miami Grand Prix', date: 'May 2–4, 2026', startDate: '2026-05-02', endDate: '2026-05-04', location: 'Miami, FL', category: 'Sports', subcategory: 'Motorsport · lifestyle', source: 'Curated', region: 'North America', industries: ['Sports', 'Lifestyle', 'Entertainment'] },
  { id: 'ufc-300-series', title: 'UFC mega-fight window (summer)', date: 'Jul–Aug 2026', startDate: '2026-07-10', endDate: '2026-08-30', location: 'Las Vegas + intl.', category: 'Sports', subcategory: 'Combat sports', source: 'Curated', region: 'North America', industries: ['Sports', 'Entertainment', 'Lifestyle'] },
  { id: 'met-gala', title: 'Met Gala', date: 'May 4, 2026', startDate: '2026-05-04', endDate: '2026-05-04', location: 'New York, NY', category: 'Fashion', subcategory: 'Costume Institute benefit', source: 'Curated', region: 'North America', industries: ['Fashion', 'Beauty', 'Entertainment'] },
  { id: 'nyfw', title: 'New York Fashion Week', date: 'Sep 5–13, 2026', startDate: '2026-09-05', endDate: '2026-09-13', location: 'New York, NY', category: 'Fashion', subcategory: 'RTW season', source: 'Curated', region: 'North America', industries: ['Fashion', 'Beauty', 'Lifestyle'] },
  { id: 'milan-fw', title: 'Milan Fashion Week', date: 'Feb 17–23, 2026', startDate: '2026-02-17', endDate: '2026-02-23', location: 'Milan, Italy', category: 'Fashion', subcategory: 'RTW / heritage luxury', source: 'Curated', region: 'Europe', industries: ['Fashion', 'Beauty', 'Lifestyle'] },
  { id: 'paris-fw', title: 'Paris Fashion Week', date: 'Sep 28–Oct 6, 2026', startDate: '2026-09-28', endDate: '2026-10-06', location: 'Paris, France', category: 'Fashion', subcategory: 'RTW finale', source: 'Curated', region: 'Europe', industries: ['Fashion', 'Beauty', 'Lifestyle'] },
  { id: 'london-fw', title: 'London Fashion Week', date: 'Sep 12–16, 2026', startDate: '2026-09-12', endDate: '2026-09-16', location: 'London, UK', category: 'Fashion', subcategory: 'Emerging designers', source: 'Curated', region: 'Europe', industries: ['Fashion', 'Lifestyle', 'Entertainment'] },
  { id: 'copenhagen-fw', title: 'Copenhagen Fashion Week', date: 'Aug 5–9, 2026', startDate: '2026-08-05', endDate: '2026-08-09', location: 'Copenhagen, DK', category: 'Fashion', subcategory: 'Scandi sustainability', source: 'Curated', region: 'Europe', industries: ['Fashion', 'Lifestyle', 'Wellness'] },
  { id: 'cannes-lions', title: 'Cannes Lions', date: 'Jun 22–26, 2026', startDate: '2026-06-22', endDate: '2026-06-26', location: 'Cannes, France', category: 'Cultural Moments', subcategory: 'Creative industry summit', source: 'Curated', region: 'Europe', industries: ['Lifestyle', 'Entertainment', 'Fashion'] },
];

const CULTURAL_SEASONAL_RAW: Raw[] = [
  {
    id: 'pride-month',
    title: 'Pride Month',
    date: 'Jun 1–30, 2026',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    location: 'Global',
    category: 'Cultural Moments',
    subcategory: 'Inclusion & community',
    source: 'Curated',
    region: 'Global',
    industries: ['Lifestyle', 'Entertainment', 'Fashion'],
  },
  {
    id: 'back-to-school',
    title: 'Back-to-school push',
    date: 'Jul 15–Sep 15, 2026',
    startDate: '2026-07-15',
    endDate: '2026-09-15',
    location: 'North America',
    category: 'Cultural Moments',
    subcategory: 'Retail & family',
    source: 'Curated',
    region: 'North America',
    industries: ['Lifestyle', 'Food & Beverage', 'Wellness'],
  },
  {
    id: 'black-friday',
    title: 'Black Friday / Cyber Week build',
    date: 'Nov 20–Dec 1, 2026',
    startDate: '2026-11-20',
    endDate: '2026-12-01',
    location: 'Global',
    category: 'Cultural Moments',
    subcategory: 'Retail peak',
    source: 'Curated',
    region: 'Global',
    industries: ['Lifestyle', 'Beauty', 'Fashion'],
  },
  {
    id: 'nye',
    title: "New Year's Eve cultural peak",
    date: 'Dec 26–Jan 1, 2027',
    startDate: '2026-12-26',
    endDate: '2027-01-01',
    location: 'Global',
    category: 'Cultural Moments',
    subcategory: 'Celebration & travel',
    source: 'Curated',
    region: 'Global',
    industries: ['Entertainment', 'Lifestyle', 'Food & Beverage'],
  },
  {
    id: 'art-basel',
    title: 'Art Basel Miami Beach',
    date: 'Dec 3–6, 2026',
    startDate: '2026-12-03',
    endDate: '2026-12-06',
    location: 'Miami, FL',
    category: 'Cultural Moments',
    subcategory: 'Art · luxury nightlife',
    source: 'Curated',
    region: 'North America',
    industries: ['Fashion', 'Lifestyle', 'Entertainment'],
  },
  { id: 'tonys', title: 'Tony Awards', date: 'Jun 14, 2026', startDate: '2026-06-14', endDate: '2026-06-14', location: 'New York, NY', category: 'Awards', subcategory: 'Theater', source: 'Curated', region: 'North America', industries: ['Entertainment', 'Lifestyle', 'Fashion'] },
  { id: 'olympics-winter', title: 'Milano-Cortina Winter Olympics', date: 'Feb 6–22, 2026', startDate: '2026-02-06', endDate: '2026-02-22', location: 'Italy', category: 'Sports', subcategory: 'Olympic cycle', source: 'Curated', region: 'Europe', industries: ['Sports', 'Lifestyle', 'Entertainment'] },
  { id: 'olympics-track', title: 'World Athletics Championships host weekend', date: 'Aug 2026', startDate: '2026-08-15', endDate: '2026-08-23', location: 'See host city', category: 'Sports', subcategory: 'Global athletics', source: 'Curated', region: 'Global', industries: ['Sports', 'Wellness', 'Lifestyle'] },
];

const CULTURAL_MOMENTS_RAW: Raw[] = [...CULTURAL_TENTPOLE_RAW, ...CULTURAL_SEASONAL_RAW];

/** Curated live moments — composed with Ticketmaster in `liveEventsService`. */
export const LIVE_EVENTS_INTEL_SEED: CalendarIntelEvent[] = LIVE_EVENTS_RAW.map((row) => e(row));

/** Curated + TMDb movie pipeline — composed in `moviePremieresService`. */
export const MOVIE_PREMIERES_INTEL_SEED: CalendarIntelEvent[] = MOVIE_PREMIERES_RAW.map((row) => e(row));

/** Curated + TMDb TV discover — composed in `tvPremieresService`. */
export const TV_PREMIERES_INTEL_SEED: CalendarIntelEvent[] = TV_PREMIERES_RAW.map((row) => e(row));

/** Festivals, awards, sports seasons, fashion weeks, seasonal tentpoles — `culturalMomentsService`. */
export const CULTURAL_MOMENTS_INTEL_SEED: CalendarIntelEvent[] = CULTURAL_MOMENTS_RAW.map((row) => e(row));

/** Full seed union — home/opportunities; aggregation uses domain slices first. */
export const CALENDAR_SEED_EVENTS: CalendarIntelEvent[] = [
  ...LIVE_EVENTS_INTEL_SEED,
  ...MOVIE_PREMIERES_INTEL_SEED,
  ...TV_PREMIERES_INTEL_SEED,
  ...CULTURAL_MOMENTS_INTEL_SEED,
];
