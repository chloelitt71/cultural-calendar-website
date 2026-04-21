import type { TalentProfile } from '../types';

interface Props {
  profile: TalentProfile;
}

export function TalentProfileCard({ profile }: Props) {
  return (
    <article className={`cc-card cc-card--talent${profile.emerging ? ' cc-card--emerging' : ''}`}>
      <header className="cc-card__head">
        <div>
          <h3 className="cc-card__title">{profile.name}</h3>
          <p className="cc-card__meta">{profile.category}</p>
        </div>
        {profile.emerging && <span className="cc-pill cc-pill--emerging">Emerging</span>}
      </header>
      <p className="cc-card__body">
        <strong className="cc-strong">Audience:</strong> {profile.audience}
      </p>
      <div className="cc-insight">
        <span className="cc-insight__label">Recent projects</span>
        <p>{profile.recentProjects}</p>
      </div>
      <div className="cc-insight">
        <span className="cc-insight__label">Brand fit</span>
        <p>{profile.brandFit}</p>
      </div>
      <div className="cc-insight">
        <span className="cc-insight__label">Cultural relevance</span>
        <p>{profile.culturalRelevance}</p>
      </div>
      {profile.emerging && (
        <>
          {profile.trendingWhy && (
            <div className="cc-insight cc-insight--accent">
              <span className="cc-insight__label">Why they’re trending</span>
              <p>{profile.trendingWhy}</p>
            </div>
          )}
          {profile.momentum && (
            <p className="cc-card__body">
              <strong className="cc-strong">Growth momentum:</strong> {profile.momentum}
            </p>
          )}
          {profile.actEarly && (
            <div className="cc-callout">
              <span className="cc-callout__label">Why brands should act early</span>
              <p>{profile.actEarly}</p>
            </div>
          )}
        </>
      )}
    </article>
  );
}
