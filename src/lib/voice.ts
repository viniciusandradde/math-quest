/**
 * Professor de voz: fala frases curtas, uma de cada vez, com pausas e ritmo calmo.
 *
 * Usa a síntese de voz do próprio aparelho (Web Speech API, pt-BR). Se um áudio gravado
 * for registrado para uma frase (por exemplo, gerado com uma voz profissional), ele é
 * tocado no lugar da voz sintética — o resto do app não muda.
 */
import { isSoundMuted } from './sound';

export type VoiceSpeed = 'calma' | 'normal';
const SPEED_KEY = 'mq-voice-speed';
export const voiceRates: Record<VoiceSpeed, number> = { calma: 0.78, normal: 0.95 };
const PITCH = 1.02;
const PAUSE_MS = 650;

let session = 0;
let timers: number[] = [];
let audio: HTMLAudioElement | null = null;
const clips = new Map<string, string>();

export function getVoiceSpeed(): VoiceSpeed {
  try { return localStorage.getItem(SPEED_KEY) === 'normal' ? 'normal' : 'calma'; } catch { return 'calma'; }
}

export function setVoiceSpeed(speed: VoiceSpeed) {
  try { localStorage.setItem(SPEED_KEY, speed); } catch { /* armazenamento indisponível */ }
}

/** Registra áudios gravados: frase exata → URL do arquivo. */
export function registerVoiceClips(map: Record<string, string>) {
  for (const [text, url] of Object.entries(map)) clips.set(text, url);
}

function synth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function' ? window.speechSynthesis : null;
}

export function canSpeak(): boolean { return synth() !== null || clips.size > 0; }

/** Prefere uma voz brasileira; nomes conhecidos de vozes femininas suaves vêm primeiro. */
function pickVoice(engine: SpeechSynthesis): SpeechSynthesisVoice | null {
  const voices = engine.getVoices?.() ?? [];
  const brazilian = voices.filter(voice => /^pt[-_]BR$/i.test(voice.lang));
  const preferred = ['Luciana', 'Francisca', 'Thalita', 'Google português do Brasil', 'Maria'];
  for (const name of preferred) {
    const found = brazilian.find(voice => voice.name.includes(name));
    if (found) return found;
  }
  return brazilian[0] ?? voices.find(voice => voice.lang?.toLowerCase().startsWith('pt')) ?? null;
}

export function stopVoice() {
  session += 1;
  timers.forEach(timer => window.clearTimeout(timer));
  timers = [];
  if (audio) { audio.pause(); audio = null; }
  synth()?.cancel();
}

export type SpeakOptions = {
  /** Fala mesmo com o som desligado (quando a criança toca em "Ouvir"). */
  force?: boolean;
  onLine?: (line: string, index: number) => void;
  onEnd?: () => void;
  pauseMs?: number;
};

/** Fala as frases em sequência. Retorna false quando nada pôde ser falado. */
export function speakLines(lines: string[], options: SpeakOptions = {}): boolean {
  stopVoice();
  const engine = synth();
  if ((isSoundMuted() && !options.force) || (!engine && clips.size === 0) || lines.length === 0) {
    options.onEnd?.();
    return false;
  }
  const id = session;
  const rate = voiceRates[getVoiceSpeed()];
  const pause = options.pauseMs ?? PAUSE_MS;

  const next = (index: number) => {
    if (id !== session) return;
    if (index >= lines.length) { options.onEnd?.(); return; }
    const line = lines[index];
    options.onLine?.(line, index);
    let done = false;
    const advance = () => {
      if (done || id !== session) return;
      done = true;
      timers.push(window.setTimeout(() => next(index + 1), pause));
    };
    // Rede de segurança: alguns aparelhos não disparam "onend".
    timers.push(window.setTimeout(advance, 1500 + (line.length * 95) / rate));

    const clip = clips.get(line);
    if (clip && typeof Audio === 'function') {
      audio = new Audio(clip);
      audio.onended = advance;
      audio.onerror = advance;
      void audio.play().catch(advance);
      return;
    }
    if (!engine) { advance(); return; }
    const utterance = new SpeechSynthesisUtterance(line);
    utterance.lang = 'pt-BR';
    utterance.rate = rate;
    utterance.pitch = PITCH;
    const voice = pickVoice(engine);
    if (voice) utterance.voice = voice;
    utterance.onend = advance;
    utterance.onerror = advance;
    engine.speak(utterance);
  };

  next(0);
  return true;
}
