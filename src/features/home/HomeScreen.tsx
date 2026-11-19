import { kit, scenarioLabel, type Scenario } from '../../app/kit';
import type { Screen } from '../../app/screens';
import Item from '../../components/Item';
import { Mascot, MascotPose } from '../../components/Mascot';
import type { CollectibleItem, LevelInfo } from '../../learning/rewards';
import { nextChallengeIndex } from '../../learning/rewards';
import type { LearningOverview } from '../../lib/db';
import MissionMap from './MissionMap';

type Props = {
  overview: LearningOverview;
  level: LevelInfo;
  collection: CollectibleItem[];
  onNavigate: (screen: Screen) => void;
  onOpenChallenge: (index: number) => void;
};

const worlds: { scenario: Scenario; screen: Screen; title: string; description: string }[] = [
  { scenario: 'ilha', screen: 'challenges', title: 'Missões estratégicas', description: 'Problemas do 5º ano com várias etapas, frações, decimais, geometria e lógica.' },
  { scenario: 'base-espacial', screen: 'memory', title: 'Memória matemática', description: 'Ligue cada operação ao resultado certo, sem cronômetro.' },
  { scenario: 'laboratorio', screen: 'learn', title: 'Laboratório visual', description: 'Grupos, matrizes e o significado da multiplicação.' },
  { scenario: 'fabrica', screen: 'practice', title: 'Aquecimento', description: 'Abasteça os robôs com cálculos de multiplicação.' }
];

const printables = [
  { n: '04', title: 'Operação Resgate', href: import.meta.env.BASE_URL + 'assets/printables/mission-04-strategy-level.svg' },
  { n: '05', title: 'Geometria e lógica', href: import.meta.env.BASE_URL + 'assets/printables/mission-05-geometry-logic.svg' }
];

export default function HomeScreen({ overview, level, collection, onNavigate, onOpenChallenge }: Props) {
  const { challenges } = overview;
  const next = nextChallengeIndex(challenges.items);
  const unlockedCount = collection.filter(item => item.unlocked).length;
  const coins = challenges.correct + overview.multiplication.correct;

  return <div className="space-y-6 pb-4">
    <h1 className="sr-only">Math Quest: a aventura da matemática</h1>

    <section className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
      <div className="mq-panel flex flex-col overflow-hidden p-1.5 animate-pop">
        <img src={kit.hero} alt="" className="block w-full rounded-[1.4rem]" />
        <button type="button" onClick={() => onOpenChallenge(next)} className="group flex flex-1 items-center gap-3 rounded-[1.2rem] px-3 py-3 text-left transition hover:bg-white/5">
          <Mascot expression="incentivando" decorative className="h-14 w-14 shrink-0 object-contain transition group-hover:scale-110" />
          <span className="min-w-0 flex-1">
            <span className="block font-display text-[11px] font-bold uppercase tracking-[.18em] text-mq-orange">Próxima missão <span className="num text-mq-yellow">{next + 1}/{challenges.total}</span></span>
            <span className="block truncate text-base font-extrabold text-white">{challenges.items[next]?.title}</span>
            <span className="block truncate text-xs text-slate-300">{challenges.items[next]?.area}</span>
          </span>
          <span aria-hidden="true" className="text-xl font-black text-mq-cyan transition group-hover:translate-x-1">→</span>
        </button>
      </div>

      <div className="mq-panel flex flex-col gap-4 p-5 animate-pop [animation-delay:.08s]">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 shrink-0 rounded-full border-2 border-mq-cyan/50 bg-gradient-to-b from-mq-blue/40 to-mq-navy p-1 shadow-[0_0_24px_rgba(0,229,255,.35)]">
            <Mascot expression="feliz" decorative className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-mq-cyan">Bem-vindo de volta</p>
            <h2 className="font-display text-lg font-black leading-tight text-white sm:text-xl">{level.title}</h2>
            <div className="mt-2 xp-track" role="progressbar" aria-label="Experiência no nível atual" aria-valuemin={0} aria-valuemax={level.xpForNext} aria-valuenow={level.xpInLevel}>
              <div className="xp-fill" style={{ width: Math.max(4, level.progress * 100) + '%' }} />
            </div>
            <p className="mt-1 text-xs text-slate-300">{level.xpInLevel} / {level.xpForNext} XP para o nível {level.level + 1}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="mq-card p-2"><Item id="estrela" className="mx-auto h-9 w-9" /><p className="mt-1 num text-xl text-mq-yellow">{challenges.solved}/{challenges.total}</p><p className="text-[11px] text-slate-300">Missões</p></div>
          <div className="mq-card p-2"><Item id="moeda" className="mx-auto h-9 w-9" /><p className="mt-1 num text-xl text-mq-yellow">{coins}</p><p className="text-[11px] text-slate-300">Acertos</p></div>
          <div className="mq-card p-2"><Item id="xp" className="mx-auto h-9 w-9" /><p className="mt-1 num text-xl text-mq-cyan">{level.xp}</p><p className="text-[11px] text-slate-300">XP total</p></div>
        </div>
        <button type="button" onClick={() => onOpenChallenge(next)} className="btn btn-action w-full py-4 font-display text-xl tracking-wider">
          JOGAR <span className="sr-only">: iniciar missão estratégica {next + 1}</span><span aria-hidden="true">▶</span>
        </button>
        <div className="grid grid-cols-2 gap-3">
          <a href="#mapa-de-missoes" className="btn btn-blue text-sm">Missões</a>
          <button type="button" onClick={() => onNavigate('parent')} className="btn btn-ghost text-sm">Perfil</button>
        </div>
      </div>
    </section>

    <section id="mapa-de-missoes" className="mq-panel scroll-mt-20 overflow-hidden">
      <div className="relative">
        <img src={kit.scenario('ilha')} alt={scenarioLabel.ilha} className="block h-36 w-full object-cover object-bottom sm:h-52" />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-mq-navy to-transparent" />
      </div>
      <div className="px-4 pb-6 sm:px-8">
        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="relative">
            <p className="chip">11 a 13 anos · 6 missões</p>
            <h2 className="mt-2 font-display text-2xl font-black text-white">Mapa de Missões</h2>
            <p className="mt-1 text-sm text-slate-300">Toque em uma ilha para jogar. Cada missão resolvida acende uma estrela.</p>
          </div>
          <MascotPose pose="presenting" decorative className="-mb-2 h-28 w-auto shrink-0 animate-float sm:h-36" />
        </div>
        <div className="mx-auto mt-6 max-w-md">
          <MissionMap items={challenges.items} treasureUnlocked={collection.some(item => item.id === 'bau' && item.unlocked)} onOpen={onOpenChallenge} />
        </div>
      </div>
    </section>

    <section aria-labelledby="mundos" className="mq-panel p-4 sm:p-6">
      <p className="chip">Cenários principais</p>
      <h2 id="mundos" className="mt-2 font-display text-2xl font-black text-white">Escolha seu mundo</h2>
      <div className="stagger mt-4 grid gap-4 sm:grid-cols-2">
        {worlds.map(world => <button key={world.scenario} type="button" onClick={() => onNavigate(world.screen)} className="group overflow-hidden rounded-2xl border border-white/10 bg-mq-night/60 text-left transition hover:-translate-y-1 hover:border-mq-cyan/60 hover:shadow-[0_12px_30px_rgba(0,229,255,.18)]">
          <img src={kit.scenario(world.scenario)} alt={scenarioLabel[world.scenario]} className="block aspect-[2.6/1] w-full object-cover transition duration-500 group-hover:scale-105" />
          <span className="block p-4">
            <span className="block font-display text-base font-black text-white">{world.title}</span>
            <span className="mt-1 block text-sm text-slate-300">{world.description}</span>
            <span className="mt-3 inline-block font-bold text-mq-orange">Entrar →</span>
          </span>
        </button>)}
      </div>
    </section>

    <section className="grid gap-5 lg:grid-cols-2">
      <div className="mq-panel overflow-hidden p-5">
        <div className="flex items-center gap-4">
          <MascotPose pose="thinking" decorative className="h-32 w-auto shrink-0 animate-float sm:h-36" />
          <div className="min-w-0">
            <p className="chip">Mapa de conhecimentos</p>
            <h2 className="mt-2 font-display text-xl font-black leading-tight text-white">Diagnóstico rápido</h2>
            <p className="mt-1 text-sm text-slate-300">Seis perguntas para descobrir por onde começar. Não é prova nem nota.</p>
          </div>
        </div>
        <button type="button" onClick={() => onNavigate('diagnostic')} className="btn btn-cyan mt-4 w-full text-sm">Fazer diagnóstico</button>
      </div>

      <div className="mq-panel p-5">
        <div className="flex items-center justify-between gap-2">
          <div><p className="chip">Elementos e itens</p><h2 className="mt-2 font-display text-xl font-black text-white">Sua coleção</h2></div>
          <span className="num text-xl text-mq-yellow">{unlockedCount}/{collection.length}</span>
        </div>
        <ul className="mt-4 grid grid-cols-5 gap-2" aria-label="Coleção de itens">
          {collection.map(item => <li key={item.id} title={item.unlocked ? item.name : item.name + ': ' + item.goal} className={'flex flex-col items-center rounded-xl p-1.5 text-center ' + (item.unlocked ? 'bg-mq-yellow/10' : 'bg-mq-night/40')}>
            <Item id={item.id} locked={!item.unlocked} className={'h-11 w-11 ' + (item.unlocked ? 'animate-bounce-in' : '')} />
            <span className="mt-1 text-[10px] font-bold leading-tight text-slate-200">{item.name}</span>
            <span className="sr-only">{item.unlocked ? ' — conquistado' : ' — bloqueado. ' + item.goal}</span>
          </li>)}
        </ul>
        <p className="mt-3 text-xs text-slate-400">Cada item é ganho com uma evidência de aprendizagem: acertos, missões resolvidas, partidas e diagnóstico.</p>
      </div>
    </section>

    <section className="mq-panel overflow-hidden">
      <div className="grid items-center gap-4 p-4 sm:grid-cols-[1fr_1fr] sm:p-6">
        <img src={kit.printables} alt="Caderno de Missões Math Quest e folhas de atividades para imprimir" className="w-full rounded-2xl border border-white/10" />
        <div>
          <p className="chip">Parte física</p>
          <h2 className="mt-2 font-display text-xl font-black text-white">Caderno de Missões</h2>
          <p className="mt-1 text-sm text-slate-300">Resolva no papel e explique sua estratégia. Ótimo para fazer com um adulto.</p>
          <div className="mt-4 grid gap-2">
            {printables.map(item => <a key={item.n} href={item.href} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-mq-night/50 px-4 py-3 transition hover:border-mq-cyan/50">
              <span><span className="block font-display text-[11px] font-bold text-mq-cyan">MISSÃO {item.n}</span><span className="font-bold text-white">{item.title}</span></span>
              <span className="text-sm font-bold text-mq-orange">Imprimir ↗</span>
            </a>)}
          </div>
        </div>
      </div>
    </section>
  </div>;
}
