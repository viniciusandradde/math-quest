import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const required = [
  'index.html',
  'manifest.webmanifest',
  'sw.js',
  'brand/math-quest-logo.svg',
  'assets/environments/math-lab.svg',
  'assets/printables/mission-04-strategy-level.svg',
  'assets/printables/mission-05-geometry-logic.svg'
];
const missing = required.filter(file => !existsSync(join(dist, file)));
if (missing.length) {
  console.error('PWA beta: arquivos ausentes no build:', missing.join(', '));
  process.exitCode = 1;
} else {
  const manifest = JSON.parse(readFileSync(join(dist, 'manifest.webmanifest'), 'utf8'));
  const expected = '/math-quest/';
  const errors = [];
  if (manifest.start_url !== expected || manifest.scope !== expected) errors.push('start_url/scope incorretos');
  if (manifest.display !== 'standalone') errors.push('display não é standalone');
  if (!Array.isArray(manifest.icons) || manifest.icons.length < 2) errors.push('ícones insuficientes');
  for (const icon of manifest.icons ?? []) {
    const relative = String(icon.src).replace(/^\/math-quest\//, '');
    if (!existsSync(join(dist, relative))) errors.push('ícone não encontrado: ' + icon.src);
  }
  if (errors.length) {
    console.error('PWA beta: falhas no manifest:', errors.join('; '));
    process.exitCode = 1;
  } else {
    console.log('PWA beta: manifest, service worker, identidade visual e missões presentes.');
  }
}
