/**
 * Inserts tiktokHandle + instagramHandle after each name: '...' on talent pool rows.
 * Idempotent: skips lines that already contain tiktokHandle.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function insertHandles(line) {
  if (!line.includes('{ id:') || line.includes('tiktokHandle:')) {
    return line;
  }
  const key = "name: '";
  const start = line.indexOf(key);
  if (start === -1) {
    return line;
  }
  let i = start + key.length;
  while (i < line.length) {
    const ch = line[i];
    if (ch === '\\' && i + 1 < line.length) {
      i += 2;
      continue;
    }
    if (ch === "'") {
      break;
    }
    i++;
  }
  if (i >= line.length || line[i] !== "'") {
    return line;
  }
  const rest = line.slice(i + 1);
  if (!rest.startsWith(', category:')) {
    return line;
  }
  return line.slice(0, i + 1) + ", tiktokHandle: '', instagramHandle: ''" + rest;
}

const files = [
  path.join(__dirname, '../src/data/talentPoolActors.ts'),
  path.join(__dirname, '../src/data/talentPoolMusic.ts'),
  path.join(__dirname, '../src/data/talentPoolInfluencers.ts'),
];

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const out = raw.split('\n').map(insertHandles).join('\n');
  fs.writeFileSync(file, out);
  console.log('updated', path.relative(path.join(__dirname, '..'), file));
}
