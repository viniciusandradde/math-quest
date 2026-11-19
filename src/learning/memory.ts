export type MemoryCard = {
  id: string;
  pairId: string;
  text: string;
  kind: 'operation' | 'result';
};

export type MemoryPair = { id: string; operation: string; result: string; explanation: string };

export const memoryPairs: MemoryPair[] = [
  { id: 'fraction-forty', operation: '3/4 de 40', result: '30', explanation: '40 ÷ 4 = 10 e 10 × 3 = 30.' },
  { id: 'fraction-sixty', operation: '2/5 de 60', result: '24', explanation: '60 ÷ 5 = 12 e 12 × 2 = 24.' },
  { id: 'area-rectangle', operation: 'Área: 12 × 8', result: '96 m²', explanation: 'A área do retângulo é comprimento × largura: 12 × 8 = 96 m².' },
  { id: 'perimeter-rectangle', operation: 'Perímetro: 2 × (9 + 6)', result: '30 m', explanation: 'O perímetro soma os lados: 9 + 6 = 15 e 2 × 15 = 30 m.' },
  { id: 'percentage', operation: '25% de 80', result: '20', explanation: '25% é o mesmo que 1/4: 80 ÷ 4 = 20.' },
  { id: 'decimals', operation: '1,5 + 2,75', result: '4,25', explanation: 'Alinhe as vírgulas: 1,50 + 2,75 = 4,25.' }
];

export function buildMemoryDeck(random: () => number = Math.random, pairs: MemoryPair[] = memoryPairs): MemoryCard[] {
  const cards = pairs.flatMap(pair => [
    { id: pair.id + '-operation', pairId: pair.id, text: pair.operation, kind: 'operation' as const },
    { id: pair.id + '-result', pairId: pair.id, text: pair.result, kind: 'result' as const }
  ]);
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

/**
 * Estado de uma partida de memória. É imutável: cada jogada devolve um novo estado,
 * o que mantém as regras testáveis sem depender da interface.
 */
export type MemoryGameState = {
  deck: MemoryCard[];
  /** Cartas viradas e ainda sem par (no máximo duas). */
  revealed: string[];
  /** Pares já encontrados. */
  matchedPairs: string[];
  /** Número de tentativas de par (cada duas cartas viradas contam uma tentativa). */
  attempts: number;
  /** Resultado da última tentativa, usado para o feedback. */
  lastResult: 'match' | 'mismatch' | null;
};

export function createMemoryGame(random: () => number = Math.random, pairs: MemoryPair[] = memoryPairs): MemoryGameState {
  return { deck: buildMemoryDeck(random, pairs), revealed: [], matchedPairs: [], attempts: 0, lastResult: null };
}

export function isCardFaceUp(state: MemoryGameState, card: MemoryCard): boolean {
  return state.revealed.includes(card.id) || state.matchedPairs.includes(card.pairId);
}

/**
 * Vira uma carta. Ignora cartas já visíveis. Se duas cartas sem par estiverem
 * visíveis, elas são escondidas antes de virar a nova carta, para que a criança
 * siga no próprio ritmo sem depender de temporizador.
 */
export function revealCard(state: MemoryGameState, cardId: string): MemoryGameState {
  const card = state.deck.find(item => item.id === cardId);
  if (!card || isCardFaceUp(state, card)) return state;

  const revealed = state.revealed.length >= 2 ? [cardId] : [...state.revealed, cardId];
  if (revealed.length < 2) return { ...state, revealed, lastResult: null };

  const [first, second] = revealed.map(id => state.deck.find(item => item.id === id)!);
  const attempts = state.attempts + 1;
  if (first.pairId === second.pairId) {
    return { ...state, revealed: [], matchedPairs: [...state.matchedPairs, first.pairId], attempts, lastResult: 'match' };
  }
  return { ...state, revealed, attempts, lastResult: 'mismatch' };
}

/** Esconde as duas cartas de uma tentativa sem par. */
export function hideMismatch(state: MemoryGameState): MemoryGameState {
  return state.lastResult === 'mismatch' ? { ...state, revealed: [], lastResult: null } : state;
}

export function isMemoryComplete(state: MemoryGameState): boolean {
  const pairIds = new Set(state.deck.map(card => card.pairId));
  return state.matchedPairs.length === pairIds.size;
}

function numericPart(text: string): string {
  return text.replace(/[^\d,.-]/g, '');
}

/** Explica por que duas cartas não formam par, sem revelar o resultado correto. */
export function describeMismatch(first: MemoryCard, second: MemoryCard, pairs: MemoryPair[] = memoryPairs): string {
  if (first.kind === second.kind) {
    return first.kind === 'operation'
      ? 'Duas operações não formam par. Procure uma operação e o resultado dela.'
      : 'Dois resultados não formam par. Procure uma operação e o resultado dela.';
  }
  const operation = first.kind === 'operation' ? first : second;
  const result = first.kind === 'result' ? first : second;
  const expected = pairs.find(pair => pair.id === operation.pairId)?.result ?? '';
  if (numericPart(expected) === numericPart(result.text) && expected !== result.text) {
    return 'O número confere, mas a unidade de medida não combina com ' + operation.text + '. Observe o que a operação mede.';
  }
  return operation.text + ' não resulta em ' + result.text + '. Calcule a operação antes de procurar o resultado.';
}

/** Explica o raciocínio de um par encontrado. */
export function describeMatch(pairId: string, pairs: MemoryPair[] = memoryPairs): string {
  const pair = pairs.find(item => item.id === pairId);
  return pair ? pair.operation + ' = ' + pair.result + '. ' + pair.explanation : '';
}
