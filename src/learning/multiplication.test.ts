import { describe, expect, it } from 'vitest';
import { buildChoices, buildFact, multiply } from './multiplication';

describe('multiplication learning primitives', () => {
  it('calculates multiplication', () => {
    expect(multiply(7, 8)).toBe(56);
  });
  it('creates a fact with a stable id', () => {
    expect(buildFact(6, 9)).toMatchObject({ id: '6x9', answer: 54 });
  });
  it('builds four distinct answer choices including the correct answer', () => {
    const choices = buildChoices(56);
    expect(choices).toHaveLength(4);
    expect(new Set(choices).size).toBe(4);
    expect(choices).toContain(56);
  });
});
