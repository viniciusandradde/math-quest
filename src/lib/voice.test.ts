import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setSoundMuted } from './sound';
import { setVoiceSpeed, speakLines, stopVoice, voiceRates } from './voice';

type FakeUtterance = { text: string; lang: string; rate: number; pitch: number; voice?: unknown; onend?: () => void; onerror?: () => void };

describe('voice teacher', () => {
  let spoken: FakeUtterance[];

  beforeEach(() => {
    vi.useFakeTimers();
    spoken = [];
    class Utterance { lang = ''; rate = 1; pitch = 1; voice?: unknown; onend?: () => void; onerror?: () => void; constructor(public text: string) {} }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: Utterance, configurable: true, writable: true });
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      writable: true,
      value: {
        speak: (u: FakeUtterance) => spoken.push(u),
        cancel: vi.fn(),
        getVoices: () => [{ name: 'English', lang: 'en-US' }, { name: 'Luciana', lang: 'pt-BR' }]
      }
    });
    setSoundMuted(false);
    setVoiceSpeed('calma');
  });

  afterEach(() => { stopVoice(); vi.useRealTimers(); });

  it('speaks one calm sentence at a time, in Brazilian Portuguese, with pauses', () => {
    const lines: string[] = [];
    const onEnd = vi.fn();
    speakLines(['Vamos contar juntos?', 'Um.', 'Dois.'], { onLine: line => lines.push(line), onEnd });
    expect(spoken).toHaveLength(1);
    expect(spoken[0]).toMatchObject({ text: 'Vamos contar juntos?', lang: 'pt-BR', rate: voiceRates.calma });
    expect((spoken[0].voice as { name: string }).name).toBe('Luciana');

    spoken[0].onend?.();
    expect(spoken).toHaveLength(1); // ainda na pausa
    vi.advanceTimersByTime(700);
    expect(spoken[1].text).toBe('Um.');
    spoken[1].onend?.(); vi.advanceTimersByTime(700);
    spoken[2].onend?.(); vi.advanceTimersByTime(700);
    expect(lines).toEqual(['Vamos contar juntos?', 'Um.', 'Dois.']);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it('keeps going even if the device never fires the end event', () => {
    speakLines(['Olá.', 'Tudo bem?']);
    vi.advanceTimersByTime(5000);
    expect(spoken.map(u => u.text)).toEqual(['Olá.', 'Tudo bem?']);
  });

  it('stays quiet when sound is off, unless the child taps "Ouvir"', () => {
    setSoundMuted(true);
    expect(speakLines(['Oi!'])).toBe(false);
    expect(spoken).toHaveLength(0);
    expect(speakLines(['Oi!'], { force: true })).toBe(true);
    expect(spoken).toHaveLength(1);
  });

  it('uses the normal speed when an adult chooses it', () => {
    setVoiceSpeed('normal');
    speakLines(['Oi!']);
    expect(spoken[0].rate).toBe(voiceRates.normal);
  });

  it('stops the previous explanation when a new one starts', () => {
    speakLines(['Primeira frase.', 'Segunda frase.']);
    speakLines(['Nova explicação.']);
    spoken[0].onend?.(); // fim da fala antiga não deve continuar a sequência antiga
    vi.advanceTimersByTime(5000);
    expect(spoken.map(u => u.text)).toEqual(['Primeira frase.', 'Nova explicação.']);
  });
});
