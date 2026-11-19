import { useCallback, useEffect, useRef, useState } from 'react';
import type { AgeProfileId } from '../learning/profiles';
import { loadWellbeing, saveWellbeing, type WellbeingRecord } from '../lib/db';
import {
  acceptMission, completeReturn, createState, DEFAULT_CONFIG, hashPin, insist, isDue, isHardCap, isLastRound, normalize, parentPauseNow,
  parentResetToday, parentUnlock, randomSalt, resolveScreen, returnFromBreak, shouldWarn, markWarned, startMission, tick, verifyPin,
  weekSummary, type WellbeingConfig
} from './core';
import { findMission, pickMission } from './missions';

type Options = {
  profile: AgeProfileId;
  /** Verdadeiro quando a criança está usando o app (não na área dos adultos). */
  active: boolean;
};

export type CheckpointResult = 'mission' | 'warned' | 'none';

/** Liga o núcleo da pausa saudável ao app: relógio, persistência e ações. */
export function useWellbeing({ profile, active }: Options) {
  const [record, setRecord] = useState<WellbeingRecord | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const recordRef = useRef<WellbeingRecord | null>(null);
  const lastSaveRef = useRef(0);
  const lastRenderRef = useRef(0);
  const lastNowRef = useRef(0);
  const lastTickRef = useRef(Date.now());

  /**
   * Guarda o novo estado. Durante o uso, o relógio soma segundos sem redesenhar o app inteiro:
   * só redesenha quando algo visível muda (ou a cada 15 s) e salva no IndexedDB a cada 10 s.
   */
  const commit = useCallback((next: WellbeingRecord, { save = true, render = true }: { save?: boolean; render?: boolean } = {}) => {
    recordRef.current = next;
    const t = Date.now();
    if (render || t - lastRenderRef.current > 15_000) {
      lastRenderRef.current = t;
      setRecord(next);
    }
    if (save || t - lastSaveRef.current > 10_000) {
      lastSaveRef.current = t;
      void saveWellbeing(next).catch(error => console.error('Não foi possível salvar a pausa saudável:', error));
    }
  }, []);

  const update = useCallback((change: (record: WellbeingRecord) => WellbeingRecord) => {
    const current = recordRef.current;
    if (current) commit(change(current));
  }, [commit]);

  useEffect(() => {
    let alive = true;
    loadWellbeing(profile).then(
      loaded => { if (alive) { recordRef.current = loaded; setRecord(loaded); } },
      () => { if (alive) { const fallback = { profile, config: DEFAULT_CONFIG[profile], state: createState(Date.now()) }; recordRef.current = fallback; setRecord(fallback); } }
    );
    return () => { alive = false; };
  }, [profile]);

  // Relógio: soma uso ativo com o app visível, vira o dia local e aplica o teto duro.
  useEffect(() => {
    const timer = window.setInterval(() => {
      const t = Date.now();
      const dt = (t - lastTickRef.current) / 1000;
      lastTickRef.current = t;
      const current = recordRef.current;
      if (!current) return;
      let state = normalize(current.state, current.config, t);
      const screenNow = resolveScreen(state, current.config, t);
      // O sol da pausa anda a cada segundo; durante o uso, a hora só precisa ser conferida de vez em quando.
      if (screenNow !== 'play' || t - lastNowRef.current > 30_000) { lastNowRef.current = t; setNow(t); }
      const visible = typeof document === 'undefined' || document.visibilityState !== 'hidden';
      if (active && visible && screenNow === 'play') state = tick(state, current.config, dt, t);
      if (isHardCap(state, current.config)) {
        state = startMission(state, pickMission(profile, state.recentMissions, new Date(t).getHours()).id);
        lastNowRef.current = t;
        setNow(t);
        commit({ ...current, state });
        return;
      }
      if (state !== current.state) {
        const visibleChange = state.status !== current.state.status || state.localDay !== current.state.localDay;
        commit({ ...current, state }, { save: visibleChange, render: visibleChange });
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [active, profile, commit]);

  /** Ponto natural de parada: abre a missão se o tempo acabou, ou avisa uma única vez (quando `warn`). */
  const checkpoint = useCallback(({ warn = true }: { warn?: boolean } = {}): CheckpointResult => {
    const current = recordRef.current;
    if (!current) return 'none';
    const t = Date.now();
    const state = normalize(current.state, current.config, t);
    if (isDue(state, current.config)) {
      setNow(t);
      commit({ ...current, state: startMission(state, pickMission(profile, state.recentMissions, new Date(t).getHours()).id) });
      return 'mission';
    }
    if (warn && shouldWarn(state, current.config)) {
      commit({ ...current, state: markWarned(state) });
      return 'warned';
    }
    return 'none';
  }, [commit, profile]);

  const config = record?.config ?? DEFAULT_CONFIG[profile];
  const state = record?.state ?? createState(now);

  return {
    ready: record !== null,
    config,
    state,
    now,
    screen: record ? resolveScreen(state, config, now) : 'play' as const,
    mission: findMission(profile, state.missionId),
    isLastRound: isLastRound(state, config),
    summary: weekSummary(state, now),
    checkpoint,
    accept: () => update(r => ({ ...r, state: acceptMission(r.state, Date.now()) })),
    /** Retorna o nível da fala de redirecionamento, ou null quando deve ficar em silêncio. */
    insist: (): number | null => {
      const current = recordRef.current;
      if (!current) return null;
      const result = insist(current.state, current.config, Date.now());
      if (result.state !== current.state) commit({ ...current, state: result.state });
      return result.speakLevel;
    },
    returnFromBreak: () => update(r => ({ ...r, state: returnFromBreak(r.state, r.config, Date.now()) })),
    completeReturn: () => update(r => ({ ...r, state: completeReturn(r.state, r.config) })),
    parentUnlock: () => update(r => ({ ...r, state: parentUnlock(r.state) })),
    parentPauseNow: () => update(r => ({ ...r, state: parentPauseNow(r.state, r.config) })),
    parentResetToday: () => update(r => ({ ...r, state: parentResetToday(r.state) })),
    updateConfig: (change: Partial<WellbeingConfig>) => update(r => ({ ...r, config: { ...r.config, ...change } })),
    setPin: async (pin: string) => {
      const salt = randomSalt();
      const pinHash = await hashPin(pin, salt);
      update(r => ({ ...r, config: { ...r.config, pinHash, pinSalt: salt } }));
    },
    verifyPin: (pin: string) => verifyPin(recordRef.current?.config ?? config, pin)
  };
}

export type Wellbeing = ReturnType<typeof useWellbeing>;
