/**
 * Motor pedagógico do perfil de 3 a 6 anos.
 *
 * Princípios: uma ideia por vez, material concreto (objetos para tocar e contar),
 * poucas opções no início (duas), sem tempo e sem punição. A criança tenta de novo até
 * acertar; o progresso usa apenas o acerto de primeira como evidência.
 *
 * Cada brincadeira tem 7 níveis, descritos em tabelas (`*_LEVELS`) para facilitar a
 * revisão pedagógica: o nível 1 serve a quem tem 3 anos; o 7, a quem está perto dos 6.
 */

export type EarlyActivityId =
  | 'igual' | 'diferente' | 'tamanhos' | 'contar' | 'comparar'
  | 'formas' | 'sequencias' | 'vizinhos' | 'juntar' | 'tirar';
export type EarlyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export const EARLY_LEVELS: EarlyLevel[] = [1, 2, 3, 4, 5, 6, 7];
export const MAX_EARLY_LEVEL: EarlyLevel = 7;

export type ShapeId = 'circulo' | 'quadrado' | 'triangulo' | 'retangulo' | 'oval' | 'losango' | 'estrela';
export type ColorId = 'azul' | 'amarelo' | 'verde' | 'laranja';
export type ShapeSize = 'grande' | 'pequeno';
export type ShapeToken = { shape: ShapeId; color: ColorId; size?: ShapeSize };
export type CountItem = 'estrela' | 'moeda' | 'cristal' | 'chave' | 'energia' | 'engrenagem';

export type EarlyOption = { label: string; number?: number; token?: ShapeToken; group?: number; scale?: number };

export type EarlyScene =
  | { kind: 'match'; target: ShapeToken }
  | { kind: 'odd'; tokens: ShapeToken[] }
  | { kind: 'sizes'; item: CountItem; scales: number[]; ask: 'maior' | 'menor' | 'medio' }
  | { kind: 'count'; item: CountItem; count: number }
  | { kind: 'compare'; item: CountItem; groups: number[]; ask: 'mais' | 'menos' }
  | { kind: 'shapes'; target: ShapeId }
  | { kind: 'pattern'; sequence: ShapeToken[]; gap: number }
  | { kind: 'neighbors'; track: (number | null)[]; ask: 'antes' | 'depois' | 'entre' }
  | { kind: 'join'; item: CountItem; a: number; b: number }
  | { kind: 'take'; item: CountItem; total: number; away: number };

export type EarlyQuestion = {
  id: string;
  activity: EarlyActivityId;
  level: EarlyLevel;
  /** Pedido curto: aparece na tela e é falado pelo professor de voz. */
  prompt: string;
  /** Frases calmas, uma por pausa, ditas depois de uma tentativa que não deu certo. */
  hint: string[];
  /** Reforço dito depois do acerto, explicando o porquê. */
  praise: string;
  scene: EarlyScene;
  options: EarlyOption[];
  answerIndex: number;
};

export type EarlyActivity = {
  id: EarlyActivityId;
  title: string;
  subtitle: string;
  fromAge: 3 | 4 | 5;
  /** Explicação do professor de voz ao abrir a brincadeira. */
  intro: string[];
};

export const earlyActivities: EarlyActivity[] = [
  { id: 'igual', title: 'Ache o igual', subtitle: 'Mesma forma, mesma cor', fromAge: 3,
    intro: ['Oi! Vamos brincar de achar o igual.', 'Olhe a figura lá em cima.', 'Agora toque na figura igualzinha a ela.'] },
  { id: 'diferente', title: 'Qual é diferente?', subtitle: 'O que não combina', fromAge: 3,
    intro: ['Vamos procurar o diferente.', 'Quase todas as figuras são iguais.', 'Uma delas não combina.', 'Toque na figura diferente.'] },
  { id: 'tamanhos', title: 'Grande e pequeno', subtitle: 'Maior e menor', fromAge: 3,
    intro: ['Vamos comparar tamanhos.', 'Algumas figuras são grandes, outras são pequenas.', 'Escute o que eu peço e toque na figura certa.'] },
  { id: 'contar', title: 'Conte comigo', subtitle: 'Toque e conte', fromAge: 3,
    intro: ['Vamos contar juntos?', 'Toque em cada figura, uma de cada vez.', 'Eu conto com você.', 'Depois, toque no número.'] },
  { id: 'comparar', title: 'Onde tem mais?', subtitle: 'Mais e menos', fromAge: 3,
    intro: ['Vamos olhar os grupos.', 'Eu vou perguntar onde tem mais.', 'Olhe com calma e toque no grupo.'] },
  { id: 'formas', title: 'Formas', subtitle: 'Círculo, quadrado, triângulo', fromAge: 3,
    intro: ['Vamos conhecer as formas.', 'Eu vou falar o nome de uma forma.', 'Você toca na forma certa.'] },
  { id: 'sequencias', title: 'O que vem depois?', subtitle: 'Sequências', fromAge: 4,
    intro: ['Olhe esta fila de figuras.', 'Ela vai se repetindo, sempre igual.', 'Descubra qual figura completa a fila.'] },
  { id: 'vizinhos', title: 'Antes e depois', subtitle: 'Vizinhos dos números', fromAge: 4,
    intro: ['Os números moram em fila.', 'Cada número tem um vizinho antes e um vizinho depois.', 'Descubra qual número está faltando.'] },
  { id: 'juntar', title: 'Juntar', subtitle: 'Somar com objetos', fromAge: 5,
    intro: ['Vamos juntar dois grupos.', 'Toque em cada figura para contar tudo.', 'Depois, toque no número que mostra quantas ficaram.'] },
  { id: 'tirar', title: 'Tirar', subtitle: 'Quantos ficaram?', fromAge: 5,
    intro: ['Agora algumas figuras vão embora.', 'As que saíram ficam clarinhas.', 'Conte só as que ficaram e toque no número.'] }
];

export const shapeNames: Record<ShapeId, string> = {
  circulo: 'círculo', quadrado: 'quadrado', triangulo: 'triângulo', retangulo: 'retângulo', oval: 'oval', losango: 'losango', estrela: 'estrela'
};
const shapeArticle = (shape: ShapeId) => (shape === 'estrela' ? 'a' : 'o');
const shapeHints: Record<ShapeId, string> = {
  circulo: 'O círculo é redondinho. Ele não tem pontas.',
  quadrado: 'O quadrado tem quatro lados iguais.',
  triangulo: 'O triângulo tem três lados e três pontas.',
  retangulo: 'O retângulo tem quatro lados. Dois compridos e dois curtinhos.',
  oval: 'O oval é redondinho e comprido, como um ovo.',
  losango: 'O losango parece uma pipa. Tem uma ponta em cima e outra embaixo.',
  estrela: 'A estrela tem cinco pontas.'
};
export const colorNames: Record<ColorId, string> = { azul: 'azul', amarelo: 'amarelo', verde: 'verde', laranja: 'laranja' };
const colorFeminine: Record<ColorId, string> = { azul: 'azul', amarelo: 'amarela', verde: 'verde', laranja: 'laranja' };

type Noun = { singular: string; plural: string; feminine: boolean };
export const itemNouns: Record<CountItem, Noun> = {
  estrela: { singular: 'estrela', plural: 'estrelas', feminine: true },
  moeda: { singular: 'moeda', plural: 'moedas', feminine: true },
  cristal: { singular: 'cristal', plural: 'cristais', feminine: false },
  chave: { singular: 'chave', plural: 'chaves', feminine: true },
  energia: { singular: 'bateria', plural: 'baterias', feminine: true },
  engrenagem: { singular: 'engrenagem', plural: 'engrenagens', feminine: true }
};

const words = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez',
  'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove', 'vinte'];

/** Número por extenso para a fala ("uma estrela", "dois cristais"). */
export function numberWord(n: number, feminine = false): string {
  if (feminine && n === 1) return 'uma';
  if (feminine && n === 2) return 'duas';
  return words[n] ?? String(n);
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const quantity = (n: number, item: CountItem) => numberWord(n, itemNouns[item].feminine) + ' ' + (n === 1 ? itemNouns[item].singular : itemNouns[item].plural);
const howMany = (noun: Noun) => (noun.feminine ? 'quantas' : 'quantos');
export const tokenName = (token: ShapeToken) => {
  const feminine = token.shape === 'estrela';
  const color = feminine ? colorFeminine[token.color] : colorNames[token.color];
  const size = token.size === 'pequeno' && feminine ? 'pequena' : token.size;
  return shapeNames[token.shape] + ' ' + color + (size ? ' ' + size : '');
};
const withArticle = (token: ShapeToken) => (shapeArticle(token.shape) === 'a' ? 'uma ' : 'um ') + tokenName(token);

/** Contagem falada uma palavra por pausa: "Um.", "Dois.", "Três." */
export function countAloud(n: number, from = 1): string[] {
  const lines: string[] = [];
  for (let i = from; i <= n; i += 1) lines.push(capitalize(words[i] ?? String(i)) + '.');
  return lines;
}

/* ---------- níveis ---------- */

export type EarlyStats = { attempts: number; firstTry: number };

/** Limiares para subir de nível: acertos de primeira e proporção de acertos de primeira. */
export const LEVEL_THRESHOLDS: { level: EarlyLevel; firstTry: number; ratio: number }[] = [
  { level: 2, firstTry: 4, ratio: 0.6 },
  { level: 3, firstTry: 8, ratio: 0.65 },
  { level: 4, firstTry: 12, ratio: 0.65 },
  { level: 5, firstTry: 16, ratio: 0.7 },
  { level: 6, firstTry: 20, ratio: 0.7 },
  { level: 7, firstTry: 25, ratio: 0.75 }
];

/** Sobe de nível só com evidência: acertos de primeira suficientes e consistentes. */
export function earlyLevel(stats: EarlyStats): EarlyLevel {
  const ratio = stats.attempts ? stats.firstTry / stats.attempts : 0;
  let level: EarlyLevel = 1;
  for (const threshold of LEVEL_THRESHOLDS) {
    if (stats.firstTry >= threshold.firstTry && ratio >= threshold.ratio) level = threshold.level;
  }
  return level;
}

const at = <T,>(table: readonly T[], level: EarlyLevel): T => table[level - 1];

/* ---------- utilidades com aleatoriedade injetável (testes determinísticos) ---------- */

type Random = () => number;
const int = (random: Random, min: number, max: number) => min + Math.floor(random() * (max - min + 1));
const pick = <T,>(random: Random, list: readonly T[]) => list[Math.floor(random() * list.length)];
function shuffle<T>(random: Random, list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export const sameToken = (a: ShapeToken, b: ShapeToken) => a.shape === b.shape && a.color === b.color && (a.size ?? 'grande') === (b.size ?? 'grande');
const allColors: ColorId[] = ['azul', 'amarelo', 'verde', 'laranja'];
const allShapes: ShapeId[] = ['circulo', 'quadrado', 'triangulo', 'retangulo', 'oval', 'losango', 'estrela'];
const countItems: CountItem[] = ['estrela', 'moeda', 'cristal', 'chave', 'energia', 'engrenagem'];
const other = <T,>(random: Random, list: readonly T[], not: T) => pick(random, list.filter(value => value !== not));

/** Opções numéricas próximas da resposta, em ordem crescente (previsível para a criança). */
function numberOptions(random: Random, answer: number, size: number, max: number): EarlyOption[] {
  const values = new Set<number>([answer]);
  const offsets = [...shuffle(random, [-1, 1]), ...shuffle(random, [-2, 2]), ...shuffle(random, [3, -3, 4, -4])];
  for (const offset of offsets) {
    if (values.size >= size) break;
    const value = answer + offset;
    if (value >= 1 && value <= Math.max(max, answer + 3)) values.add(value);
  }
  return [...values].sort((a, b) => a - b).map(number => ({ number, label: numberWord(number) }));
}

function finish(question: Omit<EarlyQuestion, 'answerIndex' | 'options'>, options: EarlyOption[], isAnswer: (option: EarlyOption, index: number) => boolean): EarlyQuestion {
  return { ...question, options, answerIndex: options.findIndex(isAnswer) };
}

/** Gera um distrator mudando exatamente um atributo (forma, cor ou tamanho). */
function changeOne(random: Random, token: ShapeToken, shapes: ShapeId[], attributes: ('shape' | 'color' | 'size')[]): ShapeToken {
  const attribute = pick(random, attributes);
  if (attribute === 'shape') return { ...token, shape: other(random, shapes, token.shape) };
  if (attribute === 'color') return { ...token, color: other(random, allColors, token.color) };
  return { ...token, size: token.size === 'pequeno' ? 'grande' : 'pequeno' };
}

/* ---------- Ache o igual ---------- */

const MATCH_LEVELS = [
  { options: 2, mode: 'both', shapes: 3, sizes: false },
  { options: 3, mode: 'both', shapes: 3, sizes: false },
  { options: 3, mode: 'one', shapes: 3, sizes: false },
  { options: 4, mode: 'one', shapes: 3, sizes: false },
  { options: 4, mode: 'one', shapes: 4, sizes: false },
  { options: 3, mode: 'size', shapes: 4, sizes: true },
  { options: 4, mode: 'any', shapes: 5, sizes: true }
] as const;

function buildMatch(random: Random, level: EarlyLevel, id: string): EarlyQuestion {
  const cfg = at(MATCH_LEVELS, level);
  const shapes = allShapes.slice(0, cfg.shapes);
  const target: ShapeToken = { shape: pick(random, shapes), color: pick(random, allColors), ...(cfg.sizes ? { size: pick(random, ['grande', 'pequeno'] as ShapeSize[]) } : {}) };
  const distractors: ShapeToken[] = [];
  if (cfg.mode === 'size') distractors.push({ ...target, size: target.size === 'pequeno' ? 'grande' : 'pequeno' });
  let guard = 0;
  while (distractors.length < cfg.options - 1 && guard < 200) {
    guard += 1;
    const candidate: ShapeToken = cfg.mode === 'both'
      ? { ...target, shape: other(random, shapes, target.shape), color: other(random, allColors, target.color) }
      : changeOne(random, target, shapes, cfg.mode === 'any' ? ['shape', 'color', 'size'] : ['shape', 'color']);
    if (!sameToken(candidate, target) && !distractors.some(d => sameToken(d, candidate))) distractors.push(candidate);
  }
  const options = shuffle(random, [target, ...distractors]).map(token => ({ token, label: tokenName(token) }));
  return finish({
    id, activity: 'igual', level, scene: { kind: 'match', target },
    prompt: 'Toque na figura igual.',
    hint: [cfg.sizes ? 'Olhe a forma, a cor e o tamanho.' : 'Olhe a forma e a cor.', 'Lá em cima tem ' + withArticle(target) + '.', 'Procure outra figura igualzinha.'],
    praise: 'É ' + withArticle(target).replace(/^um /, 'o mesmo ').replace(/^uma /, 'a mesma ') + '.'
  }, options, option => !!option.token && sameToken(option.token, target));
}

/* ---------- Qual é diferente? ---------- */

const ODD_LEVELS = [
  { count: 3, diff: 'both' }, { count: 3, diff: 'color' }, { count: 3, diff: 'shape' }, { count: 4, diff: 'color' },
  { count: 4, diff: 'shape' }, { count: 4, diff: 'size' }, { count: 5, diff: 'any' }
] as const;

function buildOdd(random: Random, level: EarlyLevel, id: string): EarlyQuestion {
  const cfg = at(ODD_LEVELS, level);
  const shapes = allShapes.slice(0, level >= 5 ? 5 : level === 4 ? 4 : 3);
  const usesSize = cfg.diff === 'size' || cfg.diff === 'any';
  const base: ShapeToken = { shape: pick(random, shapes), color: pick(random, allColors), ...(usesSize ? { size: 'grande' as ShapeSize } : {}) };
  const kind = cfg.diff === 'any' ? pick(random, ['shape', 'color', 'size'] as const) : cfg.diff;
  const odd: ShapeToken = kind === 'both' ? { ...base, shape: other(random, shapes, base.shape), color: other(random, allColors, base.color) }
    : kind === 'size' ? { ...base, size: 'pequeno' }
      : changeOne(random, base, shapes, [kind]);
  const oddIndex = int(random, 0, cfg.count - 1);
  const tokens = Array.from({ length: cfg.count }, (_, i) => (i === oddIndex ? odd : base));
  const why = { both: 'Uma tem outra forma e outra cor.', color: 'Uma tem outra cor.', shape: 'Uma tem outra forma.', size: 'Uma tem outro tamanho.' }[kind];
  return finish({
    id, activity: 'diferente', level, scene: { kind: 'odd', tokens },
    prompt: 'Qual é diferente?',
    hint: [usesSize ? 'Olhe a forma, a cor e o tamanho.' : 'Olhe a forma e a cor.', capitalize(numberWord(cfg.count - 1, true)) + ' figuras são iguais.', why],
    praise: 'Essa é diferente: é ' + withArticle(odd) + '.'
  }, tokens.map((token, i) => ({ token, label: 'figura ' + (i + 1) + ': ' + tokenName(token) })), (_option, index) => index === oddIndex);
}

/* ---------- Grande e pequeno ---------- */

const SIZE_LEVELS = [
  { scales: [1, 0.45], asks: ['maior'] },
  { scales: [1, 0.5], asks: ['maior', 'menor'] },
  { scales: [1, 0.7, 0.42], asks: ['maior', 'menor'] },
  { scales: [1, 0.78, 0.56], asks: ['maior', 'menor'] },
  { scales: [1, 0.8, 0.62, 0.45], asks: ['maior', 'menor'] },
  { scales: [1, 0.86, 0.72, 0.58], asks: ['maior', 'menor'] },
  { scales: [1, 0.72, 0.45], asks: ['maior', 'menor', 'medio'] }
] as const;

function buildSizes(random: Random, level: EarlyLevel, id: string): EarlyQuestion {
  const cfg = at(SIZE_LEVELS, level);
  const item = pick(random, countItems);
  const noun = itemNouns[item];
  const scales = shuffle(random, [...cfg.scales]);
  const ask = pick(random, cfg.asks);
  const sorted = [...scales].sort((a, b) => b - a);
  const answerScale = ask === 'maior' ? sorted[0] : ask === 'menor' ? sorted[sorted.length - 1] : sorted[1];
  const f = noun.feminine;
  const art = f ? 'a' : 'o';
  const askWord = ask === 'medio' ? 'do meio' : ask;
  const hintByAsk = {
    maior: capitalize(art) + ' maior é ' + art + ' que ocupa mais espaço.',
    menor: capitalize(art) + ' menor é ' + art + ' mais pequenininh' + art + '.',
    medio: capitalize(art) + ' do meio não é ' + art + ' maior nem ' + art + ' menor.'
  };
  return finish({
    id, activity: 'tamanhos', level, scene: { kind: 'sizes', item, scales, ask },
    prompt: 'Toque ' + (f ? 'na ' : 'no ') + noun.singular + ' ' + askWord + '.',
    hint: ['Olhe com calma o tamanho de cada ' + noun.singular + '.', hintByAsk[ask]],
    praise: (f ? 'Essa é a ' : 'Esse é o ') + noun.singular + ' ' + askWord + '.'
  }, scales.map((scale, i) => ({ scale, label: noun.singular + ' ' + (i + 1) })), option => option.scale === answerScale);
}

/* ---------- Conte comigo ---------- */

const COUNT_LEVELS = [
  { max: 3, options: 2 }, { max: 5, options: 3 }, { max: 6, options: 3 }, { max: 8, options: 3 },
  { max: 10, options: 4 }, { max: 12, options: 4 }, { max: 15, options: 4 }
] as const;

function buildCount(random: Random, level: EarlyLevel, id: string): EarlyQuestion {
  const cfg = at(COUNT_LEVELS, level);
  const item = pick(random, countItems);
  const count = int(random, level >= 5 ? 4 : 1, cfg.max);
  const noun = itemNouns[item];
  return finish({
    id, activity: 'contar', level, scene: { kind: 'count', item, count },
    prompt: capitalize(howMany(noun)) + ' ' + noun.plural + ' tem aqui?',
    hint: ['Vamos contar juntos, bem devagar.', ...countAloud(count), 'O último número que falamos mostra ' + howMany(noun) + ' ' + noun.plural + ' tem.'],
    praise: count === 1 ? 'É ' + quantity(1, item) + '.' : 'São ' + quantity(count, item) + '.'
  }, numberOptions(random, count, cfg.options, cfg.max), option => option.number === count);
}

/* ---------- Onde tem mais? ---------- */

const COMPARE_LEVELS = [
  { groups: 2, max: 4, minDiff: 2, asks: ['mais'] },
  { groups: 2, max: 6, minDiff: 2, asks: ['mais'] },
  { groups: 2, max: 6, minDiff: 1, asks: ['mais'] },
  { groups: 2, max: 8, minDiff: 1, asks: ['mais', 'menos'] },
  { groups: 2, max: 10, minDiff: 1, asks: ['mais', 'menos'] },
  { groups: 3, max: 10, minDiff: 1, asks: ['mais'] },
  { groups: 3, max: 12, minDiff: 1, asks: ['mais', 'menos'] }
] as const;

function buildCompare(random: Random, level: EarlyLevel, id: string): EarlyQuestion {
  const cfg = at(COMPARE_LEVELS, level);
  const item = pick(random, countItems);
  const noun = itemNouns[item];
  let groups: number[] = [];
  let guard = 0;
  do {
    guard += 1;
    groups = Array.from({ length: cfg.groups }, () => int(random, 1, cfg.max));
  } while (guard < 500 && groups.some((a, i) => groups.some((b, j) => i !== j && Math.abs(a - b) < cfg.minDiff)));
  const ask = pick(random, cfg.asks);
  const target = ask === 'mais' ? Math.max(...groups) : Math.min(...groups);
  const answer = groups.indexOf(target);
  const f = noun.feminine;
  const conclusion = groups.length === 2
    ? capitalize(numberWord(target, f)) + ' é ' + ask + ' que ' + numberWord(groups[1 - answer], f) + '.'
    : capitalize(numberWord(target, f)) + ' é o ' + (ask === 'mais' ? 'maior' : 'menor') + ' número.';
  return finish({
    id, activity: 'comparar', level, scene: { kind: 'compare', item, groups, ask },
    prompt: 'Onde tem ' + ask + ' ' + noun.plural + '?',
    hint: ['Vamos contar os grupos.', ...groups.map((n, i) => (i === 0 ? 'Aqui tem ' : 'E aqui tem ') + numberWord(n, f) + '.'), conclusion],
    praise: 'Aqui tem ' + ask + ': ' + quantity(target, item) + '.'
  }, groups.map((n, i) => ({ group: i, label: 'grupo ' + (i + 1) + ' com ' + n })), option => option.group === answer);
}

/* ---------- Formas ---------- */

const SHAPE_LEVELS = [
  { options: 2, pool: 3 }, { options: 3, pool: 3 }, { options: 3, pool: 4 }, { options: 4, pool: 4 },
  { options: 4, pool: 5 }, { options: 4, pool: 6 }, { options: 4, pool: 7 }
] as const;

function buildShapes(random: Random, level: EarlyLevel, id: string): EarlyQuestion {
  const cfg = at(SHAPE_LEVELS, level);
  const pool = allShapes.slice(0, cfg.pool);
  const chosen = shuffle(random, pool).slice(0, cfg.options);
  const target = pick(random, chosen);
  const colors = shuffle(random, allColors);
  const options = chosen.map((shape, i) => ({ token: { shape, color: colors[i % colors.length] }, label: shapeNames[shape] }));
  const article = shapeArticle(target);
  return finish({
    id, activity: 'formas', level, scene: { kind: 'shapes', target },
    prompt: 'Toque ' + (article === 'a' ? 'na ' : 'no ') + shapeNames[target] + '.',
    hint: [shapeHints[target], 'Procure ' + article + ' ' + shapeNames[target] + '.'],
    praise: (article === 'a' ? 'Essa é a ' : 'Esse é o ') + shapeNames[target] + '.'
  }, options, option => option.token?.shape === target);
}

/* ---------- O que vem depois? ---------- */

const PATTERN_LEVELS: { layouts: number[][]; options: number; middleGap: boolean }[] = [
  { layouts: [[0, 1]], options: 2, middleGap: false },
  { layouts: [[0, 1]], options: 3, middleGap: false },
  { layouts: [[0, 0, 1]], options: 3, middleGap: false },
  { layouts: [[0, 1, 2]], options: 3, middleGap: false },
  { layouts: [[0, 0, 1, 1]], options: 3, middleGap: false },
  { layouts: [[0, 1, 1], [0, 1, 2]], options: 4, middleGap: false },
  { layouts: [[0, 1, 2], [0, 0, 1], [0, 1]], options: 3, middleGap: true }
];

function buildPattern(random: Random, level: EarlyLevel, id: string): EarlyQuestion {
  const cfg = at(PATTERN_LEVELS, level);
  const layout = pick(random, cfg.layouts);
  const size = Math.max(...layout) + 1;
  const shapes = shuffle(random, ['circulo', 'quadrado', 'triangulo', 'estrela'] as ShapeId[]);
  const colors = shuffle(random, allColors);
  const unitTokens: ShapeToken[] = Array.from({ length: size }, (_, i) => ({ shape: shapes[i], color: colors[i] }));
  const length = layout.length === 4 ? 7 : 6;
  const sequence = Array.from({ length }, (_, i) => unitTokens[layout[i % layout.length]]);
  const gap = cfg.middleGap ? int(random, 2, length - 2) : length - 1;
  const answer = sequence[gap];
  const distractors = unitTokens.filter(token => !sameToken(token, answer));
  let guard = 0;
  while (distractors.length < cfg.options - 1 && guard < 200) {
    guard += 1;
    const extra: ShapeToken = { shape: pick(random, allShapes.slice(0, 6)), color: pick(random, allColors) };
    if (!sameToken(extra, answer) && !distractors.some(d => sameToken(d, extra))) distractors.push(extra);
  }
  const options = shuffle(random, [answer, ...distractors.slice(0, cfg.options - 1)]).map(token => ({ token, label: tokenName(token) }));
  const spoken = sequence.flatMap((token, i) => (i === gap ? (cfg.middleGap ? ['E aqui?'] : []) : [capitalize(tokenName(token)) + '.']));
  return finish({
    id, activity: 'sequencias', level, scene: { kind: 'pattern', sequence, gap },
    prompt: cfg.middleGap ? 'Qual figura está faltando?' : 'Qual figura vem depois?',
    hint: ['Vamos falar a fila juntos, devagar.', ...spoken, cfg.middleGap ? 'Qual figura completa a fila?' : 'O que vem agora?'],
    praise: cfg.middleGap ? 'Faltava ' + withArticle(answer).replace(/^um /, 'o ').replace(/^uma /, 'a ') + '.' : 'Depois ' + (sequence[gap - 1].shape === 'estrela' ? 'da ' : 'do ') + tokenName(sequence[gap - 1]) + ' vem ' + withArticle(answer).replace(/^um /, 'o ').replace(/^uma /, 'a ') + '.'
  }, options, option => !!option.token && sameToken(option.token, answer));
}

/* ---------- Antes e depois ---------- */

const NEIGHBOR_LEVELS = [
  { max: 5, asks: ['depois'], options: 2 },
  { max: 6, asks: ['depois'], options: 3 },
  { max: 6, asks: ['antes'], options: 3 },
  { max: 10, asks: ['depois', 'antes'], options: 3 },
  { max: 10, asks: ['entre'], options: 3 },
  { max: 15, asks: ['depois', 'antes', 'entre'], options: 3 },
  { max: 20, asks: ['depois', 'antes', 'entre'], options: 4 }
] as const;

function buildNeighbors(random: Random, level: EarlyLevel, id: string): EarlyQuestion {
  const cfg = at(NEIGHBOR_LEVELS, level);
  const ask = pick(random, cfg.asks);
  let answer: number;
  let track: (number | null)[];
  let prompt: string;
  let hint: string[];
  let praise: string;
  const w = (n: number) => numberWord(n);
  if (ask === 'depois') {
    answer = int(random, 2, cfg.max);
    const start = Math.max(1, answer - 3);
    track = [...Array.from({ length: answer - start }, (_, i) => start + i), null];
    prompt = 'Que número vem depois do ' + w(answer - 1) + '?';
    hint = ['Vamos contar juntos.', ...countAloud(answer - 1, start), 'Qual número vem agora?'];
    praise = 'Depois do ' + w(answer - 1) + ' vem o ' + w(answer) + '.';
  } else if (ask === 'antes') {
    answer = int(random, 1, cfg.max - 1);
    const end = Math.min(cfg.max, answer + 3);
    track = [null, ...Array.from({ length: end - answer }, (_, i) => answer + 1 + i)];
    const from = Math.max(1, answer - 2);
    prompt = 'Que número vem antes do ' + w(answer + 1) + '?';
    hint = ['Vamos contar até o ' + w(answer + 1) + '.', ...countAloud(answer + 1, from), 'Qual número veio logo antes do ' + w(answer + 1) + '?'];
    praise = 'Antes do ' + w(answer + 1) + ' vem o ' + w(answer) + '.';
  } else {
    answer = int(random, 2, cfg.max - 1);
    track = [answer - 1, null, answer + 1];
    prompt = 'Que número fica entre o ' + w(answer - 1) + ' e o ' + w(answer + 1) + '?';
    hint = ['Vamos contar do ' + w(answer - 1) + ' até o ' + w(answer + 1) + '.', ...countAloud(answer + 1, answer - 1), 'Qual número ficou no meio?'];
    praise = 'Entre o ' + w(answer - 1) + ' e o ' + w(answer + 1) + ' fica o ' + w(answer) + '.';
  }
  return finish({ id, activity: 'vizinhos', level, scene: { kind: 'neighbors', track, ask }, prompt, hint, praise },
    numberOptions(random, answer, cfg.options, cfg.max), option => option.number === answer);
}

/* ---------- Juntar ---------- */

const JOIN_LEVELS = [
  { max: 4, options: 2 }, { max: 5, options: 3 }, { max: 6, options: 3 }, { max: 7, options: 3 },
  { max: 8, options: 3 }, { max: 9, options: 4 }, { max: 10, options: 4 }
] as const;

function buildJoin(random: Random, level: EarlyLevel, id: string): EarlyQuestion {
  const cfg = at(JOIN_LEVELS, level);
  const item = pick(random, countItems);
  const a = int(random, 1, Math.min(5, cfg.max - 1));
  const b = int(random, 1, Math.min(5, cfg.max - a));
  const total = a + b;
  const noun = itemNouns[item];
  return finish({
    id, activity: 'juntar', level, scene: { kind: 'join', item, a, b },
    prompt: capitalize(numberWord(a, noun.feminine)) + ' e mais ' + numberWord(b, noun.feminine) + '. ' + capitalize(howMany(noun)) + ' ficam?',
    hint: ['Vamos juntar tudo e contar, bem devagar.', ...countAloud(total), 'Juntando, ficam ' + numberWord(total, noun.feminine) + '.'],
    praise: capitalize(numberWord(a, noun.feminine)) + ' e mais ' + numberWord(b, noun.feminine) + ' são ' + quantity(total, item) + '.'
  }, numberOptions(random, total, cfg.options, cfg.max), option => option.number === total);
}

/* ---------- Tirar ---------- */

const TAKE_LEVELS = [
  { max: 3, options: 2 }, { max: 4, options: 3 }, { max: 5, options: 3 }, { max: 6, options: 3 },
  { max: 7, options: 3 }, { max: 8, options: 4 }, { max: 10, options: 4 }
] as const;

function buildTake(random: Random, level: EarlyLevel, id: string): EarlyQuestion {
  const cfg = at(TAKE_LEVELS, level);
  const item = pick(random, countItems);
  const noun = itemNouns[item];
  const f = noun.feminine;
  const total = int(random, 2, cfg.max);
  const away = level === 1 ? 1 : int(random, 1, total - 1);
  const remaining = total - away;
  return finish({
    id, activity: 'tirar', level, scene: { kind: 'take', item, total, away },
    prompt: 'Tinha ' + quantity(total, item) + '. ' + capitalize(numberWord(away, f)) + (away === 1 ? ' foi embora. ' : ' foram embora. ') + capitalize(howMany(noun)) + (remaining === 1 ? ' ficou?' : ' ficaram?'),
    hint: ['Vamos contar só ' + (f ? 'as' : 'os') + ' que ficaram.', ...countAloud(remaining), (remaining === 1 ? 'Ficou ' : 'Ficaram ') + numberWord(remaining, f) + '.'],
    praise: 'Tinha ' + numberWord(total, f) + ', ' + (away === 1 ? 'foi ' : 'foram ') + numberWord(away, f) + ', ' + (remaining === 1 ? 'ficou ' : 'ficaram ') + numberWord(remaining, f) + '.'
  }, numberOptions(random, remaining, cfg.options, cfg.max), option => option.number === remaining);
}

const builders: Record<EarlyActivityId, (random: Random, level: EarlyLevel, id: string) => EarlyQuestion> = {
  igual: buildMatch, diferente: buildOdd, tamanhos: buildSizes, contar: buildCount, comparar: buildCompare,
  formas: buildShapes, sequencias: buildPattern, vizinhos: buildNeighbors, juntar: buildJoin, tirar: buildTake
};

export function buildEarlyQuestion(activity: EarlyActivityId, level: EarlyLevel, random: Random = Math.random, id = activity + '-1'): EarlyQuestion {
  return builders[activity](random, level, id);
}

export const EARLY_ROUND_SIZE = 4;

/** Rodada curta (atenção das crianças pequenas), sem repetir a mesma cena em seguida. */
export function buildEarlyRound(activity: EarlyActivityId, level: EarlyLevel, random: Random = Math.random, size = EARLY_ROUND_SIZE): EarlyQuestion[] {
  const round: EarlyQuestion[] = [];
  let guard = 0;
  while (round.length < size && guard < size * 20) {
    guard += 1;
    const question = buildEarlyQuestion(activity, level, random, activity + '-' + (round.length + 1));
    const previous = round[round.length - 1];
    if (previous && JSON.stringify(previous.scene) === JSON.stringify(question.scene)) continue;
    round.push(question);
  }
  return round;
}

export const praiseWords = ['Muito bem!', 'Isso mesmo!', 'Você conseguiu!', 'Que legal!', 'Parabéns!'];
export const tryAgainWords = ['Quase! Vamos tentar de novo, com calma.', 'Tudo bem. Vamos pensar juntos.', 'Sem pressa. Vamos olhar de novo.'];

/** Evidência registrada ao resolver uma pergunta. */
export type EarlyAttempt = { activity: EarlyActivityId; level: EarlyLevel; firstTry: boolean; tries: number; answeredAt: string };

export type EarlyActivitySummary = { id: EarlyActivityId; attempts: number; firstTry: number; level: EarlyLevel };
export type EarlySummary = { attempts: number; firstTry: number; stars: number; activities: EarlyActivitySummary[] };

export function summarizeEarlyAttempts(attempts: EarlyAttempt[]): EarlySummary {
  const activities = earlyActivities.map(activity => {
    const own = attempts.filter(item => item.activity === activity.id);
    const firstTry = own.filter(item => item.firstTry).length;
    return { id: activity.id, attempts: own.length, firstTry, level: earlyLevel({ attempts: own.length, firstTry }) };
  });
  const firstTry = activities.reduce((sum, item) => sum + item.firstTry, 0);
  return { attempts: attempts.length, firstTry, stars: firstTry, activities };
}
