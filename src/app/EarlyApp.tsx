import { useEffect, useState } from 'react';
import { getEarlySummary, recordEarlyAttempt } from '../lib/db';
import { summarizeEarlyAttempts, type EarlyActivityId, type EarlyAttempt, type EarlySummary } from '../learning/early';
import { isSoundMuted, setSoundMuted, sfx } from '../lib/sound';
import { stopVoice } from '../lib/voice';
import { useWellbeing } from '../wellbeing/useWellbeing';
import { lines } from '../wellbeing/missions';
import ParentGate from '../wellbeing/ParentGate';
import EarlyPause from '../wellbeing/EarlyPause';
import WellbeingSettings from '../wellbeing/WellbeingSettings';
import PwaStatus from '../components/PwaStatus';
import Item from '../components/Item';
import { IconFamily, IconHome, IconSoundOff, IconSoundOn } from '../components/Icons';
import EarlyHome from '../features/early/EarlyHome';
import EarlyActivityScreen from '../features/early/EarlyActivityScreen';
import EarlyProgressScreen from '../features/early/EarlyProgressScreen';

const logo = import.meta.env.BASE_URL + 'brand/math-quest-logo.svg';
type EarlyScreen = 'home' | 'activity' | 'progress';

/** App do perfil de 3 a 6 anos: poucas telas, botões grandes e professor de voz. */
export default function EarlyApp({ onChangeProfile }: { onChangeProfile: () => void }) {
  const [screen, setScreen] = useState<EarlyScreen>('home');
  const [activity, setActivity] = useState<EarlyActivityId>('contar');
  const [summary, setSummary] = useState<EarlySummary>(() => summarizeEarlyAttempts([]));
  const [muted, setMuted] = useState(isSoundMuted);
  // Área dos adultos: só abre depois do portão e volta a trancar ao sair dela.
  const [adultOpen, setAdultOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [greeting, setGreeting] = useState<string[] | undefined>(undefined);
  const wellbeing = useWellbeing({ profile: 'age-3-6', active: !adultOpen && !gateOpen });
  const pausing = wellbeing.ready && wellbeing.screen !== 'play' && !adultOpen;

  async function refresh() {
    try { setSummary(await getEarlySummary()); }
    catch (error) { console.error('Não foi possível ler o progresso local:', error); }
  }
  useEffect(() => { void refresh(); }, [screen]);

  function scrollTop() {
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { /* jsdom */ }
  }

  function go(next: EarlyScreen) {
    stopVoice();
    if (next === 'progress' && !adultOpen) { setGateOpen(true); return; }
    if (next !== 'progress') {
      setAdultOpen(false);
      // Ponto natural de parada: ao trocar de tela a missão pode aparecer (sem aviso falado aqui).
      wellbeing.checkpoint({ warn: false });
    }
    setScreen(next);
    scrollTop();
  }

  function passGate() {
    setGateOpen(false);
    setAdultOpen(true);
    setScreen('progress');
    scrollTop();
  }

  /** Entre perguntas: abre a missão quando o tempo acabou ou devolve o aviso único, falado pelo professor. */
  function checkpointInActivity(): string | null {
    const result = wellbeing.checkpoint();
    if (result !== 'warned') return null;
    return wellbeing.isLastRound ? lines.early.lastWarning : lines.early.warning[Math.floor(Math.random() * lines.early.warning.length)];
  }

  function open(id: EarlyActivityId) { setActivity(id); setGreeting(undefined); go('activity'); }

  function record(attempt: EarlyAttempt) {
    void recordEarlyAttempt(attempt).then(refresh, error => console.error('Falha ao salvar progresso local:', error));
  }

  function toggleSound() {
    const next = !muted;
    setSoundMuted(next);
    setMuted(next);
    if (next) stopVoice(); else sfx.tap();
  }

  const level = summary.activities.find(item => item.id === activity)?.level ?? 1;
  const tabs = [
    { id: 'home' as const, label: 'Brincar', Icon: IconHome },
    { id: 'progress' as const, label: 'Adultos', Icon: IconFamily }
  ];

  return <div className="min-h-screen pb-28">
    <header className="sticky top-0 z-40 border-b border-mq-cyan/10 bg-mq-night/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-2.5">
        <button className="flex items-center gap-2 text-left" onClick={() => go('home')} aria-label="Ir para as brincadeiras">
          <img src={logo} className="h-10 w-10 object-contain" alt="" />
          <span className="font-display text-sm font-black leading-[1.05] tracking-wide text-white">MATH<br /><span className="text-mq-orange">QUEST</span></span>
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className="chip border-mq-yellow/40 bg-mq-yellow/10 px-2.5 text-base text-mq-yellow" title="Estrelas"><Item id="estrela" className="h-6 w-6" /><span className="sr-only">Estrelas:</span>{summary.stars}</span>
          <button type="button" onClick={toggleSound} aria-pressed={!muted} aria-label={muted ? 'Ligar som e voz' : 'Desligar som e voz'} className="flex h-11 w-11 items-center justify-center rounded-full border border-mq-cyan/30 bg-mq-cyan/10 text-mq-cyan">
            {muted ? <IconSoundOff className="h-6 w-6" /> : <IconSoundOn className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-4xl px-4 pt-4 sm:px-6">
      <PwaStatus />
      {pausing
        ? <div className="animate-pop"><EarlyPause wellbeing={wellbeing} onAdults={() => { stopVoice(); setGateOpen(true); }} onResume={() => setScreen('home')} /></div>
        : <div key={screen + (screen === 'activity' ? activity : '')} className="animate-pop">
          {screen === 'home' && <EarlyHome summary={summary} onOpen={open} greeting={greeting} />}
          {screen === 'activity' && <EarlyActivityScreen activityId={activity} level={level} onBack={() => go('home')} onAnswer={record} onCheckpoint={checkpointInActivity} />}
          {screen === 'progress' && adultOpen && <EarlyProgressScreen summary={summary} onBack={() => go('home')} onChangeProfile={onChangeProfile}
            wellbeing={<WellbeingSettings profile="age-3-6" wellbeing={wellbeing} onUnlocked={() => setGreeting([lines.early.unlock, 'Toque em uma brincadeira.'])} />} />}
        </div>}
      <footer className="mt-8 text-center text-xs text-slate-500">Math Quest · Pequeno Explorador (3 a 6 anos) · VSA Tecnologia</footer>
    </main>

    {gateOpen && <ParentGate profile="age-3-6" wellbeing={wellbeing} onPass={passGate} onCancel={() => setGateOpen(false)} />}

    {!pausing && <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-40 border-t border-mq-cyan/15 bg-mq-night/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <ul className="mx-auto grid max-w-md grid-cols-2">
        {tabs.map(({ id, label, Icon }) => {
          const active = screen === id || (id === 'home' && screen === 'activity');
          return <li key={id}>
            <button type="button" onClick={() => go(id)} aria-current={active ? 'page' : undefined} className={'flex w-full flex-col items-center gap-0.5 py-2 text-xs font-bold transition ' + (active ? 'text-mq-cyan' : 'text-slate-400 hover:text-white')}>
              <span className={'flex h-9 w-14 items-center justify-center rounded-full ' + (active ? 'bg-mq-cyan/15 shadow-[0_0_16px_rgba(0,229,255,.35)]' : '')}><Icon className="h-6 w-6" /></span>
              {label}
            </button>
          </li>;
        })}
      </ul>
    </nav>}
  </div>;
}
