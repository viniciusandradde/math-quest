export type MultiplicationFact = {
  id: string;
  left: number;
  right: number;
  answer: number;
  attempts: number;
  correct: number;
  lastSeenAt?: string;
};

export function multiply(left: number, right: number): number {
  if (!Number.isInteger(left) || !Number.isInteger(right) || left < 0 || right < 0) {
    throw new Error('A multiplicação aceita apenas inteiros não negativos neste módulo.');
  }
  return left * right;
}

export function buildFact(left: number, right: number): MultiplicationFact {
  return { id: String(left) + 'x' + String(right), left, right, answer: multiply(left, right), attempts: 0, correct: 0 };
}

export function buildChoices(answer: number): number[] {
  const candidates = new Set<number>([answer]);
  const offsets = [2, -2, 5, -5, 10, -10, 1, -1, 7, -7];
  for (const offset of offsets) {
    if (candidates.size >= 4) break;
    const value = answer + offset;
    if (value >= 0) candidates.add(value);
  }
  return [...candidates].sort((a, b) => a - b);
}
