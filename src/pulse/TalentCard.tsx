import type { Specialty, TalentItem } from './types';

const specialtyStyles: Record<Specialty, string> = {
  Beauty: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
  Fashion: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  Sports: 'bg-green-500/20 text-green-300 border-green-500/40',
  'Food & Beverage': 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  Music: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  Entertainment: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  Wellness: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
  Lifestyle: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
};

export function TalentCard({ profile }: { profile: TalentItem }) {
  const isEmerging = profile.tier === 'Emerging';

  return (
    <article className="event-tile rounded-[1.35rem] p-5">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="subtle-float grid h-10 w-10 place-content-center rounded-full border border-white/8 bg-zinc-800/85 text-xl">
            {profile.emoji}
          </span>
          <div>
            <h3 className="font-display text-lg text-zinc-100">{profile.name}</h3>
            <p className="text-xs text-zinc-400">{profile.type}</p>
          </div>
        </div>
        <span className="rounded-full border border-[#c9a96e]/40 bg-[#c9a96e]/10 px-2 py-1 font-mono text-xs text-[#e8d5a3]">
          {profile.matchScore}%
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {profile.specialty.map((tag) => (
          <span key={tag} className={`rounded-full border px-2 py-1 text-xs font-semibold ${specialtyStyles[tag]}`}>
            {tag}
          </span>
        ))}
      </div>

      <p className="mb-2 text-sm text-zinc-300">{profile.audience}</p>
      <p className="text-sm leading-relaxed text-zinc-300">{profile.brandFit}</p>

      {isEmerging && (
        <div className="saas-panel-soft mt-4 space-y-3 rounded-2xl p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-zinc-400">Why trending</p>
            <span className="rounded-full border border-amber-500/40 bg-amber-500/20 px-2 py-1 text-[11px] font-semibold text-amber-200">
              Act Early
            </span>
          </div>
          <p className="text-sm text-zinc-200">{profile.whyTrending}</p>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
              <span>Growth momentum</span>
              <span>{profile.growth}%</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800">
              <div className="h-2 rounded-full bg-gradient-to-r from-[#c9a96e] to-[#e8d5a3]" style={{ width: `${profile.growth}%` }} />
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
