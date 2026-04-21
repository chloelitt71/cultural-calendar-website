import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { CATEGORY_PILLS } from './pulse/data.ts';
import { matchTalentForLaunch } from './talentMatchApi';
import { EventCard } from './pulse/EventCard';
import { MomentsPreview } from './components/MomentsPreview';
import { DiscoveryTalentCard } from './components/DiscoveryTalentCard';
import { CalendarPage } from './pages/CalendarPage';
import { MomentsPage } from './pages/MomentsPage';
import { TalentDiscoveryPage } from './pages/TalentDiscoveryPage';
import { TalentIntelPage } from './pages/TalentIntelPage';
import { getTalentBySegment } from './services/talentDiscoveryService';
import type { AppTab, TalentMatchInput, TalentMatchReport } from './pulse/types';
import { DECORATED_EVENTS } from './pulse/decoratedEvents';

const TABS: Array<{ id: AppTab; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'moments', label: 'Moments' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'talent-intel', label: 'Who Is This?' },
  { id: 'talent-match', label: 'Talent Match' },
  { id: 'talent', label: 'Talent' },
];

function sectionTitle(text: string) {
  return <h2 className="section-title font-display text-[1.9rem] text-zinc-100 md:text-[2.15rem]">{text}</h2>;
}

function HomePage({ onNavigate }: { onNavigate: (tab: AppTab) => void }) {
  const [pill, setPill] = useState<(typeof CATEGORY_PILLS)[number]>('All');

  const upcoming = DECORATED_EVENTS.filter((event) => event.computedStatus === 'soon' || event.computedStatus === 'upcoming');
  const upcomingTiles = upcoming.filter((event) => (pill === 'All' ? true : event.category === pill)).slice(0, 8);
  const talentSpotlight = getTalentBySegment('influencers').slice(0, 3);

  return (
    <div className="page-transition">
      <section className="relative overflow-hidden px-2 pb-20 pt-12 md:pt-18">
        <div className="pointer-events-none absolute -top-28 right-0 h-72 w-72 rounded-full bg-[#d6b67f]/10 blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-36 h-64 w-64 rounded-full bg-[#a58a60]/10 blur-3xl" />
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-7">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#c9a96e]">PULSE CULTURAL INTELLIGENCE</p>
            <h1 className="font-display text-5xl leading-[1.04] text-zinc-50 md:text-6xl">
              Cultural Intelligence for Modern PR Teams
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-zinc-300">
              What is moving online, which dates matter, and which talent is timely—built for comms, brand, and talent desks.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('moments')}
                className="rounded-full border border-[#d5ba8d]/65 bg-[#d5ba8d]/18 px-6 py-3 text-sm font-semibold text-[#f2e2c0] transition hover:-translate-y-0.5 hover:bg-[#d5ba8d]/26"
              >
                View Moments
              </button>
              <button
                type="button"
                onClick={() => onNavigate('talent-match')}
                className="rounded-full border border-white/18 bg-white/4 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/8"
              >
                Talent Match
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="hero-orb" />
            <div className="hero-glass relative z-10 space-y-4 rounded-[1.5rem] p-5">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#c9a96e]">Signal desk</p>
              <h3 className="font-display text-2xl text-zinc-100">Culture, discourse, and tentpole dates in one stack.</h3>
              <p className="text-sm leading-relaxed text-zinc-300">
                Moments tracks buzz and conversation velocity; Calendar locks to activatable events—no random marketing blog noise.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('calendar')}
                className="rounded-full border border-white/16 bg-white/6 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:border-white/30 hover:bg-white/10"
              >
                Event calendar
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-18 pt-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            {sectionTitle('Moments preview')}
            <p className="mt-2 max-w-2xl text-zinc-400">
              Social and cultural signals your team can brief on—discourse, momentum, and press-adjacent conversation, not generic trade pieces.
            </p>
          </div>
          <button type="button" onClick={() => onNavigate('moments')} className="shrink-0 text-sm text-[#d5ba8d] transition hover:text-[#eed9b3]">
            Open Moments →
          </button>
        </div>
        <MomentsPreview limit={4} />
      </section>

      <section className="section-shell pb-20">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            {sectionTitle('Upcoming events')}
            <p className="mt-2 text-zinc-400">Tentpole dates to plan earned, talent, and activations around.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_PILLS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPill(item)}
                className={`saas-pill rounded-full px-3 py-1 text-xs ${pill === item ? 'saas-pill-active' : 'text-zinc-300'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="hide-scrollbar flex snap-x gap-5 overflow-x-auto pb-4">
          {upcomingTiles.map((event) => (
            <div key={event.id} className="min-w-[320px] snap-start">
              <EventCard event={event} status={event.computedStatus} />
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell pb-18">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            {sectionTitle('Talent spotlight')}
            <p className="mt-2 text-zinc-400">Creators with clear timing hooks—see screen & music talent in the Talent tab.</p>
          </div>
          <button type="button" onClick={() => onNavigate('talent')} className="text-sm text-[#d5ba8d] transition hover:text-[#eed9b3]">
            Talent discovery →
          </button>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {talentSpotlight.map((profile) => (
            <DiscoveryTalentCard key={profile.id} profile={profile} />
          ))}
        </div>
      </section>

      <section className="section-shell pb-24">
        <div className="brand-preview-grid rounded-[1.6rem] p-8 md:p-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d6bc8f]">Talent matching engine</p>
            <h3 className="mt-3 font-display text-4xl text-zinc-50">Pair launches with creators who fit the brief—not just the feed.</h3>
            <p className="mt-4 max-w-xl text-zinc-300">
              Rule-based matching on category, audience, and creator proof points (GRWM, testing, events) with activation-ready recommendations.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('talent-match')}
              className="mt-7 rounded-full border border-[#d5ba8d]/70 bg-[#d5ba8d]/15 px-6 py-3 text-sm font-semibold text-[#f2e2c0] transition hover:bg-[#d5ba8d]/28"
            >
              Open Talent Match
            </button>
          </div>
          <div className="space-y-3">
            {['Ranked creator shortlists from your brief', 'Activation copy you can hand to talent mgmt', 'No API keys required for matching'].map((line) => (
              <div key={line} className="brand-preview-chip rounded-xl px-4 py-3 text-sm text-zinc-200">
                {line}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="section-shell border-t border-white/8 py-9 text-sm text-zinc-500">
        <p>PULSE © 2026 · PR & cultural intelligence</p>
      </footer>
    </div>
  );
}

function TalentMatchPage() {
  const [form, setForm] = useState<TalentMatchInput>({
    brandName: '',
    category: '',
    audience: '',
    productOrLaunch: '',
    campaignGoal: '',
  });
  const [result, setResult] = useState<TalentMatchReport | null>(null);

  const onField = (field: keyof TalentMatchInput) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(matchTalentForLaunch(form));
  }

  return (
    <div className="page-transition section-shell grid gap-8 pb-20 pt-8 xl:grid-cols-[400px_1fr]">
      <form onSubmit={onSubmit} className="saas-panel-soft h-fit rounded-[1.4rem] p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c9a96e]">Talent matching engine</p>
        <h2 className="mt-2 font-display text-[1.9rem] text-zinc-100">Launch × creator fit</h2>
        <p className="mb-5 text-sm leading-relaxed text-zinc-400">
          Match a brand launch to vetted creator profiles from our local dataset—category, audience, and proof-point alignment. Runs entirely in the browser.
        </p>
        <div className="space-y-3">
          <input required value={form.brandName} onChange={onField('brandName')} placeholder="Brand name" className="saas-input w-full rounded-xl px-3 py-2 text-sm text-zinc-100" />
          <input required value={form.category} onChange={onField('category')} placeholder="Category (e.g. skincare, streetwear, beverage)" className="saas-input w-full rounded-xl px-3 py-2 text-sm text-zinc-100" />
          <input required value={form.audience} onChange={onField('audience')} placeholder="Target audience (e.g. Gen Z women, US, skincare-first)" className="saas-input w-full rounded-xl px-3 py-2 text-sm text-zinc-100" />
          <textarea
            required
            value={form.productOrLaunch}
            onChange={onField('productOrLaunch')}
            placeholder="Product or launch (name, SKU, or initiative)"
            rows={3}
            className="saas-input w-full rounded-xl px-3 py-2 text-sm text-zinc-100"
          />
          <textarea
            required
            value={form.campaignGoal}
            onChange={onField('campaignGoal')}
            placeholder="Campaign goal (e.g. awareness, partnership, conversion, launch)"
            rows={3}
            className="saas-input w-full rounded-xl px-3 py-2 text-sm text-zinc-100"
          />
          <button type="submit" className="w-full rounded-full border border-[#c9a96e]/55 bg-[#c9a96e]/14 px-3 py-2.5 font-semibold text-[#e8d5a3] transition hover:bg-[#c9a96e]/24">
            Generate recommendations
          </button>
        </div>
      </form>

      <div className="space-y-5">
        {!result && (
          <div className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-black/20 p-8 text-sm leading-relaxed text-zinc-400">
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-[#c9a96e]/10 blur-3xl" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c9a96e]/90">Confidential · talent strategy</p>
            <p className="relative mt-4 max-w-xl">
              Complete the brief to generate a ranked shortlist (typically 3–5 creators) with fit rationale and activation direction—formatted like an internal PR recommendation memo.
            </p>
          </div>
        )}
        {result && (
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-[1.4rem] border border-[#c9a96e]/25 bg-gradient-to-br from-[#1a1814]/90 to-black/50 p-8 shadow-[0_0_0_1px_rgba(201,169,110,0.12)]">
              <div className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-[#c9a96e]/15 blur-3xl" />
              <p className="relative font-mono text-[10px] uppercase tracking-[0.24em] text-[#e8d5a3]">Strategic recommendation memo</p>
              <h3 className="relative mt-3 font-display text-[1.75rem] leading-tight text-zinc-50">{result.headline}</h3>
              <p className="relative mt-4 text-sm leading-relaxed text-zinc-300">{result.executiveSummary}</p>
              <p className="relative mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-zinc-500">{result.briefContext}</p>
            </div>

            <div className="space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c9a96e]">Ranked creator shortlist</p>
              {result.matches.map((match, index) => (
                <article
                  key={`${match.name}-${index}`}
                  className="relative overflow-hidden rounded-[1.15rem] border border-white/10 bg-black/35 pl-5 pr-5 pb-5 pt-5 before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-gradient-to-b before:from-[#d5bc90] before:to-[#8a7349]/80"
                >
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs text-zinc-500">Rec #{index + 1}</span>
                      <h4 className="font-display text-xl text-zinc-50">{match.name}</h4>
                    </div>
                    <span className="rounded-full border border-[#c9a96e]/45 bg-[#c9a96e]/12 px-3 py-1 font-mono text-xs text-[#e8d5a3]">Fit score {match.matchScore}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-400">{match.description}</p>
                  <div className="mt-4 space-y-3 border-t border-white/8 pt-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">Why they fit</p>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-200">{match.whyFit}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">Recommended activation</p>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-300">{match.activationIdea}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');

  return (
    <div className="pulse-bg min-h-screen text-zinc-200">
      <header className="sticky top-0 z-30 border-b border-white/7 bg-[#0d0d0e]/62 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:px-8">
          <button type="button" onClick={() => setActiveTab('home')} className="group flex shrink-0 items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#d2b27a] transition group-hover:scale-125" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#d2b27a]">PULSE</span>
          </button>
          <nav className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-1 gap-y-1.5 sm:gap-x-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] transition sm:px-3 sm:text-sm ${
                  activeTab === tab.id ? 'bg-white/10 text-zinc-100' : 'text-zinc-400 hover:bg-white/6 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-6">
        {activeTab === 'home' && <HomePage onNavigate={setActiveTab} />}
        {activeTab === 'moments' && <MomentsPage />}
        {activeTab === 'calendar' && <CalendarPage />}
        {activeTab === 'talent-intel' && <TalentIntelPage />}
        {activeTab === 'talent-match' && <TalentMatchPage />}
        {activeTab === 'talent' && <TalentDiscoveryPage />}
      </main>
    </div>
  );
}
