import { TalentProfileCard } from '../components/TalentProfileCard';
import type { TalentProfile } from '../types';

interface Props {
  profiles: TalentProfile[];
}

export function EmergingTalentView({ profiles }: Props) {
  return (
    <div className="cc-page">
      <div className="cc-pagehead">
        <div>
          <p className="cc-eyebrow">Early movers win</p>
          <h1 className="cc-title">Emerging talent</h1>
          <p className="cc-subtitle">
            Rising creators and breakout faces — prioritize education-first partnerships before the fee step-change.
          </p>
        </div>
      </div>
      <div className="cc-grid cc-grid--3">
        {profiles.map((p) => (
          <TalentProfileCard key={p.id} profile={p} />
        ))}
      </div>
    </div>
  );
}
