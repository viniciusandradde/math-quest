import { useEffect } from 'react';
import Item from '../../components/Item';
import { useVoiceTeacher, VoiceBubble } from '../../components/VoiceTeacher';
import { earlyActivities, type EarlyActivityId, type EarlySummary } from '../../learning/early';
import ActivityIcon from './ActivityIcon';

const cardTone: Record<EarlyActivityId, string> = {
  igual: 'from-[#1d4fd8] to-[#0b2a6b] border-[#6ea8ff]/60',
  contar: 'from-[#c45f00] to-[#5a2c00] border-mq-orange/70',
  comparar: 'from-[#a67700] to-[#4a3500] border-mq-yellow/70',
  formas: 'from-[#007a8a] to-[#03343d] border-mq-cyan/60',
  sequencias: 'from-[#178a22] to-[#0a3d10] border-mq-green/70',
  juntar: 'from-[#4b3fd6] to-[#1d1760] border-[#9d94ff]/60'
};

const GREETING = ['Oi! Eu sou o Robô.', 'Vamos brincar com os números?', 'Toque em uma brincadeira.'];

type Props = { summary: EarlySummary; onOpen: (activity: EarlyActivityId) => void };

export default function EarlyHome({ summary, onOpen }: Props) {
  const voice = useVoiceTeacher();
  useEffect(() => { voice.say(GREETING); }, [voice.say]);

  return <div className="space-y-5 pb-4">
    <h1 className="sr-only">Pequeno Explorador: brincadeiras de 3 a 6 anos</h1>
    <div className="mq-panel p-4 sm:p-6">
      <VoiceBubble line={voice.line} speaking={voice.speaking} onRepeat={voice.repeat} expression="feliz" />
      <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-mq-yellow/10 py-2">
        <Item id="estrela" className="h-8 w-8" />
        <span className="num text-2xl text-mq-yellow">{summary.stars}</span>
        <span className="text-sm font-semibold text-slate-200">{summary.stars === 1 ? 'estrela' : 'estrelas'}</span>
      </div>
    </div>

    <ul className="stagger grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Brincadeiras">
      {earlyActivities.map(activity => {
        const stats = summary.activities.find(item => item.id === activity.id);
        return <li key={activity.id}>
          <button type="button" onClick={() => onOpen(activity.id)} aria-label={activity.title}
            className={'flex h-full min-h-44 w-full flex-col items-center justify-between gap-2 rounded-[1.5rem] border-2 bg-gradient-to-b p-3 text-center shadow-[0_6px_0_rgba(0,0,0,.35)] transition hover:-translate-y-1 active:translate-y-1 ' + cardTone[activity.id]}>
            <span className="flex h-16 items-center justify-center"><ActivityIcon activity={activity} /></span>
            <span>
              <span className="block text-lg font-extrabold leading-tight text-white">{activity.title}</span>
              <span className="block text-xs text-white/80">{activity.subtitle}</span>
            </span>
            <span className="flex items-center gap-2 text-[11px] font-bold text-white/85">
              <span className="rounded-full bg-black/25 px-2 py-0.5" title={'A partir de ' + activity.fromAge + ' anos'}>{activity.fromAge}+ anos</span>
              <span className="flex items-center gap-0.5"><Item id="estrela" className="h-4 w-4" />{stats?.firstTry ?? 0}</span>
            </span>
          </button>
        </li>;
      })}
    </ul>
  </div>;
}
