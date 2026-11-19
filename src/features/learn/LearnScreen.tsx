import { kit, scenarioLabel } from '../../app/kit';
import { IconBack } from '../../components/Icons';
import { Mascot } from '../../components/Mascot';
import ArrayLab from '../lab/ArrayLab';

type Props = { onBack: () => void; onPractice: () => void };

const steps = [
  { n: '3 grupos', d: 'Quantos grupos iguais existem?', color: 'text-mq-cyan' },
  { n: '4 itens', d: 'Quantos itens há em cada grupo?', color: 'text-mq-yellow' },
  { n: '12 itens', d: '3 × 4 = 12 no total.', color: 'text-mq-green' }
];

export default function LearnScreen({ onBack, onPractice }: Props) {
  return <section className="mq-panel overflow-hidden">
    <div className="relative">
      <img src={kit.scenario('laboratorio')} alt={scenarioLabel.laboratorio} className="block h-36 w-full object-cover object-bottom sm:h-52" />
      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-mq-navy to-transparent" />
      <button onClick={onBack} className="btn btn-ghost absolute left-4 top-4 bg-mq-night/70 px-3 py-2 text-sm"><IconBack className="h-4 w-4" /> Voltar ao laboratório</button>
    </div>
    <div className="px-5 pb-7 pt-4 sm:px-9">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Mascot expression="explicando" className="h-28 w-auto shrink-0 animate-float sm:h-36" />
        <div>
          <h1 className="font-display text-2xl font-black text-white sm:text-3xl">O que significa multiplicar?</h1>
          <p className="mt-2 max-w-2xl text-slate-200">Multiplicar é reunir grupos com a mesma quantidade. Em vez de contar cada objeto separadamente, descobrimos quantos grupos existem e quantos elementos há em cada grupo.</p>
        </div>
      </div>
      <div className="stagger mt-6 grid gap-3 sm:grid-cols-3">
        {steps.map((item, i) => <article key={item.n} className="mq-card p-5"><span className="font-display text-xs font-bold text-mq-cyan">ETAPA 0{i + 1}</span><h2 className={'mt-2 num text-3xl font-black ' + item.color}>{item.n}</h2><p className="mt-2 text-sm text-slate-300">{item.d}</p></article>)}
      </div>
      <div className="mt-5 rounded-2xl border border-mq-orange/40 bg-mq-orange/10 p-5"><p className="text-sm font-bold text-mq-yellow">Experimente pensar assim:</p><p className="mt-2 num text-3xl font-black text-white">4 + 4 + 4 = 3 × 4 = 12</p><p className="mt-2 text-sm text-slate-200">A multiplicação é uma forma de representar a adição de parcelas iguais.</p></div>
      <ArrayLab />
      <button onClick={onPractice} className="btn btn-action mt-6 w-full sm:w-auto">Praticar agora</button>
    </div>
  </section>;
}
