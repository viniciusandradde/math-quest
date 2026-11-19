/**
 * Núcleo da pausa saudável (Padrão VSA de Bem-Estar Digital Infantil).
 *
 * Funções puras e determinísticas: o relógio (`now`, em ms) é sempre um parâmetro,
 * para que tudo seja testável sem interface. Datas e horários usam o fuso LOCAL do aparelho.
 */
import type { AgeProfileId } from '../learning/profiles';

export type WellbeingConfig = {
  enabled: boolean;
  /** Minutos de uso por rodada. */
  sessionMin: number;
  /** Minutos da pausa. */
  breakMin: number;
  roundsPerDay: number;
  /** Janela de uso no fuso local, "HH:MM". */
  windowStart: string;
  windowEnd: string;
  /** PIN dos adultos (perfil 11 a 13), guardado como hash com sal. */
  pinHash?: string;
  pinSalt?: string;
};

export type WellbeingStatus = 'idle' | 'mission' | 'break' | 'return' | 'done';

export type DayLog = { day: string; activeSec: number; rounds: number; missions: string[] };

export type WellbeingState = {
  status: WellbeingStatus;
  /** Segundos de uso na rodada atual. */
  activeSec: number;
  warned: boolean;
  breakStartedAt?: number;
  missionId?: string;
  recentMissions: string[];
  insistCount: number;
  lastInsistAt?: number;
  roundsToday: number;
  localDay: string;
  lastActiveAt: number;
  history: DayLog[];
};

export type WellbeingScreen = 'play' | 'mission' | 'break' | 'return' | 'done' | 'outside-hours';

export const DEFAULT_CONFIG: Record<AgeProfileId, WellbeingConfig> = {
  'age-3-6': { enabled: true, sessionMin: 15, breakMin: 15, roundsPerDay: 2, windowStart: '08:00', windowEnd: '19:00' },
  'age-11-13': { enabled: true, sessionMin: 30, breakMin: 10, roundsPerDay: 3, windowStart: '07:00', windowEnd: '21:00' }
};

export const CONFIG_OPTIONS: Record<AgeProfileId, { session: number[]; break: number[]; rounds: number[]; startHours: number[]; endHours: number[] }> = {
  'age-3-6': { session: [10, 15, 20, 30], break: [10, 15, 20, 30], rounds: [1, 2, 3], startHours: [6, 7, 8, 9, 10], endHours: [17, 18, 19, 20] },
  'age-11-13': { session: [20, 30, 45, 60], break: [5, 10, 15, 20], rounds: [1, 2, 3, 4], startHours: [6, 7, 8, 9, 10], endHours: [19, 20, 21, 22] }
};

export const WARN_BEFORE_SEC = 180;
export const HARD_CAP_EXTRA_SEC = 120;
export const MAX_INSIST = 4;
export const INSIST_INTERVAL_MS = 20_000;
const HISTORY_DAYS = 14;

const pad = (n: number) => String(n).padStart(2, '0');

/** Data local AAAA-MM-DD (nunca toISOString, que usa UTC). */
export function localDay(now: number): string {
  const d = new Date(now);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

export function minutesOfDay(now: number): number {
  const d = new Date(now);
  return d.getHours() * 60 + d.getMinutes();
}

function parseHHMM(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function isWithinWindow(config: WellbeingConfig, now: number): boolean {
  const t = minutesOfDay(now);
  const start = parseHHMM(config.windowStart);
  const end = parseHHMM(config.windowEnd);
  return start <= end ? t >= start && t < end : t >= start || t < end;
}

export function limitSec(config: WellbeingConfig): number {
  return config.sessionMin * 60;
}

export function createState(now: number): WellbeingState {
  return { status: 'idle', activeSec: 0, warned: false, recentMissions: [], insistCount: 0, roundsToday: 0, localDay: localDay(now), lastActiveAt: now, history: [] };
}

function withLog(state: WellbeingState, change: (log: DayLog) => DayLog): WellbeingState {
  const day = state.localDay;
  const current = state.history.find(item => item.day === day) ?? { day, activeSec: 0, rounds: 0, missions: [] };
  const rest = state.history.filter(item => item.day !== day);
  return { ...state, history: [...rest, change(current)].sort((a, b) => a.day.localeCompare(b.day)).slice(-HISTORY_DAYS) };
}

/** Ajusta o estado ao abrir o app ou a cada minuto: novo dia local e pausas longas sem uso. */
export function normalize(state: WellbeingState, config: WellbeingConfig, now: number): WellbeingState {
  let next = state;
  const today = localDay(now);
  if (next.localDay !== today) {
    next = { ...next, localDay: today, roundsToday: 0, activeSec: 0, warned: false, status: next.status === 'done' || next.status === 'return' ? 'idle' : next.status };
  }
  if (next.status === 'idle' && now - next.lastActiveAt > config.breakMin * 60_000 && next.activeSec > 0) {
    next = { ...next, activeSec: 0, warned: false };
  }
  return next;
}

/** Soma tempo de uso ativo (só quando a criança está numa atividade e a rodada está em andamento). */
export function tick(state: WellbeingState, config: WellbeingConfig, dtSec: number, now: number): WellbeingState {
  if (!config.enabled || state.status !== 'idle' || dtSec <= 0) return { ...state, lastActiveAt: now };
  const safeDt = Math.min(dtSec, 60);
  return withLog({ ...state, activeSec: state.activeSec + safeDt, lastActiveAt: now }, log => ({ ...log, activeSec: log.activeSec + safeDt }));
}

export function shouldWarn(state: WellbeingState, config: WellbeingConfig): boolean {
  return config.enabled && state.status === 'idle' && !state.warned && state.activeSec >= limitSec(config) - WARN_BEFORE_SEC && state.activeSec < limitSec(config);
}

export function isDue(state: WellbeingState, config: WellbeingConfig): boolean {
  return config.enabled && state.status === 'idle' && state.activeSec >= limitSec(config);
}

export function isHardCap(state: WellbeingState, config: WellbeingConfig): boolean {
  return config.enabled && state.status === 'idle' && state.activeSec >= limitSec(config) + HARD_CAP_EXTRA_SEC;
}

export function isLastRound(state: WellbeingState, config: WellbeingConfig): boolean {
  return state.roundsToday + 1 >= config.roundsPerDay;
}

export function markWarned(state: WellbeingState): WellbeingState {
  return { ...state, warned: true };
}

export function startMission(state: WellbeingState, missionId: string): WellbeingState {
  return { ...state, status: 'mission', missionId, recentMissions: [missionId, ...state.recentMissions.filter(id => id !== missionId)].slice(0, 3), insistCount: 0, lastInsistAt: undefined };
}

export function acceptMission(state: WellbeingState, now: number): WellbeingState {
  return { ...state, status: 'break', breakStartedAt: now };
}

export function breakElapsedSec(state: WellbeingState, now: number): number {
  return state.breakStartedAt ? Math.max(0, (now - state.breakStartedAt) / 1000) : 0;
}

export function breakProgress(state: WellbeingState, config: WellbeingConfig, now: number): number {
  return Math.min(1, breakElapsedSec(state, now) / (config.breakMin * 60));
}

export function isBreakDone(state: WellbeingState, config: WellbeingConfig, now: number): boolean {
  return state.status === 'break' && breakElapsedSec(state, now) >= config.breakMin * 60;
}

/** Toque durante a pausa: no máximo 4 falas, com 20 s de intervalo. O tempo da pausa nunca reinicia. */
export function insist(state: WellbeingState, config: WellbeingConfig, now: number): { state: WellbeingState; speakLevel: number | null } {
  if (state.status !== 'break' || isBreakDone(state, config, now)) return { state, speakLevel: null };
  if (state.insistCount >= MAX_INSIST) return { state, speakLevel: null };
  if (state.lastInsistAt !== undefined && now - state.lastInsistAt < INSIST_INTERVAL_MS) return { state, speakLevel: null };
  return { state: { ...state, insistCount: state.insistCount + 1, lastInsistAt: now }, speakLevel: state.insistCount };
}

export function returnFromBreak(state: WellbeingState, config: WellbeingConfig, now: number): WellbeingState {
  return isBreakDone(state, config, now) ? { ...state, status: 'return' } : state;
}

/** "Toca aqui": conta a rodada e decide entre continuar ou "até amanhã". */
export function completeReturn(state: WellbeingState, config: WellbeingConfig): WellbeingState {
  const roundsToday = state.roundsToday + 1;
  const missionId = state.missionId;
  const next: WellbeingState = { ...state, roundsToday, status: roundsToday >= config.roundsPerDay ? 'done' : 'idle', activeSec: 0, warned: false, breakStartedAt: undefined, insistCount: 0, lastInsistAt: undefined };
  return withLog(next, log => ({ ...log, rounds: log.rounds + 1, missions: missionId ? [...log.missions, missionId] : log.missions }));
}

/** Adulto: libera agora (frase neutra na interface). */
export function parentUnlock(state: WellbeingState): WellbeingState {
  return { ...state, status: 'idle', activeSec: 0, warned: false, breakStartedAt: undefined, insistCount: 0, lastInsistAt: undefined };
}

/** Adulto: a missão vem no próximo ponto de parada. */
export function parentPauseNow(state: WellbeingState, config: WellbeingConfig): WellbeingState {
  return state.status === 'idle' ? { ...state, activeSec: Math.max(state.activeSec, limitSec(config)), warned: true } : state;
}

export function parentResetToday(state: WellbeingState): WellbeingState {
  return { ...state, status: state.status === 'done' ? 'idle' : state.status, activeSec: 0, warned: false, roundsToday: 0 };
}

/** Qual tela de bem-estar deve aparecer agora (ou "play" para seguir no app). */
export function resolveScreen(state: WellbeingState, config: WellbeingConfig, now: number): WellbeingScreen {
  if (!config.enabled) return 'play';
  if (state.status === 'mission' || state.status === 'break' || state.status === 'return') return state.status;
  if (state.status === 'done') return 'done';
  if (!isWithinWindow(config, now)) return 'outside-hours';
  return 'play';
}

export type DaySummary = { day: string; minutes: number; rounds: number; missions: number };

/** Resumo dos últimos `days` dias locais (inclui dias sem uso). */
export function weekSummary(state: WellbeingState, now: number, days = 7): DaySummary[] {
  const result: DaySummary[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = localDay(now - i * 86_400_000);
    const log = state.history.find(item => item.day === day);
    result.push({ day, minutes: Math.round((log?.activeSec ?? 0) / 60), rounds: log?.rounds ?? 0, missions: log?.missions.length ?? 0 });
  }
  return result;
}

/* ---------- PIN dos adultos ---------- */

export function randomSalt(): string {
  const bytes = new Uint8Array(12);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPin(pin: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(salt + ':' + pin);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPin(config: WellbeingConfig, pin: string): Promise<boolean> {
  if (!config.pinHash || !config.pinSalt) return false;
  return (await hashPin(pin, config.pinSalt)) === config.pinHash;
}

export const isValidPin = (pin: string) => /^\d{4}$/.test(pin);
