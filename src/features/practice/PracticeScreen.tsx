import { useMemo, useState } from 'react';
import { kit, scenarioLabel } from '../../app/kit';
import Confetti from '../../components/Confetti';
import { IconBack } from '../../components/Icons';
import Item from '../../components/Item';
import { Mascot } from '../../components/Mascot';
import { buildChoices, buildFact } from '../../learning/multiplication';
import { sfx } from '../../lib/sound';

type Props = { onBack: () => void; onAnswer: (factId: string, correct: boolean) => Promise<void> | void };

const STARS = 4;
const randomFactor = () => 1 + Math.floor(Math.random() * 10);

export default function PracticeScreen({ onBack, onAnswer }: Props) {
  const [left, setLeft] = useState(7);
  const [right, setRight] = useState(8);
  const [selected, setSelected] = useState<number | null>(null);
  const [stars, setStars] = useState(0);
  const [burst, setBurst] = useState(0);
  const fact = useMemo(() => buildFact(left, right), [left, right]);
  const choices = useMemo(() => buildChoices(fact.answer), [fact.answer]);
  const correct = selected === fact.answer;

  function answer(value: number) {
    if (selected !== null) return;
    setSelected(value);
    const isCorrect = value === fact.answer;
    if (isCorrect) {
      sfx.correct();
      const next = Math.min(STARS, stars + 1);
      setStars(next);
      if (next === STARS && stars < STARS) setBurst(b => b + 1);
    } else sfx.tryAgain();
    void onAnswer(fact.id, isCorrect);
  }

  function nextQuestion() {
    sfx.tap();
    if (stars === STARS) setStars(0);
    setLeft(randomFactor());
    setRight(randomFactor());
    setSelected(null);
  }

  return <section className="mq-panel mx-auto max-w-2xl overflow-hidden">
    <Confetti burst={burst} />
    <div className="relative">
      <img src={kit.scenario('fabrica')} alt={scenarioLabel.fabrica} className="block h-32 w-full object-cover object-bottom sm:h-44" />
      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-mq-navy to-transparent" />
      <button onClick={onBack} className="btn btn-ghost absolute left-4 top-4 bg-mq-night/70 px-3 py-2 text-sm"><IconBack className="h-4 w-4" /> Voltar ao laboratório</button>
    </div>
    <div className="px-5 pb-6 sm:px-8">
      <p className="mt-4 text-center font-display text-xs font-bold uppercase tracking-[.2em] text-mq-orange">Desafio de energia</p>
      <h1 className="mt-1 text-center font-display text-2xl font-black text-white">Resolva o enigma</h1>
      <div className="mt-3 flex justify-center gap-1" aria-label={'Estrelas desta rodada: ' + stars + ' de ' + STARS}>
        {Array.from({ length: STARS }, (_, i) => <Item key={i} id="estrela" locked={i >= stars} className={'h-9 w-9 ' + (i < stars ? 'animate-bounce-in' : '')} />)}
      </div>
      <p className="mx-auto mt-4 max-w-md text-center text-slate-200">Existem <strong className="text-white">{left} robôs</strong>. Cada robô precisa de <strong className="text-white">{right} unidades</strong> de energia. Quantas unidades precisamos?</p>
      <div className="my-6 flex flex-wrap justify-center gap-2" aria-label={left + ' grupos com ' + right + ' unidades'}>
        {Array.from({ length: left }, (_, i) => <div key={i} className="mq-card flex items-center gap-1.5 px-2 py-1.5">
          <Item id="energia" className="h-5 w-5" />
          <span className="text-xs font-bold text-slate-300">Robô {i + 1}</span>
          <span className="text-sm tracking-widest text-mq-cyan">{'●'.repeat(right)}</span>
        </div>)}
      </div>
      <p className="num text-center text-5xl font-black tracking-wide text-white drop-shadow-[0_0_18px_rgba(0,229,255,.35)] sm:text-6xl">{left} × {right} = <span className="text-mq-yellow">?</span></p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {choices.map(value => <button key={value} disabled={selected !== null} onClick={() => answer(value)}
          className={'tile py-4 text-3xl disabled:cursor-default ' + (selected !== null && value === fact.answer ? 'tile-correct' : selected === value ? 'tile-try' : '')}>{value}</button>)}
      </div>
      {selected !== null && <div role="status" className={'mt-5 flex items-center gap-3 rounded-2xl border p-4 animate-pop ' + (correct ? 'border-mq-green/50 bg-mq-green/10' : 'border-mq-orange/50 bg-mq-orange/10')}>
        <Mascot expression={correct ? 'comemorando' : 'incentivando'} decorative className="h-16 w-16 shrink-0 animate-bounce-in object-contain" />
        <div className="flex-1 text-sm text-slate-100">
          <p>{correct ? 'Boa! Você encontrou o resultado. ⚡' : 'Quase! Vamos entender: ' + left + ' grupos de ' + right + ' formam ' + fact.answer + '.'}</p>
          <button onClick={nextQuestion} className="btn btn-cyan mt-3 w-full">Próximo desafio</button>
        </div>
      </div>}
    </div>
  </section>;
}
