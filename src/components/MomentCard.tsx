import type { CulturalMoment, MomentSignalCategory } from '../pulse/types';

const categoryStyle: Record<MomentSignalCategory, string> = {
  Drama: 'border-rose-500/35 bg-rose-500/10 text-rose-200',
  Trend: 'border-violet-500/35 bg-violet-500/10 text-violet-200',
  'Influencer Momentum': 'border-cyan-500/35 bg-cyan-500/10 text-cyan-200',
  'Celebrity Moment': 'border-amber-500/35 bg-amber-500/10 text-amber-200',
  'Internet Conversation': 'border-sky-500/35 bg-sky-500/10 text-sky-200',
};

function formatObserved(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(d);
}

function ExternalLinkGlyph({ className }: { className?: string }) {
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

export function MomentCard({ moment }: { moment: CulturalMoment }) {
  const url = moment.url?.trim();
  if (!url || !/^https?:\/\//i.test(url)) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Read article: ${moment.headline}`}
      className="group relative block overflow-hidden rounded-[1.15rem] border border-white/10 bg-gradient-to-b from-white/[0.04] to-black/30 p-5 shadow-sm transition duration-200 hover:border-[#c9a96e]/35 hover:bg-white/[0.07] hover:shadow-[0_16px_48px_-20px_rgba(0,0,0,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a96e]/55"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] ${categoryStyle[moment.category]}`}
        >
          {moment.category}
        </span>
        <span className="font-mono text-[11px] text-zinc-500">Signal {moment.signalStrength}</span>
      </div>
      <h3 className="font-display text-lg leading-snug text-zinc-50 transition group-hover:text-white">{moment.headline}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400 transition group-hover:text-zinc-300">{moment.description}</p>
      <p className="mt-3 font-mono text-[11px] text-zinc-400">
        <span className="text-zinc-300">Source:</span> {moment.source}
        {formatObserved(moment.observedAt) ? ` · ${formatObserved(moment.observedAt)}` : ''}
      </p>
      <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#c9a96e] transition group-hover:text-[#e8d5a3]">
        <span>Read article</span>
        <ExternalLinkGlyph className="h-3.5 w-3.5 opacity-90" />
      </p>
      <div className="mt-4 border-t border-white/8 pt-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#c9a96e]/90">Why it matters for brands</p>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-200">{moment.whyForBrands}</p>
      </div>
    </a>
  );
}
