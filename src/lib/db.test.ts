import 'fake-indexeddb/auto';
import Dexie from 'dexie';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  MathQuestDatabase,
  db,
  getLearningOverview,
  recordAnswer,
  recordChallengeAttempt,
  saveMemorySession
} from './db';
import { challenges } from '../learning/challenges';

describe('local learning database', () => {
  beforeEach(async () => {
    await Promise.all(db.tables.map(table => table.clear()));
  });

  it('starts with an empty overview', async () => {
    const overview = await getLearningOverview();
    expect(overview.multiplication.attempts).toBe(0);
    expect(overview.challenges.attempted).toBe(0);
    expect(overview.challenges.total).toBe(challenges.length);
    expect(overview.memory).toEqual({ sessions: 0, bestAttempts: null });
  });

  it('stores challenge attempts, memory sessions and practice together', async () => {
    await recordAnswer('7x8', true);
    await recordChallengeAttempt({ challengeId: 'rescue-stock', correct: false, value: 22, answeredAt: '2026-11-19T10:00:00.000Z' });
    await recordChallengeAttempt({ challengeId: 'rescue-stock', correct: true, value: 17, answeredAt: '2026-11-19T10:05:00.000Z' });
    await recordChallengeAttempt({ challengeId: 'logic-sequence', correct: false, value: null, answeredAt: '2026-11-19T10:06:00.000Z' });
    await saveMemorySession({ attempts: 9, pairs: 6, completedAt: '2026-11-19T11:00:00.000Z' });
    await saveMemorySession({ attempts: 7, pairs: 6, completedAt: '2026-11-19T12:00:00.000Z' });

    const overview = await getLearningOverview();
    expect(overview.multiplication).toMatchObject({ attempts: 1, correct: 1 });
    expect(overview.challenges).toMatchObject({ attempted: 2, solved: 1, attempts: 3, correct: 1, accuracy: 33 });
    expect(overview.challenges.items.find(item => item.id === 'logic-sequence')?.status).toBe('in-progress');
    expect(overview.memory).toEqual({ sessions: 2, bestAttempts: 7, lastCompletedAt: '2026-11-19T12:00:00.000Z' });
  });

  it('keeps existing beta data when upgrading from schema version 2', async () => {
    const name = 'math-quest-upgrade-test';
    const legacy = new Dexie(name);
    legacy.version(1).stores({ progress: 'id, lastSeenAt' });
    legacy.version(2).stores({ progress: 'id, lastSeenAt', assessments: 'id, completedAt' });
    await legacy.table('progress').put({ id: '6x9', attempts: 3, correct: 2, lastSeenAt: '2026-11-18T09:00:00.000Z' });
    legacy.close();

    const upgraded = new MathQuestDatabase(name);
    expect(await upgraded.progress.get('6x9')).toMatchObject({ attempts: 3, correct: 2 });
    await upgraded.challengeAttempts.add({ challengeId: 'fraction-parts', correct: true, value: 39, answeredAt: '2026-11-19T10:00:00.000Z' });
    expect(await upgraded.challengeAttempts.count()).toBe(1);
    expect(upgraded.verno).toBe(3);
    upgraded.close();
    await Dexie.delete(name);
  });
});
