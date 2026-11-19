import { useCallback, useEffect, useState } from 'react';
import type { Expression } from '../app/kit';
import { speakLines, stopVoice } from '../lib/voice';
import { IconSoundOn } from './Icons';
import { Mascot } from './Mascot';

/** Estado do professor de voz: a frase atual vira legenda na tela. */
export function useVoiceTeacher() {
  const [line, setLine] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [lastLines, setLastLines] = useState<string[]>([]);

  const say = useCallback((lines: string[], options: { force?: boolean; onEnd?: () => void; onLine?: (line: string, index: number) => void } = {}) => {
    setLastLines(lines);
    setLine(lines[0] ?? '');
    const started = speakLines(lines, {
      force: options.force,
      onLine: (current, index) => { setLine(current); setSpeaking(true); options.onLine?.(current, index); },
      onEnd: () => { setSpeaking(false); options.onEnd?.(); }
    });
    // Sem voz (som desligado ou aparelho sem síntese): mostra a explicação inteira como texto.
    if (!started) { setSpeaking(false); setLine(lines.join(' ')); }
  }, []);

  const repeat = useCallback(() => { if (lastLines.length) say(lastLines, { force: true }); }, [lastLines, say]);

  useEffect(() => () => stopVoice(), []);
  return { line, speaking, say, repeat };
}

type BubbleProps = { line: string; speaking: boolean; onRepeat: () => void; expression?: Expression };

/** Mascote com balão de fala e botão grande para ouvir de novo. */
export function VoiceBubble({ line, speaking, onRepeat, expression = 'explicando' }: BubbleProps) {
  return <div className="flex items-end gap-2">
    <Mascot expression={expression} decorative className={'h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24 ' + (speaking ? 'animate-float' : '')} />
    <div className="relative flex min-h-16 flex-1 items-center gap-2 rounded-3xl rounded-bl-md border-2 border-mq-cyan/40 bg-mq-navy/90 p-3 shadow-[0_0_24px_rgba(0,229,255,.18)]">
      <p aria-live="polite" className="flex-1 text-lg font-semibold leading-snug text-white">{line}</p>
      <button type="button" onClick={onRepeat} aria-label="Ouvir de novo" className={'flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#6ff3ff] to-mq-cyan text-[#03202a] shadow-[0_4px_0_#00879a] transition active:translate-y-1 ' + (speaking ? 'animate-glow' : '')}>
        <IconSoundOn className="h-7 w-7" />
      </button>
    </div>
  </div>;
}
