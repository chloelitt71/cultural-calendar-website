import { type FormEvent, useState } from 'react';
import type { TalentIntelProfile } from '../talentIntel/types';
import { assembleTalentIntelProfile } from '../services/talentIntelProfileAssembler';

function ExternalGlyph({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function ProfileCard({ profile }: { profile: TalentIntelProfile }) {
  return (
    <div className="relative overflow-hidden rounded-[1.35rem] border border-[#c9a96e]/20 bg-gradient-to-br from-[#141210]/95 to-black/60 shadow-[0_0_0_1px_rgba(201,169,110,0.08)]">
      <div className="pointer-events-none absolute -right-24 top-0 h-56 w-56 rounded-full bg-[#c9a96e]/12 blur-3xl" />
      <div className="relative grid gap-8 p-6 md:gap-10 md:p-8">
        <div className="min-w-0 space-y-6">
          <header>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#c9a96e]/90">Who Is This?</p>
            <h2 className="mt-1 font-display text-[1.85rem] leading-tight text-zinc-50 md:text-[2.1rem]">{profile.name}</h2>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-zinc-400">
              <span>
                <span className="text-zinc-600">Sector ·</span> {profile.sector}
              </span>
              <span>
                <span className="text-zinc-600">Location ·</span> {profile.location}
              </span>
            </div>
          </header>

          <section className="space-y-3">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">Online personality</h3>
            <p className="text-sm leading-relaxed text-zinc-200">{profile.onlinePersonality}</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">Audience / content style</h3>
            <p className="text-sm leading-relaxed text-zinc-300">{profile.audienceStyle}</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">Brand deals & partnerships</h3>
            {profile.brandDeals.length === 0 ? (
              <p className="text-sm text-zinc-500">No clearly reported partnerships in current coverage.</p>
            ) : (
              <ul className="space-y-3">
                {profile.brandDeals.map((b) => (
                  <li key={`${b.sourceUrl}-${b.label}`} className="rounded-xl border border-white/8 bg-black/20 p-4 text-sm">
                    <p className="font-medium text-zinc-100">{b.label}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{b.evidence}</p>
                    <a
                      href={b.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-[#c9a96e] hover:text-[#e8d5a3]"
                    >
                      View source
                      <ExternalGlyph className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">Recent coverage</h3>
            <ul className="space-y-2.5">
              {profile.recentCoverage.map((c) => (
                <li key={c.url}>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-0.5 rounded-lg border border-transparent px-1 py-1 transition hover:border-white/10 hover:bg-white/[0.03]"
                  >
                    <span className="text-sm font-medium text-zinc-100 group-hover:text-white">{c.title}</span>
                    <span className="font-mono text-[11px] text-zinc-500">
                      {c.source} · {new Date(c.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

type DebugStatus = 'idle' | 'loading' | 'success' | 'no_results' | 'error';

export function TalentIntelPage() {
  const [q, setQ] = useState('');
  const [profile, setProfile] = useState<TalentIntelProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [debug, setDebug] = useState<{
    searchTerm: string;
    status: DebugStatus;
    articleCount: number;
    firstThreeTitles: string[];
  }>({
    searchTerm: '',
    status: 'idle',
    articleCount: 0,
    firstThreeTitles: [],
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setHasSearched(true);
    setLoading(true);
    setError(null);
    setProfile(null);
    setDebug({
      searchTerm: term,
      status: 'loading',
      articleCount: 0,
      firstThreeTitles: [],
    });
    try {
      const result = await assembleTalentIntelProfile(term);
      setProfile(result.profile);
      setDebug({
        searchTerm: result.debug.searchTerm,
        status: result.debug.requestStatus,
        articleCount: result.debug.articleCount,
        firstThreeTitles: result.debug.firstThreeTitles,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not build profile');
      setDebug((d) => ({ ...d, status: 'error' }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-transition section-shell pb-24 pt-8">
      <header className="mb-10 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#c9a96e]">Who Is This?</p>
        <h1 className="mt-2 font-display text-[2rem] leading-tight text-zinc-50 md:text-[2.45rem]">Quick PR lookup</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Type a name to generate a fast PR snapshot from recent coverage. This version uses NewsAPI as the source of truth and focuses on usable briefing
          fields over perfect completeness.
        </p>
        {import.meta.env.DEV && (
          <p className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
            Source used: NewsAPI only
          </p>
        )}
      </header>

      {import.meta.env.DEV && (
        <section className="mb-8 rounded-xl border border-[#c9a96e]/30 bg-[#c9a96e]/6 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c9a96e]">Who Is This? debug</p>
          <div className="mt-2 grid gap-1.5 text-xs text-zinc-300">
            <p>
              <span className="text-zinc-500">Current search term:</span> {debug.searchTerm || '—'}
            </p>
            <p>
              <span className="text-zinc-500">NewsAPI request status:</span> {debug.status}
            </p>
            <p>
              <span className="text-zinc-500">Articles returned:</span> {debug.articleCount}
            </p>
            <div>
              <p className="text-zinc-500">First 3 article titles:</p>
              {debug.firstThreeTitles.length === 0 ? (
                <p className="mt-1 text-zinc-500">—</p>
              ) : (
                <ul className="mt-1 list-inside list-disc space-y-0.5 text-zinc-200">
                  {debug.firstThreeTitles.map((title, idx) => (
                    <li key={`${idx}-${title}`}>{title}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      <form onSubmit={onSubmit} className="mb-10 max-w-2xl space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a creator, celebrity, or public figure"
            className="saas-input flex-1 rounded-xl px-4 py-3 text-sm text-zinc-100"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading || !q.trim()}
            className="rounded-xl border border-[#c9a96e]/50 bg-[#c9a96e]/15 px-6 py-3 font-semibold text-[#e8d5a3] transition hover:bg-[#c9a96e]/25 disabled:opacity-40"
          >
            {loading ? 'Building brief…' : 'Run lookup'}
          </button>
        </div>
        {error && <p className="text-sm text-amber-300/90">{error}</p>}
      </form>

      {loading && (
        <div className="space-y-4">
          <div className="h-48 animate-pulse rounded-[1.35rem] border border-white/8 bg-white/[0.03]" />
          <p className="font-mono text-xs text-zinc-500">Pulling sources and assembling briefing…</p>
        </div>
      )}

      {!loading && profile && <ProfileCard profile={profile} />}

      {!loading && !profile && (
        <div className="rounded-[1.2rem] border border-white/10 bg-black/25 p-8 text-sm text-zinc-500">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            {hasSearched ? 'No coverage found' : 'Start a lookup'}
          </p>
          <p className="mt-3 max-w-xl leading-relaxed">
            {hasSearched
              ? 'No matching NewsAPI articles were returned for this search. Try an alternate spelling or add another keyword.'
              : 'Enter a name to generate a quick PR briefing from NewsAPI coverage. Set VITE_NEWS_API_KEY in your environment.'}
          </p>
        </div>
      )}

      <p className="mt-12 border-t border-white/8 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
        News setup: <span className="text-zinc-500">VITE_NEWS_API_KEY</span> · endpoint proxied via <span className="text-zinc-500">/news-api</span> in
        dev.
      </p>
    </div>
  );
}
