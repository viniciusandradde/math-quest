import { describe, expect, it } from 'vitest';
import { buildMemoryDeck, memoryPairs } from './memory';

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
