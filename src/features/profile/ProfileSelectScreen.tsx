import { kit } from '../../app/kit';
import Item from '../../components/Item';
import { Mascot, MascotPose } from '../../components/Mascot';
import { ageProfiles, type AgeProfileId } from '../../learning/profiles';
import Shape from '../early/Shape';

type Props = { onSelect: (profile: AgeProfileId) => void; onCancel?: () => void };

/** Primeira abertura: um adulto escolhe a faixa de idade de quem vai jogar. */
export default function ProfileSelectScreen({ onSelect, onCancel }: Props) {
  const [little, explorer] = ageProfiles;
  return <main className="mx-auto min-h-screen max-w-4xl px-4 pb-10 pt-5 sm:px-6">
    <div className="mq-panel overflow-hidden p-1.5 animate-pop">
      <img src={kit.hero} alt="Math Quest: a aventura da matemática" className="block w-full rounded-[1.4rem]" />
    </div>
    <h1 className="mt-6 text-center font-display text-2xl font-black text-white sm:text-3xl">Quem vai jogar?</h1>
    <p className="mx-auto mt-2 max-w-xl text-center text-slate-300">Escolha a faixa de idade para ver as atividades certas. Dá para trocar depois, na área de Progresso.</p>

    <div className="stagger mt-6 grid gap-4 sm:grid-cols-2">
      <button type="button" onClick={() => onSelect(little.id)} aria-label={little.title + ', ' + little.ageRange}
        className="group relative overflow-hidden rounded-[1.75rem] border-2 border-mq-yellow/50 bg-gradient-to-br from-[#3a2a07] via-mq-deep to-mq-navy p-5 text-left shadow-[0_14px_30px_rgba(0,0,0,.35)] transition hover:-translate-y-1 hover:border-mq-yellow">
        <span className="chip border-mq-yellow/60 bg-mq-yellow/15 text-base text-mq-yellow">{little.ageRange}</span>
        <div className="mt-3 flex items-center gap-3">
          <Mascot expression="feliz" decorative className="h-24 w-24 shrink-0 object-contain transition group-hover:scale-105" />
          <div className="flex flex-wrap items-end gap-1">
            <Shape token={{ shape: 'circulo', color: 'amarelo' }} className="h-10 w-10" />
            <Shape token={{ shape: 'triangulo', color: 'verde' }} className="h-10 w-10" />
            <Item id="estrela" className="h-10 w-10" />
          </div>
        </div>
        <span className="mt-3 block font-display text-xl font-black text-white">{little.title}</span>
        <span className="mt-1 block text-sm text-slate-200">{little.description}</span>
        <ul className="mt-3 space-y-1 text-sm text-mq-yellow">{little.highlights.map(item => <li key={item}>• {item}</li>)}</ul>
        <span className="btn btn-action mt-4 w-full text-lg">Começar</span>
      </button>

      <button type="button" onClick={() => onSelect(explorer.id)} aria-label={explorer.title + ', ' + explorer.ageRange}
        className="group relative overflow-hidden rounded-[1.75rem] border-2 border-mq-cyan/40 bg-gradient-to-br from-[#06324a] via-mq-deep to-mq-navy p-5 text-left shadow-[0_14px_30px_rgba(0,0,0,.35)] transition hover:-translate-y-1 hover:border-mq-cyan">
        <span className="chip text-base">{explorer.ageRange}</span>
        <div className="mt-3 flex items-center gap-3">
          <MascotPose pose="presenting" decorative className="h-28 w-auto shrink-0 transition group-hover:scale-105" />
          <div className="flex flex-wrap gap-1"><Item id="xp" className="h-10 w-10" /><Item id="cristal" className="h-10 w-10" /><Item id="bau" className="h-10 w-10" /></div>
        </div>
        <span className="mt-3 block font-display text-xl font-black text-white">{explorer.title}</span>
        <span className="mt-1 block text-sm text-slate-200">{explorer.description}</span>
        <ul className="mt-3 space-y-1 text-sm text-mq-cyan">{explorer.highlights.map(item => <li key={item}>• {item}</li>)}</ul>
        <span className="btn btn-blue mt-4 w-full text-lg">Começar</span>
      </button>
    </div>

    <p className="mt-6 text-center text-xs text-slate-400">Guardamos só a faixa de idade, neste aparelho. Nenhum dado é enviado.</p>
    {onCancel && <div className="mt-4 text-center"><button type="button" onClick={onCancel} className="btn btn-ghost text-sm">Voltar sem trocar</button></div>}
  </main>;
}
