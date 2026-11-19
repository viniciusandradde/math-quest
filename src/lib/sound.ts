/**
 * Efeitos sonoros curtos sintetizados com Web Audio (sem arquivos nem serviços externos).
 * A preferência de silêncio fica no aparelho; em ambientes sem áudio tudo vira no-op.
 */
const STORAGE_KEY = 'mq-sound-muted';
let context: AudioContext | null = null;
let muted = readMuted();

function readMuted(): boolean {
  try { return typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) === '1'; }
  catch { return false; }
}

export function isSoundMuted(): boolean { return muted; }

export function setSoundMuted(value: boolean) {
  muted = value;
  try { localStorage.setItem(STORAGE_KEY, value ? '1' : '0'); } catch { /* armazenamento indisponível */ }
}

function audio(): AudioContext | null {
  if (muted || typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    context ??= new Ctor();
    if (context.state === 'suspended') void context.resume();
    return context;
  } catch { return null; }
}

function tone(ctx: AudioContext, frequency: number, start: number, duration: number, type: OscillatorType = 'sine', volume = 0.12) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + start);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.02);
}

function play(notes: [number, number, number, OscillatorType?, number?][]) {
  const ctx = audio();
  if (!ctx) return;
  for (const [frequency, start, duration, type, volume] of notes) tone(ctx, frequency, start, duration, type, volume);
}

export const sfx = {
  tap: () => play([[660, 0, 0.06, 'triangle', 0.06]]),
  flip: () => play([[520, 0, 0.05, 'triangle', 0.07], [780, 0.04, 0.05, 'triangle', 0.05]]),
  correct: () => play([[523.25, 0, 0.12], [659.25, 0.09, 0.12], [783.99, 0.18, 0.14], [1046.5, 0.28, 0.28, 'triangle']]),
  match: () => play([[659.25, 0, 0.1, 'triangle'], [987.77, 0.08, 0.18, 'triangle']]),
  /** Som gentil para "tente de novo": nada de buzina de erro. */
  tryAgain: () => play([[440, 0, 0.14, 'sine', 0.08], [392, 0.12, 0.2, 'sine', 0.07]]),
  reward: () => play([[783.99, 0, 0.1, 'triangle'], [1046.5, 0.08, 0.1, 'triangle'], [1318.5, 0.16, 0.1, 'triangle'], [1567.98, 0.24, 0.3, 'triangle']])
};
