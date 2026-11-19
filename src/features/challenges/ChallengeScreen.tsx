import { useState } from 'react';
import { challenges, checkChallengeAnswer } from '../../learning/challenges';

type Props = { onBack: () => void };

export default function ChallengeScreen({ onBack }: Props) {
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const challenge = challenges[index];
  const correct = submitted && checkChallengeAnswer(challenge, response);

  function submit() {
    if (!response.trim() || submitted) return;
    const isCorrect = checkChallengeAnswer(challenge, response);
    if (isCorrect) setCorrectCount(value => value + 1);
    setSubmitted(true);
  }

  function next() {
    setIndex(value => value + 1);
    setResponse('');
    setSubmitted(false);
  }

  const finished = index >= challenges.length;

  return <section className="mx-auto mt-8 max-w-3xl rounded-3xl border border-white/10 bg-[#10223a] p-6 sm:p-9">
    <button onClick={onBack} className="text-sm text-cyan-300">← Voltar ao laboratório</button>
    {!finished ? <>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200">{challenge.area}</span>
        <span className="text-xs font-bold text-orange-300">DESAFIO {index + 1} / {challenges.length}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950/60"><div className="h-full rounded-full bg-cyan-300" style={{ width: ((index + 1) / challenges.length * 100) + '%' }} /></div>
      <h1 className="mt-7 text-3xl font-black">{challenge.title}</h1>
      <span className="mt-2 inline-block rounded-md bg-orange-300/10 px-2 py-1 text-xs font-bold text-orange-200">{challenge.difficulty}</span>
      <p className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-5 text-lg leading-relaxed text-slate-100">{challenge.prompt}</p>
      <h2 className="mt-6 text-xl font-bold">{challenge.question}</h2>
      <form className="mt-4" onSubmit={event => { event.preventDefault(); submit(); }}>
        <label htmlFor="challenge-answer" className="mb-2 block text-sm text-slate-400">Sua resposta {challenge.unit ? '(' + challenge.unit + ')' : ''}</label>
        <input id="challenge-answer" type="text" inputMode="decimal" autoComplete="off" value={response} disabled={submitted} onChange={event => setResponse(event.target.value)} placeholder="Digite o resultado" className="w-full rounded-xl border border-white/15 bg-slate-950/50 px-4 py-4 text-xl font-bold text-white outline-none focus:border-cyan-300" />
        {!submitted && <button type="submit" disabled={!response.trim()} className="mt-4 w-full rounded-xl bg-orange-400 px-5 py-3 font-extrabold text-slate-950 disabled:opacity-40">Conferir resposta</button>}
      </form>
      {submitted && <div role="status" className={'mt-5 rounded-2xl border p-5 ' + (correct ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-orange-300/30 bg-orange-300/10')}>
        <p className="font-extrabold">{correct ? 'Código correto! ⚡' : 'Vamos analisar a estratégia.'}</p>
        <p className="mt-2 text-sm text-slate-200">{challenge.explanation}</p>
        <details className="mt-3 text-sm text-slate-300"><summary className="cursor-pointer font-bold text-cyan-200">Ver uma pista de resolução</summary><p className="mt-2">{challenge.hint}</p></details>
        <button onClick={next} className="mt-4 w-full rounded-xl bg-cyan-300 px-5 py-3 font-extrabold text-slate-950">{index + 1 === challenges.length ? 'Ver resultado da missão' : 'Próximo desafio'}</button>
      </div>}
    </> : <>
      <p className="mt-8 text-center text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Missão concluída</p>
      <h1 className="mt-3 text-center text-3xl font-black">Você chegou ao núcleo do laboratório!</h1>
      <p className="mt-4 text-center text-lg text-slate-300">Acertou {correctCount} de {challenges.length} desafios.</p>
      <p className="mt-3 text-center text-sm text-slate-400">O mais importante é conseguir explicar a estratégia, conferir o resultado e aprender com cada tentativa.</p>
      <button onClick={() => { setIndex(0); setCorrectCount(0); setResponse(''); setSubmitted(false); }} className="mt-7 w-full rounded-xl bg-orange-400 px-5 py-3 font-extrabold text-slate-950">Refazer missão</button>
    </>}
  </section>;
}
