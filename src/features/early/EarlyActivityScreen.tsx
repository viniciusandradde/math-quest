import { useEffect, useMemo, useRef, useState } from 'react';
import type { Expression } from '../../app/kit';
import Confetti from '../../components/Confetti';
import { IconBack } from '../../components/Icons';
import Item from '../../components/Item';
import { MascotPose } from '../../components/Mascot';
import { useVoiceTeacher, VoiceBubble } from '../../components/VoiceTeacher';
import {
  buildEarlyRound, countAloud, earlyActivities, praiseWords, tryAgainWords,
  type CountItem, type EarlyActivityId, type EarlyAttempt, type EarlyLevel, type EarlyOption, type EarlyQuestion
} from '../../learning/early';
import { sfx } from '../../lib/sound';
import Shape from './Shape';

type Props = {
  activityId: EarlyActivityId;
  level: EarlyLevel;
  onBack: () => void;
  onAnswer: (attempt: EarlyAttempt) => void;
  /** Permite rodadas determinísticas nos testes. */
  random?: () => number;
};

const pickWord = (list: string[]) => list[Math.floor(Math.random() * list.length)];

/** Pontinhos de apoio sob o numeral (nível 1): a criança pode comparar quantidades sem saber ler números. */
function Dots({ n }: { n: number }) {
  return <span className="mt-1 flex max-w-20 flex-wrap justify-center gap-1" aria-hidden="true">
    {Array.from({ length: n }, (_, i) => <span key={i} className="h-2.5 w-2.5 rounded-full bg-mq-yellow" />)}
  </span>;
}

function ItemGrid({ item, count, offset = 0, counted, highlight, onTap, size = 'h-14 w-14' }: {
  item: CountItem; count: number; offset?: number; counted?: Map<number, number>; highlight?: number; onTap?: (index: number) => void; size?: string;
}) {
  return <div className="flex flex-wrap justify-center gap-2">
    {Array.from({ length: count }, (_, i) => {
      const index = offset + i;
      const number = counted?.get(index);
      const lit = number !== undefined || highlight === index + 1;
      const content = <>
        <Item id={item} className={size + ' transition ' + (lit ? 'scale-110' : '')} />
        {number !== undefined && <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-mq-green text-sm font-black text-white shadow animate-bounce-in">{number}</span>}
      </>;
      return onTap
        ? <button key={index} type="button" onClick={() => onTap(index)} aria-label={number !== undefined ? 'Contado: ' + number : 'Tocar para contar'} className={'relative rounded-2xl p-1.5 transition ' + (lit ? 'bg-mq-yellow/25 shadow-[0_0_18px_rgba(255,203,87,.5)]' : 'bg-white/5 hover:bg-white/10')}>{content}</button>
        : <span key={index} className={'relative rounded-2xl p-1 ' + (lit ? 'bg-mq-yellow/25' : '')}>{content}</span>;
    })}
  </div>;
}

export default function EarlyActivityScreen({ activityId, level, onBack, onAnswer, random = Math.random }: Props) {
  const activity = earlyActivities.find(item => item.id === activityId)!;
  const [round, setRound] = useState<EarlyQuestion[]>(() => buildEarlyRound(activityId, level, random));
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [counted, setCounted] = useState<Map<number, number>>(new Map());
  const [highlight, setHighlight] = useState(0);
  const [burst, setBurst] = useState(0);
  const [mood, setMood] = useState<Expression>('feliz');
  const voice = useVoiceTeacher();
  const introduced = useRef(false);
  const question = round[index];
  const finished = index >= round.length;
  const stars = results.filter(Boolean).length;
  const countWords = useMemo(() => countAloud(10), []);
  const scene = question?.scene;

  // Explica a brincadeira na primeira pergunta; depois, só o pedido.
  useEffect(() => {
    if (finished) {
      voice.say(['Você terminou!', stars === 1 ? 'Ganhou uma estrela.' : stars > 1 ? 'Ganhou ' + stars + ' estrelas.' : 'Você treinou muito bem.', 'Parabéns!']);
      return;
    }
    const lines = introduced.current ? [question.prompt] : [...activity.intro, question.prompt];
    introduced.current = true;
    voice.say(lines);
  }, [index, round]);

  function sayWithCountHighlight(lines: string[]) {
    voice.say(lines, {
      onLine: line => { const position = countWords.indexOf(line); setHighlight(position >= 0 ? position + 1 : 0); },
      onEnd: () => setHighlight(0)
    });
  }

  function tapToCount(itemIndex: number) {
    if (counted.has(itemIndex)) return;
    const next = new Map(counted);
    const number = counted.size + 1;
    next.set(itemIndex, number);
    setCounted(next);
    sfx.tap();
    const total = scene?.kind === 'count' ? scene.count : scene?.kind === 'join' ? scene.a + scene.b : 0;
    const word = countWords[number - 1] ?? String(number);
    voice.say(number === total ? [word, 'Agora toque no número.'] : [word]);
  }

  function choose(optionIndex: number) {
    if (solved || wrong.includes(optionIndex)) return;
    if (optionIndex === question.answerIndex) {
      setSolved(true);
      setMood('comemorando');
      setResults(value => [...value, wrong.length === 0]);
      onAnswer({ activity: activityId, level, firstTry: wrong.length === 0, tries: wrong.length + 1, answeredAt: new Date().toISOString() });
      setBurst(value => value + 1);
      sfx.correct();
      voice.say([pickWord(praiseWords), question.praise]);
    } else {
      setWrong(value => [...value, optionIndex]);
      setMood('incentivando');
      sfx.tryAgain();
      sayWithCountHighlight([pickWord(tryAgainWords), ...question.hint]);
    }
  }

  function next() {
    sfx.tap();
    setIndex(value => value + 1);
    setWrong([]);
    setSolved(false);
    setCounted(new Map());
    setHighlight(0);
    setMood('feliz');
  }

  function playAgain() {
    introduced.current = true;
    setRound(buildEarlyRound(activityId, level, random));
    setIndex(0); setResults([]); setWrong([]); setSolved(false); setCounted(new Map()); setMood('feliz');
  }

  function optionContent(option: EarlyOption) {
    if (option.token) return <Shape token={option.token} className="h-20 w-20 sm:h-24 sm:w-24" />;
    if (option.number !== undefined) return <span className="flex flex-col items-center"><span className="num text-5xl text-white">{option.number}</span>{level === 1 && <Dots n={option.number} />}</span>;
    return null;
  }

  function optionClass(optionIndex: number) {
    if (solved && optionIndex === question.answerIndex) return 'tile-correct animate-bounce-in';
    if (wrong.includes(optionIndex)) return 'opacity-35 grayscale animate-wiggle';
    return '';
  }


  return <section className="mq-panel mx-auto max-w-3xl p-4 sm:p-7">
    <Confetti burst={burst} />
    <div className="flex items-center justify-between gap-2">
      <button onClick={onBack} className="btn btn-ghost px-3 py-2 text-sm"><IconBack className="h-5 w-5" /> Brincadeiras</button>
      {!finished && <div className="flex gap-1.5" aria-label={'Pergunta ' + (index + 1) + ' de ' + round.length}>
        {round.map((item, i) => <span key={item.id} className={'h-3.5 w-3.5 rounded-full ' + (i < index ? (results[i] ? 'bg-mq-yellow' : 'bg-mq-green') : i === index ? 'bg-mq-cyan animate-glow' : 'bg-white/15')} />)}
      </div>}
    </div>
    <h1 className="mt-3 text-center font-display text-xl font-black text-white">{activity.title}</h1>

    <div className="mt-3"><VoiceBubble line={voice.line} speaking={voice.speaking} onRepeat={voice.repeat} expression={finished ? 'comemorando' : mood} /></div>

    {!finished && scene ? <div key={question.id} className="animate-pop">
      <div className="mt-5 flex min-h-36 flex-col items-center justify-center gap-3 rounded-3xl border border-white/10 bg-mq-night/50 p-4">
        {scene.kind === 'match' && <><p className="text-sm font-bold text-slate-300">Igual a este:</p><div className="rounded-3xl border-2 border-dashed border-mq-cyan/50 p-3"><Shape token={scene.target} className="h-24 w-24" title={question.options[question.answerIndex].label} /></div></>}
        {scene.kind === 'count' && <ItemGrid item={scene.item} count={scene.count} counted={counted} highlight={highlight} onTap={tapToCount} />}
        {scene.kind === 'join' && <div className="flex flex-wrap items-center justify-center gap-3">
          <ItemGrid item={scene.item} count={scene.a} counted={counted} highlight={highlight} onTap={tapToCount} size="h-12 w-12" />
          <span className="num text-4xl text-mq-yellow">+</span>
          <ItemGrid item={scene.item} count={scene.b} offset={scene.a} counted={counted} highlight={highlight} onTap={tapToCount} size="h-12 w-12" />
        </div>}
        {scene.kind === 'pattern' && <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
          {scene.sequence.map((token, i) => <Shape key={i} token={token} className="h-10 w-10 sm:h-16 sm:w-16" />)}
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-mq-yellow text-xl font-black text-mq-yellow animate-glow sm:h-16 sm:w-16 sm:text-2xl">?</span>
        </div>}
        {scene.kind === 'shapes' && <p className="text-center text-2xl font-black text-white">{question.prompt}</p>}
        {scene.kind === 'compare' && <p className="text-center text-2xl font-black text-white">{question.prompt}</p>}
      </div>

      {scene.kind === 'compare'
        ? <div className="mt-4 grid grid-cols-2 gap-3">
          {question.options.map((option, i) => {
            const amount = option.side === 'left' ? scene.left : scene.right;
            return <button key={option.label} type="button" onClick={() => choose(i)} disabled={wrong.includes(i)} aria-label={option.label + ' com ' + amount}
              className={'tile flex min-h-40 items-center justify-center p-3 ' + optionClass(i)}>
              <ItemGrid item={scene.item} count={amount} highlight={0} size={amount > 6 ? 'h-8 w-8' : 'h-11 w-11'} />
            </button>;
          })}
        </div>
        : <div className={'mt-4 grid gap-3 ' + (question.options.length === 2 ? 'grid-cols-2' : 'grid-cols-3')}>
          {question.options.map((option, i) => <button key={option.label} type="button" onClick={() => choose(i)} disabled={wrong.includes(i)} aria-label={option.label}
            className={'tile flex min-h-28 items-center justify-center p-3 ' + optionClass(i)}>{optionContent(option)}</button>)}
        </div>}

      {solved && <button onClick={next} className="btn btn-action mt-5 w-full py-4 text-xl animate-pop">{index + 1 === round.length ? 'Ver minhas estrelas' : 'Próxima'} <span aria-hidden="true">▶</span></button>}
    </div> : <div className="animate-pop text-center">
      <MascotPose pose="celebrating" decorative className="mx-auto mt-4 h-48 w-auto animate-float" />
      <div className="mt-2 flex justify-center gap-1" aria-label={'Estrelas: ' + stars + ' de ' + round.length}>
        {round.map((item, i) => <Item key={item.id} id="estrela" locked={!results[i]} className="h-12 w-12 animate-bounce-in" />)}
      </div>
      <p className="mt-3 text-lg font-bold text-white">Você terminou a brincadeira!</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button onClick={playAgain} className="btn btn-action py-4 text-lg">Brincar de novo</button>
        <button onClick={onBack} className="btn btn-ghost py-4 text-lg">Escolher outra</button>
      </div>
    </div>}
  </section>;
}
