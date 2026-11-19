import { useEffect, useState } from 'react';
import Confetti from '../components/Confetti';
import { IconHand, IconLock, IconMoon } from '../components/Icons';
import Item from '../components/Item';
import { Mascot, MascotPose } from '../components/Mascot';
import { useVoiceTeacher, VoiceBubble } from '../components/VoiceTeacher';
import { sfx } from '../lib/sound';
import { breakProgress, isBreakDone } from './core';
import { lines } from './missions';
import type { Wellbeing } from './useWellbeing';

const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];
/** Uma frase por vez, como o professor de voz faz nas brincadeiras. */
export const sentences = (text: string) => text.split(/(?<=[.!?])\s+/).filter(Boolean);

const WAITING = 'Estou te esperando. Quando o sol chegar do outro lado, a mão aparece.';

/** Céu com o sol atravessando de um lado para o outro: mostra a passagem do tempo sem números. */
export function SunSky({ progress }: { progress: number }) {
  const p = Math.min(1, Math.max(0, progress));
  const x = 150 - 118 * Math.cos(Math.PI * p);
  const y = 150 - 104 * Math.sin(Math.PI * p);
  return <svg viewBox="0 0 300 180" className="h-auto w-full" aria-hidden="true">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4fb3ff" /><stop offset="1" stopColor="#bde6ff" /></linearGradient>
      <radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff3b0" /><stop offset=".7" stopColor="#ffcb57" /><stop offset="1" stopColor="#ff8a00" /></radialGradient>
    </defs>
    <rect width="300" height="180" rx="24" fill="url(#sky)" />
    <path d="M32 150 A118 104 0 0 1 268 150" fill="none" stroke="#ffffff" strokeOpacity=".7" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
    <g fill="#ffffff" opacity=".9"><ellipse cx="70" cy="44" rx="22" ry="9" /><ellipse cx="86" cy="38" rx="14" ry="9" /><ellipse cx="226" cy="58" rx="20" ry="8" /><ellipse cx="240" cy="52" rx="12" ry="8" /></g>
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <g stroke="#ffcb57" strokeWidth="4" strokeLinecap="round">
        {Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return <line key={i} x1={Math.cos(a) * 24} y1={Math.sin(a) * 24} x2={Math.cos(a) * 32} y2={Math.sin(a) * 32} />; })}
      </g>
      <circle r="20" fill="url(#sun)" />
      <circle cx="-6" cy="-3" r="2.2" fill="#7a3d00" /><circle cx="6" cy="-3" r="2.2" fill="#7a3d00" />
      <path d="M-7 5 Q0 11 7 5" fill="none" stroke="#7a3d00" strokeWidth="2.2" strokeLinecap="round" />
    </g>
    <path d="M0 150 Q75 128 150 146 T300 142 V180 H0 Z" fill="#21c02b" />
    <path d="M0 162 Q90 146 170 160 T300 156 V180 H0 Z" fill="#11801a" />
  </svg>;
}

type Props = { wellbeing: Wellbeing; onAdults: () => void; onResume: () => void };

/** Pausa do perfil de 3 a 6 anos: missão falada, sol sem números, "toca aqui" na volta e "até amanhã". */
export default function EarlyPause({ wellbeing, onAdults, onResume }: Props) {
  const voice = useVoiceTeacher();
  const { screen, mission, state, config, now } = wellbeing;
  const [burst, setBurst] = useState(0);
  const [tapped, setTapped] = useState(false);
  const breakDone = screen === 'break' && isBreakDone(state, config, now);

  useEffect(() => { if (breakDone) wellbeing.returnFromBreak(); }, [breakDone]);

  useEffect(() => {
    setTapped(false);
    if (screen === 'mission' && mission) voice.say(sentences(mission.text));
    else if (screen === 'return') voice.say([wellbeing.isLastRound ? lines.early.backLast : pick(lines.early.back)]);
    else if (screen === 'done') voice.say(sentences(lines.early.goodnight));
    else if (screen === 'outside-hours') voice.say(sentences(lines.early.outsideHours));
  }, [screen, mission?.id]);

  function accept() {
    if (tapped) return;
    setTapped(true);
    sfx.tap();
    voice.say([pick(lines.early.accept)]);
    wellbeing.accept();
  }

  function tapDuringBreak() {
    const level = wellbeing.insist();
    if (level !== null) voice.say([lines.early.insist[level]]);
  }

  function hiFive() {
    if (tapped) return;
    setTapped(true);
    sfx.reward();
    setBurst(value => value + 1);
    const finish = () => { wellbeing.completeReturn(); onResume(); };
    if (wellbeing.isLastRound) { finish(); return; }
    voice.say([pick(lines.early.hifive)], { onEnd: finish });
  }

  const adults = <button type="button" onClick={onAdults} className="btn btn-ghost absolute right-3 top-3 px-3 py-1.5 text-xs"><IconLock className="h-4 w-4" /> Adultos</button>;
  const caption = voice.line || (screen === 'break' ? WAITING : '');

  return <section className="mq-panel relative mx-auto max-w-xl p-4 pt-14 sm:p-7 sm:pt-16" aria-labelledby="pause-title">
    <Confetti burst={burst} />
    {adults}

    {screen === 'mission' && mission && <div className="text-center animate-pop">
      <h1 id="pause-title" className="font-display text-xl font-black text-mq-yellow">Missão especial!</h1>
      <div className="mt-3 text-left"><VoiceBubble line={caption} speaking={voice.speaking} onRepeat={voice.repeat} expression="animado" /></div>
      <div className="mt-4 flex items-center justify-center gap-3">
        <Item id={mission.icon} className="h-20 w-20 animate-float" />
        <p className="font-display text-lg font-black text-white">{mission.title}</p>
      </div>
      <button type="button" onClick={accept} aria-label="Toque na mão e vá!" className="btn btn-action mx-auto mt-6 flex h-36 w-36 flex-col rounded-full p-0 text-base animate-glow">
        <IconHand className="h-16 w-16" />
        Toque e vá!
      </button>
    </div>}

    {screen === 'break' && <div className="text-center animate-pop">
      <h1 id="pause-title" className="sr-only">Hora da missão fora da tela</h1>
      <VoiceBubble line={caption} speaking={voice.speaking} onRepeat={voice.repeat} expression="feliz" />
      <button type="button" onClick={tapDuringBreak} aria-label="O sol está atravessando o céu. Vá fazer a missão!" className="mt-4 block w-full overflow-hidden rounded-3xl">
        <SunSky progress={breakProgress(state, config, now)} />
      </button>
      {mission && <p className="mt-4 flex items-center justify-center gap-2 text-base font-bold text-white"><Item id={mission.icon} className="h-9 w-9" />{mission.title}</p>}
    </div>}

    {screen === 'return' && <div className="text-center animate-pop">
      <h1 id="pause-title" className="font-display text-xl font-black text-mq-green">Você voltou!</h1>
      <div className="mt-3 text-left"><VoiceBubble line={caption} speaking={voice.speaking} onRepeat={voice.repeat} expression="comemorando" /></div>
      <MascotPose pose="celebrating" decorative className="mx-auto mt-2 h-36 w-auto animate-float" />
      <button type="button" onClick={hiFive} aria-label="Toca aqui!" className="btn btn-green mx-auto mt-4 flex h-36 w-36 flex-col rounded-full p-0 text-base animate-glow">
        <IconHand className="h-16 w-16" />
        Toca aqui!
      </button>
    </div>}

    {(screen === 'done' || screen === 'outside-hours') && <div className="text-center animate-pop">
      <h1 id="pause-title" className="font-display text-xl font-black text-white">{screen === 'done' ? 'Até amanhã!' : 'Hora de descansar'}</h1>
      <div className="relative mx-auto mt-4 h-44 w-44">
        <IconMoon className="absolute right-0 top-0 h-12 w-12 text-mq-yellow" />
        <Item id="estrela" className="absolute left-2 top-4 h-8 w-8 opacity-80" />
        <Mascot expression="feliz" decorative className="h-full w-full object-contain" />
      </div>
      <div className="mt-3 text-left"><VoiceBubble line={caption} speaking={voice.speaking} onRepeat={voice.repeat} expression="feliz" /></div>
    </div>}
  </section>;
}
