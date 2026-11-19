import { describe, expect, it } from 'vitest';
import {
  buildEarlyQuestion, buildEarlyRound, countAloud, EARLY_LEVELS, earlyActivities, earlyLevel, numberWord, sameToken, summarizeEarlyAttempts, tokenName,
  type EarlyActivityId, type EarlyLevel, type EarlyQuestion
} from './early';

/** PRNG determinístico (mulberry32) para testes reprodutíveis. */
function seeded(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const activities = earlyActivities.map(activity => activity.id);

function sample(activity: EarlyActivityId, level: EarlyLevel, n = 50): EarlyQuestion[] {
  const random = seeded(activity.length * 100 + level * 7 + activity.charCodeAt(0));
  return Array.from({ length: n }, (_, i) => buildEarlyQuestion(activity, level, random, activity + '-' + i));
}

const scenesOf = <K extends EarlyQuestion['scene']['kind']>(questions: EarlyQuestion[], kind: K) =>
  questions.map(q => q.scene).filter((scene): scene is Extract<EarlyQuestion['scene'], { kind: K }> => scene.kind === kind);

describe('early years catalogue', () => {
  it('offers ten activities, each with seven levels', () => {
    expect(activities).toEqual(['igual', 'diferente', 'tamanhos', 'contar', 'comparar', 'formas', 'sequencias', 'vizinhos', 'juntar', 'tirar']);
    expect(EARLY_LEVELS).toEqual([1, 2, 3, 4, 5, 6, 7]);
    for (const activity of earlyActivities) expect(activity.intro.length).toBeGreaterThanOrEqual(3);
  });

  it('always builds exactly one right answer among distinct options, at every level', () => {
    for (const activity of activities) for (const level of EARLY_LEVELS) for (const q of sample(activity, level, 30)) {
      expect(q.answerIndex, activity + ' L' + level).toBeGreaterThanOrEqual(0);
      expect(q.answerIndex).toBeLessThan(q.options.length);
      expect(new Set(q.options.map(option => option.label)).size, activity + ' L' + level + ' labels').toBe(q.options.length);
      expect(q.prompt.length).toBeGreaterThan(5);
      expect(q.hint.length).toBeGreaterThan(1);
      expect(q.praise.length).toBeGreaterThan(5);
    }
  });

  it('starts with only two choices for the youngest and offers more at higher levels', () => {
    for (const activity of activities.filter(id => id !== 'diferente')) {
      expect(sample(activity, 1).every(q => q.options.length === 2), activity).toBe(true);
    }
    expect(sample('diferente', 1).every(q => q.options.length === 3)).toBe(true);
    for (const activity of ['igual', 'contar', 'formas', 'juntar', 'tirar', 'vizinhos'] as EarlyActivityId[]) {
      expect(Math.max(...sample(activity, 7).map(q => q.options.length)), activity).toBe(4);
    }
    expect(sample('diferente', 7).every(q => q.options.length === 5)).toBe(true);
  });
});

describe('early years generators by activity', () => {
  it('Conte comigo grows from up to 3 to up to 15 objects', () => {
    const maxes = [3, 5, 6, 8, 10, 12, 15];
    EARLY_LEVELS.forEach(level => {
      const counts = scenesOf(sample('contar', level), 'count').map(scene => scene.count);
      expect(Math.max(...counts)).toBeLessThanOrEqual(maxes[level - 1]);
      expect(Math.min(...counts)).toBeGreaterThanOrEqual(1);
    });
    for (const q of sample('contar', 4)) expect(q.scene.kind === 'count' && q.options[q.answerIndex].number === q.scene.count).toBe(true);
    const three = sample('contar', 1).find(q => q.scene.kind === 'count' && q.scene.count === 3)!;
    expect(three.hint).toEqual(expect.arrayContaining(['Um.', 'Dois.', 'Três.']));
  });

  it('Onde tem mais? moves from two very different groups to three groups and "menos"', () => {
    for (const q of sample('comparar', 1)) {
      if (q.scene.kind !== 'compare') throw new Error('scene');
      expect(q.scene.groups).toHaveLength(2);
      expect(Math.abs(q.scene.groups[0] - q.scene.groups[1])).toBeGreaterThanOrEqual(2);
      expect(q.scene.ask).toBe('mais');
      expect(q.scene.groups[q.options[q.answerIndex].group!]).toBe(Math.max(...q.scene.groups));
    }
    const level7 = sample('comparar', 7);
    for (const q of level7) {
      if (q.scene.kind !== 'compare') throw new Error('scene');
      expect(q.scene.groups).toHaveLength(3);
      expect(new Set(q.scene.groups).size).toBe(3);
      const target = q.scene.ask === 'mais' ? Math.max(...q.scene.groups) : Math.min(...q.scene.groups);
      expect(q.scene.groups[q.options[q.answerIndex].group!]).toBe(target);
    }
    expect(scenesOf(level7, 'compare').some(scene => scene.ask === 'menos')).toBe(true);
  });

  it('Ache o igual always offers the identical figure and adds size at level 6', () => {
    for (const level of EARLY_LEVELS) for (const q of sample('igual', level)) {
      if (q.scene.kind !== 'match') throw new Error('scene');
      const target = q.scene.target;
      expect(sameToken(q.options[q.answerIndex].token!, target)).toBe(true);
      expect(q.options.filter(option => sameToken(option.token!, target)).length).toBe(1);
    }
    for (const q of sample('igual', 6)) {
      if (q.scene.kind !== 'match') throw new Error('scene');
      const target = q.scene.target;
      expect(q.options.some(option => option.token!.shape === target.shape && option.token!.color === target.color && option.token!.size !== target.size)).toBe(true);
    }
  });

  it('Qual é diferente? has exactly one figure that differs from all the others', () => {
    for (const level of EARLY_LEVELS) for (const q of sample('diferente', level)) {
      if (q.scene.kind !== 'odd') throw new Error('scene');
      const odd = q.scene.tokens[q.answerIndex];
      const rest = q.scene.tokens.filter((_, i) => i !== q.answerIndex);
      expect(rest.every(token => sameToken(token, rest[0]))).toBe(true);
      expect(sameToken(odd, rest[0])).toBe(false);
    }
    expect(scenesOf(sample('diferente', 6), 'odd').every(scene => scene.tokens.some(token => token.size === 'pequeno'))).toBe(true);
  });

  it('Grande e pequeno asks for the biggest, the smallest and, at level 7, the middle one', () => {
    for (const level of EARLY_LEVELS) for (const q of sample('tamanhos', level)) {
      if (q.scene.kind !== 'sizes') throw new Error('scene');
      const sorted = [...q.scene.scales].sort((a, b) => b - a);
      const expected = q.scene.ask === 'maior' ? sorted[0] : q.scene.ask === 'menor' ? sorted[sorted.length - 1] : sorted[1];
      expect(q.options[q.answerIndex].scale).toBe(expected);
    }
    expect(scenesOf(sample('tamanhos', 1), 'sizes').every(scene => scene.ask === 'maior' && scene.scales.length === 2)).toBe(true);
    expect(scenesOf(sample('tamanhos', 7), 'sizes').some(scene => scene.ask === 'medio')).toBe(true);
    const crystal = sample('tamanhos', 2).find(q => q.scene.kind === 'sizes' && q.scene.item === 'cristal');
    if (crystal) expect(crystal.prompt.startsWith('Toque no cristal')).toBe(true);
  });

  it('Formas introduces oval, losango and estrela only at the higher levels', () => {
    const targets = (level: EarlyLevel) => new Set(scenesOf(sample('formas', level, 80), 'shapes').map(scene => scene.target));
    expect([...targets(1)].every(shape => ['circulo', 'quadrado', 'triangulo'].includes(shape))).toBe(true);
    const level7 = targets(7);
    expect(level7.has('estrela') || level7.has('losango') || level7.has('oval')).toBe(true);
    for (const q of sample('formas', 7)) expect(q.scene.kind === 'shapes' && q.options[q.answerIndex].token?.shape === q.scene.target).toBe(true);
  });

  it('O que vem depois? keeps a repeating pattern and hides a middle figure at level 7', () => {
    for (const level of EARLY_LEVELS) for (const q of sample('sequencias', level)) {
      if (q.scene.kind !== 'pattern') throw new Error('scene');
      const seq = q.scene.sequence;
      const periodic = [2, 3, 4].some(p => seq.every((token, i) => i < p || sameToken(token, seq[i - p])));
      expect(periodic, 'L' + level).toBe(true);
      expect(sameToken(q.options[q.answerIndex].token!, seq[q.scene.gap])).toBe(true);
      if (level < 7) expect(q.scene.gap).toBe(seq.length - 1);
    }
    expect(scenesOf(sample('sequencias', 7), 'pattern').every(scene => scene.gap < scene.sequence.length - 1)).toBe(true);
  });

  it('Antes e depois shows consecutive numbers with the missing neighbour', () => {
    const maxes = [5, 6, 6, 10, 10, 15, 20];
    for (const level of EARLY_LEVELS) for (const q of sample('vizinhos', level)) {
      if (q.scene.kind !== 'neighbors') throw new Error('scene');
      const answer = q.options[q.answerIndex].number!;
      const gap = q.scene.track.indexOf(null);
      const filled = q.scene.track.map((n, i) => (i === gap ? answer : n!));
      filled.forEach((n, i) => { if (i > 0) expect(n).toBe(filled[i - 1] + 1); });
      expect(Math.max(...filled)).toBeLessThanOrEqual(maxes[level - 1]);
      expect(Math.min(...filled)).toBeGreaterThanOrEqual(1);
      if (q.scene.ask === 'depois') expect(gap).toBe(q.scene.track.length - 1);
      if (q.scene.ask === 'antes') expect(gap).toBe(0);
      if (q.scene.ask === 'entre') expect(gap).toBe(1);
    }
    expect(scenesOf(sample('vizinhos', 1), 'neighbors').every(scene => scene.ask === 'depois')).toBe(true);
    expect(scenesOf(sample('vizinhos', 5), 'neighbors').every(scene => scene.ask === 'entre')).toBe(true);
  });

  it('Juntar and Tirar keep totals within the level and compute the result', () => {
    const joinMax = [4, 5, 6, 7, 8, 9, 10];
    const takeMax = [3, 4, 5, 6, 7, 8, 10];
    for (const level of EARLY_LEVELS) {
      for (const q of sample('juntar', level)) {
        if (q.scene.kind !== 'join') throw new Error('scene');
        expect(q.scene.a + q.scene.b).toBeLessThanOrEqual(joinMax[level - 1]);
        expect(q.options[q.answerIndex].number).toBe(q.scene.a + q.scene.b);
      }
      for (const q of sample('tirar', level)) {
        if (q.scene.kind !== 'take') throw new Error('scene');
        expect(q.scene.total).toBeLessThanOrEqual(takeMax[level - 1]);
        expect(q.scene.away).toBeGreaterThanOrEqual(1);
        expect(q.scene.away).toBeLessThan(q.scene.total);
        expect(q.options[q.answerIndex].number).toBe(q.scene.total - q.scene.away);
      }
    }
    expect(scenesOf(sample('tirar', 1), 'take').every(scene => scene.away === 1)).toBe(true);
  });

  it('builds short rounds without repeating the same scene in a row', () => {
    for (const activity of activities) {
      const round = buildEarlyRound(activity, 3, seeded(7));
      expect(round).toHaveLength(4);
      for (let i = 1; i < round.length; i += 1) expect(JSON.stringify(round[i].scene)).not.toBe(JSON.stringify(round[i - 1].scene));
    }
  });
});

describe('Portuguese for the voice teacher', () => {
  it('uses number words with gender and counts from any start', () => {
    expect(numberWord(1, true)).toBe('uma');
    expect(numberWord(2, true)).toBe('duas');
    expect(numberWord(2)).toBe('dois');
    expect(numberWord(15)).toBe('quinze');
    expect(numberWord(20)).toBe('vinte');
    expect(countAloud(2)).toEqual(['Um.', 'Dois.']);
    expect(countAloud(13, 11)).toEqual(['Onze.', 'Doze.', 'Treze.']);
  });

  it('names figures with the right gender', () => {
    expect(tokenName({ shape: 'circulo', color: 'amarelo' })).toBe('círculo amarelo');
    expect(tokenName({ shape: 'estrela', color: 'amarelo', size: 'pequeno' })).toBe('estrela amarela pequena');
    const crystals = sample('contar', 2).find(q => q.scene.kind === 'count' && q.scene.item === 'cristal');
    if (crystals) expect(crystals.prompt.startsWith('Quantos cristais')).toBe(true);
    const take = sample('tirar', 4).find(q => q.scene.kind === 'take' && q.scene.away > 1);
    if (take) expect(take.prompt).toMatch(/foram embora/);
  });
});

describe('early years levels and summary', () => {
  it('climbs one level at a time only with consistent first-try evidence', () => {
    expect(earlyLevel({ attempts: 0, firstTry: 0 })).toBe(1);
    expect(earlyLevel({ attempts: 6, firstTry: 3 })).toBe(1);
    expect(earlyLevel({ attempts: 6, firstTry: 4 })).toBe(2);
    expect(earlyLevel({ attempts: 12, firstTry: 8 })).toBe(3);
    expect(earlyLevel({ attempts: 18, firstTry: 12 })).toBe(4);
    expect(earlyLevel({ attempts: 22, firstTry: 16 })).toBe(5);
    expect(earlyLevel({ attempts: 28, firstTry: 20 })).toBe(6);
    expect(earlyLevel({ attempts: 33, firstTry: 25 })).toBe(7);
    expect(earlyLevel({ attempts: 60, firstTry: 25 })).toBe(1);
  });

  it('turns first-try answers into stars per activity', () => {
    const summary = summarizeEarlyAttempts([
      { activity: 'contar', level: 1, firstTry: true, tries: 1, answeredAt: '2026-11-19T10:00:00.000Z' },
      { activity: 'contar', level: 1, firstTry: false, tries: 2, answeredAt: '2026-11-19T10:01:00.000Z' },
      { activity: 'tirar', level: 1, firstTry: true, tries: 1, answeredAt: '2026-11-19T10:02:00.000Z' }
    ]);
    expect(summary).toMatchObject({ attempts: 3, firstTry: 2, stars: 2 });
    expect(summary.activities.find(item => item.id === 'contar')).toMatchObject({ attempts: 2, firstTry: 1, level: 1 });
    expect(summary.activities).toHaveLength(10);
  });
});
