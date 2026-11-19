import Dexie, { type Table } from 'dexie';

export type ProgressRecord = {
  id: string;
  attempts: number;
  correct: number;
  lastSeenAt: string;
};

class MathQuestDatabase extends Dexie {
  progress!: Table<ProgressRecord, string>;
  constructor() {
    super('math-quest');
    this.version(1).stores({ progress: 'id, lastSeenAt' });
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
