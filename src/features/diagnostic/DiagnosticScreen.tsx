import { useState } from 'react';
import { IconBack } from '../../components/Icons';
import { Mascot, MascotPose } from '../../components/Mascot';
import { diagnosticQuestions, evaluateDiagnostic, type DiagnosticResult, type DiagnosticSkill } from '../../learning/diagnostic';
import { sfx } from '../../lib/sound';

type Props = { onBack: () => void; onComplete: (result: DiagnosticResult) => void };

const skillName: Record<DiagnosticSkill, string> = {
  'equal-groups': 'Grupos iguais',
  'repeated-addition': 'Adição repetida',
  arrays: 'Matrizes',
  symbolic: 'Representação simbólica',
  facts: 'Fatos da multiplicação'
};

const levelView = {
  'not-assessed': { label: 'Ainda não avaliado', bar: 'bg-slate-500', text: 'text-slate-300' },
  secure: { label: 'Bom desempenho nesta amostra', bar: 'bg-mq-green', text: 'text-mq-green' },
  developing: { label: 'Em desenvolvimento', bar: 'bg-mq-yellow', text: 'text-mq-yellow' },
  'needs-support': { label: 'Vamos praticar juntos', bar: 'bg-mq-orange', text: 'text-mq-orange' }
} as const;

export default function DiagnosticScreen({ onBack, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const question = diagnosticQuestions[index];

  function choose(option: string) {
    if (selected !== null) return;
    setSelected(option);
    if (option === question.answer) sfx.correct(); else sfx.tryAgain();
  }

  function next() {
    if (selected === null) return;
    sfx.tap();
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
    sfx.reward();
    onComplete(evaluated);
  }

  return <section className="mq-panel mx-auto max-w-2xl p-5 sm:p-8">
    <button onClick={onBack} className="btn btn-ghost px-3 py-2 text-sm"><IconBack className="h-4 w-4" /> Voltar ao laboratório</button>
    {!result ? <div key={question.id} className="animate-pop">
      <div className="mt-5 flex items-center gap-3">
        <Mascot expression="pensativo" decorative className="h-16 w-16 shrink-0 object-contain" />
        <div className="flex-1">
          <p className="font-display text-xs font-bold uppercase tracking-[.2em] text-mq-orange">Mapa de conhecimentos · {index + 1} de {diagnosticQuestions.length}</p>
          <div className="mt-2 xp-track"><div className="xp-fill" style={{ width: ((index + 1) / diagnosticQuestions.length * 100) + '%' }} /></div>
        </div>
      </div>
      <h1 className="mt-6 text-center font-display text-xl font-black leading-snug text-white sm:text-2xl">{question.prompt}</h1>
      <div className="mt-6 grid gap-3">
        {question.options.map(option => <button key={option} disabled={selected !== null} onClick={() => choose(option)}
          className={'tile px-5 py-4 text-left font-sans text-lg font-extrabold disabled:cursor-default ' + (selected !== null && option === question.answer ? 'tile-correct' : selected === option ? 'tile-try' : '')}>{option}</button>)}
      </div>
      {selected !== null && <div role="status" className="mt-5 rounded-2xl border border-white/10 bg-mq-night/60 p-4 text-sm text-slate-100 animate-pop">
        {question.explanation}
        <button onClick={next} className="btn btn-cyan mt-3 w-full">{index + 1 === diagnosticQuestions.length ? 'Ver meu mapa de aprendizagem' : 'Próxima pergunta'}</button>
      </div>}
    </div> : <div className="animate-pop">
      <div className="mt-4 flex flex-col items-center text-center">
        <MascotPose pose="idle" decorative className="h-40 w-auto animate-float" />
        <p className="mt-2 font-display text-xs font-bold uppercase tracking-[.2em] text-mq-cyan">Seu mapa de aprendizagem</p>
        <h1 className="mt-1 font-display text-2xl font-black text-white sm:text-3xl">Descobertas do laboratório</h1>
        <p className="mt-2 text-sm text-slate-300">Este resultado orienta as próximas atividades. Não é uma nota nem uma classificação.</p>
      </div>
      <div className="stagger mt-6 space-y-3">
        {(Object.entries(result.bySkill) as [DiagnosticSkill, DiagnosticResult['bySkill'][DiagnosticSkill]][]).map(([skill, data]) => {
          const view = levelView[data.level];
          return <div key={skill} className="mq-card p-4">
            <div className="flex items-center justify-between gap-2"><strong className="text-white">{skillName[skill]}</strong><span className={'text-xs font-bold ' + view.text}>{view.label}</span></div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-mq-night"><div className={'h-full rounded-full ' + view.bar} style={{ width: (data.total ? Math.max(8, data.correct / data.total * 100) : 8) + '%' }} /></div>
            <p className="mt-1 text-xs text-slate-400">{data.correct} de {data.total} respostas corretas</p>
          </div>;
        })}
      </div>
      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-mq-cyan/30 bg-mq-cyan/5 p-4">
        <Mascot expression="confiante" decorative className="h-16 w-16 shrink-0 object-contain" />
        <p className="text-sm text-slate-100">Ótimo trabalho! Agora sabemos por onde começar. A chave da coleção é sua.</p>
      </div>
      <button onClick={onBack} className="btn btn-action mt-6 w-full">Voltar ao laboratório</button>
    </div>}
  </section>;
}
