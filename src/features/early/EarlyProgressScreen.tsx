import { useState, type ReactNode } from 'react';
import { IconBack } from '../../components/Icons';
import Item from '../../components/Item';
import { Mascot } from '../../components/Mascot';
import ProfileSwitch from '../../components/ProfileSwitch';
import { earlyActivities, MAX_EARLY_LEVEL, type EarlySummary } from '../../learning/early';
import { getVoiceSpeed, setVoiceSpeed, speakLines, type VoiceSpeed } from '../../lib/voice';
import ActivityIcon from './ActivityIcon';

type Props = { summary: EarlySummary; onBack: () => void; onChangeProfile: () => void; wellbeing?: ReactNode };

export default function EarlyProgressScreen({ summary, onBack, onChangeProfile, wellbeing }: Props) {
  const [speed, setSpeed] = useState<VoiceSpeed>(getVoiceSpeed);

  function chooseSpeed(value: VoiceSpeed) {
    setVoiceSpeed(value);
    setSpeed(value);
    speakLines(['Assim fica a minha voz.', 'Vamos brincar juntos?'], { force: true });
  }

  return <section className="mq-panel p-5 sm:p-8">
    <button onClick={onBack} className="btn btn-ghost px-3 py-2 text-sm"><IconBack className="h-4 w-4" /> Brincadeiras</button>
    <div className="mt-5 flex items-center gap-4">
      <Mascot expression="confiante" decorative className="h-20 w-20 shrink-0 object-contain" />
      <div>
        <h1 className="font-display text-2xl font-black text-white">Área dos adultos</h1>
        <p className="mt-1 text-sm text-slate-300">Progresso do Pequeno Explorador, salvo só neste aparelho.</p>
      </div>
    </div>

    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
      <div className="mq-card p-4"><Item id="estrela" className="mb-2 h-9 w-9" /><p className="text-xs text-slate-300">Estrelas (acertos de primeira)</p><strong className="num mt-1 block text-2xl text-white">{summary.stars}</strong></div>
      <div className="mq-card p-4"><Item id="energia" className="mb-2 h-9 w-9" /><p className="text-xs text-slate-300">Perguntas resolvidas</p><strong className="num mt-1 block text-2xl text-white">{summary.attempts}</strong></div>
    </div>

    <h2 className="mt-8 font-display text-lg font-black text-white">Brincadeiras</h2>
    <ul className="mt-3 space-y-2" aria-label="Progresso por brincadeira">
      {earlyActivities.map(activity => {
        const stats = summary.activities.find(item => item.id === activity.id)!;
        return <li key={activity.id} className="mq-card flex items-center gap-3 p-3">
          <span className="flex h-12 w-20 shrink-0 items-center justify-center overflow-hidden" aria-hidden="true"><span className="scale-[.5]"><ActivityIcon activity={activity} /></span></span>
          <span className="min-w-0 flex-1">
            <strong className="block text-sm text-white">{activity.title}</strong>
            <small className="text-xs text-slate-400">{stats.attempts ? stats.firstTry + ' de ' + stats.attempts + ' acertos de primeira' : 'Ainda não jogou'}</small>
          </span>
          <span className="shrink-0 whitespace-nowrap rounded-full border border-mq-cyan/40 bg-mq-cyan/10 px-2.5 py-1 text-xs font-bold text-[#b9f6ff]">Nível {stats.level}/{MAX_EARLY_LEVEL}</span>
        </li>;
      })}
    </ul>
    <p className="mt-3 text-xs text-slate-400">Cada brincadeira tem 7 níveis e o nível sobe sozinho quando a criança acerta de primeira com frequência. No nível 1 há só duas opções e números até 3; no nível 7 há mais opções, números até 15 ou 20 e diferenças mais sutis. Errar não tira estrelas: a criança tenta de novo com a ajuda do professor de voz.</p>

    <h2 className="mt-8 font-display text-lg font-black text-white">Professor de voz</h2>
    <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Velocidade da voz">
      {(['calma', 'normal'] as VoiceSpeed[]).map(value => <button key={value} type="button" role="radio" aria-checked={speed === value} onClick={() => chooseSpeed(value)}
        className={'btn text-sm ' + (speed === value ? 'btn-cyan' : 'btn-ghost')}>{value === 'calma' ? 'Bem devagar (recomendado)' : 'Normal'}</button>)}
    </div>
    <p className="mt-2 text-xs text-slate-400">A voz usa o português do Brasil disponível no aparelho. Se não ouvir nada, confira o volume e a voz do sistema.</p>

    {wellbeing}
    <ProfileSwitch current="age-3-6" onChange={onChangeProfile} />
  </section>;
}
