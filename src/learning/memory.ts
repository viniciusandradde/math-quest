export type MemoryCard = {
  id: string;
  pairId: string;
  text: string;
  kind: 'operation' | 'result';
};

type MemoryPair = { id: string; operation: string; result: string; };

export const memoryPairs: MemoryPair[] = [
  { id: 'fraction-forty', operation: '3/4 de 40', result: '30' },
  { id: 'fraction-sixty', operation: '2/5 de 60', result: '24' },
  { id: 'area-rectangle', operation: 'Área: 12 × 8', result: '96 m²' },
  { id: 'perimeter-rectangle', operation: 'Perímetro: 2 × (9 + 6)', result: '30 m' },
  { id: 'percentage', operation: '25% de 80', result: '20' },
  { id: 'decimals', operation: '1,5 + 2,75', result: '4,25' }
];

export function buildMemoryDeck(random: () => number = Math.random): MemoryCard[] {
  const cards = memoryPairs.flatMap(pair => [
    { id: pair.id + '-operation', pairId: pair.id, text: pair.operation, kind: 'operation' as const },
    { id: pair.id + '-result', pairId: pair.id, text: pair.result, kind: 'result' as const }
  ]);
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}
