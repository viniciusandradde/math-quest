import { describe, expect, it } from 'vitest';
import { challenges, checkChallengeAnswer } from './challenges';

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
