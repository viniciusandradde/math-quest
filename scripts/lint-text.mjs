#!/usr/bin/env node
/**
 * Lint de linguagem (Padrão VSA de Bem-Estar Digital Infantil, docs/standards/CHILD-WELLBEING-STANDARD.md §8).
 * Procura, nos textos do app (src/, sem testes), linguagem de violência, culpa ou castigo,
 * família restrita ("mamãe ou papai") e nomes de personagens licenciados.
 * Comentários de código são ignorados.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const L = '\\p{L}';
const word = term => new RegExp(`(?<![${L}])(?:${term})(?![${L}])`, 'iu');

const rules = [
  ['violência', word('matar|mata|morr[ea]u?|morte|sangue|armas?|tiros?|explod\\w*|golpe\\w*|esmag\\w*|bat[ae] nele|bater nele|derrot\\w*|furios\\w*|viol[eê]nci\\w*')],
  ['culpa ou castigo', word('castig\\w*|desobedec\\w*|que feio|culpa|vergonha|preguiç\\w*|você falhou|fracass\\w*|burr[oa]s?')],
  ['família restrita', word('mam[ãa]e ou (?:o )?papai|papai ou (?:a )?mam[ãa]e|sua mãe e seu pai|seu pai e sua mãe')],
  ['marca licenciada', word('homem de ferro|capit[ãa]o am[ée]rica|homem-aranha|batman|superman|pok[ée]mon|minecraft|patrulha canina|peppa|disney|marvel')]
];

function files(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(tsx?|mjs|js)$/.test(name) && !/\.test\./.test(name) ? [path] : [];
  });
}

/** Remove comentários mantendo as quebras de linha (para apontar a linha certa). */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, block => block.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1');
}

let problems = 0;
for (const file of files(join(root, 'src'))) {
  const lines = stripComments(readFileSync(file, 'utf8')).split('\n');
  lines.forEach((line, index) => {
    for (const [label, pattern] of rules) {
      const match = line.match(pattern);
      if (match) {
        problems += 1;
        console.log(`${relative(root, file)}:${index + 1}  [${label}] "${match[0]}"`);
      }
    }
  });
}

console.log(problems ? `\n${problems} texto(s) fora do Padrão VSA de linguagem.` : 'Textos ok: nenhuma linguagem de violência, culpa, família restrita ou marca licenciada.');
process.exit(problems ? 1 : 0);
