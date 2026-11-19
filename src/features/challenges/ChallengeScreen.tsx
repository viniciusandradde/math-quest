import { useState } from 'react';
import Confetti from '../../components/Confetti';
import { IconBack } from '../../components/Icons';
import Item from '../../components/Item';
import { Mascot, MascotPose } from '../../components/Mascot';
import { buildChallengeAttempt, challenges, checkChallengeAnswer, type ChallengeAttempt } from '../../learning/challenges';
import { sfx } from '../../lib/sound';

type Props = { onBack: () => void; onAnswer?: (attempt: ChallengeAttempt) => void; startIndex?: number };

export default function ChallengeScreen({ onBack, onAnswer, startIndex = 0 }: Props) {
  const [index, setIndex] = useState(() => Math.min(Math.max(0, startIndex), challenges.length - 1));
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [burst, setBurst] = useState(0);
  const challenge = challenges[index];
  const correct = submitted && checkChallengeAnswer(challenge, response);
  const finished = index >= challenges.length;
  const correctCount = Object.values(results).filter(Boolean).length;
  const answeredCount = Object.keys(results).length;

  function submit() {
    if (!response.trim() || submitted) return;
    const attempt = buildChallengeAttempt(challenge, response);
    setResults(value => ({ ...value, [challenge.id]: attempt.correct }));
    setSubmitted(true);
    if (attempt.correct) { setBurst(value => value + 1); sfx.correct(); } else sfx.tryAgain();
    onAnswer?.(attempt);
  }

  function next() {
    sfx.tap();
    const upcoming = index + 1;
    setIndex(upcoming);
    setResponse('');
    setSubmitted(false);
    if (upcoming >= challenges.length && correctCount > 0) setBurst(value => value + 1);
  }

  function restart() {
    setIndex(0); setResults({}); setResponse(''); setSubmitted(false);
  }

  return <section className="mq-panel mx-auto max-w-3xl overflow-hidden p-5 sm:p-8">
    <Confetti burst={burst} />
    <button onClick={onBack} className="btn btn-ghost px-3 py-2 text-sm"><IconBack className="h-4 w-4" /> Voltar ao mapa</button>

    {!finished ? <div key={challenge.id} className="animate-pop">
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <span className="chip">{challenge.area}</span>
        <span className="font-display text-xs font-bold tracking-wider text-mq-orange">DESAFIO {index + 1} / {challenges.length}</span>
      </div>
      <div className="mt-3 xp-track"><div className="xp-fill" style={{ width: ((index + 1) / challenges.length * 100) + '%' }} /></div>

      <div className="mt-6 flex items-center gap-4">
        <Mascot expression="desafiando" decorative className="h-20 w-20 shrink-0 animate-float object-contain sm:h-28 sm:w-28" />
        <div>
          <h1 className="font-display text-xl font-black leading-tight text-white sm:text-3xl">{challenge.title}</h1>
          <span className="mt-2 inline-block rounded-lg bg-mq-orange/15 px-2 py-1 text-xs font-bold text-mq-yellow">{challenge.difficulty}</span>
        </div>
      </div>

      <p className="mq-card mt-5 p-5 text-lg leading-relaxed text-slate-100">{challenge.prompt}</p>
      <h2 className="mt-5 text-xl font-extrabold text-white">{challenge.question}</h2>

      <form className="mt-4" onSubmit={event => { event.preventDefault(); submit(); }}>
        <label htmlFor="challenge-answer" className="mb-2 block text-sm font-semibold text-slate-300">Sua resposta {challenge.unit ? '(' + challenge.unit + ')' : ''}</label>
        <input id="challenge-answer" type="text" inputMode="decimal" autoComplete="off" value={response} disabled={submitted} onChange={event => setResponse(event.target.value)} placeholder="Digite o resultado"
          className="w-full rounded-2xl border-2 border-mq-blue/60 bg-mq-night/70 px-5 py-4 num text-3xl text-white outline-none transition placeholder:font-sans placeholder:text-base placeholder:font-semibold placeholder:text-slate-500 focus:border-mq-cyan focus:shadow-[0_0_0_4px_rgba(0,229,255,.15)]" />
        {!submitted && <button type="submit" disabled={!response.trim()} className="btn btn-action mt-4 w-full py-4 text-lg">Conferir resposta</button>}
      </form>

      {submitted && <div role="status" className={'mt-5 rounded-2xl border-2 p-5 animate-pop ' + (correct ? 'border-mq-green/60 bg-mq-green/10' : 'border-mq-orange/50 bg-mq-orange/10')}>
        <div className="flex items-center gap-4">
          <Mascot expression={correct ? 'comemorando' : 'incentivando'} decorative className="h-20 w-20 shrink-0 animate-bounce-in object-contain" />
          <div>
            <p className="font-display text-lg font-black text-white">{correct ? 'Código correto! ⚡' : 'Vamos analisar a estratégia.'}</p>
            {correct && <p className="mt-1 flex items-center gap-1 text-sm font-bold text-mq-yellow"><Item id="estrela" className="h-5 w-5" /> +50 XP</p>}
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-100">{challenge.explanation}</p>
        <details className="mt-3 text-sm text-slate-200"><summary className="cursor-pointer font-bold text-mq-cyan">Ver uma pista de resolução</summary><p className="mt-2">{challenge.hint}</p></details>
        <button onClick={next} className="btn btn-cyan mt-4 w-full">{index + 1 === challenges.length ? 'Ver resultado da missão' : 'Próximo desafio'}</button>
      </div>}
    </div> : <div className="animate-pop text-center">
      <MascotPose pose="celebrating" className="mx-auto mt-4 h-52 w-auto animate-float" />
      <p className="mt-2 font-display text-xs font-bold uppercase tracking-[.25em] text-mq-cyan">Missão concluída</p>
      <h1 className="mt-2 font-display text-2xl font-black text-white sm:text-3xl">Você chegou ao núcleo do laboratório!</h1>
      <div className="mt-4 flex justify-center gap-1" aria-hidden="true">
        {challenges.map(item => <Item key={item.id} id="estrela" locked={!results[item.id]} className="h-9 w-9 animate-bounce-in" />)}
      </div>
      <p className="mt-3 text-lg text-slate-200">Acertou {correctCount} de {answeredCount} {answeredCount === 1 ? 'desafio respondido' : 'desafios respondidos'} nesta rodada.</p>
      <p className="mt-2 text-sm text-slate-300">O mais importante é conseguir explicar a estratégia, conferir o resultado e aprender com cada tentativa.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button onClick={restart} className="btn btn-action">Refazer missão</button>
        <button onClick={onBack} className="btn btn-ghost">Voltar ao mapa</button>
      </div>
    </div>}
  </section>;
}
