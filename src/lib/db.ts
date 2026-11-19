import Dexie, { type Table } from 'dexie';

import type { DiagnosticResult } from '../learning/diagnostic';

export type ProgressRecord = {
  id: string;
  attempts: number;
  correct: number;
  lastSeenAt: string;
};

class MathQuestDatabase extends Dexie {
  progress!: Table<ProgressRecord, string>;
  assessments!: Table<DiagnosticResult & { id: string }, string>;
  constructor() {
    super('math-quest');
    this.version(1).stores({ progress: 'id, lastSeenAt' });
    this.version(2).stores({ progress: 'id, lastSeenAt', assessments: 'id, completedAt' });
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

export async function getProgressSummary() {
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
