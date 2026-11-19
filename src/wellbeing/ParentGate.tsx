import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { AgeProfileId } from '../learning/profiles';
import { IconLock } from '../components/Icons';
import { isValidPin } from './core';

/** Tentativas de PIN erradas e bloqueio valem para a sessão inteira, mesmo fechando e abrindo o portão. */
const PIN_ATTEMPTS = 3;
const LOCKOUT_MS = 30_000;
let pinFailures = 0;
let lockedUntil = 0;

/** Só para testes. */
export function resetGateLockout() { pinFailures = 0; lockedUntil = 0; }

type GateWellbeing = { config: { pinHash?: string }; setPin: (pin: string) => Promise<void>; verifyPin: (pin: string) => Promise<boolean> };

type Props = {
  profile: AgeProfileId;
  wellbeing: GateWellbeing;
  onPass: () => void;
  onCancel: () => void;
  holdMs?: number;
  random?: () => number;
};

type Step = 'hold' | 'sum' | 'pin' | 'create';

function makeSum(profile: AgeProfileId, random: () => number) {
  const between = (min: number, max: number) => min + Math.floor(random() * (max - min + 1));
  // 3 a 6: duas parcelas de 2 dígitos (fora do alcance da criança). 11 a 13: 3 dígitos, só para criar o PIN.
  return profile === 'age-3-6' ? { a: between(16, 58), b: between(17, 39) } : { a: between(214, 589), b: between(178, 396) };
}

/** Botão de segurar: só libera depois de `ms` milissegundos pressionado (toque, mouse ou teclado). */
function HoldButton({ ms, onDone }: { ms: number; onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const stop = (reset = true) => {
    window.clearInterval(timer.current);
    timer.current = undefined;
    if (reset) setProgress(0);
  };
  const start = () => {
    if (timer.current !== undefined) return;
    let elapsed = 0;
    timer.current = window.setInterval(() => {
      elapsed += 100;
      setProgress(Math.min(1, elapsed / ms));
      if (elapsed >= ms) { stop(false); onDone(); }
    }, 100);
  };
  useEffect(() => () => window.clearInterval(timer.current), []);

  const circumference = 2 * Math.PI * 52;
  return <button type="button" aria-label={'Segure por ' + Math.round(ms / 1000) + ' segundos'}
    onPointerDown={start} onPointerUp={() => stop()} onPointerLeave={() => stop()} onPointerCancel={() => stop()}
    onKeyDown={event => { if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) { event.preventDefault(); start(); } }}
    onKeyUp={event => { if (event.key === 'Enter' || event.key === ' ') stop(); }}
    onContextMenu={event => event.preventDefault()}
    className="relative mx-auto flex h-32 w-32 touch-none select-none items-center justify-center rounded-full bg-mq-navy text-mq-cyan">
    <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,229,255,.18)" strokeWidth="8" />
      <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} />
    </svg>
    <span className="flex flex-col items-center text-xs font-bold text-slate-200"><IconLock className="mb-1 h-8 w-8 text-mq-cyan" />Segure</span>
  </button>;
}

/**
 * Portão dos adultos (Padrão VSA): segurar 3 s e depois
 * 3 a 6 → uma soma de dois números de 2 dígitos;
 * 11 a 13 → PIN de 4 números (criado na primeira vez, após uma soma de 3 dígitos), com bloqueio após 3 erros.
 */
export default function ParentGate({ profile, wellbeing, onPass, onCancel, holdMs = 3000, random = Math.random }: Props) {
  const hasPin = Boolean(wellbeing.config.pinHash);
  const [step, setStep] = useState<Step>('hold');
  const [sum, setSum] = useState(() => makeSum(profile, random));
  const [answer, setAnswer] = useState('');
  const [pin, setPin] = useState('');
  const [pinAgain, setPinAgain] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [, setClock] = useState(0);
  const field = useRef<HTMLInputElement>(null);

  const lockRemaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
  useEffect(() => {
    if (!lockRemaining) return;
    const timer = window.setInterval(() => setClock(value => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [lockRemaining]);

  useEffect(() => { if (step !== 'hold') field.current?.focus(); }, [step]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  function afterHold() {
    setError('');
    if (profile === 'age-3-6') setStep('sum');
    else setStep(hasPin ? 'pin' : 'sum');
  }

  function checkSum(event: FormEvent) {
    event.preventDefault();
    if (Number(answer.trim()) === sum.a + sum.b && answer.trim() !== '') {
      setError('');
      if (profile === 'age-3-6') onPass(); else setStep('create');
      return;
    }
    setError('Resposta incorreta. Tente esta outra conta.');
    setSum(makeSum(profile, random));
    setAnswer('');
  }

  async function checkPin(event: FormEvent) {
    event.preventDefault();
    if (lockRemaining || busy) return;
    setBusy(true);
    const ok = await wellbeing.verifyPin(pin);
    setBusy(false);
    setPin('');
    if (ok) { pinFailures = 0; onPass(); return; }
    pinFailures += 1;
    if (pinFailures >= PIN_ATTEMPTS) {
      pinFailures = 0;
      lockedUntil = Date.now() + LOCKOUT_MS;
      setError('PIN incorreto. Aguarde 30 segundos para tentar de novo.');
    } else {
      const left = PIN_ATTEMPTS - pinFailures;
      setError('PIN incorreto. ' + (left === 1 ? 'Resta 1 tentativa.' : 'Restam ' + left + ' tentativas.'));
    }
  }

  async function createPin(event: FormEvent) {
    event.preventDefault();
    if (!isValidPin(pin)) { setError('O PIN precisa ter exatamente 4 números.'); return; }
    if (pin !== pinAgain) { setError('Os dois PINs não são iguais.'); return; }
    setBusy(true);
    await wellbeing.setPin(pin);
    setBusy(false);
    onPass();
  }

  const inputClass = 'num mt-2 w-full rounded-2xl border-2 border-mq-cyan/40 bg-mq-night px-4 py-3 text-center text-3xl text-white outline-none focus:border-mq-cyan';

  return <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-mq-night/95 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="gate-title">
    <div className="mq-panel w-full max-w-sm p-6 text-center animate-pop">
      <h2 id="gate-title" className="font-display text-xl font-black text-white">Área dos adultos</h2>

      {step === 'hold' && <>
        <p className="mt-2 text-sm text-slate-300">Para um adulto. Segure o botão por 3 segundos.</p>
        <div className="mt-5"><HoldButton ms={holdMs} onDone={afterHold} /></div>
      </>}

      {step === 'sum' && <form onSubmit={checkSum} className="mt-3">
        <p className="text-sm text-slate-300">{profile === 'age-3-6' ? 'Responda para entrar.' : 'Primeiro acesso: responda para criar o PIN dos adultos.'}</p>
        <label htmlFor="gate-sum" className="mt-4 block text-lg font-bold text-white">Quanto é <span className="num">{sum.a} + {sum.b}</span>?</label>
        <input id="gate-sum" ref={field} value={answer} onChange={event => setAnswer(event.target.value.replace(/\D/g, '').slice(0, 4))}
          inputMode="numeric" autoComplete="off" className={inputClass} />
        <button type="submit" className="btn btn-cyan mt-4 w-full">Entrar</button>
      </form>}

      {step === 'pin' && <form onSubmit={checkPin} className="mt-3">
        <label htmlFor="gate-pin" className="block text-sm text-slate-300">Digite o PIN dos adultos</label>
        <input id="gate-pin" ref={field} type="password" value={pin} onChange={event => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
          inputMode="numeric" autoComplete="off" disabled={lockRemaining > 0} className={inputClass} />
        <button type="submit" disabled={lockRemaining > 0 || pin.length !== 4 || busy} className="btn btn-cyan mt-4 w-full">
          {lockRemaining > 0 ? 'Aguarde ' + lockRemaining + ' s' : 'Entrar'}
        </button>
        <p className="mt-4 text-xs text-slate-400">Esqueceu o PIN? Apague os dados deste site nas configurações do navegador. Isso também apaga o progresso salvo neste aparelho.</p>
      </form>}

      {step === 'create' && <form onSubmit={createPin} className="mt-3 text-left">
        <p className="text-center text-sm text-slate-300">Crie um PIN de 4 números. Ele protege os ajustes de tempo de tela e a troca de perfil.</p>
        <label htmlFor="gate-new" className="mt-4 block text-sm font-bold text-white">Novo PIN</label>
        <input id="gate-new" ref={field} type="password" value={pin} onChange={event => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" autoComplete="new-password" className={inputClass} />
        <label htmlFor="gate-again" className="mt-3 block text-sm font-bold text-white">Repita o PIN</label>
        <input id="gate-again" type="password" value={pinAgain} onChange={event => setPinAgain(event.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" autoComplete="new-password" className={inputClass} />
        <button type="submit" disabled={busy} className="btn btn-cyan mt-4 w-full">Salvar PIN e entrar</button>
        <p className="mt-3 text-center text-xs text-slate-400">O PIN fica guardado só neste aparelho, em forma cifrada.</p>
      </form>}

      {error && <p role="alert" className="mt-3 text-sm font-bold text-mq-yellow">{error}</p>}
      <button type="button" onClick={onCancel} className="btn btn-ghost mt-5 w-full text-sm">Voltar</button>
    </div>
  </div>;
}
