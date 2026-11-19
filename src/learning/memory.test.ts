import { describe, expect, it } from 'vitest';
import { buildMemoryDeck, createMemoryGame, describeMatch, describeMismatch, hideMismatch, isMemoryComplete, memoryPairs, revealCard, summarizeMemorySessions } from './memory';

describe('Math Quest memory game', () => {
  it('creates two cards for every math pair', () => {
    const deck = buildMemoryDeck(() => 0.5);
    expect(deck).toHaveLength(memoryPairs.length * 2);
    expect(new Set(deck.map(card => card.id)).size).toBe(deck.length);
  });

  it('keeps operation and result connected by the same pair id', () => {
    const deck = buildMemoryDeck(() => 0.5);
    for (const pair of memoryPairs) {
      const cards = deck.filter(card => card.pairId === pair.id);
      expect(cards).toHaveLength(2);
      expect(cards.map(card => card.kind).sort()).toEqual(['operation', 'result']);
      expect(cards.map(card => card.text)).toContain(pair.operation);
      expect(cards.map(card => card.text)).toContain(pair.result);
    }
  });

  it('uses grade-level content rather than single-digit multiplication facts', () => {
    expect(memoryPairs.some(pair => pair.operation.includes('%'))).toBe(true);
    expect(memoryPairs.some(pair => pair.operation.includes('/'))).toBe(true);
    expect(memoryPairs.some(pair => pair.operation.includes('Área'))).toBe(true);
    expect(memoryPairs.some(pair => pair.operation.includes(','))).toBe(true);
  });
});

describe('Math Quest memory game rules', () => {
  const findCard = (state: ReturnType<typeof createMemoryGame>, pairId: string, kind: 'operation' | 'result') =>
    state.deck.find(card => card.pairId === pairId && card.kind === kind)!;

  it('matches an operation with its own result and explains the reasoning', () => {
    let state = createMemoryGame(() => 0.5);
    state = revealCard(state, findCard(state, 'fraction-forty', 'operation').id);
    expect(state.revealed).toHaveLength(1);
    state = revealCard(state, findCard(state, 'fraction-forty', 'result').id);
    expect(state.lastResult).toBe('match');
    expect(state.matchedPairs).toEqual(['fraction-forty']);
    expect(state.revealed).toHaveLength(0);
    expect(state.attempts).toBe(1);
    expect(describeMatch('fraction-forty')).toContain('40 ÷ 4 = 10');
  });

  it('keeps a mismatch visible until it is hidden or another card is chosen', () => {
    let state = createMemoryGame(() => 0.5);
    const operation = findCard(state, 'percentage', 'operation');
    const wrong = findCard(state, 'decimals', 'result');
    state = revealCard(revealCard(state, operation.id), wrong.id);
    expect(state.lastResult).toBe('mismatch');
    expect(state.revealed).toEqual([operation.id, wrong.id]);
    expect(hideMismatch(state).revealed).toHaveLength(0);

    const third = findCard(state, 'area-rectangle', 'operation');
    const next = revealCard(state, third.id);
    expect(next.revealed).toEqual([third.id]);
    expect(next.attempts).toBe(1);
  });

  it('ignores cards that are already face up', () => {
    let state = createMemoryGame(() => 0.5);
    const card = findCard(state, 'decimals', 'operation');
    state = revealCard(state, card.id);
    expect(revealCard(state, card.id)).toBe(state);
    expect(revealCard(state, 'missing-card')).toBe(state);
  });

  it('finishes when every pair is matched', () => {
    let state = createMemoryGame(() => 0.5);
    for (const pair of memoryPairs) {
      expect(isMemoryComplete(state)).toBe(false);
      state = revealCard(state, findCard(state, pair.id, 'operation').id);
      state = revealCard(state, findCard(state, pair.id, 'result').id);
    }
    expect(isMemoryComplete(state)).toBe(true);
    expect(state.attempts).toBe(memoryPairs.length);
  });

  it('explains mismatches without revealing the correct result', () => {
    const state = createMemoryGame(() => 0.5);
    const fraction = findCard(state, 'fraction-forty', 'operation');
    const perimeterResult = findCard(state, 'perimeter-rectangle', 'result');
    expect(describeMismatch(fraction, perimeterResult)).toContain('unidade de medida');
    expect(describeMismatch(fraction, perimeterResult)).not.toContain('= 30');

    const twoOperations = describeMismatch(fraction, findCard(state, 'decimals', 'operation'));
    expect(twoOperations).toContain('Duas operações');

    const plainWrong = describeMismatch(fraction, findCard(state, 'decimals', 'result'));
    expect(plainWrong).toContain('não resulta em 4,25');
  });

  it('keeps every pair mathematically consistent with its explanation', () => {
    for (const pair of memoryPairs) {
      expect(pair.explanation.length).toBeGreaterThan(10);
      expect(pair.explanation).toContain(pair.result.replace(/ m²| m/, ''));
    }
  });
});

describe('memory session summary', () => {
  it('summarizes completed sessions', () => {
    expect(summarizeMemorySessions([])).toEqual({ sessions: 0, bestAttempts: null });
    expect(summarizeMemorySessions([
      { attempts: 10, pairs: 6, completedAt: '2026-11-19T10:00:00.000Z' },
      { attempts: 8, pairs: 6, completedAt: '2026-11-19T09:00:00.000Z' }
    ])).toEqual({ sessions: 2, bestAttempts: 8, lastCompletedAt: '2026-11-19T10:00:00.000Z' });
  });
});
