import { useState } from 'react';
import { diagnosticQuestions, evaluateDiagnostic, type DiagnosticResult } from '../../learning/diagnostic';

type Props = { onBack: () => void; onComplete: (result: DiagnosticResult) => void };

export default function DiagnosticScreen({ onBack, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const question = diagnosticQuestions[index];

  function next() {
    if (selected === null) return;
    const nextAnswers = [...answers, selected];
    setAnswers(nextAnswers);
    if (index + 1 < diagnosticQuestions.length) {
      setIndex(index + 1);
      setSelected(null);
      return;
    }
    const responses = diagnosticQuestions.map((item, i) => ({
      questionId: item.id,
      skill: item.skill,
      selected: nextAnswers[i],
      correct: nextAnswers[i] === item.answer
    }));
    const evaluated = evaluateDiagnostic(responses);
    setResult(evaluated);
    onComplete(evaluated);
  }

  return <section className="mx-auto mt-8 max-w-2xl rounded-3xl border border-white/10 bg-[#10223a] p-6 sm:p-9">
    <button onClick={onBack} className="text-sm text-cyan-300">← Voltar ao laboratório</button>
    {!result ? <>
      <p className="mt-7 text-center text-xs font-bold uppercase tracking-[.2em] text-orange-300">Mapa de conhecimentos · {index + 1} de {diagnosticQuestions.length}</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950/60"><div className="h-full rounded-full bg-cyan-300" style={{ width: ((index + 1) / diagnosticQuestions.length * 100) + '%' }} /></div>
      <h1 className="mt-7 text-center text-2xl font-black">{question.prompt}</h1>
      <div className="mt-7 grid gap-3">
        {question.options.map(option => <button key={option} disabled={selected !== null} onClick={() => setSelected(option)} className={'rounded-xl border px-4 py-4 text-left font-bold ' + (selected === option ? (option === question.answer ? 'border-emerald-400 bg-emerald-400/10 text-emerald-200' : 'border-orange-400 bg-orange-400/10 text-orange-200') : 'border-white/10 bg-slate-950/30 hover:border-cyan-300/50')}>{option}</button>)}
      </div>
      {selected !== null && <div role="status" className="mt-5 rounded-xl bg-slate-950/40 p-4 text-sm text-slate-200">
        {question.explanation}
        <button onClick={next} className="mt-3 block w-full rounded-lg bg-cyan-300 px-4 py-3 font-bold text-slate-950">{index + 1 === diagnosticQuestions.length ? 'Ver meu mapa de aprendizagem' : 'Próxima pergunta'}</button>
      </div>}
    </> : <>
      <p className="mt-7 text-center text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Seu mapa de aprendizagem</p>
      <h1 className="mt-2 text-center text-3xl font-black">Descobertas do laboratório</h1>
      <p className="mt-3 text-center text-sm text-slate-300">Este resultado orienta as próximas atividades. Não é uma nota nem uma classificação.</p>
      <div className="mt-6 space-y-3">
        {Object.entries(result.bySkill).map(([skill, data]) => <div key={skill} className="rounded-xl bg-slate-950/40 p-4">
          <div className="flex items-center justify-between gap-2"><strong className="capitalize">{skill.replaceAll('-', ' ')}</strong><span className="text-xs text-cyan-200">{data.level === 'secure' ? 'Bom desempenho nesta amostra' : data.level === 'developing' ? 'Em desenvolvimento' : 'Vamos praticar juntos'}</span></div>
          <p className="mt-1 text-xs text-slate-400">{data.correct} de {data.total} respostas corretas</p>
        </div>)}
      </div>
      <button onClick={onBack} className="mt-6 w-full rounded-xl bg-orange-400 px-5 py-3 font-bold text-slate-950">Voltar ao laboratório</button>
    </>}
  </section>;
}
