import { IconBack } from '../../components/Icons';
import Item from '../../components/Item';
import { Mascot } from '../../components/Mascot';
import ProfileSwitch from '../../components/ProfileSwitch';
import type { ChallengeStatus } from '../../learning/challenges';
import type { CollectibleItem, LevelInfo } from '../../learning/rewards';
import type { LearningOverview } from '../../lib/db';

type Props = { overview: LearningOverview; level: LevelInfo; collection: CollectibleItem[]; onBack: () => void; onChangeProfile?: () => void };

const statusLabel: Record<ChallengeStatus, string> = {
  solved: 'Resolvido',
  'in-progress': 'Em andamento',
  'not-started': 'Ainda não tentado'
};

const statusStyle: Record<ChallengeStatus, string> = {
  solved: 'border-mq-green/50 bg-mq-green/15 text-[#7dff84]',
  'in-progress': 'border-mq-orange/50 bg-mq-orange/15 text-mq-yellow',
  'not-started': 'border-white/15 text-slate-300'
};

function Tile({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return <div className="mq-card flex flex-col p-4">
    <Item id={icon} className="mb-2 h-9 w-9" />
    <p className="text-xs text-slate-300">{label}</p>
    <strong className="mt-1 block num text-2xl font-black text-white">{value}</strong>
  </div>;
}

export default function ParentScreen({ overview, level, collection, onBack, onChangeProfile }: Props) {
  const { challenges, memory, multiplication } = overview;
  return <section className="mq-panel p-5 sm:p-8">
    <button onClick={onBack} className="btn btn-ghost px-3 py-2 text-sm"><IconBack className="h-4 w-4" /> Início</button>

    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="h-24 w-24 shrink-0 rounded-full border-2 border-mq-cyan/50 bg-gradient-to-b from-mq-blue/40 to-mq-navy p-1 shadow-[0_0_24px_rgba(0,229,255,.35)]">
        <Mascot expression="confiante" decorative className="h-full w-full object-contain" />
      </div>
      <div className="flex-1">
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Resumo de aprendizagem</h1>
        <p className="mt-1 text-sm text-slate-300">Dados armazenados somente neste dispositivo. Nada é enviado para servidores.</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="chip">{level.title}</span>
          <div className="xp-track flex-1"><div className="xp-fill" style={{ width: Math.max(4, level.progress * 100) + '%' }} /></div>
          <span className="text-xs font-bold text-slate-300">{level.xp} XP</span>
        </div>
      </div>
    </div>

    <h2 className="mt-8 font-display text-xl font-black text-white">Desafios estratégicos</h2>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Tile icon="engrenagem" label="Desafios tentados" value={challenges.attempted + ' / ' + challenges.total} />
      <Tile icon="estrela" label="Resolvidos" value={challenges.solved} />
      <Tile icon="energia" label="Tentativas" value={challenges.attempts} />
      <Tile icon="cristal" label="Precisão" value={challenges.accuracy + '%'} />
    </div>
    <ul className="mt-4 space-y-2" aria-label="Progresso por desafio">
      {challenges.items.map(item => <li key={item.id} className="mq-card flex flex-wrap items-center justify-between gap-2 p-3">
        <span className="flex items-center gap-3">
          <Item id="estrela" locked={item.status !== 'solved'} className="h-7 w-7" />
          <span><strong className="block text-sm text-white">{item.title}</strong><small className="text-xs text-slate-400">{item.area}{item.attempts ? ' · ' + item.attempts + (item.attempts === 1 ? ' tentativa' : ' tentativas') : ''}</small></span>
        </span>
        <span className={'rounded-full border px-3 py-1 text-xs font-bold ' + statusStyle[item.status]}>{statusLabel[item.status]}</span>
      </li>)}
    </ul>
    <p className="mt-3 text-xs text-slate-400">"Resolvido" indica ao menos um acerto nesta amostra. A retenção será observada em revisões futuras.</p>

    <h2 className="mt-8 font-display text-xl font-black text-white">Memória matemática</h2>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Tile icon="chip" label="Partidas concluídas" value={memory.sessions} />
      <Tile icon="conquista" label="Menos tentativas" value={memory.bestAttempts ?? '—'} />
    </div>

    <h2 className="mt-8 font-display text-xl font-black text-white">Aquecimento de multiplicação</h2>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Tile icon="moeda" label="Combinações vistas" value={multiplication.factsSeen} />
      <Tile icon="energia" label="Tentativas" value={multiplication.attempts} />
      <Tile icon="estrela" label="Acertos" value={multiplication.correct} />
      <Tile icon="cristal" label="Precisão" value={multiplication.accuracy + '%'} />
    </div>

    <h2 className="mt-8 font-display text-xl font-black text-white">Coleção de itens</h2>
    <ul className="mt-4 grid gap-2 sm:grid-cols-2" aria-label="Itens e como conquistar">
      {collection.map(item => <li key={item.id} className="mq-card flex items-center gap-3 p-3">
        <Item id={item.id} locked={!item.unlocked} className="h-10 w-10" />
        <span className="flex-1"><strong className="block text-sm text-white">{item.name}</strong><small className="text-xs text-slate-400">{item.goal}</small></span>
        <span className={'text-xs font-bold ' + (item.unlocked ? 'text-[#7dff84]' : 'text-slate-400')}>{item.unlocked ? 'Conquistado' : 'Bloqueado'}</span>
      </li>)}
    </ul>
    {onChangeProfile && <ProfileSwitch current="age-11-13" onChange={onChangeProfile} />}
  </section>;
}
