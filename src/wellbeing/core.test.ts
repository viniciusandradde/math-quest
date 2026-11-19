(globalThis as unknown as { process: { env: Record<string, string> } }).process.env.TZ = 'America/Sao_Paulo';

import { describe, expect, it } from 'vitest';
import {
  acceptMission, completeReturn, createState, DEFAULT_CONFIG, hashPin, insist, isBreakDone, isDue, isHardCap, isLastRound, isValidPin,
  isWithinWindow, localDay, normalize, parentPauseNow, parentResetToday, parentUnlock, randomSalt, resolveScreen, returnFromBreak,
  shouldWarn, startMission, tick, verifyPin, weekSummary, type WellbeingConfig
} from './core';
import { findMission, missionsFor, pickMission } from './missions';

const at = (y: number, mo: number, d: number, h: number, mi = 0) => new Date(y, mo - 1, d, h, mi).getTime();
const early = DEFAULT_CONFIG['age-3-6'];
const explorer = DEFAULT_CONFIG['age-11-13'];

function play(state = createState(at(2026, 11, 19, 10)), config: WellbeingConfig = early, seconds: number, start = at(2026, 11, 19, 10)) {
  let s = state;
  for (let t = 0; t < seconds; t += 10) s = tick(s, config, 10, start + t * 1000);
  return s;
}

describe('wellbeing core: day and allowed hours (local time zone)', () => {
  it('uses the local date, not UTC (in Brazil the old UTC logic rolled the day at 21h)', () => {
    const lateEvening = at(2026, 11, 19, 23, 30);
    expect(localDay(lateEvening)).toBe('2026-11-19');
    expect(new Date(lateEvening).toISOString().slice(0, 10)).toBe('2026-11-20');
  });

  it('keeps "Até amanhã" after 21h and only releases on the next local day', () => {
    const done = { ...createState(at(2026, 11, 19, 20, 59)), status: 'done' as const, roundsToday: 2 };
    expect(normalize(done, early, at(2026, 11, 19, 21, 1)).status).toBe('done');
    const nextDay = normalize(done, early, at(2026, 11, 20, 8, 5));
    expect(nextDay).toMatchObject({ status: 'idle', roundsToday: 0, localDay: '2026-11-20' });
  });

  it('respects the allowed-hours window per profile', () => {
    expect(isWithinWindow(early, at(2026, 11, 19, 7, 59))).toBe(false);
    expect(isWithinWindow(early, at(2026, 11, 19, 8, 0))).toBe(true);
    expect(isWithinWindow(early, at(2026, 11, 19, 18, 59))).toBe(true);
    expect(isWithinWindow(early, at(2026, 11, 19, 19, 0))).toBe(false);
    expect(isWithinWindow(explorer, at(2026, 11, 19, 20, 30))).toBe(true);
    expect(resolveScreen(createState(0), early, at(2026, 11, 19, 20))).toBe('outside-hours');
    expect(resolveScreen(createState(0), explorer, at(2026, 11, 19, 20))).toBe('play');
    expect(resolveScreen(createState(0), { ...early, enabled: false }, at(2026, 11, 19, 22))).toBe('play');
  });
});

describe('wellbeing core: one round', () => {
  it('counts only active time, warns once about 3 minutes before and becomes due at the limit', () => {
    let s = play(undefined, early, 11 * 60);
    expect(shouldWarn(s, early)).toBe(false);
    s = play(s, early, 60);
    expect(shouldWarn(s, early)).toBe(true);
    expect(shouldWarn({ ...s, warned: true }, early)).toBe(false);
    s = play(s, early, 3 * 60);
    expect(isDue(s, early)).toBe(true);
    expect(isHardCap(s, early)).toBe(false);
    s = play(s, early, 2 * 60);
    expect(isHardCap(s, early)).toBe(true);
  });

  it('runs mission → break → return without ever restarting the break timer', () => {
    const start = at(2026, 11, 19, 10);
    let s = startMission(play(undefined, early, 15 * 60), 'contar-brinquedos');
    expect(resolveScreen(s, early, start)).toBe('mission');
    s = acceptMission(s, start);
    expect(resolveScreen(s, early, start)).toBe('break');
    expect(isBreakDone(s, early, start + 14 * 60_000)).toBe(false);
    expect(returnFromBreak(s, early, start + 14 * 60_000).status).toBe('break');
    const tick1 = tick(s, early, 30, start + 60_000);
    expect(tick1.breakStartedAt).toBe(start);
    s = returnFromBreak(s, early, start + 15 * 60_000);
    expect(s.status).toBe('return');
    s = completeReturn(s, early);
    expect(s).toMatchObject({ status: 'idle', activeSec: 0, roundsToday: 1, warned: false });
    expect(s.history.at(-1)).toMatchObject({ rounds: 1, missions: ['contar-brinquedos'] });
  });

  it('answers insistence at most 4 times, 20 seconds apart', () => {
    const start = at(2026, 11, 19, 10);
    let s = acceptMission(startMission(createState(start), 'agua'), start);
    const levels: (number | null)[] = [];
    let now = start;
    for (let i = 0; i < 8; i += 1) {
      const r = insist(s, early, now);
      s = r.state; levels.push(r.speakLevel);
      now += i % 2 === 0 ? 5_000 : 20_000;
    }
    expect(levels.filter(level => level !== null)).toEqual([0, 1, 2, 3]);
    expect(s.insistCount).toBe(4);
  });

  it('ends the day after the configured rounds', () => {
    let s = { ...createState(at(2026, 11, 19, 10)), roundsToday: 1 };
    expect(isLastRound(s, early)).toBe(true);
    s = completeReturn({ ...s, status: 'return' }, early);
    expect(s.status).toBe('done');
    expect(resolveScreen(s, early, at(2026, 11, 19, 11))).toBe('done');
  });

  it('resets the round counter after a pause longer than the break without use', () => {
    const s = play(undefined, early, 5 * 60);
    expect(normalize(s, early, at(2026, 11, 19, 10, 40)).activeSec).toBe(0);
  });
});

describe('wellbeing core: adult actions and summary', () => {
  it('pauses at the next stopping point, unlocks neutrally and resets the day', () => {
    const s = createState(at(2026, 11, 19, 10));
    expect(isDue(parentPauseNow(s, early), early)).toBe(true);
    expect(parentUnlock({ ...s, status: 'break', breakStartedAt: 1 })).toMatchObject({ status: 'idle', activeSec: 0 });
    expect(parentResetToday({ ...s, status: 'done', roundsToday: 2 })).toMatchObject({ status: 'idle', roundsToday: 0 });
  });

  it('summarises the last 7 local days, including days without use', () => {
    const s = play(undefined, early, 6 * 60);
    const week = weekSummary(s, at(2026, 11, 19, 12));
    expect(week).toHaveLength(7);
    expect(week.at(-1)).toMatchObject({ day: '2026-11-19', minutes: 6 });
    expect(week[0]).toMatchObject({ day: '2026-11-13', minutes: 0 });
  });

  it('stores the PIN only as a salted hash', async () => {
    expect(isValidPin('1234')).toBe(true);
    expect(isValidPin('12a4')).toBe(false);
    const salt = randomSalt();
    const config = { ...explorer, pinSalt: salt, pinHash: await hashPin('4821', salt) };
    expect(config.pinHash).not.toContain('4821');
    expect(await verifyPin(config, '4821')).toBe(true);
    expect(await verifyPin(config, '1111')).toBe(false);
    expect(await verifyPin(explorer, '4821')).toBe(false);
  });
});

describe('wellbeing missions', () => {
  it('has at least 12 missions per profile with 3+ calm and 3+ real-world maths', () => {
    for (const profile of ['age-3-6', 'age-11-13'] as const) {
      const list = missionsFor(profile);
      expect(list.length).toBeGreaterThanOrEqual(12);
      expect(list.filter(m => m.energy === 'calma').length).toBeGreaterThanOrEqual(3);
      expect(list.filter(m => m.category === 'mundo-real').length).toBeGreaterThanOrEqual(3);
      expect(new Set(list.map(m => m.id)).size).toBe(list.length);
    }
    for (const m of missionsFor('age-3-6')) expect(m.text.split(' ').length).toBeLessThanOrEqual(25);
  });

  it('never repeats the last 3 missions and avoids active missions after 19h', () => {
    let seed = 1;
    const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const recent = ['contar-brinquedos', 'agua', 'abraco'];
    for (let i = 0; i < 100; i += 1) {
      const m = pickMission('age-3-6', recent, 20, random);
      expect(recent).not.toContain(m.id);
      expect(m.energy).toBe('calma');
    }
    expect(findMission('age-11-13', 'area-quarto')?.skill).toContain('EF05MA20');
  });
});
