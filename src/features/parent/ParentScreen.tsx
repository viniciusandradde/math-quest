import type { ChallengeStatus } from '../../learning/challenges';
import type { LearningOverview } from '../../lib/db';

type Props = { overview: LearningOverview; onBack: () => void };

const statusLabel: Record<ChallengeStatus, string> = {
  solved: 'Resolvido',
  'in-progress': 'Em andamento',
  'not-started': 'Ainda não tentado'
};

const statusStyle: Record<ChallengeStatus, string> = {
  solved: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  'in-progress': 'border-orange-300/30 bg-orange-300/10 text-orange-200',
  'not-started': 'border-white/10 text-slate-400'
};

function Tile({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl bg-slate-950/40 p-4"><p className="text-xs text-slate-400">{label}</p><strong className="mt-2 block text-2xl">{value}</strong></div>;
}

export default function ParentScreen({ overview, onBack }: Props) {
  const { challenges, memory, multiplication } = overview;
  return <section className="mt-8 rounded-3xl border border-white/10 bg-[#10223a] p-6 sm:p-9">
    <button onClick={onBack} className="text-sm text-cyan-300">← Início</button>
    <h1 className="mt-5 text-3xl font-black">Resumo de aprendizagem</h1>
    <p className="mt-2 text-sm text-slate-400">Dados armazenados somente neste dispositivo. Nada é enviado para servidores.</p>

    <h2 className="mt-8 text-xl font-extrabold">Desafios estratégicos</h2>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Tile label="Desafios tentados" value={challenges.attempted + ' / ' + challenges.total} />
      <Tile label="Resolvidos" value={challenges.solved} />
      <Tile label="Tentativas" value={challenges.attempts} />
      <Tile label="Precisão" value={challenges.accuracy + '%'} />
    </div>
    <ul className="mt-4 space-y-2" aria-label="Progresso por desafio">
      {challenges.items.map(item => <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-950/30 p-3">
        <span><strong className="block text-sm">{item.title}</strong><small className="text-xs text-slate-400">{item.area}{item.attempts ? ' · ' + item.attempts + (item.attempts === 1 ? ' tentativa' : ' tentativas') : ''}</small></span>
        <span className={'rounded-full border px-3 py-1 text-xs font-bold ' + statusStyle[item.status]}>{statusLabel[item.status]}</span>
      </li>)}
    </ul>
    <p className="mt-3 text-xs text-slate-500">"Resolvido" indica ao menos um acerto nesta amostra. A retenção será observada em revisões futuras.</p>

    <h2 className="mt-8 text-xl font-extrabold">Memória matemática</h2>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Tile label="Partidas concluídas" value={memory.sessions} />
      <Tile label="Menos tentativas" value={memory.bestAttempts ?? '—'} />
    </div>

    <h2 className="mt-8 text-xl font-extrabold">Aquecimento de multiplicação</h2>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Tile label="Combinações vistas" value={multiplication.factsSeen} />
      <Tile label="Tentativas" value={multiplication.attempts} />
      <Tile label="Acertos" value={multiplication.correct} />
      <Tile label="Precisão" value={multiplication.accuracy + '%'} />
    </div>
  </section>;
}
