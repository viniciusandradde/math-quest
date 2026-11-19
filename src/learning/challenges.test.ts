import { describe, expect, it } from 'vitest';
import { buildChallengeAttempt, challenges, checkChallengeAnswer, parseChallengeResponse, summarizeChallengeAttempts } from './challenges';

describe('Math Quest grade-level challenges', () => {
  it('contains a balanced set of multi-step math domains', () => {
    expect(challenges).toHaveLength(6);
    expect(new Set(challenges.map(item => item.area)).size).toBeGreaterThanOrEqual(5);
  });

  it('accepts decimal answers with comma or point', () => {
    const money = challenges.find(item => item.id === 'market-change');
    expect(money).toBeDefined();
    expect(checkChallengeAnswer(money!, '12,55')).toBe(true);
    expect(checkChallengeAnswer(money!, '12.55')).toBe(true);
    expect(checkChallengeAnswer(money!, '12,50')).toBe(false);
  });

  it('checks multi-step challenge answers', () => {
    const expected: Record<string, number> = {
      'rescue-stock': 17,
      'fraction-parts': 39,
      'market-change': 12.55,
      'geometry-platform': 126,
      'logic-sequence': 191,
      'combined-fractions': 54
    };
    for (const challenge of challenges) {
      expect(challenge.answer).toBe(expected[challenge.id]);
      expect(checkChallengeAnswer(challenge, String(expected[challenge.id]))).toBe(true);
    }
  });

  it('rejects blank and non-numeric responses', () => {
    const challenge = challenges[0];
    expect(checkChallengeAnswer(challenge, '')).toBe(false);
    expect(checkChallengeAnswer(challenge, 'resposta')).toBe(false);
  });
});

describe('challenge learning evidence', () => {
  it('records only the numeric value of a response', () => {
    const challenge = challenges.find(item => item.id === 'market-change')!;
    expect(buildChallengeAttempt(challenge, ' 12,55 ', '2026-11-19T10:00:00.000Z')).toEqual({
      challengeId: 'market-change', correct: true, value: 12.55, answeredAt: '2026-11-19T10:00:00.000Z'
    });
    expect(buildChallengeAttempt(challenge, 'meu nome é Ana').value).toBeNull();
    expect(parseChallengeResponse('')).toBeNull();
  });

  it('summarizes progress per challenge without turning it into a ranking', () => {
    const summary = summarizeChallengeAttempts([
      { challengeId: 'rescue-stock', correct: false, value: 22, answeredAt: '2026-11-19T10:00:00.000Z' },
      { challengeId: 'rescue-stock', correct: true, value: 17, answeredAt: '2026-11-19T11:00:00.000Z' },
      { challengeId: 'fraction-parts', correct: false, value: 40, answeredAt: '2026-11-19T10:30:00.000Z' },
      { challengeId: 'unknown-challenge', correct: true, value: 1, answeredAt: '2026-11-19T10:30:00.000Z' }
    ]);
    expect(summary).toMatchObject({ total: challenges.length, attempted: 2, solved: 1, attempts: 3, correct: 1, accuracy: 33 });
    const rescue = summary.items.find(item => item.id === 'rescue-stock')!;
    expect(rescue).toMatchObject({ status: 'solved', attempts: 2, correct: 1, lastAnsweredAt: '2026-11-19T11:00:00.000Z' });
    expect(summary.items.find(item => item.id === 'fraction-parts')!.status).toBe('in-progress');
    expect(summary.items.find(item => item.id === 'logic-sequence')!.status).toBe('not-started');
  });

  it('reports zero accuracy when there are no attempts', () => {
    expect(summarizeChallengeAttempts([])).toMatchObject({ attempted: 0, solved: 0, accuracy: 0 });
  });
});
