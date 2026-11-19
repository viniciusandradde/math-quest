import { useEffect } from 'react';
import { IconLock } from '../components/Icons';
import Item from '../components/Item';
import { Mascot } from '../components/Mascot';
import { breakElapsedSec, breakProgress, isBreakDone } from './core';
import { lines } from './missions';
import type { Wellbeing } from './useWellbeing';

type Props = { wellbeing: Wellbeing; onAdults: () => void; onResume: () => void };

/** Pausa do perfil de 11 a 13 anos: cartão de "Pausa ativa" com missão do mundo real, sem voz. */
export default function ExplorerPause({ wellbeing, onAdults, onResume }: Props) {
  const { screen, mission, state, config, now, summary } = wellbeing;
  const breakDone = screen === 'break' && isBreakDone(state, config, now);
  useEffect(() => { if (breakDone) wellbeing.returnFromBreak(); }, [breakDone]);

  const today = summary[summary.length - 1];
  const left = Math.max(1, Math.ceil((config.breakMin * 60 - breakElapsedSec(state, now)) / 60));
  const missionCard = mission && <div className="mq-card mt-4 flex items-start gap-3 p-4 text-left">
    <Item id={mission.icon} className="h-14 w-14 shrink-0" />
    <div>
      <p className="font-display text-lg font-black text-white">{mission.title}</p>
      <p className="mt-1 text-base text-slate-200">{mission.text}</p>
      {mission.skill && <span className="chip mt-2">Matemática no mundo real · {mission.skill}</span>}
    </div>
  </div>;

  return <section className="mq-panel relative mx-auto max-w-2xl p-5 pt-14 sm:p-8 sm:pt-16" aria-labelledby="pause-title">
    <button type="button" onClick={onAdults} className="btn btn-ghost absolute right-3 top-3 px-3 py-1.5 text-xs"><IconLock className="h-4 w-4" /> Adultos</button>

    {screen === 'mission' && <div className="animate-pop">
      <p className="text-xs font-bold uppercase tracking-widest text-mq-cyan">{config.sessionMin} min de foco concluídos</p>
      <h1 id="pause-title" className="mt-1 font-display text-2xl font-black text-white sm:text-3xl">Pausa ativa</h1>
      <p className="mt-2 text-sm text-slate-300">Seu cérebro guarda melhor o que aprendeu depois de uma pausa. Faça esta missão longe da tela por {config.breakMin} min.</p>
      {missionCard}
      <button type="button" onClick={wellbeing.accept} className="btn btn-action mt-5 w-full py-4 text-lg">Começar a pausa</button>
    </div>}

    {screen === 'break' && <div className="animate-pop">
      <h1 id="pause-title" className="font-display text-2xl font-black text-white">Pausa ativa em andamento</h1>
      <p className="mt-2 text-sm text-slate-300">Volte em cerca de <strong className="num text-white">{left}</strong> min. O tempo continua contando mesmo com o app fechado.</p>
      <div className="xp-track mt-4" role="progressbar" aria-label="Progresso da pausa" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(breakProgress(state, config, now) * 100)}>
        <div className="xp-fill" style={{ width: Math.max(3, breakProgress(state, config, now) * 100) + '%' }} />
      </div>
      {missionCard}
    </div>}

    {screen === 'return' && <div className="animate-pop text-center">
      <Mascot expression="comemorando" decorative className="mx-auto h-32 w-32 object-contain" />
      <h1 id="pause-title" className="mt-2 font-display text-2xl font-black text-white">Pausa concluída!</h1>
      <p className="mt-2 text-sm text-slate-300">{wellbeing.isLastRound ? 'Essa foi a última rodada de hoje.' : 'Pronto para a próxima rodada de missões?'}</p>
      <button type="button" onClick={() => { wellbeing.completeReturn(); onResume(); }} className="btn btn-action mt-5 w-full py-4 text-lg">{wellbeing.isLastRound ? 'Ver resumo de hoje' : 'Voltar ao Math Quest'}</button>
    </div>}

    {(screen === 'done' || screen === 'outside-hours') && <div className="animate-pop text-center">
      <Mascot expression="confiante" decorative className="mx-auto h-32 w-32 object-contain" />
      <h1 id="pause-title" className="mt-2 font-display text-2xl font-black text-white">{screen === 'done' ? 'Até amanhã!' : 'Fora do horário'}</h1>
      <p className="mt-2 text-base text-slate-200">{screen === 'done' ? lines.explorer.goodnight : lines.explorer.outsideHours + ' (' + config.windowStart + ' às ' + config.windowEnd + ').'}</p>
      {screen === 'done' && today && <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="mq-card p-3"><p className="text-xs text-slate-300">Minutos hoje</p><strong className="num mt-1 block text-2xl text-white">{today.minutes}</strong></div>
        <div className="mq-card p-3"><p className="text-xs text-slate-300">Rodadas</p><strong className="num mt-1 block text-2xl text-white">{today.rounds}</strong></div>
        <div className="mq-card p-3"><p className="text-xs text-slate-300">Missões reais</p><strong className="num mt-1 block text-2xl text-white">{today.missions}</strong></div>
      </div>}
    </div>}
  </section>;
}
