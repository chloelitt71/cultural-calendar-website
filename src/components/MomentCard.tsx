import type { CulturalMoment, MomentSignalCategory } from '../pulse/types';
import { SaveToProjectButton } from './SaveToProjectButton';

const categoryStyle: Record<MomentSignalCategory, string> = {
  Drama: 'border-[#e0ddd8] bg-[#f5f5f5] text-[#1c1c1c]',
  Trend: 'border-[#e0ddd8] bg-[#f5f5f5] text-[#1c1c1c]',
  'Influencer Momentum': 'border-[#e0ddd8] bg-[#f5f5f5] text-[#1c1c1c]',
  'Celebrity Moment': 'border-[#e0ddd8] bg-[#f5f5f5] text-[#1c1c1c]',
  'Internet Conversation': 'border-[#e0ddd8] bg-[#f5f5f5] text-[#1c1c1c]',
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
    <article
      className="group relative block overflow-hidden rounded-[1.15rem] border border-[#eae7e2] bg-white p-5 shadow-sm transition duration-200 hover:border-[#d8d2c9] hover:shadow-[0_10px_24px_-20px_rgba(0,0,0,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c84c2f]/45"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`rounded-lg border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] ${categoryStyle[moment.category]}`}
        >
          {moment.category}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-zinc-500">Signal {moment.signalStrength}</span>
          <SaveToProjectButton
            item={{
              type: 'moment',
              sourceId: moment.id,
              originPage: 'moments',
              title: moment.headline,
              subtitle: moment.source,
              description: moment.description,
              url,
              metadata: {
                category: moment.category,
                observedAt: moment.observedAt,
              },
            }}
          />
        </div>
      </div>
      <h3 className="font-display text-lg leading-snug text-zinc-50 transition">{moment.headline}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400 transition">{moment.description}</p>
      <p className="mt-3 font-mono text-[11px] text-zinc-400">
        <span className="text-zinc-300">Source:</span> {moment.source}
        {formatObserved(moment.observedAt) ? ` · ${formatObserved(moment.observedAt)}` : ''}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Read article: ${moment.headline}`}
        className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#c84c2f] transition group-hover:text-[#c84c2f]"
      >
        <span>Read article</span>
        <ExternalLinkGlyph className="h-3.5 w-3.5 opacity-90" />
      </a>
      <div className="mt-4 border-t border-white/8 pt-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#c84c2f]/90">Why it matters for brands</p>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-200">{moment.whyForBrands}</p>
      </div>
    </article>
  );
}
