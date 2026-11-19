import { useState, type FormEvent } from 'react';
import type { AgeProfileId } from '../learning/profiles';
import { breakElapsedSec, CONFIG_OPTIONS, isValidPin, localDay, type DaySummary } from './core';
import { lines } from './missions';
import type { Wellbeing } from './useWellbeing';

type Props = { profile: AgeProfileId; wellbeing: Wellbeing; onUnlocked?: () => void };

const hh = (hour: number) => String(hour).padStart(2, '0') + ':00';

function Choice({ label, values, current, unit, onPick }: { label: string; values: number[]; current: number; unit: string; onPick: (value: number) => void }) {
  const id = 'wb-' + label.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-');
  return <div className="mt-4">
    <p id={id} className="text-sm font-bold text-white">{label}</p>
    <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-labelledby={id}>
      {values.map(value => <button key={value} type="button" role="radio" aria-checked={current === value} onClick={() => onPick(value)}
        className={'btn px-3 py-2 text-sm ' + (current === value ? 'btn-cyan' : 'btn-ghost')}>{value} {unit}</button>)}
    </div>
  </div>;
}

function statusText(wellbeing: Wellbeing): string {
  const { state, config, screen, now } = wellbeing;
  if (!config.enabled) return 'Pausa saudável desligada: o app não pede pausas nem respeita a janela de horários.';
  const rounds = state.roundsToday + ' de ' + config.roundsPerDay + (config.roundsPerDay === 1 ? ' rodada' : ' rodadas');
  switch (screen) {
    case 'mission': return 'Agora: missão fora da tela aberta, esperando a criança aceitar.';
    case 'break': {
      const left = Math.max(1, Math.ceil((config.breakMin * 60 - breakElapsedSec(state, now)) / 60));
      return 'Agora: em pausa. Faltam cerca de ' + left + ' min.';
    }
    case 'return': return 'Agora: pausa concluída, esperando a criança voltar.';
    case 'done': return 'Agora: encerrado por hoje (' + rounds + ').';
    case 'outside-hours': return 'Agora: fora do horário de uso (' + config.windowStart + ' às ' + config.windowEnd + ').';
    default: return 'Agora: ' + Math.floor(state.activeSec / 60) + ' de ' + config.sessionMin + ' min nesta rodada · ' + rounds + ' concluídas hoje.';
  }
}

function weekdayLabel(day: string, today: string): string {
  if (day === today) return 'Hoje';
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
}

function WeekChart({ days, goal, today }: { days: DaySummary[]; goal: number; today: string }) {
  const max = Math.max(goal, ...days.map(day => day.minutes), 1);
  return <ul className="mt-3 grid grid-cols-7 items-end gap-1.5" aria-label="Uso nos últimos 7 dias">
    {days.map(day => {
      const label = weekdayLabel(day.day, today);
      return <li key={day.day} className="flex flex-col items-center gap-1">
        <span className="num text-[11px] text-slate-300" aria-hidden="true">{day.minutes}</span>
        <span className="flex h-24 w-full items-end overflow-hidden rounded-lg bg-white/5" aria-hidden="true">
          <span className={'w-full rounded-lg ' + (day.minutes > goal ? 'bg-mq-orange' : 'bg-mq-cyan')} style={{ height: Math.max(day.minutes ? 6 : 0, (day.minutes / max) * 100) + '%' }} />
        </span>
        <span className="text-[11px] font-bold capitalize text-slate-300" aria-hidden="true">{label}</span>
        <span className="sr-only">{label}: {day.minutes} min, {day.rounds} {day.rounds === 1 ? 'rodada' : 'rodadas'}, {day.missions} {day.missions === 1 ? 'missão' : 'missões'}</span>
      </li>;
    })}
  </ul>;
}

/** Painel dos adultos: tempo de uso, pausas, janela de horários, ações rápidas, resumo da semana e PIN. */
export default function WellbeingSettings({ profile, wellbeing, onUnlocked }: Props) {
  const { config, state, screen, now, summary } = wellbeing;
  const options = CONFIG_OPTIONS[profile];
  const [feedback, setFeedback] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newPinAgain, setNewPinAgain] = useState('');
  const [pinMessage, setPinMessage] = useState('');
  const today = localDay(now);
  const todayLog = summary[summary.length - 1];
  const paused = screen === 'mission' || screen === 'break' || screen === 'return';
  const goal = config.sessionMin * config.roundsPerDay;
  const [startHour, endHour] = [Number(config.windowStart.slice(0, 2)), Number(config.windowEnd.slice(0, 2))];

  function act(action: () => void, message: string) { action(); setFeedback(message); }

  async function changePin(event: FormEvent) {
    event.preventDefault();
    if (!isValidPin(newPin)) { setPinMessage('O PIN precisa ter exatamente 4 números.'); return; }
    if (newPin !== newPinAgain) { setPinMessage('Os dois PINs não são iguais.'); return; }
    await wellbeing.setPin(newPin);
    setNewPin(''); setNewPinAgain('');
    setPinMessage('PIN alterado.');
  }

  return <section className="mq-card mt-8 p-4 sm:p-5" aria-labelledby="wb-title">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 id="wb-title" className="font-display text-lg font-black text-white">Pausa saudável</h2>
        <p className="mt-1 text-sm text-slate-300">{profile === 'age-3-6'
          ? 'Depois do tempo combinado, o robô propõe uma missão fora da tela. A pausa nunca aparece no meio de uma pergunta.'
          : 'Depois do tempo combinado, o app propõe uma Pausa ativa com uma missão do mundo real.'}</p>
      </div>
      <button type="button" role="switch" aria-checked={config.enabled} aria-label="Pausa saudável ligada"
        onClick={() => wellbeing.updateConfig({ enabled: !config.enabled })}
        className={'relative h-8 w-14 shrink-0 rounded-full border transition ' + (config.enabled ? 'border-mq-green bg-mq-green/70' : 'border-white/30 bg-white/10')}>
        <span className={'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ' + (config.enabled ? 'left-7' : 'left-0.5')} />
      </button>
    </div>

    <p className="mt-3 rounded-xl bg-mq-night/60 p-3 text-sm text-slate-200" aria-live="polite">{statusText(wellbeing)}</p>

    <div className="mt-3 flex flex-wrap gap-2">
      {paused
        ? <button type="button" className="btn btn-action text-sm" onClick={() => act(() => { wellbeing.parentUnlock(); onUnlocked?.(); }, profile === 'age-3-6' ? 'Liberado. Ao voltar, o robô diz: "' + lines.early.unlock + '"' : 'Liberado. A criança verá: "' + lines.explorer.unlock + '"')}>Liberar agora</button>
        : <button type="button" className="btn btn-blue text-sm" disabled={!config.enabled || screen !== 'play'} onClick={() => act(() => wellbeing.parentPauseNow(), 'A missão aparece no próximo ponto de parada.')}>Pausar no próximo ponto de parada</button>}
      <button type="button" className="btn btn-ghost text-sm" disabled={state.roundsToday === 0 && state.activeSec === 0 && screen !== 'done'} onClick={() => act(wellbeing.parentResetToday, 'O dia foi zerado: rodadas e tempo voltam ao início.')}>Zerar o dia</button>
    </div>
    {feedback && <p role="status" className="mt-2 text-sm font-semibold text-[#7dff84]">{feedback}</p>}
    {screen === 'outside-hours' && <p className="mt-2 text-xs text-slate-400">Para liberar fora do horário, ajuste a janela de uso abaixo ou desligue a pausa saudável.</p>}

    <Choice label="Tempo de uso por rodada" values={options.session} current={config.sessionMin} unit="min" onPick={value => wellbeing.updateConfig({ sessionMin: value })} />
    <Choice label="Duração da pausa" values={options.break} current={config.breakMin} unit="min" onPick={value => wellbeing.updateConfig({ breakMin: value })} />
    <Choice label="Rodadas por dia" values={options.rounds} current={config.roundsPerDay} unit="" onPick={value => wellbeing.updateConfig({ roundsPerDay: value })} />

    <div className="mt-4 grid grid-cols-2 gap-3">
      <label className="text-sm font-bold text-white">Uso a partir de
        <select value={startHour} onChange={event => wellbeing.updateConfig({ windowStart: hh(Number(event.target.value)) })} className="mt-2 block w-full rounded-xl border border-mq-cyan/30 bg-mq-night p-2.5 text-white">
          {options.startHours.map(hour => <option key={hour} value={hour}>{hh(hour)}</option>)}
        </select>
      </label>
      <label className="text-sm font-bold text-white">Até
        <select value={endHour} onChange={event => wellbeing.updateConfig({ windowEnd: hh(Number(event.target.value)) })} className="mt-2 block w-full rounded-xl border border-mq-cyan/30 bg-mq-night p-2.5 text-white">
          {options.endHours.map(hour => <option key={hour} value={hour}>{hh(hour)}</option>)}
        </select>
      </label>
    </div>

    <h3 className="mt-6 font-display text-base font-black text-white">Últimos 7 dias</h3>
    <p className="mt-1 text-sm text-slate-300">Hoje: <span className="num">{todayLog?.minutes ?? 0}</span> min · {todayLog?.rounds ?? 0} {todayLog?.rounds === 1 ? 'rodada' : 'rodadas'} · {todayLog?.missions ?? 0} {todayLog?.missions === 1 ? 'missão cumprida' : 'missões cumpridas'}</p>
    <WeekChart days={summary} goal={goal} today={today} />
    <p className="mt-3 text-xs text-slate-400">{profile === 'age-3-6'
      ? 'Referência da Sociedade Brasileira de Pediatria (#MenosTelas #MaisSaúde): de 2 a 5 anos, até 1 hora de tela por dia, sempre com um adulto por perto, e nada de telas nas refeições ou antes de dormir.'
      : 'Referência da Sociedade Brasileira de Pediatria (#MenosTelas #MaisSaúde): de 11 a 18 anos, 2 a 3 horas de tela por dia somando todos os aparelhos, e nunca à noite no lugar do sono.'} Barras laranja indicam dias acima do combinado ({goal} min).</p>

    {profile === 'age-11-13' && <form onSubmit={changePin} className="mt-6">
      <h3 className="font-display text-base font-black text-white">Trocar PIN</h3>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <label className="text-sm font-bold text-white">Novo PIN
          <input type="password" inputMode="numeric" autoComplete="new-password" value={newPin} onChange={event => setNewPin(event.target.value.replace(/\D/g, '').slice(0, 4))} className="num mt-2 block w-full rounded-xl border border-mq-cyan/30 bg-mq-night p-2.5 text-center text-xl text-white" />
        </label>
        <label className="text-sm font-bold text-white">Repita
          <input type="password" inputMode="numeric" autoComplete="new-password" value={newPinAgain} onChange={event => setNewPinAgain(event.target.value.replace(/\D/g, '').slice(0, 4))} className="num mt-2 block w-full rounded-xl border border-mq-cyan/30 bg-mq-night p-2.5 text-center text-xl text-white" />
        </label>
      </div>
      <button type="submit" className="btn btn-ghost mt-3 text-sm">Salvar novo PIN</button>
      {pinMessage && <p role="status" className="mt-2 text-sm font-semibold text-mq-yellow">{pinMessage}</p>}
    </form>}
  </section>;
}
