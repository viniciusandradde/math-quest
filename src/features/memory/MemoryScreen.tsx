import { useEffect, useState } from 'react';
import {
  createMemoryGame,
  describeMatch,
  describeMismatch,
  hideMismatch,
  isCardFaceUp,
  isMemoryComplete,
  revealCard,
  type MemoryGameState
} from '../../learning/memory';

export type MemorySessionResult = { attempts: number; pairs: number; completedAt: string };

type Props = {
  onBack: () => void;
  onComplete?: (result: MemorySessionResult) => void;
  /** Permite embaralhamento determinístico nos testes. */
  random?: () => number;
};

const MISMATCH_VISIBLE_MS = 2500;

export default function MemoryScreen({ onBack, onComplete, random = Math.random }: Props) {
  const [game, setGame] = useState<MemoryGameState>(() => createMemoryGame(random));
  const [feedback, setFeedback] = useState('Vire duas cartas: uma operação e o resultado dela.');
  const complete = isMemoryComplete(game);
  const totalPairs = new Set(game.deck.map(card => card.pairId)).size;

  useEffect(() => {
    if (game.lastResult !== 'mismatch') return;
    const timer = window.setTimeout(() => setGame(current => hideMismatch(current)), MISMATCH_VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [game]);

  function flip(cardId: string) {
    const next = revealCard(game, cardId);
    if (next === game) return;
    setGame(next);
    if (next.lastResult === 'match') {
      const pairId = next.matchedPairs[next.matchedPairs.length - 1];
      setFeedback('Par encontrado! ' + describeMatch(pairId));
      if (isMemoryComplete(next)) onComplete?.({ attempts: next.attempts, pairs: next.matchedPairs.length, completedAt: new Date().toISOString() });
    } else if (next.lastResult === 'mismatch') {
      const [first, second] = next.revealed.map(id => next.deck.find(card => card.id === id)!);
      setFeedback(describeMismatch(first, second));
    }
  }

  function restart() {
    setGame(createMemoryGame(random));
    setFeedback('Vire duas cartas: uma operação e o resultado dela.');
  }

  return <section className="mx-auto mt-8 max-w-3xl rounded-3xl border border-white/10 bg-[#10223a] p-6 sm:p-9">
    <button onClick={onBack} className="text-sm text-cyan-300">← Voltar ao laboratório</button>
    <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-orange-300">Jogo · Memória matemática</p>
    <h1 className="mt-2 text-3xl font-black">Conecte cada operação ao resultado</h1>
    <p className="mt-3 text-slate-300">Calcule antes de virar a segunda carta. Não há cronômetro: pense com calma e use papel se precisar.</p>

    <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-bold">
      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-cyan-200">Pares: {game.matchedPairs.length} / {totalPairs}</span>
      <span className="rounded-full border border-white/10 px-3 py-1 text-slate-300">Tentativas: {game.attempts}</span>
    </div>

    <ul className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="Cartas do jogo da memória">
      {game.deck.map((card, index) => {
        const faceUp = isCardFaceUp(game, card);
        const matched = game.matchedPairs.includes(card.pairId);
        const label = faceUp
          ? (card.kind === 'operation' ? 'Operação: ' : 'Resultado: ') + card.text + (matched ? ', par encontrado' : '')
          : 'Carta ' + (index + 1) + ', virada para baixo';
        return <li key={card.id}>
          <button
            type="button"
            onClick={() => flip(card.id)}
            disabled={matched || complete}
            aria-label={label}
            aria-pressed={faceUp}
            className={'flex min-h-24 w-full items-center justify-center rounded-2xl border p-2 text-center text-sm font-black leading-tight transition sm:min-h-28 sm:text-base ' + (matched
              ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-100'
              : faceUp
                ? (card.kind === 'operation' ? 'border-cyan-300/60 bg-cyan-300/10 text-white' : 'border-orange-300/60 bg-orange-300/10 text-white')
                : 'border-white/10 bg-slate-950/50 text-cyan-300/70 hover:border-cyan-300/50')}
          >
            {faceUp ? card.text : <span aria-hidden="true" className="text-2xl">?</span>}
          </button>
        </li>;
      })}
    </ul>

    <p role="status" className={'mt-5 rounded-xl p-4 text-sm ' + (game.lastResult === 'mismatch' ? 'bg-orange-300/10 text-orange-100' : 'bg-slate-950/40 text-slate-200')}>{feedback}</p>

    {complete && <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-center">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-200">Memória concluída</p>
      <h2 className="mt-2 text-2xl font-black">Todos os {totalPairs} pares encontrados!</h2>
      <p className="mt-2 text-sm text-slate-200">Você usou {game.attempts} tentativas. Na próxima partida, tente calcular cada operação antes de procurar o resultado.</p>
      <button onClick={restart} className="mt-4 w-full rounded-xl bg-orange-400 px-5 py-3 font-extrabold text-slate-950">Jogar novamente</button>
    </div>}
  </section>;
}
