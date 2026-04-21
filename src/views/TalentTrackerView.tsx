import { TalentProfileCard } from '../components/TalentProfileCard';
import type { TalentProfile } from '../types';

interface Props {
  profiles: TalentProfile[];
}

export function TalentTrackerView({ profiles }: Props) {
  return (
    <div className="cc-page">
      <div className="cc-pagehead">
        <div>
          <p className="cc-eyebrow">Established talent</p>
          <h1 className="cc-title">Talent Tracker</h1>
          <p className="cc-subtitle">
            Names with proven press cycles — use for partnerships, dressing, and long-lead announcements.
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
