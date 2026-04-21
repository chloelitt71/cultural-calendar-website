import type { RankedCuratedTalent } from '../pulse/types';

const industryLabel: Record<string, string> = {
  beauty: 'Beauty',
  fashion: 'Fashion',
  lifestyle: 'Lifestyle',
  entertainment: 'Entertainment',
  consumer: 'Consumer',
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-0.5 flex justify-between font-mono text-[9px] uppercase tracking-wide text-zinc-500">
        <span>{label}</span>
        <span className="text-zinc-400">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800/90">
        <div className="h-full rounded-full bg-gradient-to-r from-[#8a7349] to-[#d5bc90]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function DiscoveryTalentCard({ profile }: { profile: RankedCuratedTalent }) {
  return (
    <article className="relative overflow-hidden rounded-[1.15rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-black/40 p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-xl text-zinc-50">{profile.name}</h3>
          <p className="mt-0.5 font-mono text-[11px] text-[#c9a96e]/90">
            {profile.category} · {profile.subcategory}
          </p>
          {(profile.tiktokHandle || profile.instagramHandle) && (
            <p className="mt-1 font-mono text-[10px] text-zinc-400">
              {[
                profile.tiktokHandle && `TikTok ${profile.tiktokHandle}`,
                profile.instagramHandle && `Instagram ${profile.instagramHandle}`,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="block font-mono text-[10px] uppercase tracking-wide text-zinc-500">Right now score</span>
          <span className="font-mono text-lg text-[#e8d5a3]">{profile.relevanceScore}</span>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {profile.industries.map((ind) => (
          <span key={ind} className="rounded-full border border-white/12 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
            {industryLabel[ind] ?? ind}
          </span>
        ))}
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">Why they matter right now</p>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-200">{profile.currentRelevanceReason}</p>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">Persona & content</p>
      <p className="mt-1 text-sm text-zinc-400">{profile.contentPersonaStyle}</p>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">Brand fit (this roster)</p>
      <p className="mt-1 text-sm text-zinc-300">
        <span className="text-[#c9a96e]">{profile.brandFitTag}</span> — {profile.audience}
      </p>

      <div className="mt-4 space-y-3 rounded-xl border border-[#c9a96e]/20 bg-[#c9a96e]/[0.06] px-3 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#d5bc90]/90">PR strategy</p>
        <div className="space-y-2.5 text-sm">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wide text-zinc-500">Best for</p>
            <p className="mt-0.5 leading-relaxed text-zinc-200">{profile.bestFor}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wide text-zinc-500">Activation style</p>
            <p className="mt-0.5 leading-relaxed text-zinc-300">{profile.activationStyle}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wide text-zinc-500">Partnership strength</p>
            <p className="mt-0.5 leading-relaxed text-zinc-300">{profile.partnershipStrength}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wide text-zinc-500">Brand use case</p>
            <p className="mt-0.5 leading-relaxed text-zinc-200">{profile.brandUseCase}</p>
          </div>
        </div>
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">Upcoming timing hook</p>
      <p className="mt-1 text-sm text-zinc-200">{profile.upcomingHook}</p>

      {profile.segment === 'actors' && (profile.upcomingFilmTv || profile.premiereWindow) && (
        <div className="mt-3 rounded-lg border border-white/8 bg-black/30 px-3 py-2 text-xs text-zinc-400">
          {profile.upcomingFilmTv && <p className="text-zinc-300">{profile.upcomingFilmTv}</p>}
          {profile.premiereWindow && <p className="mt-1">{profile.premiereWindow}</p>}
          {profile.awardOrPressCycle && <p className="mt-1 text-zinc-500">{profile.awardOrPressCycle}</p>}
        </div>
      )}

      {profile.segment === 'music' && (profile.tourFestival || profile.releaseNote || profile.liveVisibilityNote) && (
        <div className="mt-3 rounded-lg border border-white/8 bg-black/30 px-3 py-2 text-xs text-zinc-400">
          {profile.tourFestival && <p>{profile.tourFestival}</p>}
          {profile.releaseNote && <p className="mt-1 text-zinc-500">{profile.releaseNote}</p>}
          {profile.liveVisibilityNote && <p className="mt-1">{profile.liveVisibilityNote}</p>}
        </div>
      )}

      {profile.segment === 'influencers' && (profile.socialTractionNote || profile.partnershipPotentialNote || profile.conversationVolumeNote) && (
        <div className="mt-3 space-y-1.5 rounded-lg border border-emerald-500/15 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-100/90">
          {profile.partnershipPotentialNote && <p>Partnership: {profile.partnershipPotentialNote}</p>}
          {profile.socialTractionNote && <p>Social: {profile.socialTractionNote}</p>}
          {profile.conversationVolumeNote && <p>Conversation: {profile.conversationVolumeNote}</p>}
        </div>
      )}

      <div className="mt-4 space-y-2 border-t border-white/8 pt-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">Drivers (0–100)</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <ScoreBar label="Cultural momentum" value={profile.momentumScore} />
          <ScoreBar label="Press visibility" value={profile.pressVisibilityScore} />
          <ScoreBar label="Brand friendliness" value={profile.brandFitScore} />
          <ScoreBar label="Audience fit" value={profile.audienceRelevanceScore} />
          <ScoreBar label="Timing urgency" value={profile.timingUrgencyScore} />
        </div>
        {profile.risingTalent && (
          <span className="inline-block rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-amber-200">
            Rising trajectory
          </span>
        )}
      </div>
    </article>
  );
}
