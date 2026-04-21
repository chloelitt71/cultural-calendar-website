/**
 * One-off helper: inject bestFor, activationStyle, partnershipStrength, brandUseCase
 * after risingTalent on each curated talent row. Re-run only if adding new rows without these fields.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function extractQuoted(line, key) {
  const prefix = `${key}: '`;
  const start = line.indexOf(prefix);
  if (start === -1) return '';
  let i = start + prefix.length;
  let out = '';
  while (i < line.length) {
    const ch = line[i];
    if (ch === "'") {
      let bs = 0;
      for (let k = i - 1; k >= 0 && line[k] === '\\'; k--) bs++;
      if (bs % 2 === 0) break;
      out += "'";
      i++;
      continue;
    }
    if (ch === '\\' && i + 1 < line.length) {
      const n = line[i + 1];
      if (n === "'") {
        out += "'";
        i += 2;
        continue;
      }
      if (n === '\\') {
        out += '\\';
        i += 2;
        continue;
      }
    }
    out += ch;
    i++;
  }
  return out;
}

function escapeForTs(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function buildInjection(line) {
  const name = extractQuoted(line, 'name');
  const first = name.split(/\s+/)[0] || 'Talent';
  const tag = extractQuoted(line, 'brandFitTag');
  const cat = extractQuoted(line, 'category');
  const seg = extractQuoted(line, 'segment');
  const hook = extractQuoted(line, 'upcomingHook');
  const rel = extractQuoted(line, 'currentRelevanceReason');
  const tagHead = tag
    ? tag
        .split('·')
        .map((s) => s.trim())
        .filter(Boolean)[0] ?? tag
    : '';

  const laneHint =
    seg === 'actors'
      ? 'press tours, awards corridors, red carpet, long-lead covers'
      : seg === 'music'
        ? 'routing, festivals, releases, live and streaming spikes'
        : 'short-form arcs, collab capsules, seeding, podcast/clip moments';

  const bestFor = [
    tagHead || 'Cross-lane cultural',
    cat ? cat : null,
    laneHint,
  ]
    .filter(Boolean)
    .join(' · ');

  const activationStyle =
    seg === 'actors'
      ? 'Earned-first: premieres and junkets, glossy profiles, styling desks, limited set visits, award-season FYC.'
      : seg === 'music'
        ? 'Live-led: tour routing, festival stages, fan zones, streaming bundles, day-of-drop content.'
        : 'Creator-native: serialized shorts, collab SKUs, live streams, affiliate and mailer programs.';

  const relShort = rel.length > 100 ? `${rel.slice(0, 97)}…` : rel;
  const partnershipStrength = tagHead
    ? `Differentiates on ${tagHead} credibility; ${relShort}`
    : `Story-led partnership fit; ${relShort}`;

  const hookShort = hook.length > 95 ? `${hook.slice(0, 92)}…` : hook;
  const brandUseCase = `Brief ${first} when objectives align with ${tag || 'their roster lane'} and you can sync creative to live hooks (${hookShort}).`;

  return `bestFor: '${escapeForTs(bestFor)}', activationStyle: '${escapeForTs(activationStyle)}', partnershipStrength: '${escapeForTs(partnershipStrength)}', brandUseCase: '${escapeForTs(brandUseCase)}', `;
}

function injectLine(line) {
  if (!line.includes('{ id:')) return line;
  if (line.includes('bestFor:')) return line;

  const inj = buildInjection(line);

  if (line.includes('risingTalent: true,') || line.includes('risingTalent: false,')) {
    return line.replace(/risingTalent: (true|false),/, `risingTalent: $1, ${inj}`);
  }
  // Last field before closing brace: risingTalent: true },
  if (/risingTalent: (true|false) \},/.test(line)) {
    return line.replace(/risingTalent: (true|false) \},/, `risingTalent: $1, ${inj}},`);
  }

  return line;
}

const files = [
  path.join(__dirname, '../src/data/talentPoolActors.ts'),
  path.join(__dirname, '../src/data/talentPoolMusic.ts'),
  path.join(__dirname, '../src/data/talentPoolInfluencers.ts'),
];

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const out = raw
    .split('\n')
    .map((line) => injectLine(line))
    .join('\n');
  fs.writeFileSync(file, out);
  console.log('updated', path.relative(path.join(__dirname, '..'), file));
}
