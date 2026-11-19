import { describe, expect, it } from 'vitest';
import {
  buildEarlyQuestion, buildEarlyRound, countAloud, earlyActivities, earlyLevel, numberWord, summarizeEarlyAttempts,
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
const levels: EarlyLevel[] = [1, 2, 3];

function sample(activity: EarlyActivityId, level: EarlyLevel, n = 60): EarlyQuestion[] {
  const random = seeded(activity.length * 100 + level);
  return Array.from({ length: n }, (_, i) => buildEarlyQuestion(activity, level, random, activity + '-' + i));
}

describe('early years (3–6) question generators', () => {
  it('always include exactly one right answer among distinct options', () => {
    for (const activity of activities) for (const level of levels) for (const q of sample(activity, level)) {
      expect(q.answerIndex).toBeGreaterThanOrEqual(0);
      expect(q.answerIndex).toBeLessThan(q.options.length);
      expect(new Set(q.options.map(option => option.label)).size).toBe(q.options.length);
      expect(q.prompt.length).toBeGreaterThan(5);
      expect(q.hint.length).toBeGreaterThan(0);
    }
  });

  it('starts with only two options and grows to three', () => {
    for (const activity of activities.filter(id => id !== 'comparar')) {
      expect(sample(activity, 1).every(q => q.options.length === 2)).toBe(true);
      expect(sample(activity, 2).every(q => q.options.length === 3)).toBe(true);
    }
    expect(sample('comparar', 3).every(q => q.options.length === 2)).toBe(true);
  });

  it('keeps counting small for the youngest and up to ten later', () => {
    const count = (level: EarlyLevel) => sample('contar', level).map(q => (q.scene.kind === 'count' ? q.scene.count : 0));
    expect(Math.max(...count(1))).toBeLessThanOrEqual(3);
    expect(Math.min(...count(1))).toBeGreaterThanOrEqual(1);
    expect(Math.max(...count(2))).toBeLessThanOrEqual(5);
    expect(Math.max(...count(3))).toBeLessThanOrEqual(10);
    for (const q of sample('contar', 2)) {
      expect(q.scene.kind === 'count' && q.options[q.answerIndex].number === q.scene.count).toBe(true);
    }
  });

  it('models counting aloud in the hint (one number per pause)', () => {
    const q = sample('contar', 1).find(item => item.scene.kind === 'count' && item.scene.count === 3)!;
    expect(q.hint).toEqual(expect.arrayContaining(['Um.', 'Dois.', 'Três.']));
    expect(countAloud(2)).toEqual(['Um.', 'Dois.']);
  });

  it('compares groups with a clear difference at level 1', () => {
    for (const q of sample('comparar', 1)) {
      if (q.scene.kind !== 'compare') throw new Error('scene');
      expect(Math.abs(q.scene.left - q.scene.right)).toBeGreaterThanOrEqual(2);
      expect(q.scene.ask).toBe('mais');
      const bigger = q.scene.left > q.scene.right ? 'left' : 'right';
      expect(q.options[q.answerIndex].side).toBe(bigger);
    }
    expect(sample('comparar', 3).some(q => q.scene.kind === 'compare' && q.scene.ask === 'menos')).toBe(true);
  });

  it('builds sums that stay within the level limit', () => {
    for (const q of sample('juntar', 1)) {
      if (q.scene.kind !== 'join') throw new Error('scene');
      expect(q.scene.a + q.scene.b).toBeLessThanOrEqual(4);
      expect(q.options[q.answerIndex].number).toBe(q.scene.a + q.scene.b);
    }
  });

  it('asks for the shape that is named and the identical figure in "Ache o igual"', () => {
    for (const q of sample('formas', 2)) {
      expect(q.scene.kind === 'shapes' && q.options[q.answerIndex].token?.shape === q.scene.target).toBe(true);
    }
    for (const q of sample('igual', 3)) {
      if (q.scene.kind !== 'match') throw new Error('scene');
      expect(q.options[q.answerIndex].token).toEqual(q.scene.target);
    }
  });

  it('continues the repeating pattern correctly', () => {
    for (const q of [...sample('sequencias', 1), ...sample('sequencias', 3)]) {
      if (q.scene.kind !== 'pattern') throw new Error('scene');
      const seq = q.scene.sequence;
      const answer = q.options[q.answerIndex].token!;
      // em AB a resposta repete a posição 3 (índice 5 − 2); em AAB/ABC, a posição 2 (índice 5 − 3)
      const period = JSON.stringify(seq[0]) === JSON.stringify(seq[2]) && JSON.stringify(seq[1]) === JSON.stringify(seq[3]) ? 2 : 3;
      expect(answer).toEqual(seq[5 - period]);
    }
  });

  it('uses Portuguese number words with gender', () => {
    expect(numberWord(1, true)).toBe('uma');
    expect(numberWord(2, true)).toBe('duas');
    expect(numberWord(2)).toBe('dois');
    const crystals = sample('contar', 2).find(q => q.scene.kind === 'count' && q.scene.item === 'cristal');
    if (crystals) expect(crystals.prompt.startsWith('Quantos cristais')).toBe(true);
  });

  it('builds short rounds without repeating the same scene in a row', () => {
    const round = buildEarlyRound('contar', 1, seeded(7));
    expect(round).toHaveLength(4);
    for (let i = 1; i < round.length; i += 1) expect(JSON.stringify(round[i].scene)).not.toBe(JSON.stringify(round[i - 1].scene));
  });
});

describe('early years levels and summary', () => {
  it('raises the level only with consistent first-try evidence', () => {
    expect(earlyLevel({ attempts: 0, firstTry: 0 })).toBe(1);
    expect(earlyLevel({ attempts: 10, firstTry: 4 })).toBe(1);
    expect(earlyLevel({ attempts: 8, firstTry: 5 })).toBe(2);
    expect(earlyLevel({ attempts: 30, firstTry: 12 })).toBe(1);
    expect(earlyLevel({ attempts: 15, firstTry: 12 })).toBe(3);
  });

  it('turns first-try answers into stars per activity', () => {
    const summary = summarizeEarlyAttempts([
      { activity: 'contar', level: 1, firstTry: true, tries: 1, answeredAt: '2026-11-19T10:00:00.000Z' },
      { activity: 'contar', level: 1, firstTry: false, tries: 2, answeredAt: '2026-11-19T10:01:00.000Z' },
      { activity: 'formas', level: 1, firstTry: true, tries: 1, answeredAt: '2026-11-19T10:02:00.000Z' }
    ]);
    expect(summary).toMatchObject({ attempts: 3, firstTry: 2, stars: 2 });
    expect(summary.activities.find(item => item.id === 'contar')).toMatchObject({ attempts: 2, firstTry: 1, level: 1 });
    expect(summary.activities).toHaveLength(6);
  });
});
