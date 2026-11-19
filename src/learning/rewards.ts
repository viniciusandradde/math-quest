/**
 * Recompensas ligadas a evidências de aprendizagem: XP, nível e coleção de itens.
 * Nada aqui pune o erro — tentativas sem acerto não tiram pontos.
 */
export type RewardInput = {
  challenges: { solved: number; correct: number; attempted: number; total: number };
  memory: { sessions: number };
  multiplication: { correct: number };
  diagnosticCompleted: boolean;
};

export const XP_PER_LEVEL = 200;
export const XP_RULES = { challengeCorrect: 50, memorySession: 40, practiceCorrect: 10, diagnostic: 30 } as const;

export function computeXp(input: RewardInput): number {
  return input.challenges.correct * XP_RULES.challengeCorrect
    + input.memory.sessions * XP_RULES.memorySession
    + input.multiplication.correct * XP_RULES.practiceCorrect
    + (input.diagnosticCompleted ? XP_RULES.diagnostic : 0);
}

export type LevelInfo = { xp: number; level: number; xpInLevel: number; xpForNext: number; progress: number; title: string };

export function levelFromXp(xp: number): LevelInfo {
  const safe = Math.max(0, Math.floor(xp));
  const level = 1 + Math.floor(safe / XP_PER_LEVEL);
  const xpInLevel = safe % XP_PER_LEVEL;
  return { xp: safe, level, xpInLevel, xpForNext: XP_PER_LEVEL, progress: xpInLevel / XP_PER_LEVEL, title: 'Explorador Nível ' + level };
}

export type ItemId = 'moeda' | 'energia' | 'engrenagem' | 'cristal' | 'chip' | 'bau' | 'estrela' | 'conquista' | 'xp' | 'chave';
export type CollectibleItem = { id: ItemId; name: string; goal: string; unlocked: boolean };

/** Itens do brand board, na mesma ordem, cada um ligado a uma evidência observável. */
const ITEM_RULES: { id: ItemId; name: string; goal: string; check: (input: RewardInput, level: number) => boolean }[] = [
  { id: 'moeda', name: 'Moeda', goal: 'Acerte a primeira resposta.', check: input => input.challenges.correct + input.multiplication.correct >= 1 },
  { id: 'energia', name: 'Energia', goal: 'Acerte 5 cálculos no aquecimento.', check: input => input.multiplication.correct >= 5 },
  { id: 'engrenagem', name: 'Engrenagem', goal: 'Tente todos os desafios estratégicos.', check: input => input.challenges.total > 0 && input.challenges.attempted >= input.challenges.total },
  { id: 'cristal', name: 'Cristal', goal: 'Resolva 3 desafios estratégicos.', check: input => input.challenges.solved >= 3 },
  { id: 'chip', name: 'Chip IA', goal: 'Conclua uma partida da memória.', check: input => input.memory.sessions >= 1 },
  { id: 'bau', name: 'Baú', goal: 'Resolva todos os desafios estratégicos.', check: input => input.challenges.total > 0 && input.challenges.solved >= input.challenges.total },
  { id: 'estrela', name: 'Estrela', goal: 'Resolva o primeiro desafio estratégico.', check: input => input.challenges.solved >= 1 },
  { id: 'conquista', name: 'Conquista', goal: 'Conclua 3 partidas da memória.', check: input => input.memory.sessions >= 3 },
  { id: 'xp', name: 'XP', goal: 'Alcance o nível 3.', check: (_input, level) => level >= 3 },
  { id: 'chave', name: 'Chave', goal: 'Complete o diagnóstico.', check: input => input.diagnosticCompleted }
];

export function computeCollection(input: RewardInput): CollectibleItem[] {
  const { level } = levelFromXp(computeXp(input));
  return ITEM_RULES.map(rule => ({ id: rule.id, name: rule.name, goal: rule.goal, unlocked: rule.check(input, level) }));
}

/** Itens desbloqueados em `next` que ainda não estavam em `previous`. */
export function newlyUnlocked(previous: CollectibleItem[], next: CollectibleItem[]): CollectibleItem[] {
  const before = new Set(previous.filter(item => item.unlocked).map(item => item.id));
  return next.filter(item => item.unlocked && !before.has(item.id));
}

/** Índice do próximo desafio a jogar: o primeiro ainda não resolvido (ou o primeiro, se todos foram). */
export function nextChallengeIndex(statuses: { status: 'not-started' | 'in-progress' | 'solved' }[]): number {
  const index = statuses.findIndex(item => item.status !== 'solved');
  return index === -1 ? 0 : index;
}
