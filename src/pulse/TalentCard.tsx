import type { Specialty, TalentItem } from './types';

interface CategoryTone {
  tint: string;
  border: string;
  dot: string;
}

const CATEGORY_TONES: Record<string, CategoryTone> = {
  beauty: { tint: '#F6EAEA', border: '#e6cfcd', dot: '#c9a6a2' },
  fashion: { tint: '#F3EDE7', border: '#ddd2c6', dot: '#bba58d' },
  entertainment: { tint: '#F1EFFA', border: '#d8d3ea', dot: '#aca1cf' },
  lifestyle: { tint: '#EEF3EF', border: '#d1ddd3', dot: '#9cb49f' },
  consumer: { tint: '#EEF2F5', border: '#d1d9e0', dot: '#9baab7' },
};

const specialtyToToneKey: Record<Specialty, keyof typeof CATEGORY_TONES> = {
  Beauty: 'beauty',
  Fashion: 'fashion',
  Sports: 'consumer',
  'Food & Beverage': 'consumer',
  Music: 'entertainment',
  Entertainment: 'entertainment',
  Wellness: 'lifestyle',
  Lifestyle: 'lifestyle',
};

function toneForSpecialty(specialty?: Specialty): CategoryTone {
  if (!specialty) return CATEGORY_TONES.consumer;
  return CATEGORY_TONES[specialtyToToneKey[specialty]];
}

const specialtyStyles: Record<Specialty, string> = {
  Beauty: 'bg-[#f5f5f5] text-[#1c1c1c]',
  Fashion: 'bg-[#f5f5f5] text-[#1c1c1c]',
  Sports: 'bg-[#f5f5f5] text-[#1c1c1c]',
  'Food & Beverage': 'bg-[#f5f5f5] text-[#1c1c1c]',
  Music: 'bg-[#f5f5f5] text-[#1c1c1c]',
  Entertainment: 'bg-[#f5f5f5] text-[#1c1c1c]',
  Wellness: 'bg-[#f5f5f5] text-[#1c1c1c]',
  Lifestyle: 'bg-[#f5f5f5] text-[#1c1c1c]',
};

export function TalentCard({ profile }: { profile: TalentItem }) {
  const isEmerging = profile.tier === 'Emerging';
  const primaryTone = toneForSpecialty(profile.specialty[0]);

  return (
    <article className="event-tile relative overflow-hidden rounded-[1.35rem] p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1" style={{ backgroundColor: primaryTone.tint }} />
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="subtle-float grid h-10 w-10 place-content-center rounded-lg border border-[#e0ddd8] bg-[#f5f5f5] text-xl">
            {profile.emoji}
          </span>
          <div>
            <h3 className="font-display text-lg text-zinc-100">{profile.name}</h3>
            <p className="text-xs text-zinc-400">{profile.type}</p>
          </div>
        </div>
        <span className="rounded-lg px-2 py-1 font-mono text-xs text-[#1c1c1c]" style={{ border: `1px solid ${primaryTone.border}`, backgroundColor: primaryTone.tint }}>
          {profile.matchScore}%
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {profile.specialty.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-semibold ${specialtyStyles[tag]}`}
            style={{ borderColor: toneForSpecialty(tag).border }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: toneForSpecialty(tag).dot }} aria-hidden />
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
            <span className="rounded-lg border border-[#e0ddd8] bg-[#f5f5f5] px-2 py-1 text-[11px] font-semibold text-[#1c1c1c]">
              Act Early
            </span>
          </div>
          <p className="text-sm text-zinc-200">{profile.whyTrending}</p>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
              <span>Growth momentum</span>
              <span>{profile.growth}%</span>
            </div>
            <div className="h-2 rounded-lg bg-[#ece9e4]">
              <div className="h-2 rounded-lg bg-[#c84c2f]" style={{ width: `${profile.growth}%` }} />
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
