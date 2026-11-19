import type { ChallengeProgress } from '../../learning/challenges';
import Item from '../../components/Item';

type Props = { items: ChallengeProgress[]; treasureUnlocked: boolean; onOpen: (index: number) => void };

const ROW = 104;
const positions = [22, 66, 30, 72, 26, 64];
const statusText = { solved: 'resolvido', 'in-progress': 'em andamento', 'not-started': 'ainda não tentado' } as const;

/** Trilha sinuosa de ilhas (Mapa de Missões do board), uma parada por desafio estratégico. */
export default function MissionMap({ items, treasureUnlocked, onOpen }: Props) {
  const stops = items.map((item, index) => ({ item, index, x: positions[index % positions.length], y: index * ROW + ROW / 2 }));
  const height = items.length * ROW + 96;
  const treasureY = items.length * ROW + 44;
  const path = stops.map((stop, i) => {
    if (i === 0) return 'M ' + stop.x + ' ' + stop.y;
    const prev = stops[i - 1];
    const mid = (prev.y + stop.y) / 2;
    return 'C ' + prev.x + ' ' + mid + ', ' + stop.x + ' ' + mid + ', ' + stop.x + ' ' + stop.y;
  }).join(' ') + ' C ' + stops[stops.length - 1].x + ' ' + (treasureY - 30) + ', 50 ' + (treasureY - 30) + ', 50 ' + treasureY;

  return <div className="relative" style={{ height }}>
    <svg className="absolute inset-0 h-full w-full" viewBox={'0 0 100 ' + height} preserveAspectRatio="none" aria-hidden="true">
      <path d={path} fill="none" stroke="rgba(0,229,255,.35)" strokeWidth="5" strokeDasharray="2 10" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
    <ol aria-label="Mapa de missões" className="stagger">
      {stops.map(({ item, index, x, y }) => {
        const right = x < 50;
        const tone = item.status === 'solved'
          ? 'from-[#ffe08a] to-[#ffb300] border-[#fff2c4] text-[#3a2400] shadow-[0_6px_0_#a86a00,0_0_26px_rgba(255,203,87,.6)]'
          : item.status === 'in-progress'
            ? 'from-[#ffb347] to-[#ff8a00] border-[#ffd7a1] text-[#2a1400] shadow-[0_6px_0_#b45c00,0_0_22px_rgba(255,138,0,.5)]'
            : 'from-[#3d8bff] to-[#0d6efd] border-[#9cc5ff] text-white shadow-[0_6px_0_#0846a8,0_0_22px_rgba(13,110,253,.5)]';
        return <li key={item.id} className="absolute h-0 w-0" style={{ top: y, left: x + '%' }}>
          <button
            type="button"
            onClick={() => onOpen(index)}
            aria-label={'Missão ' + (index + 1) + ': ' + item.title + ', ' + statusText[item.status]}
            className={'absolute left-0 top-0 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 bg-gradient-to-b num text-2xl transition hover:scale-110 active:scale-95 ' + tone + (index === items.findIndex(entry => entry.status !== 'solved') ? ' animate-glow' : '')}
          >
            {item.status === 'solved' ? <Item id="estrela" className="h-10 w-10" /> : index + 1}
          </button>
          <div className={'pointer-events-none absolute top-0 w-[min(9.5rem,40vw)] -translate-y-1/2 ' + (right ? 'left-11' : 'right-11 text-right')}>
            <p className="font-display text-[11px] font-bold uppercase tracking-wider text-mq-cyan">Missão {index + 1}</p>
            <p className="text-sm font-extrabold leading-tight text-white">{item.title}</p>
            <p className="text-[11px] leading-tight text-slate-300">{item.area}</p>
          </div>
        </li>;
      })}
    </ol>
    <div className="absolute left-1/2 -translate-x-1/2 text-center" style={{ top: treasureY - 34 }}>
      <Item id="bau" locked={!treasureUnlocked} className={'mx-auto h-16 w-16 ' + (treasureUnlocked ? 'animate-float' : '')} alt={treasureUnlocked ? 'Baú do tesouro aberto' : 'Baú do tesouro: resolva todas as missões'} />
      <p className="mt-1 font-display text-[11px] font-bold uppercase tracking-wider text-mq-yellow">Tesouro</p>
    </div>
  </div>;
}
