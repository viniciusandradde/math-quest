import { useEffect, useMemo, useState } from 'react';
import { buildChoices, buildFact } from '../learning/multiplication';
import { getProgressSummary, recordAnswer, saveDiagnostic } from '../lib/db';
import DiagnosticScreen from '../features/diagnostic/DiagnosticScreen';
import ArrayLab from '../features/lab/ArrayLab';
import type { DiagnosticResult } from '../learning/diagnostic';

type Screen = 'home' | 'diagnostic' | 'practice' | 'learn' | 'parent';
const logo = import.meta.env.BASE_URL + 'brand/math-quest-logo.svg';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [left, setLeft] = useState(7);
  const [right, setRight] = useState(8);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [summary, setSummary] = useState({ factsSeen: 0, attempts: 0, correct: 0, accuracy: 0 });
  const fact = useMemo(() => buildFact(left, right), [left, right]);
  const choices = useMemo(() => buildChoices(fact.answer), [fact.answer]);

  async function refreshSummary() { setSummary(await getProgressSummary()); }
  useEffect(() => { void refreshSummary(); }, []);

  async function answer(value: number) {
    if (selected !== null) return;
    setSelected(value);
    const correct = value === fact.answer;
    setFeedback(correct ? 'Boa! Você encontrou o resultado. ⚡' : 'Quase! Vamos entender: ' + left + ' grupos de ' + right + ' formam ' + fact.answer + '.');
    await recordAnswer(fact.id, correct);
    await refreshSummary();
  }

  function nextQuestion() {
    setLeft(1 + Math.floor(Math.random() * 10));
    setRight(1 + Math.floor(Math.random() * 10));
    setSelected(null);
    setFeedback('');
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 pb-12 pt-5 sm:px-6">
      <header className="flex items-center justify-between gap-3">
        <button className="flex items-center gap-3 text-left" onClick={() => setScreen('home')} aria-label="Ir para início">
          <img src={logo} className="h-12 w-12 object-contain" alt="" />
          <span><strong className="block text-lg tracking-wide">MATH QUEST</strong><small className="text-slate-400">Aprender é uma aventura</small></span>
        </button>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200">MISSÃO 01 · TABUADA</span>
      </header>

      {screen === 'home' && <section className="mt-8 grid gap-6 md:grid-cols-[1.15fr_.85fr]">
        <div className="relative overflow-hidden rounded-3xl border border-blue-300/15 bg-gradient-to-br from-[#12365b] to-[#10213a] p-6 shadow-2xl sm:p-9" style={{ backgroundImage: `linear-gradient(115deg, rgba(7,20,38,.94), rgba(16,34,58,.82)), url("${import.meta.env.BASE_URL}assets/environments/math-lab.svg")`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <p className="text-sm font-bold uppercase tracking-[.2em] text-cyan-300">Bem-vindo, explorador</p>
          <h1 className="mt-3 max-w-xl text-4xl font-black leading-tight sm:text-5xl">Sua próxima descoberta começa com <span className="text-orange-400">multiplicação.</span></h1>
          <p className="mt-4 max-w-lg text-slate-300">Explore padrões, resolva enigmas e ajude nosso robô a recuperar a energia do laboratório.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => setScreen('diagnostic')} className="rounded-xl border border-cyan-300/30 px-5 py-3 font-bold text-cyan-100 hover:bg-cyan-300/10">Fazer diagnóstico</button>
            <button onClick={() => setScreen('practice')} className="rounded-xl bg-orange-400 px-5 py-3 font-extrabold text-slate-950 shadow-lg shadow-orange-950/30 hover:bg-orange-300">Começar missão →</button>
            <button onClick={() => setScreen('learn')} className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white hover:bg-white/10">Explorar multiplicação</button>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2">
            {['Descobrir','Praticar','Conquistar'].map((label, i) => <div key={label} className="rounded-xl bg-slate-950/30 p-3"><span className="text-xs text-cyan-300">0{i+1}</span><p className="mt-1 text-sm font-bold">{label}</p></div>)}
          </div>
        </div>
        <aside className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0d1c30] p-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Seu copiloto</p>
            <img src={logo} alt="Robô Math Quest" className="mx-auto my-3 max-h-56 w-full object-contain" />
            <h2 className="text-center text-2xl font-extrabold">Pronto para o desafio?</h2>
            <p className="mt-2 text-center text-sm text-slate-400">Cada tentativa ensina algo. Vamos no seu ritmo.</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-slate-400">Tentativas</p><strong className="text-2xl">{summary.attempts}</strong></div>
            <div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-slate-400">Precisão</p><strong className="text-2xl">{summary.accuracy}%</strong></div>
          </div>
        </aside>
      </section>}

      {screen === 'diagnostic' && <DiagnosticScreen onBack={() => setScreen('home')} onComplete={(result: DiagnosticResult) => { void saveDiagnostic(result); }} />}
      {screen === 'practice' && <section className="mx-auto mt-8 max-w-2xl rounded-3xl border border-white/10 bg-[#10223a] p-6 sm:p-9">
        <button onClick={() => setScreen('home')} className="text-sm text-cyan-300">← Voltar ao laboratório</button>
        <p className="mt-7 text-center text-xs font-bold uppercase tracking-[.2em] text-orange-300">Desafio de energia</p>
        <h1 className="mt-2 text-center text-3xl font-black">Resolva o enigma</h1>
        <p className="mx-auto mt-3 max-w-md text-center text-slate-300">Existem <strong className="text-white">{left} robôs</strong>. Cada robô precisa de <strong className="text-white">{right} unidades</strong> de energia. Quantas unidades precisamos?</p>
        <div className="my-8 flex flex-wrap justify-center gap-2" aria-label={left + ' grupos com ' + right + ' unidades'}>
          {Array.from({ length: left }, (_, i) => <div key={i} className="rounded-xl border border-cyan-300/20 bg-slate-950/30 p-2 text-center"><span className="block text-xs text-slate-400">Robô {i+1}</span><span className="text-xl tracking-widest text-cyan-300">{'● '.repeat(right)}</span></div>)}
        </div>
        <p className="text-center text-4xl font-black tracking-wider">{left} × {right} = ?</p>
        <div className="mt-7 grid grid-cols-2 gap-3">
          {choices.map(value => <button key={value} disabled={selected !== null} onClick={() => void answer(value)} className={'rounded-xl border px-4 py-4 text-2xl font-black transition ' + (selected === value ? (value === fact.answer ? 'border-emerald-400 bg-emerald-400/15 text-emerald-200' : 'border-orange-400 bg-orange-400/15 text-orange-200') : 'border-white/10 bg-slate-950/30 hover:border-cyan-300/50') + ' disabled:cursor-default'}>{value}</button>)}
        </div>
        {feedback && <div role="status" className="mt-5 rounded-xl bg-slate-950/40 p-4 text-center text-sm text-slate-200">{feedback}<button onClick={nextQuestion} className="mt-3 block w-full rounded-lg bg-cyan-300 px-4 py-3 font-bold text-slate-950">Próximo desafio</button></div>}
      </section>}

      {screen === 'learn' && <section className="mt-8 rounded-3xl border border-white/10 bg-[#10223a] p-6 sm:p-9">
        <button onClick={() => setScreen('home')} className="text-sm text-cyan-300">← Voltar ao laboratório</button>
        <h1 className="mt-5 text-3xl font-black">O que significa multiplicar?</h1>
        <p className="mt-3 max-w-2xl text-slate-300">Multiplicar é reunir grupos com a mesma quantidade. Em vez de contar cada objeto separadamente, descobrimos quantos grupos existem e quantos elementos há em cada grupo.</p>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {[{n:'3 grupos',d:'Quantos grupos iguais existem?'},{n:'4 itens',d:'Quantos itens há em cada grupo?'},{n:'12 itens',d:'3 × 4 = 12 no total.'}].map((item,i)=><article key={item.n} className="rounded-2xl bg-slate-950/40 p-5"><span className="text-xs font-bold text-cyan-300">ETAPA 0{i+1}</span><h2 className="mt-2 text-2xl font-black">{item.n}</h2><p className="mt-2 text-sm text-slate-400">{item.d}</p></article>)}
        </div>
        <div className="mt-6 rounded-2xl border border-orange-300/20 bg-orange-300/5 p-5"><p className="text-sm text-orange-200">Experimente pensar assim:</p><p className="mt-2 text-2xl font-black">4 + 4 + 4 = 3 × 4 = 12</p><p className="mt-2 text-sm text-slate-300">A multiplicação é uma forma de representar a adição de parcelas iguais.</p></div>
        <ArrayLab />
        <button onClick={() => setScreen('practice')} className="mt-6 rounded-xl bg-orange-400 px-5 py-3 font-bold text-slate-950">Praticar agora</button>
      </section>}

      {screen === 'parent' && <section className="mt-8 rounded-3xl border border-white/10 bg-[#10223a] p-6">
        <button onClick={() => setScreen('home')} className="text-sm text-cyan-300">← Início</button>
        <h1 className="mt-5 text-3xl font-black">Resumo de aprendizagem</h1>
        <p className="mt-2 text-sm text-slate-400">Dados armazenados neste dispositivo.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[['Combinações vistas',summary.factsSeen],['Tentativas',summary.attempts],['Acertos',summary.correct],['Precisão',summary.accuracy + '%']].map(([label,value])=><div key={String(label)} className="rounded-xl bg-slate-950/40 p-4"><p className="text-xs text-slate-400">{label}</p><strong className="mt-2 block text-2xl">{value}</strong></div>)}
        </div>
      </section>}

      <nav className="mx-auto mt-8 flex max-w-xl justify-center gap-2 rounded-2xl border border-white/10 bg-[#0b1a2c] p-2">
        {([['home','Início'],['diagnostic','Diagnóstico'],['practice','Jogar'],['learn','Aprender'],['parent','Responsáveis']] as [Screen,string][]).map(([id,label])=><button key={id} onClick={() => setScreen(id)} className={'rounded-xl px-3 py-2 text-xs font-bold sm:px-4 ' + (screen === id ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white')}>{label}</button>)}
      </nav>
      <footer className="mt-8 text-center text-xs text-slate-500">Math Quest · Um produto educacional da VSA Tecnologia · MVP 0.1</footer>
    </main>
  );
}
