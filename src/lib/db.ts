import Dexie, { type Table } from 'dexie';

import type { DiagnosticResult } from '../learning/diagnostic';
import { summarizeChallengeAttempts, type ChallengeAttempt, type ChallengeSummary } from '../learning/challenges';
import { summarizeMemorySessions, type MemorySessionResult, type MemorySummary } from '../learning/memory';
import { summarizeEarlyAttempts, type EarlyAttempt, type EarlySummary } from '../learning/early';
import { isAgeProfileId, type AgeProfileId } from '../learning/profiles';
import { createState, DEFAULT_CONFIG, normalize, type WellbeingConfig, type WellbeingState } from '../wellbeing/core';

export type ProgressRecord = {
  id: string;
  attempts: number;
  correct: number;
  lastSeenAt: string;
};

export type ChallengeAttemptRecord = ChallengeAttempt & { id?: number };
export type MemorySessionRecord = MemorySessionResult & { id?: number };
export type EarlyAttemptRecord = EarlyAttempt & { id?: number };
/** Configurações do aparelho. Hoje guarda só a faixa de idade escolhida. */
export type SettingRecord = { id: string; value: string };
/** Pausa saudável por perfil: configuração dos adultos e estado da rodada (somente no aparelho). */
export type WellbeingRecord = { profile: AgeProfileId; config: WellbeingConfig; state: WellbeingState };

export type ProgressSummary = { factsSeen: number; attempts: number; correct: number; accuracy: number };

export type LearningOverview = {
  multiplication: ProgressSummary;
  challenges: ChallengeSummary;
  memory: MemorySummary;
  diagnosticCompleted: boolean;
};

export class MathQuestDatabase extends Dexie {
  progress!: Table<ProgressRecord, string>;
  assessments!: Table<DiagnosticResult & { id: string }, string>;
  challengeAttempts!: Table<ChallengeAttemptRecord, number>;
  memorySessions!: Table<MemorySessionRecord, number>;
  earlyAttempts!: Table<EarlyAttemptRecord, number>;
  settings!: Table<SettingRecord, string>;
  wellbeing!: Table<WellbeingRecord, AgeProfileId>;
  constructor(name = 'math-quest') {
    super(name);
    this.version(1).stores({ progress: 'id, lastSeenAt' });
    this.version(2).stores({ progress: 'id, lastSeenAt', assessments: 'id, completedAt' });
    this.version(3).stores({
      progress: 'id, lastSeenAt',
      assessments: 'id, completedAt',
      challengeAttempts: '++id, challengeId, answeredAt',
      memorySessions: '++id, completedAt'
    });
    this.version(4).stores({
      progress: 'id, lastSeenAt',
      assessments: 'id, completedAt',
      challengeAttempts: '++id, challengeId, answeredAt',
      memorySessions: '++id, completedAt',
      earlyAttempts: '++id, activity, answeredAt',
      settings: 'id'
    });
    this.version(5).stores({
      progress: 'id, lastSeenAt',
      assessments: 'id, completedAt',
      challengeAttempts: '++id, challengeId, answeredAt',
      memorySessions: '++id, completedAt',
      earlyAttempts: '++id, activity, answeredAt',
      settings: 'id',
      wellbeing: 'profile'
    });
  }
}

export const db = new MathQuestDatabase();

export async function recordAnswer(factId: string, correct: boolean) {
  const current = await db.progress.get(factId);
  await db.progress.put({
    id: factId,
    attempts: (current?.attempts ?? 0) + 1,
    correct: (current?.correct ?? 0) + (correct ? 1 : 0),
    lastSeenAt: new Date().toISOString()
  });
}

export async function getProgressSummary(): Promise<ProgressSummary> {
  const records = await db.progress.toArray();
  const attempts = records.reduce((sum, item) => sum + item.attempts, 0);
  const correct = records.reduce((sum, item) => sum + item.correct, 0);
  return { factsSeen: records.length, attempts, correct, accuracy: attempts ? Math.round((correct / attempts) * 100) : 0 };
}

export async function saveDiagnostic(result: DiagnosticResult) {
  await db.assessments.put({ ...result, id: result.completedAt });
}

export async function getLatestDiagnostic() {
  return db.assessments.orderBy('completedAt').last();
}

export async function recordChallengeAttempt(attempt: ChallengeAttempt) {
  await db.challengeAttempts.add({ ...attempt });
}

export async function getChallengeSummary(): Promise<ChallengeSummary> {
  return summarizeChallengeAttempts(await db.challengeAttempts.toArray());
}

export async function saveMemorySession(result: MemorySessionResult) {
  await db.memorySessions.add({ ...result });
}

export async function getMemorySummary(): Promise<MemorySummary> {
  return summarizeMemorySessions(await db.memorySessions.toArray());
}

export async function getLearningOverview(): Promise<LearningOverview> {
  const [multiplication, challenges, memory, diagnostics] = await Promise.all([getProgressSummary(), getChallengeSummary(), getMemorySummary(), db.assessments.count()]);
  return { multiplication, challenges, memory, diagnosticCompleted: diagnostics > 0 };
}

const AGE_PROFILE_KEY = 'ageProfile';

export async function loadAgeProfile(): Promise<AgeProfileId | null> {
  const record = await db.settings.get(AGE_PROFILE_KEY);
  return isAgeProfileId(record?.value) ? record.value : null;
}

export async function saveAgeProfile(profile: AgeProfileId) {
  await db.settings.put({ id: AGE_PROFILE_KEY, value: profile });
}

export async function recordEarlyAttempt(attempt: EarlyAttempt) {
  await db.earlyAttempts.add({ ...attempt });
}

export async function getEarlySummary(): Promise<EarlySummary> {
  return summarizeEarlyAttempts(await db.earlyAttempts.toArray());
}

/** Lê a pausa saudável do perfil (com padrões e ajuste de novo dia local). */
export async function loadWellbeing(profile: AgeProfileId, now = Date.now()): Promise<WellbeingRecord> {
  const stored = await db.wellbeing.get(profile);
  const config = { ...DEFAULT_CONFIG[profile], ...(stored?.config ?? {}) };
  const state = normalize(stored?.state ?? createState(now), config, now);
  return { profile, config, state };
}

export async function saveWellbeing(record: WellbeingRecord) {
  await db.wellbeing.put(record);
}
