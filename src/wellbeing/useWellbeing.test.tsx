import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createState, DEFAULT_CONFIG } from './core';

const dbMock = vi.hoisted(() => ({ loadWellbeing: vi.fn(), saveWellbeing: vi.fn(async () => {}) }));
vi.mock('../lib/db', () => dbMock);

import { useWellbeing } from './useWellbeing';

const minutes = (n: number) => n * 60_000;

async function mount(active = true) {
  const hook = renderHook(({ on }) => useWellbeing({ profile: 'age-3-6', active: on }), { initialProps: { on: active } });
  await act(async () => { await Promise.resolve(); });
  return hook;
}

describe('useWellbeing (relógio, aviso e teto duro)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date(2026, 10, 19, 10, 0) });
    dbMock.loadWellbeing.mockImplementation(async () => ({
      profile: 'age-3-6',
      config: { ...DEFAULT_CONFIG['age-3-6'], windowStart: '00:00', windowEnd: '24:00' },
      state: createState(Date.now())
    }));
  });
  afterEach(() => { vi.useRealTimers(); vi.clearAllMocks(); });

  it('counts only active time and gives a single warning about 3 minutes before', async () => {
    const { result } = await mount();
    expect(result.current.ready).toBe(true);
    act(() => { vi.advanceTimersByTime(minutes(11)); });
    expect(result.current.checkpoint()).toBe('none');
    act(() => { vi.advanceTimersByTime(minutes(1) + 1000); });
    let first: string = '';
    act(() => { first = result.current.checkpoint(); });
    expect(first).toBe('warned');
    expect(result.current.checkpoint()).toBe('none');
    act(() => { vi.advanceTimersByTime(minutes(3)); });
    let due: string = '';
    act(() => { due = result.current.checkpoint(); });
    expect(due).toBe('mission');
    expect(result.current.screen).toBe('mission');
    expect(result.current.mission?.profile).toBe('age-3-6');
  });

  it('does not count time while the adults area is open', async () => {
    const { result, rerender } = await mount(false);
    act(() => { vi.advanceTimersByTime(minutes(20)); });
    expect(result.current.state.activeSec).toBe(0);
    rerender({ on: true });
    act(() => { vi.advanceTimersByTime(minutes(2)); });
    // O estado exibido é atualizado a cada 15 s durante o uso.
    expect(result.current.state.activeSec).toBeGreaterThanOrEqual(105);
    expect(result.current.state.activeSec).toBeLessThanOrEqual(120);
  });

  it('opens the mission by itself 2 minutes after the limit (hard cap) and saves it', async () => {
    const { result } = await mount();
    act(() => { vi.advanceTimersByTime(minutes(17) + 2000); });
    expect(result.current.screen).toBe('mission');
    expect(dbMock.saveWellbeing).toHaveBeenLastCalledWith(expect.objectContaining({ state: expect.objectContaining({ status: 'mission' }) }));
  });

  it('keeps the break running from when it started, even after reopening the app', async () => {
    const { result, unmount } = await mount();
    act(() => { vi.advanceTimersByTime(minutes(17) + 2000); });
    act(() => { result.current.accept(); });
    const saved = (dbMock.saveWellbeing.mock.calls.at(-1) as unknown as [{ state: { breakStartedAt: number } }])[0];
    unmount();
    act(() => { vi.advanceTimersByTime(minutes(10)); });
    dbMock.loadWellbeing.mockImplementation(async () => saved);
    const reopened = await mount();
    expect(reopened.result.current.screen).toBe('break');
    expect(reopened.result.current.state.breakStartedAt).toBe(saved.state.breakStartedAt);
  });
});
