import Dexie, { type Table } from 'dexie';

import type { DiagnosticResult } from '../learning/diagnostic';
import { summarizeChallengeAttempts, type ChallengeAttempt, type ChallengeSummary } from '../learning/challenges';
import { summarizeMemorySessions, type MemorySessionResult, type MemorySummary } from '../learning/memory';

export type ProgressRecord = {
  id: string;
  attempts: number;
  correct: number;
  lastSeenAt: string;
};

export type ChallengeAttemptRecord = ChallengeAttempt & { id?: number };
export type MemorySessionRecord = MemorySessionResult & { id?: number };

export type ProgressSummary = { factsSeen: number; attempts: number; correct: number; accuracy: number };

export type LearningOverview = {
  multiplication: ProgressSummary;
  challenges: ChallengeSummary;
  memory: MemorySummary;
};

export class MathQuestDatabase extends Dexie {
  progress!: Table<ProgressRecord, string>;
  assessments!: Table<DiagnosticResult & { id: string }, string>;
  challengeAttempts!: Table<ChallengeAttemptRecord, number>;
  memorySessions!: Table<MemorySessionRecord, number>;
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
  const [multiplication, challenges, memory] = await Promise.all([getProgressSummary(), getChallengeSummary(), getMemorySummary()]);
  return { multiplication, challenges, memory };
}
