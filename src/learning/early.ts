/**
 * Motor pedagógico do perfil de 3 a 6 anos.
 *
 * Princípios: uma ideia por vez, material concreto (objetos para tocar e contar),
 * poucas opções no início (duas), sem tempo e sem punição. A criança tenta de novo até
 * acertar; o progresso usa apenas o acerto de primeira como evidência.
 */

export type EarlyActivityId = 'igual' | 'contar' | 'comparar' | 'formas' | 'sequencias' | 'juntar';
export type EarlyLevel = 1 | 2 | 3;
export type ShapeId = 'circulo' | 'quadrado' | 'triangulo' | 'retangulo';
export type ColorId = 'azul' | 'amarelo' | 'verde' | 'laranja';
export type ShapeToken = { shape: ShapeId; color: ColorId };
export type CountItem = 'estrela' | 'moeda' | 'cristal' | 'chave' | 'energia' | 'engrenagem';

export type EarlyOption = { label: string; number?: number; token?: ShapeToken; side?: 'left' | 'right' };

export type EarlyScene =
  | { kind: 'match'; target: ShapeToken }
  | { kind: 'count'; item: CountItem; count: number }
  | { kind: 'compare'; item: CountItem; left: number; right: number; ask: 'mais' | 'menos' }
  | { kind: 'shapes'; target: ShapeId }
  | { kind: 'pattern'; sequence: ShapeToken[] }
  | { kind: 'join'; item: CountItem; a: number; b: number };

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
  icon: CountItem | 'formas' | 'igual' | 'sequencias';
  /** Explicação do professor de voz ao abrir a brincadeira. */
  intro: string[];
};

export const earlyActivities: EarlyActivity[] = [
  { id: 'igual', title: 'Ache o igual', subtitle: 'Mesma forma, mesma cor', fromAge: 3, icon: 'igual',
    intro: ['Oi! Vamos brincar de achar o igual.', 'Olhe a figura lá em cima.', 'Agora toque na figura igualzinha a ela.'] },
  { id: 'contar', title: 'Conte comigo', subtitle: 'Toque e conte', fromAge: 3, icon: 'estrela',
    intro: ['Vamos contar juntos?', 'Toque em cada figura, uma de cada vez.', 'Eu conto com você.', 'Depois, toque no número.'] },
  { id: 'comparar', title: 'Onde tem mais?', subtitle: 'Mais e menos', fromAge: 3, icon: 'moeda',
    intro: ['Vamos olhar dois grupos.', 'Um grupo aqui, e outro grupo ali.', 'Eu vou perguntar onde tem mais.', 'Olhe com calma e toque no grupo.'] },
  { id: 'formas', title: 'Formas', subtitle: 'Círculo, quadrado, triângulo', fromAge: 3, icon: 'formas',
    intro: ['Vamos conhecer as formas.', 'Eu vou falar o nome de uma forma.', 'Você toca na forma certa.'] },
  { id: 'sequencias', title: 'O que vem depois?', subtitle: 'Sequências', fromAge: 4, icon: 'sequencias',
    intro: ['Olhe esta fila de figuras.', 'Ela vai se repetindo, sempre igual.', 'Descubra qual figura vem depois.'] },
  { id: 'juntar', title: 'Juntar', subtitle: 'Somar com objetos', fromAge: 5, icon: 'cristal',
    intro: ['Vamos juntar dois grupos.', 'Toque em cada figura para contar tudo.', 'Depois, toque no número que mostra quantas ficaram.'] }
];

export const shapeNames: Record<ShapeId, string> = { circulo: 'círculo', quadrado: 'quadrado', triangulo: 'triângulo', retangulo: 'retângulo' };
const shapeHints: Record<ShapeId, string> = {
  circulo: 'O círculo é redondinho. Ele não tem pontas.',
  quadrado: 'O quadrado tem quatro lados iguais.',
  triangulo: 'O triângulo tem três lados e três pontas.',
  retangulo: 'O retângulo tem quatro lados. Dois compridos e dois curtinhos.'
};
export const colorNames: Record<ColorId, string> = { azul: 'azul', amarelo: 'amarelo', verde: 'verde', laranja: 'laranja' };

type Noun = { singular: string; plural: string; feminine: boolean };
export const itemNouns: Record<CountItem, Noun> = {
  estrela: { singular: 'estrela', plural: 'estrelas', feminine: true },
  moeda: { singular: 'moeda', plural: 'moedas', feminine: true },
  cristal: { singular: 'cristal', plural: 'cristais', feminine: false },
  chave: { singular: 'chave', plural: 'chaves', feminine: true },
  energia: { singular: 'bateria', plural: 'baterias', feminine: true },
  engrenagem: { singular: 'engrenagem', plural: 'engrenagens', feminine: true }
};

const words = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'];

/** Número por extenso para a fala ("uma estrela", "dois cristais"). */
export function numberWord(n: number, feminine = false): string {
  if (feminine && n === 1) return 'uma';
  if (feminine && n === 2) return 'duas';
  return words[n] ?? String(n);
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const quantity = (n: number, item: CountItem) => numberWord(n, itemNouns[item].feminine) + ' ' + (n === 1 ? itemNouns[item].singular : itemNouns[item].plural);
const howMany = (noun: Noun) => (noun.feminine ? 'quantas' : 'quantos');
const tokenName = (token: ShapeToken) => shapeNames[token.shape] + ' ' + colorNames[token.color];
/** Contagem falada uma palavra por pausa: "Um.", "Dois.", "Três." */
export function countAloud(n: number): string[] {
  return Array.from({ length: n }, (_, i) => capitalize(words[i + 1] ?? String(i + 1)) + '.');
}

/* ---------- níveis ---------- */

export type EarlyStats = { attempts: number; firstTry: number };

/** Sobe de nível só com evidência: acertos de primeira suficientes e consistentes. */
export function earlyLevel(stats: EarlyStats): EarlyLevel {
  const ratio = stats.attempts ? stats.firstTry / stats.attempts : 0;
  if (stats.firstTry >= 12 && ratio >= 0.7) return 3;
  if (stats.firstTry >= 5 && ratio >= 0.6) return 2;
  return 1;
}

const optionCount = (level: EarlyLevel) => (level === 1 ? 2 : 3);
const countMax: Record<EarlyLevel, number> = { 1: 3, 2: 5, 3: 10 };
const joinMax: Record<EarlyLevel, number> = { 1: 4, 2: 6, 3: 10 };

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
const sameToken = (a: ShapeToken, b: ShapeToken) => a.shape === b.shape && a.color === b.color;
const allColors: ColorId[] = ['azul', 'amarelo', 'verde', 'laranja'];
const countItems: CountItem[] = ['estrela', 'moeda', 'cristal', 'chave', 'energia', 'engrenagem'];

/** Opções numéricas próximas da resposta, em ordem crescente (previsível para a criança). */
function numberOptions(random: Random, answer: number, size: number, max: number): EarlyOption[] {
  const values = new Set<number>([answer]);
  const offsets = shuffle(random, [-1, 1, -2, 2, 3, -3]);
  for (const offset of offsets) {
    if (values.size >= size) break;
    const value = answer + offset;
    if (value >= 1 && value <= Math.max(max, answer + 2)) values.add(value);
  }
  return [...values].sort((a, b) => a - b).map(number => ({ number, label: numberWord(number) }));
}

function finish(question: Omit<EarlyQuestion, 'answerIndex' | 'options'>, options: EarlyOption[], isAnswer: (option: EarlyOption) => boolean): EarlyQuestion {
  return { ...question, options, answerIndex: options.findIndex(isAnswer) };
}

/* ---------- geradores por brincadeira ---------- */

function buildMatch(random: Random, level: EarlyLevel, id: string): EarlyQuestion {
  const shapes: ShapeId[] = ['circulo', 'quadrado', 'triangulo'];
  const target: ShapeToken = { shape: pick(random, shapes), color: pick(random, allColors) };
  const distractors: ShapeToken[] = [];
  while (distractors.length < optionCount(level) - 1) {
    const candidate: ShapeToken = level === 3
      // nível 3: distrator compartilha a cor OU a forma (discriminação mais fina)
      ? (random() < 0.5 ? { shape: pick(random, shapes.filter(s => s !== target.shape)), color: target.color } : { shape: target.shape, color: pick(random, allColors.filter(c => c !== target.color)) })
      : { shape: pick(random, shapes.filter(s => s !== target.shape)), color: pick(random, allColors.filter(c => c !== target.color)) };
    if (!distractors.some(d => sameToken(d, candidate))) distractors.push(candidate);
  }
  const options = shuffle(random, [target, ...distractors]).map(token => ({ token, label: tokenName(token) }));
  return finish({
    id, activity: 'igual', level, scene: { kind: 'match', target },
    prompt: 'Toque na figura igual.',
    hint: ['Olhe a forma e a cor.', 'Lá em cima tem um ' + tokenName(target) + '.', 'Procure outro ' + tokenName(target) + '.'],
    praise: 'É o mesmo ' + tokenName(target) + '.'
  }, options, option => !!option.token && sameToken(option.token, target));
}

function buildCount(random: Random, level: EarlyLevel, id: string): EarlyQuestion {
  const item = pick(random, countItems);
  const count = int(random, 1, countMax[level]);
  const noun = itemNouns[item];
  return finish({
    id, activity: 'contar', level, scene: { kind: 'count', item, count },
    prompt: capitalize(howMany(noun)) + ' ' + noun.plural + ' tem aqui?',
    hint: ['Vamos contar juntos, bem devagar.', ...countAloud(count), 'O último número que falamos mostra ' + howMany(noun) + ' ' + noun.plural + ' tem.'],
    praise: count === 1 ? 'É ' + quantity(1, item) + '.' : 'São ' + quantity(count, item) + '.'
  }, numberOptions(random, count, optionCount(level), countMax[level]), option => option.number === count);
}

function buildCompare(random: Random, level: EarlyLevel, id: string): EarlyQuestion {
  const item = pick(random, countItems);
  const max = level === 1 ? 4 : level === 2 ? 6 : 10;
  const minDiff = level === 1 ? 2 : 1;
  let left = int(random, 1, max);
  let right = int(random, 1, max);
  while (Math.abs(left - right) < minDiff) { left = int(random, 1, max); right = int(random, 1, max); }
  const ask: 'mais' | 'menos' = level === 3 && random() < 0.5 ? 'menos' : 'mais';
  const answer: 'left' | 'right' = (ask === 'mais') === (left > right) ? 'left' : 'right';
  const noun = itemNouns[item];
  const winner = answer === 'left' ? left : right;
  const loser = answer === 'left' ? right : left;
  return finish({
    id, activity: 'comparar', level, scene: { kind: 'compare', item, left, right, ask },
    prompt: 'Onde tem ' + ask + ' ' + noun.plural + '?',
    hint: ['Vamos contar os dois grupos.', 'Aqui tem ' + numberWord(left, noun.feminine) + '.', 'E aqui tem ' + numberWord(right, noun.feminine) + '.', capitalize(numberWord(winner, noun.feminine)) + ' é ' + ask + ' que ' + numberWord(loser, noun.feminine) + '.'],
    praise: 'Aqui tem ' + ask + ': ' + quantity(winner, item) + '.'
  }, [{ side: 'left', label: 'grupo da esquerda' }, { side: 'right', label: 'grupo da direita' }], option => option.side === answer);
}

function buildShapes(random: Random, level: EarlyLevel, id: string): EarlyQuestion {
  const pool: ShapeId[] = level === 3 ? ['circulo', 'quadrado', 'triangulo', 'retangulo'] : ['circulo', 'quadrado', 'triangulo'];
  const chosen = shuffle(random, pool).slice(0, optionCount(level));
  const target = pick(random, chosen);
  const colors = shuffle(random, allColors);
  const options = chosen.map((shape, i) => ({ token: { shape, color: colors[i] }, label: shapeNames[shape] }));
  return finish({
    id, activity: 'formas', level, scene: { kind: 'shapes', target },
    prompt: 'Toque no ' + shapeNames[target] + '.',
    hint: [shapeHints[target], 'Procure o ' + shapeNames[target] + '.'],
    praise: 'Esse é o ' + shapeNames[target] + '.'
  }, options, option => option.token?.shape === target);
}

function buildPattern(random: Random, level: EarlyLevel, id: string): EarlyQuestion {
  const layout = level === 3 ? pick(random, [[0, 0, 1], [0, 1, 2]]) : [0, 1];
  const size = Math.max(...layout) + 1;
  const shapes = shuffle(random, ['circulo', 'quadrado', 'triangulo'] as ShapeId[]);
  const colors = shuffle(random, allColors);
  const unitTokens: ShapeToken[] = Array.from({ length: size }, (_, i) => ({ shape: shapes[i], color: colors[i] }));
  const series = Array.from({ length: 6 }, (_, i) => unitTokens[layout[i % layout.length]]);
  const sequence = series.slice(0, 5);
  const answer = series[5];
  const distractors = unitTokens.filter(token => !sameToken(token, answer));
  while (distractors.length < optionCount(level) - 1) {
    const extra: ShapeToken = { shape: pick(random, ['circulo', 'quadrado', 'triangulo', 'retangulo'] as ShapeId[]), color: pick(random, allColors) };
    if (!sameToken(extra, answer) && !distractors.some(d => sameToken(d, extra))) distractors.push(extra);
  }
  const options = shuffle(random, [answer, ...distractors.slice(0, optionCount(level) - 1)]).map(token => ({ token, label: tokenName(token) }));
  return finish({
    id, activity: 'sequencias', level, scene: { kind: 'pattern', sequence },
    prompt: 'Qual figura vem depois?',
    hint: ['Vamos falar a fila juntos, devagar.', ...sequence.map(token => capitalize(tokenName(token)) + '.'), 'O que vem agora?'],
    praise: 'Depois do ' + tokenName(sequence[4]) + ' vem o ' + tokenName(answer) + '.'
  }, options, option => !!option.token && sameToken(option.token, answer));
}

function buildJoin(random: Random, level: EarlyLevel, id: string): EarlyQuestion {
  const item = pick(random, countItems);
  const max = joinMax[level];
  const a = int(random, 1, Math.min(5, max - 1));
  const b = int(random, 1, Math.min(4, max - a));
  const total = a + b;
  const noun = itemNouns[item];
  return finish({
    id, activity: 'juntar', level, scene: { kind: 'join', item, a, b },
    prompt: capitalize(numberWord(a, noun.feminine)) + ' e mais ' + numberWord(b, noun.feminine) + '. ' + capitalize(howMany(noun)) + ' ficam?',
    hint: ['Vamos juntar tudo e contar, bem devagar.', ...countAloud(total), 'Juntando, ficam ' + numberWord(total, noun.feminine) + '.'],
    praise: capitalize(numberWord(a, noun.feminine)) + ' e mais ' + numberWord(b, noun.feminine) + ' são ' + quantity(total, item) + '.'
  }, numberOptions(random, total, optionCount(level), max), option => option.number === total);
}

const builders: Record<EarlyActivityId, (random: Random, level: EarlyLevel, id: string) => EarlyQuestion> = {
  igual: buildMatch, contar: buildCount, comparar: buildCompare, formas: buildShapes, sequencias: buildPattern, juntar: buildJoin
};

export function buildEarlyQuestion(activity: EarlyActivityId, level: EarlyLevel, random: Random = Math.random, id = activity + '-1'): EarlyQuestion {
  return builders[activity](random, level, id);
}

export const EARLY_ROUND_SIZE = 4;

/** Rodada curta (atenção das crianças pequenas), sem repetir a mesma resposta em seguida. */
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
