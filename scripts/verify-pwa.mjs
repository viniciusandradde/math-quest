import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve('dist');
const fail = message => { console.error(`FAIL: ${message}`); process.exitCode = 1; };
const pass = message => console.log(`PASS: ${message}`);
const required = ['index.html', 'manifest.webmanifest', 'sw.js', 'workbox-*.js', 'icons/icon-192.svg', 'icons/icon-512.svg'];
for (const file of required) {
  if (file.includes('*')) {
    const prefix = file.replace('*', '');
    const { readdirSync } = await import('node:fs');
    if (readdirSync(dist).some(name => name.startsWith(prefix))) pass(file);
    else fail(`Arquivo ausente: ${file}`);
  } else if (existsSync(resolve(dist, file))) pass(file);
  else fail(`Arquivo ausente: ${file}`);
}
const manifestPath = resolve(dist, 'manifest.webmanifest');
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.start_url === '/math-quest/' && manifest.scope === '/math-quest/') pass('Escopo e URL inicial');
  else fail('Escopo ou start_url incorretos');
  if (manifest.display === 'standalone') pass('Modo standalone');
  else fail('Modo standalone ausente');
  for (const icon of manifest.icons ?? []) {
    const iconPath = resolve(dist, icon.src.replace(/^\/math-quest\//, ''));
    if (existsSync(iconPath)) pass(`Ícone ${icon.sizes}`);
    else fail(`Ícone não encontrado: ${icon.src}`);
  }
}
if (process.exitCode) process.exit(process.exitCode);
