import { describe, expect, it } from 'vitest';
import { computeCollection, computeXp, levelFromXp, newlyUnlocked, nextChallengeIndex, XP_PER_LEVEL, type RewardInput } from './rewards';

const empty: RewardInput = {
  challenges: { solved: 0, correct: 0, attempted: 0, total: 6 },
  memory: { sessions: 0 },
  multiplication: { correct: 0 },
  diagnosticCompleted: false
};

describe('learning rewards', () => {
  it('starts at level 1 with nothing unlocked', () => {
    expect(computeXp(empty)).toBe(0);
    expect(levelFromXp(0)).toMatchObject({ level: 1, xpInLevel: 0, progress: 0, title: 'Explorador Nível 1' });
    const collection = computeCollection(empty);
    expect(collection).toHaveLength(10);
    expect(collection.every(item => !item.unlocked)).toBe(true);
    expect(collection.map(item => item.id)).toEqual(['moeda', 'energia', 'engrenagem', 'cristal', 'chip', 'bau', 'estrela', 'conquista', 'xp', 'chave']);
  });

  it('turns learning evidence into XP and levels', () => {
    const input: RewardInput = { ...empty, challenges: { solved: 2, correct: 3, attempted: 4, total: 6 }, memory: { sessions: 1 }, multiplication: { correct: 4 }, diagnosticCompleted: true };
    expect(computeXp(input)).toBe(3 * 50 + 40 + 4 * 10 + 30);
    expect(levelFromXp(260)).toMatchObject({ level: 2, xpInLevel: 60, xpForNext: XP_PER_LEVEL });
    expect(levelFromXp(-5).level).toBe(1);
  });

  it('unlocks each board item from a specific achievement', () => {
    const unlocked = (input: RewardInput) => computeCollection(input).filter(item => item.unlocked).map(item => item.id);
    expect(unlocked({ ...empty, multiplication: { correct: 1 } })).toEqual(['moeda']);
    expect(unlocked({ ...empty, diagnosticCompleted: true })).toEqual(['chave']);
    expect(unlocked({ ...empty, memory: { sessions: 3 } })).toEqual(['chip', 'conquista']);
    const all = unlocked({ challenges: { solved: 6, correct: 6, attempted: 6, total: 6 }, memory: { sessions: 3 }, multiplication: { correct: 5 }, diagnosticCompleted: true });
    expect(all).toHaveLength(10);
  });

  it('reports only newly unlocked items', () => {
    const before = computeCollection(empty);
    const after = computeCollection({ ...empty, challenges: { solved: 1, correct: 1, attempted: 1, total: 6 } });
    expect(newlyUnlocked(before, after).map(item => item.id)).toEqual(['moeda', 'estrela']);
    expect(newlyUnlocked(after, after)).toEqual([]);
  });

  it('suggests the first unsolved challenge as the next mission', () => {
    expect(nextChallengeIndex([{ status: 'solved' }, { status: 'in-progress' }, { status: 'not-started' }])).toBe(1);
    expect(nextChallengeIndex([{ status: 'solved' }, { status: 'solved' }])).toBe(0);
  });
});
