import { useEffect, useMemo, useRef, useState } from 'react';
import { getLearningOverview, recordAnswer, recordChallengeAttempt, saveDiagnostic, saveMemorySession, type LearningOverview } from '../lib/db';
import { summarizeChallengeAttempts } from '../learning/challenges';
import { summarizeMemorySessions } from '../learning/memory';
import { computeCollection, computeXp, levelFromXp, newlyUnlocked, type CollectibleItem, type RewardInput } from '../learning/rewards';
import { isSoundMuted, setSoundMuted, sfx } from '../lib/sound';
import type { Screen } from './screens';
import HomeScreen from '../features/home/HomeScreen';
import DiagnosticScreen from '../features/diagnostic/DiagnosticScreen';
import ChallengeScreen from '../features/challenges/ChallengeScreen';
import MemoryScreen from '../features/memory/MemoryScreen';
import PracticeScreen from '../features/practice/PracticeScreen';
import LearnScreen from '../features/learn/LearnScreen';
import ParentScreen from '../features/parent/ParentScreen';
import PwaStatus from '../components/PwaStatus';
import Confetti from '../components/Confetti';
import Item from '../components/Item';
import { IconCards, IconFamily, IconFlask, IconHome, IconMap, IconSoundOff, IconSoundOn } from '../components/Icons';

const logo = import.meta.env.BASE_URL + 'brand/math-quest-logo.svg';
const emptyOverview: LearningOverview = {
  multiplication: { factsSeen: 0, attempts: 0, correct: 0, accuracy: 0 },
  challenges: summarizeChallengeAttempts([]),
  memory: summarizeMemorySessions([]),
  diagnosticCompleted: false
};

const tabs: { id: Screen; label: string; Icon: typeof IconHome }[] = [
  { id: 'home', label: 'Início', Icon: IconHome },
  { id: 'challenges', label: 'Missões', Icon: IconMap },
  { id: 'memory', label: 'Memória', Icon: IconCards },
  { id: 'learn', label: 'Aprender', Icon: IconFlask },
  { id: 'parent', label: 'Progresso', Icon: IconFamily }
];

function rewardInput(overview: LearningOverview): RewardInput {
  return { challenges: overview.challenges, memory: overview.memory, multiplication: overview.multiplication, diagnosticCompleted: overview.diagnosticCompleted };
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [challengeStart, setChallengeStart] = useState(0);
  const [overview, setOverview] = useState<LearningOverview>(emptyOverview);
  const [muted, setMuted] = useState(isSoundMuted);
  const [unlocked, setUnlocked] = useState<CollectibleItem | null>(null);
  const [burst, setBurst] = useState(0);
  const loaded = useRef(false);
  const previousCollection = useRef<CollectibleItem[]>(computeCollection(rewardInput(emptyOverview)));

  const level = useMemo(() => levelFromXp(computeXp(rewardInput(overview))), [overview]);
  const collection = useMemo(() => computeCollection(rewardInput(overview)), [overview]);

  async function refreshOverview() {
    try { setOverview(await getLearningOverview()); }
    catch (error) { console.error('Não foi possível ler o progresso local:', error); }
  }

  useEffect(() => { void refreshOverview(); }, [screen]);

  // Celebra itens conquistados durante o uso (não os que já existiam ao abrir o app).
  useEffect(() => {
    const fresh = newlyUnlocked(previousCollection.current, collection);
    previousCollection.current = collection;
    if (!loaded.current) { if (overview !== emptyOverview) loaded.current = true; return; }
    if (!fresh.length) return;
    setUnlocked(fresh[0]);
    setBurst(value => value + 1);
    sfx.reward();
    const timer = window.setTimeout(() => setUnlocked(null), 3800);
    return () => window.clearTimeout(timer);
  }, [collection, overview]);

  function scrollTop() {
    if (typeof window.scrollTo === 'function') {
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { /* jsdom */ }
    }
  }

  function go(next: Screen) {
    if (next === 'challenges' && screen !== 'challenges') setChallengeStart(0);
    setScreen(next);
    scrollTop();
  }

  function openChallenge(index: number) {
    setChallengeStart(index);
    setScreen('challenges');
    scrollTop();
  }

  function toggleSound() {
    const next = !muted;
    setSoundMuted(next);
    setMuted(next);
    if (!next) sfx.tap();
  }

  const persistThenRefresh = (task: Promise<unknown>) => { void task.then(refreshOverview, error => console.error('Falha ao salvar progresso local:', error)); };

  return <div className="min-h-screen pb-28">
    <Confetti burst={burst} />
    <header className="sticky top-0 z-40 border-b border-mq-cyan/10 bg-mq-night/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2.5">
        <button className="flex items-center gap-2 text-left" onClick={() => go('home')} aria-label="Ir para início">
          <img src={logo} className="h-10 w-10 object-contain" alt="" />
          <span className="font-display text-sm font-black leading-[1.05] tracking-wide text-white">MATH<br /><span className="text-mq-orange">QUEST</span></span>
        </button>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <span className="chip border-mq-yellow/40 bg-mq-yellow/10 px-2 text-mq-yellow" title="Missões resolvidas"><Item id="estrela" className="h-5 w-5" /><span className="sr-only">Missões resolvidas:</span>{overview.challenges.solved}</span>
          <span className="chip hidden border-mq-yellow/40 bg-mq-yellow/10 px-2 text-mq-yellow min-[380px]:inline-flex" title="Acertos"><Item id="moeda" className="h-5 w-5" /><span className="sr-only">Acertos:</span>{overview.challenges.correct + overview.multiplication.correct}</span>
          <span className="chip px-2" title={level.title}><Item id="xp" className="h-5 w-5" /><span className="sr-only">{level.title}</span><span aria-hidden="true">Nv {level.level}</span></span>
          <button type="button" onClick={toggleSound} aria-pressed={!muted} aria-label={muted ? 'Ligar som' : 'Desligar som'} className="flex h-9 w-9 items-center justify-center rounded-full border border-mq-cyan/30 bg-mq-cyan/10 text-mq-cyan transition hover:bg-mq-cyan/20">
            {muted ? <IconSoundOff className="h-5 w-5" /> : <IconSoundOn className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
      <PwaStatus />
      <div key={screen === 'challenges' ? screen + challengeStart : screen} className="animate-pop">
        {screen === 'home' && <HomeScreen overview={overview} level={level} collection={collection} onNavigate={go} onOpenChallenge={openChallenge} />}
        {screen === 'challenges' && <ChallengeScreen startIndex={challengeStart} onBack={() => go('home')} onAnswer={attempt => persistThenRefresh(recordChallengeAttempt(attempt))} />}
        {screen === 'memory' && <MemoryScreen onBack={() => go('home')} onComplete={result => persistThenRefresh(saveMemorySession(result))} />}
        {screen === 'diagnostic' && <DiagnosticScreen onBack={() => go('home')} onComplete={result => persistThenRefresh(saveDiagnostic(result))} />}
        {screen === 'practice' && <PracticeScreen onBack={() => go('learn')} onAnswer={(factId, correct) => persistThenRefresh(recordAnswer(factId, correct))} />}
        {screen === 'learn' && <LearnScreen onBack={() => go('home')} onPractice={() => go('practice')} />}
        {screen === 'parent' && <ParentScreen overview={overview} level={level} collection={collection} onBack={() => go('home')} />}
      </div>
      <footer className="mt-8 text-center text-xs text-slate-500">Math Quest · Um produto educacional da VSA Tecnologia · 0.1.0-beta.1</footer>
    </main>

    {unlocked && <div role="status" className="fixed inset-x-4 top-20 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-2xl border-2 border-mq-yellow/60 bg-mq-navy/95 p-3 shadow-[0_0_40px_rgba(255,203,87,.35)] animate-bounce-in">
      <Item id={unlocked.id} className="h-14 w-14 animate-float" />
      <div><p className="font-display text-xs font-bold uppercase tracking-widest text-mq-yellow">Novo item conquistado!</p><p className="font-display text-lg font-black text-white">{unlocked.name}</p><p className="text-xs text-slate-300">{unlocked.goal}</p></div>
    </div>}

    <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-40 border-t border-mq-cyan/15 bg-mq-night/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <ul className="mx-auto grid max-w-2xl grid-cols-5">
        {tabs.map(({ id, label, Icon }) => {
          const active = screen === id || (id === 'learn' && screen === 'practice') || (id === 'home' && screen === 'diagnostic');
          return <li key={id}>
            <button type="button" onClick={() => go(id)} aria-current={active ? 'page' : undefined} className={'group flex w-full flex-col items-center gap-0.5 px-0 py-2 text-[11px] font-semibold tracking-tight transition sm:text-xs ' + (active ? 'text-mq-cyan' : 'text-slate-400 hover:text-white')}>
              <span className={'flex h-8 w-12 items-center justify-center rounded-full transition ' + (active ? 'bg-mq-cyan/15 shadow-[0_0_16px_rgba(0,229,255,.35)]' : 'group-hover:bg-white/5')}><Icon className="h-5 w-5" /></span>
              {label}
            </button>
          </li>;
        })}
      </ul>
    </nav>
  </div>;
}
