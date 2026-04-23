import { useState } from 'react';
import type { RankedCuratedTalent } from '../pulse/types';
import { SaveToProjectButton } from './SaveToProjectButton';

const industryLabel: Record<string, string> = {
  beauty: 'Beauty',
  fashion: 'Fashion',
  lifestyle: 'Lifestyle',
  entertainment: 'Entertainment',
  consumer: 'Consumer',
};

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

const DEFAULT_TONE: CategoryTone = CATEGORY_TONES.consumer;

function toneForIndustry(industry?: string): CategoryTone {
  if (!industry) return DEFAULT_TONE;
  return CATEGORY_TONES[industry.toLowerCase()] ?? DEFAULT_TONE;
}

function ScoreBar({ label, value, tone }: { label: string; value: number; tone: CategoryTone }) {
  return (
    <div>
      <div className="mb-0.5 flex justify-between font-mono text-[9px] uppercase tracking-wide text-zinc-500">
        <span>{label}</span>
        <span className="text-zinc-400">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-lg bg-[#ece9e4]">
        <div className="h-full rounded-lg" style={{ width: `${value}%`, backgroundColor: tone.dot }} />
      </div>
    </div>
  );
}

type ConfidenceLevel = 'High confidence' | 'Medium confidence' | 'Low confidence';

interface RepresentationInfo {
  agencyName?: string;
  managerName?: string;
  descriptor?: string;
  confidence: ConfidenceLevel;
  tag?: 'Agented' | 'Manager-led' | 'Independent';
  links: Array<{ id: string; label: string; href: string }>;
}

function toHandleUrl(platform: 'instagram' | 'tiktok', handle?: string): string | null {
  const normalized = handle?.trim().replace(/^@/, '');
  if (!normalized) return null;
  return platform === 'instagram' ? `https://instagram.com/${normalized}` : `https://www.tiktok.com/@${normalized}`;
}

function buildRepresentation(profile: RankedCuratedTalent): RepresentationInfo {
  const websiteUrl = profile.publicWebsiteUrl?.trim();
  const agencyUrl = profile.publicAgencyUrl?.trim();
  const instagramUrl = toHandleUrl('instagram', profile.instagramHandle);
  const tiktokUrl = toHandleUrl('tiktok', profile.tiktokHandle);
  const hasAnyPublicRoute = Boolean(websiteUrl || agencyUrl || instagramUrl || tiktokUrl);

  const descriptor =
    profile.publicRepresentationNote?.trim() ||
    (!profile.publicAgencyName && !profile.publicManagerName && hasAnyPublicRoute ? 'Public contact route available' : undefined);

  let confidence: ConfidenceLevel = 'Low confidence';
  if (profile.publicAgencyName && (profile.publicManagerName || agencyUrl)) {
    confidence = 'High confidence';
  } else if (profile.publicAgencyName || profile.publicManagerName || profile.publicRepresentationNote || agencyUrl) {
    confidence = 'Medium confidence';
  }

  const links: RepresentationInfo['links'] = [
    websiteUrl ? { id: 'website', label: 'View website', href: websiteUrl } : null,
    agencyUrl ? { id: 'agency', label: 'View agency', href: agencyUrl } : null,
    instagramUrl ? { id: 'instagram', label: 'Instagram', href: instagramUrl } : null,
    tiktokUrl ? { id: 'tiktok', label: 'TikTok', href: tiktokUrl } : null,
  ].filter(Boolean) as RepresentationInfo['links'];

  const inferredTag = profile.publicAgencyName
    ? 'Agented'
    : profile.publicManagerName
      ? 'Manager-led'
      : profile.representationTag;

  return {
    agencyName: profile.publicAgencyName,
    managerName: profile.publicManagerName,
    descriptor,
    confidence,
    tag: inferredTag,
    links,
  };
}

function firstSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const sentence = trimmed.split(/(?<=[.!?])\s+/)[0] ?? trimmed;
  return sentence.length > 170 ? `${sentence.slice(0, 167).trim()}...` : sentence;
}

function bestForKeywords(bestFor: string, fallback: string): string {
  const pieces = bestFor
    .split(/[·,|/]/g)
    .map((token) => token.trim())
    .filter((token) => token.length > 2);
  const shortlist = pieces.slice(0, 5);
  if (shortlist.length >= 3) {
    return shortlist.join(' • ');
  }
  return fallback;
}

export function DiscoveryTalentCard({ profile }: { profile: RankedCuratedTalent }) {
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const representation = buildRepresentation(profile);
  const whyLine = firstSentence(profile.currentRelevanceReason);
  const bestForLine = bestForKeywords(profile.bestFor, profile.brandFitTag);
  const primaryIndustry = profile.industries[0]?.toLowerCase();
  const primaryTone = toneForIndustry(primaryIndustry);

  return (
    <article className="relative overflow-hidden rounded-[1.15rem] border border-[#eae7e2] bg-white p-5 shadow-[0_1px_2px_rgba(15,18,24,0.05)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1" style={{ backgroundColor: primaryTone.tint }} />
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl text-zinc-50">{profile.name}</h3>
        </div>
        <div className="rounded-lg px-2.5 py-1 text-right" style={{ border: `1px solid ${primaryTone.border}`, backgroundColor: primaryTone.tint }}>
          <span className="block font-mono text-[9px] uppercase tracking-wide text-zinc-500">Score</span>
          <span className="font-mono text-sm text-zinc-300">{profile.relevanceScore}</span>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        <span
          className="inline-flex items-center gap-1.5 rounded-lg border bg-[#f5f5f5] px-2 py-0.5 font-mono text-[10px] text-[#1c1c1c]"
          style={{ borderColor: primaryTone.border }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: primaryTone.dot }} aria-hidden />
          {profile.category}
        </span>
        <span className="rounded-lg border border-[#e0ddd8] bg-[#f5f5f5] px-2 py-0.5 font-mono text-[10px] text-[#1c1c1c]">
          {profile.subcategory}
        </span>
        {profile.industries.map((ind) => (
          <span
            key={ind}
            className="inline-flex items-center gap-1.5 rounded-lg border bg-[#f5f5f5] px-2 py-0.5 font-mono text-[10px] text-[#1c1c1c]"
            style={{ borderColor: toneForIndustry(ind).border }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: toneForIndustry(ind).dot }} aria-hidden />
            {industryLabel[ind] ?? ind}
          </span>
        ))}
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">Why they matter right now</p>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-200">{whyLine}</p>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">Best for</p>
      <p className="mt-1 text-sm text-zinc-300">{bestForLine}</p>

      <button
        type="button"
        onClick={() => setIsBriefOpen((open) => !open)}
        className="mt-4 text-sm font-medium text-[#c84c2f] transition hover:text-[#c84c2f]"
      >
        {isBriefOpen ? 'Hide Brief ↑' : 'View Brief →'}
      </button>
      <div className="mt-3">
        <SaveToProjectButton
          item={{
            type: 'talent',
            sourceId: profile.id,
            originPage: 'talent',
            title: profile.name,
            subtitle: `${profile.category} • ${profile.subcategory}`,
            description: whyLine,
            metadata: {
              segment: profile.segment,
              relevanceScore: String(profile.relevanceScore),
            },
          }}
        />
      </div>

      {isBriefOpen && (
        <div className="mt-4 space-y-4 border-t border-white/8 pt-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">Persona & content</p>
            <p className="mt-1 text-sm text-zinc-300">{profile.contentPersonaStyle}</p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">Brand fit</p>
            <p className="mt-1 text-sm text-zinc-300">
              <span className="text-zinc-100">{profile.brandFitTag}</span> — {profile.audience}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">PR strategy</p>
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

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">Upcoming timing hook</p>
            <p className="mt-1 text-sm text-zinc-200">{profile.upcomingHook}</p>
          </div>

          {profile.segment === 'actors' && (profile.upcomingFilmTv || profile.premiereWindow) && (
            <div className="rounded-lg border border-white/8 bg-white px-3 py-2 text-xs text-zinc-400">
              {profile.upcomingFilmTv && <p className="text-zinc-300">{profile.upcomingFilmTv}</p>}
              {profile.premiereWindow && <p className="mt-1">{profile.premiereWindow}</p>}
              {profile.awardOrPressCycle && <p className="mt-1 text-zinc-500">{profile.awardOrPressCycle}</p>}
            </div>
          )}

          {profile.segment === 'music' && (profile.tourFestival || profile.releaseNote || profile.liveVisibilityNote) && (
            <div className="rounded-lg border border-white/8 bg-white px-3 py-2 text-xs text-zinc-400">
              {profile.tourFestival && <p>{profile.tourFestival}</p>}
              {profile.releaseNote && <p className="mt-1 text-zinc-500">{profile.releaseNote}</p>}
              {profile.liveVisibilityNote && <p className="mt-1">{profile.liveVisibilityNote}</p>}
            </div>
          )}

          {profile.segment === 'influencers' && (profile.socialTractionNote || profile.partnershipPotentialNote || profile.conversationVolumeNote) && (
            <div className="space-y-1.5 rounded-lg border border-white/8 bg-white px-3 py-2 text-xs text-zinc-300">
              {profile.partnershipPotentialNote && <p>Partnership: {profile.partnershipPotentialNote}</p>}
              {profile.socialTractionNote && <p>Social: {profile.socialTractionNote}</p>}
              {profile.conversationVolumeNote && <p>Conversation: {profile.conversationVolumeNote}</p>}
            </div>
          )}

          <div className="space-y-3 border-t border-white/8 pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">Representation</p>
              <span className="font-mono text-[10px] text-zinc-500">{representation.confidence}</span>
            </div>

            {representation.tag && (
              <span className="inline-block rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                {representation.tag}
              </span>
            )}

            {(representation.agencyName || representation.managerName || representation.descriptor) ? (
              <div className="space-y-1.5 text-xs leading-relaxed">
                {representation.agencyName && (
                  <p className="text-zinc-400">
                    <span className="font-mono uppercase tracking-wide text-zinc-500">Agency</span>{' '}
                    <span className="text-zinc-200">{representation.agencyName}</span>
                  </p>
                )}
                {representation.managerName && (
                  <p className="text-zinc-400">
                    <span className="font-mono uppercase tracking-wide text-zinc-500">Manager</span>{' '}
                    <span className="text-zinc-200">{representation.managerName}</span>
                  </p>
                )}
                {representation.descriptor && <p className="text-zinc-300">{representation.descriptor}</p>}
              </div>
            ) : (
              <p className="text-xs text-zinc-500">No clear public representation listed</p>
            )}

            {representation.links.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-white/8 pt-3 text-xs">
                {representation.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-400 underline-offset-4 transition hover:text-zinc-200 hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 border-t border-white/8 pt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">Drivers (0–100)</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <ScoreBar label="Cultural momentum" value={profile.momentumScore} tone={primaryTone} />
              <ScoreBar label="Press visibility" value={profile.pressVisibilityScore} tone={primaryTone} />
              <ScoreBar label="Brand friendliness" value={profile.brandFitScore} tone={primaryTone} />
              <ScoreBar label="Audience fit" value={profile.audienceRelevanceScore} tone={primaryTone} />
              <ScoreBar label="Timing urgency" value={profile.timingUrgencyScore} tone={primaryTone} />
            </div>
            {profile.risingTalent && (
              <span className="inline-block rounded-lg border border-[#e0ddd8] bg-[#f5f5f5] px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-[#1c1c1c]">
                Rising trajectory
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
