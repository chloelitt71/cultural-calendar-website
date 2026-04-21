import { useState } from 'react';
import type { FormEvent } from 'react';
import { generateBrandMatch, type BrandMatchInput } from '../utils/brandMatch';
import { EventCard } from '../components/EventCard';

const EXAMPLE: BrandMatchInput = {
  brandName: 'LumaRay',
  industry: 'beauty',
  audience: 'millennials interested in at-home devices',
  campaign: 'red light therapy mask launch',
  goal: 'awareness and creator buzz',
};

export function BrandMatchView() {
  const [form, setForm] = useState<BrandMatchInput>({
    brandName: '',
    industry: '',
    audience: '',
    campaign: '',
    goal: '',
  });
  const [submitted, setSubmitted] = useState<ReturnType<typeof generateBrandMatch> | null>(null);

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    setSubmitted(generateBrandMatch(form));
  }

  function loadExample() {
    setForm(EXAMPLE);
    setSubmitted(generateBrandMatch(EXAMPLE));
  }

  return (
    <div className="cc-page">
      <div className="cc-pagehead">
        <div>
          <p className="cc-eyebrow">Most used surface</p>
          <h1 className="cc-title">Brand Match</h1>
          <p className="cc-subtitle">
            Enter your brief — we simulate an AI-style match across cultural moments, talent, and activations. No
            login; runs instantly in the browser.
          </p>
        </div>
        <button type="button" className="cc-btn cc-btn--ghost" onClick={loadExample}>
          Load example scenario
        </button>
      </div>

      <div className="cc-bm-layout">
        <form className="cc-panel" onSubmit={onSubmit}>
          <h2 className="cc-panel__title">Input panel</h2>
          <label className="cc-field">
            <span>Brand name</span>
            <input
              className="cc-input"
              value={form.brandName}
              onChange={(e) => setForm({ ...form, brandName: e.target.value })}
              placeholder="e.g., LumaRay"
            />
          </label>
          <label className="cc-field">
            <span>Industry</span>
            <input
              className="cc-input"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              placeholder="beauty, fashion, sports…"
            />
          </label>
          <label className="cc-field">
            <span>Target audience</span>
            <input
              className="cc-input"
              value={form.audience}
              onChange={(e) => setForm({ ...form, audience: e.target.value })}
              placeholder="who you need to reach"
            />
          </label>
          <label className="cc-field">
            <span>Campaign or product launch</span>
            <input
              className="cc-input"
              value={form.campaign}
              onChange={(e) => setForm({ ...form, campaign: e.target.value })}
              placeholder='e.g., “red light therapy mask”'
            />
          </label>
          <label className="cc-field">
            <span>Campaign goal</span>
            <select className="cc-input" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
              <option value="">Select…</option>
              <option value="awareness">Awareness</option>
              <option value="buzz">Buzz & conversation</option>
              <option value="partnerships">Partnerships</option>
              <option value="consideration">Consideration / education</option>
            </select>
          </label>
          <button type="submit" className="cc-btn cc-btn--primary">
            Generate matches
          </button>
        </form>

        <div className="cc-bm-out">
          {!submitted && (
            <div className="cc-empty">
              <p className="cc-empty__title">Your ranked plan will appear here</p>
              <p className="cc-muted">
                Tip: include concrete nouns from your launch (e.g., “mask”, “Wimbledon”, “premiere”) for sharper
                matching.
              </p>
            </div>
          )}
          {submitted && (
            <>
              <section className="cc-section">
                <div className="cc-section__head">
                  <h2>Best cultural moments</h2>
                  <p className="cc-section__sub">Ranked by lexical fit to your brief (demo heuristic).</p>
                </div>
                <ol className="cc-rank">
                  {submitted.moments.map((m, rank) => (
                    <li key={m.event.id} className="cc-rank__item">
                      <div className="cc-rank__badge">{rank + 1}</div>
                      <div className="cc-rank__body">
                        <p className="cc-muted">
                          <strong className="cc-strong">Why it fits:</strong> {m.whyFit}
                        </p>
                        <p className="cc-muted">
                          <strong className="cc-strong">Suggested angle:</strong> {m.suggestedAngle}
                        </p>
                        <div className="cc-grid cc-grid--1">
                          <EventCard event={m.event} />
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="cc-section">
                <div className="cc-section__head">
                  <h2>Talent matches</h2>
                  <p className="cc-section__sub">Established + emerging — with partnership posture.</p>
                </div>
                <div className="cc-grid cc-grid--2">
                  {submitted.talents.map((t) => (
                    <article key={t.talent.id} className="cc-card">
                      <h3 className="cc-card__title">{t.talent.name}</h3>
                      <p className="cc-card__meta">{t.talent.category}</p>
                      <div className="cc-insight">
                        <span className="cc-insight__label">Why it fits</span>
                        <p>{t.whyFit}</p>
                      </div>
                      <div className="cc-insight">
                        <span className="cc-insight__label">Suggested angle</span>
                        <p>{t.suggestedAngle}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="cc-section">
                <div className="cc-section__head">
                  <h2>Activation opportunities</h2>
                  <p className="cc-section__sub">Where to show up — from side events to owned narratives.</p>
                </div>
                <div className="cc-grid cc-grid--2">
                  {submitted.activations.map((a) => (
                    <article key={a.title} className="cc-card cc-card--activation">
                      <h3 className="cc-card__title">{a.title}</h3>
                      <p className="cc-card__body">{a.detail}</p>
                      <div className="cc-insight">
                        <span className="cc-insight__label">Suggested angle</span>
                        <p>{a.suggestedAngle}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
