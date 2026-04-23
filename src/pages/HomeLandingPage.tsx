import type { AppTab } from '../pulse/types';

const HOW_IT_WORKS: Array<{
  tab: Exclude<AppTab, 'home'>;
  label: string;
  title: string;
  line1: string;
  line2: string;
}> = [
  {
    tab: 'moments',
    label: 'Signal',
    title: 'Moments',
    line1: 'Real-time cultural conversations and trends',
    line2: 'See what’s gaining traction and what brands should respond to',
  },
  {
    tab: 'calendar',
    label: 'Schedule',
    title: 'Calendar',
    line1: 'Upcoming events that matter for PR and marketing',
    line2: 'Plan campaigns, partnerships, and activations',
  },
  {
    tab: 'talent-intel',
    label: 'Identity',
    title: 'Who Is This?',
    line1: 'Look up a public figure or creator',
    line2: 'Get a concise intel snapshot for briefings and reactive moments',
  },
  {
    tab: 'talent',
    label: 'Talent',
    title: 'Talent',
    line1: 'Curated creators and public figures',
    line2: 'Understand who’s relevant right now and why',
  },
  {
    tab: 'talent-match',
    label: 'Match',
    title: 'Talent Match',
    line1: 'Match your brand with the right talent',
    line2: 'Input your brand and get strategic recommendations',
  },
];

/**
 * Landing only: hero + how-it-works. No data, previews, feeds, or dashboard widgets.
 */
export function HomeLandingPage({ onNavigate }: { onNavigate: (tab: AppTab) => void }) {
  return (
    <div className="page-transition section-shell flex min-h-[calc(100dvh-4.25rem)] flex-col pb-12 pt-10 md:min-h-[calc(100vh-4.25rem)] md:pb-16 md:pt-12">
      {/* 1. Hero — nothing else above the fold except this block */}
      <header className="max-w-4xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#c84c2f]/90">Pulse Cultural Intelligence</p>
        <h1 className="mt-5 font-display text-[2.35rem] font-semibold leading-[1.06] tracking-tight text-zinc-50 sm:text-6xl md:text-[3.45rem]">
          Cultural Intelligence for PR Teams
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
          Track what’s happening, plan around key cultural moments, and find the right talent to activate.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('moments')}
            className="rounded-lg border border-[#c84c2f] bg-[#c84c2f] px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            View Moments
          </button>
          <button
            type="button"
            onClick={() => onNavigate('calendar')}
            className="rounded-lg border border-[#d7d2cb] bg-white px-7 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[#c84c2f]/40"
          >
            Open Calendar
          </button>
          <button
            type="button"
            onClick={() => onNavigate('talent-intel')}
            className="rounded-lg border border-[#d7d2cb] bg-white px-7 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[#c84c2f]/40"
          >
            Who Is This?
          </button>
          <button
            type="button"
            onClick={() => onNavigate('talent-match')}
            className="rounded-lg border border-[#d7d2cb] bg-white px-7 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[#c84c2f]/40"
          >
            Talent Match
          </button>
        </div>
      </header>

      {/* 2. Card navigation */}
      <section className="mx-auto mt-16 flex w-full max-w-7xl flex-1 md:mt-20">
        <div className="w-full">
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-6">
          {HOW_IT_WORKS.map(({ tab, label, title, line1, line2 }) => (
            <button
              key={tab}
              type="button"
              onClick={() => onNavigate(tab)}
              className="group relative overflow-hidden rounded-[1.35rem] border border-[#eae7e2] bg-white px-6 py-8 text-left transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[#d7d2cb] hover:shadow-[0_8px_20px_-16px_rgba(0,0,0,0.2)]"
            >
              <p className="relative font-mono text-[10px] uppercase tracking-[0.22em] text-[#c84c2f]/80">{label}</p>
              <h3 className="relative mt-4 font-display text-[1.55rem] font-semibold leading-[1.05] tracking-tight text-zinc-50 md:text-[1.75rem]">
                {title}
              </h3>
              <p className="relative mt-5 text-xs uppercase tracking-[0.08em] text-zinc-500 md:text-[12px]">{line1}</p>
              <p className="relative mt-3 text-sm leading-relaxed text-zinc-300 md:text-[14px]">{line2}</p>
            </button>
          ))}
        </div>
        </div>
      </section>
    </div>
  );
}
