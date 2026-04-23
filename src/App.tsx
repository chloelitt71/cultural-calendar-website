import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { matchTalentForLaunch } from './talentMatchApi';
import { CalendarPage } from './pages/CalendarPage';
import { MomentsPage } from './pages/MomentsPage';
import { TalentDiscoveryPage } from './pages/TalentDiscoveryPage';
import { TalentIntelPage } from './pages/TalentIntelPage';
import { HomeLandingPage } from './pages/HomeLandingPage';
import { ProjectsPage } from './pages/ProjectsPage';
import type { AppTab, TalentMatchInput, TalentMatchReport } from './pulse/types';
import { ProjectsProvider } from './projects/ProjectsContext';
import { SaveToProjectButton } from './components/SaveToProjectButton.tsx';

const TABS: Array<{ id: AppTab; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'moments', label: 'Moments' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'talent-intel', label: 'Who Is This?' },
  { id: 'talent-match', label: 'Talent Match' },
  { id: 'talent', label: 'Talent' },
  { id: 'projects', label: 'Projects' },
];

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
      <form onSubmit={onSubmit} className="saas-panel-soft h-fit rounded-[1.4rem] p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c84c2f]">Talent matching engine</p>
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
          <button type="submit" className="w-full rounded-lg border border-[#c84c2f] bg-[#c84c2f] px-3 py-2.5 font-semibold text-white transition hover:opacity-90">
            Generate recommendations
          </button>
        </div>
      </form>

      <div className="space-y-5">
        {!result && (
          <div className="relative overflow-hidden rounded-[1.4rem] border border-[#eae7e2] bg-white p-8 text-sm leading-relaxed text-zinc-400">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c84c2f]">Confidential · talent strategy</p>
            <p className="relative mt-4 max-w-xl">
              Complete the brief to generate a ranked shortlist (typically 3–5 creators) with fit rationale and activation direction—formatted like an internal PR recommendation memo.
            </p>
          </div>
        )}
        {result && (
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-[1.4rem] border border-[#eae7e2] bg-white p-8">
              <p className="relative font-mono text-[10px] uppercase tracking-[0.24em] text-[#c84c2f]">Strategic recommendation memo</p>
              <h3 className="relative mt-3 font-display text-[1.75rem] leading-tight text-zinc-50">{result.headline}</h3>
              <p className="relative mt-4 text-sm leading-relaxed text-zinc-300">{result.executiveSummary}</p>
              <p className="relative mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-zinc-500">{result.briefContext}</p>
            </div>

            <div className="space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c84c2f]">Ranked creator shortlist</p>
              {result.matches.map((match, index) => (
                <article
                  key={`${match.name}-${index}`}
                  className="relative overflow-hidden rounded-[1.15rem] border border-[#eae7e2] bg-white pl-5 pr-5 pb-5 pt-5 before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-[#c84c2f]"
                >
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs text-zinc-500">Rec #{index + 1}</span>
                      <h4 className="font-display text-xl text-zinc-50">{match.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-[#e8b8ac] bg-[#fff1ee] px-3 py-1 font-mono text-xs text-[#c84c2f]">Fit score {match.matchScore}</span>
                      <SaveToProjectButton
                        item={{
                          type: 'match',
                          sourceId: `${form.brandName}-${match.name}-${match.matchScore}-${index}`,
                          originPage: 'talent-match',
                          title: `${match.name} match for ${form.brandName}`,
                          subtitle: `Fit score ${match.matchScore}`,
                          description: match.whyFit,
                          metadata: {
                            brandName: form.brandName,
                            campaignGoal: form.campaignGoal,
                            category: form.category,
                          },
                        }}
                      />
                    </div>
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
    <ProjectsProvider>
      <div className="pulse-bg min-h-screen text-zinc-200">
        <header className="sticky top-0 z-30 border-b border-[#eae7e2] bg-[#f7f5f2]/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:px-8">
            <button type="button" onClick={() => setActiveTab('home')} className="group shrink-0 text-left">
              <span className="pulse-logo-wordmark block uppercase text-zinc-100 transition group-hover:text-zinc-50">PULSE</span>
              <span className="pulse-logo-subtext mt-0.5 block uppercase text-[#c84c2f]/80 transition group-hover:text-[#c84c2f]">
                Cultural Intelligence
              </span>
            </button>
            <nav className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-2 gap-y-1.5 sm:gap-x-3">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap border-b px-1 py-1.5 text-[13px] transition sm:text-sm ${
                    activeTab === tab.id
                      ? 'border-[#c84c2f] text-[#1c1c1c]'
                      : 'border-transparent text-[#6f6f6f] hover:border-[#d8cfc4] hover:text-[#1c1c1c]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 md:px-6">
          {activeTab === 'home' && <HomeLandingPage onNavigate={setActiveTab} />}
          {activeTab === 'moments' && <MomentsPage />}
          {activeTab === 'calendar' && <CalendarPage />}
          {activeTab === 'talent-intel' && <TalentIntelPage />}
          {activeTab === 'talent-match' && <TalentMatchPage />}
          {activeTab === 'talent' && <TalentDiscoveryPage />}
          {activeTab === 'projects' && <ProjectsPage />}
        </main>
      </div>
    </ProjectsProvider>
  );
}
