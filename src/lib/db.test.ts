import 'fake-indexeddb/auto';
import Dexie from 'dexie';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  MathQuestDatabase,
  db,
  getLearningOverview,
  recordAnswer,
  recordChallengeAttempt,
  getEarlySummary,
  loadAgeProfile,
  recordEarlyAttempt,
  saveAgeProfile,
  saveDiagnostic,
  saveMemorySession
} from './db';
import { evaluateDiagnostic } from '../learning/diagnostic';
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
    expect(overview.diagnosticCompleted).toBe(false);
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

  it('marks the diagnostic as completed once a result is saved', async () => {
    await saveDiagnostic(evaluateDiagnostic([], '2026-11-19T09:00:00.000Z'));
    expect((await getLearningOverview()).diagnosticCompleted).toBe(true);
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
    expect(upgraded.verno).toBe(4);
    expect(await upgraded.settings.count()).toBe(0);
    upgraded.close();
    await Dexie.delete(name);
  });

  it('remembers only the chosen age band', async () => {
    expect(await loadAgeProfile()).toBeNull();
    await saveAgeProfile('age-3-6');
    expect(await loadAgeProfile()).toBe('age-3-6');
    await saveAgeProfile('age-11-13');
    expect(await loadAgeProfile()).toBe('age-11-13');
    expect(await db.settings.toArray()).toEqual([{ id: 'ageProfile', value: 'age-11-13' }]);
    await db.settings.put({ id: 'ageProfile', value: 'invalido' });
    expect(await loadAgeProfile()).toBeNull();
  });

  it('stores early-years evidence separately from the 11–13 progress', async () => {
    await recordEarlyAttempt({ activity: 'contar', level: 1, firstTry: true, tries: 1, answeredAt: '2026-11-19T10:00:00.000Z' });
    await recordEarlyAttempt({ activity: 'contar', level: 1, firstTry: false, tries: 2, answeredAt: '2026-11-19T10:01:00.000Z' });
    const early = await getEarlySummary();
    expect(early).toMatchObject({ attempts: 2, firstTry: 1, stars: 1 });
    const overview = await getLearningOverview();
    expect(overview.challenges.attempts).toBe(0);
  });
});

