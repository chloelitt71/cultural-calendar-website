import { type FormEvent, useState } from 'react';
import type { TalentIntelProfile } from '../talentIntel/types';
import { assembleTalentIntelProfile } from '../services/talentIntelProfileAssembler';
import { SaveToProjectButton } from '../components/SaveToProjectButton';

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

function buildProfileDescriptors(profile: TalentIntelProfile): string[] {
  const descriptors: string[] = [];
  const role = profile.sector.trim();
  if (role) descriptors.push(role);

  const context = `${profile.onlinePersonality} ${profile.audienceStyle}`.toLowerCase();
  const specializationRules: Array<{ label: string; test: RegExp }> = [
    { label: 'Film & TV', test: /\b(actor|actress|film|tv|series|streaming|box office|cast|premiere)\b/ },
    { label: 'Comedy', test: /\b(comedic|comedy|funny|satire)\b/ },
    { label: 'Beauty', test: /\b(beauty|makeup|skincare|glam)\b/ },
    { label: 'Fashion', test: /\b(fashion|style|runway|red carpet)\b/ },
    { label: 'Pop', test: /\b(pop|single|album|tour|music)\b/ },
    { label: 'Sports', test: /\b(athlete|nba|nfl|mlb|fifa|olympic|tennis|formula 1|ufc)\b/ },
    { label: 'Lifestyle', test: /\b(lifestyle|wellness|daily|vlog)\b/ },
  ];

  const specialization = specializationRules.find((rule) => rule.test.test(context))?.label;
  if (specialization && !descriptors.includes(specialization)) {
    descriptors.push(specialization);
  }

  return descriptors.slice(0, 3);
}

function ProfileCard({ profile }: { profile: TalentIntelProfile }) {
  const descriptors = buildProfileDescriptors(profile);

  return (
    <div className="relative overflow-hidden rounded-[1.35rem] border border-[#c84c2f]/20 bg-white shadow-[0_0_0_1px_rgba(201,169,110,0.08)]">
      <div className="pointer-events-none absolute -right-24 top-0 h-56 w-56 rounded-lg bg-[#c84c2f]/12 blur-3xl" />
      <div className="relative grid gap-8 p-6 md:gap-10 md:p-8">
        <div className="min-w-0 space-y-6">
          <header>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#c84c2f]/90">Who Is This?</p>
            <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
              <h2 className="font-display text-[1.85rem] leading-tight text-zinc-50 md:text-[2.1rem]">{profile.name}</h2>
              <SaveToProjectButton
                item={{
                  type: 'lookup',
                  sourceId: profile.name.toLowerCase().replace(/\s+/g, '-'),
                  originPage: 'talent-intel',
                  title: profile.name,
                  subtitle: descriptors.join(' • '),
                  description: profile.audienceStyle,
                  metadata: {
                    sector: profile.sector,
                    coverageCount: String(profile.recentCoverage.length),
                  },
                }}
              />
            </div>
            {descriptors.length > 0 && <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-zinc-500">{descriptors.join(' • ')}</p>}
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
                      className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-[#c84c2f] hover:text-[#c84c2f]"
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

export function TalentIntelPage() {
  const [q, setQ] = useState('');
  const [profile, setProfile] = useState<TalentIntelProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const newsApiKey = import.meta.env.VITE_NEWS_API_KEY as string | undefined;
  const hasNewsApiKey = Boolean(newsApiKey?.trim());

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    if (!hasNewsApiKey) {
      setError('Lookup is temporarily unavailable. Please try again shortly.');
      setProfile(null);
      return;
    }
    setHasSearched(true);
    setLoading(true);
    setError(null);
    setProfile(null);
    try {
      const result = await assembleTalentIntelProfile(term);
      setProfile(result.profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not build profile');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-transition section-shell pb-24 pt-8">
      <header className="mb-10 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#c84c2f]">Who Is This?</p>
        <h1 className="mt-2 font-display text-[2rem] leading-tight text-zinc-50 md:text-[2.45rem]">Quick PR lookup</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">Type a name to generate a quick PR snapshot based on recent coverage.</p>
      </header>

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
            className="rounded-xl border border-[#c84c2f]/50 bg-[#c84c2f]/15 px-6 py-3 font-semibold text-[#c84c2f] transition hover:bg-[#c84c2f]/25 disabled:opacity-40"
          >
            {loading ? 'Building brief…' : 'Run lookup'}
          </button>
        </div>
        {error && <p className="text-sm text-[#8f3b2a]">{error}</p>}
      </form>

      {loading && (
        <div className="space-y-4">
          <div className="h-48 animate-pulse rounded-[1.35rem] border border-white/8 bg-white/[0.03]" />
          <p className="font-mono text-xs text-zinc-500">Building profile snapshot…</p>
        </div>
      )}

      {!loading && profile && <ProfileCard profile={profile} />}

      {!loading && !profile && (
        <div className="rounded-[1.2rem] border border-white/10 bg-white p-8 text-sm text-zinc-500">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            {hasSearched ? 'No coverage found' : 'Start a lookup'}
          </p>
          <p className="mt-3 max-w-xl leading-relaxed">
            {hasSearched
              ? 'No recent coverage in the past 30 days.'
              : 'Search a name to generate a quick PR snapshot based on recent coverage.'}
          </p>
          {!hasSearched && <p className="mt-3 text-xs text-zinc-500">Try searching: Zendaya, Alix Earle, Timothee Chalamet</p>}
        </div>
      )}
    </div>
  );
}
