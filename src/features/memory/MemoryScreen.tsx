import { useEffect, useState } from 'react';
import type { Expression } from '../../app/kit';
import Confetti from '../../components/Confetti';
import { IconBack } from '../../components/Icons';
import { Mascot, MascotPose } from '../../components/Mascot';
import {
  createMemoryGame,
  describeMatch,
  describeMismatch,
  hideMismatch,
  isCardFaceUp,
  isMemoryComplete,
  revealCard,
  type MemoryGameState,
  type MemorySessionResult
} from '../../learning/memory';
import { sfx } from '../../lib/sound';

type Props = {
  onBack: () => void;
  onComplete?: (result: MemorySessionResult) => void;
  /** Permite embaralhamento determinístico nos testes. */
  random?: () => number;
};

const MISMATCH_VISIBLE_MS = 2500;
const START_MESSAGE = 'Vire duas cartas: uma operação e o resultado dela.';
const logo = import.meta.env.BASE_URL + 'brand/math-quest-logo.svg';

export default function MemoryScreen({ onBack, onComplete, random = Math.random }: Props) {
  const [game, setGame] = useState<MemoryGameState>(() => createMemoryGame(random));
  const [feedback, setFeedback] = useState(START_MESSAGE);
  const [burst, setBurst] = useState(0);
  const complete = isMemoryComplete(game);
  const totalPairs = new Set(game.deck.map(card => card.pairId)).size;
  const mood: Expression = game.lastResult === 'match' ? 'animado' : game.lastResult === 'mismatch' ? 'surpreso' : 'estudando';

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
      if (isMemoryComplete(next)) {
        sfx.reward();
        setBurst(value => value + 1);
        onComplete?.({ attempts: next.attempts, pairs: next.matchedPairs.length, completedAt: new Date().toISOString() });
      } else sfx.match();
    } else if (next.lastResult === 'mismatch') {
      const [first, second] = next.revealed.map(id => next.deck.find(card => card.id === id)!);
      setFeedback(describeMismatch(first, second));
      sfx.tryAgain();
    } else sfx.flip();
  }

  function restart() {
    setGame(createMemoryGame(random));
    setFeedback(START_MESSAGE);
  }

  return <section className="mq-panel mx-auto max-w-3xl p-5 sm:p-8">
    <Confetti burst={burst} />
    <button onClick={onBack} className="btn btn-ghost px-3 py-2 text-sm"><IconBack className="h-4 w-4" /> Voltar ao mapa</button>
    <div className="mt-5 flex items-center gap-4">
      <Mascot expression="estudando" decorative className="h-20 w-20 shrink-0 object-contain animate-float sm:h-24 sm:w-24" />
      <div>
        <p className="font-display text-xs font-bold uppercase tracking-[.2em] text-mq-orange">Jogo · Memória matemática</p>
        <h1 className="mt-1 font-display text-lg font-black leading-tight text-white sm:text-3xl">Conecte cada operação ao resultado</h1>
      </div>
    </div>
    <p className="mt-3 text-slate-300">Calcule antes de virar a segunda carta. Não há cronômetro: pense com calma e use papel se precisar.</p>

    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="chip">Pares: {game.matchedPairs.length} / {totalPairs}</span>
      <span className="chip border-mq-orange/40 bg-mq-orange/10 text-mq-yellow">Tentativas: {game.attempts}</span>
    </div>

    <ul className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3" aria-label="Cartas do jogo da memória">
      {game.deck.map((card, index) => {
        const faceUp = isCardFaceUp(game, card);
        const matched = game.matchedPairs.includes(card.pairId);
        const label = faceUp
          ? (card.kind === 'operation' ? 'Operação: ' : 'Resultado: ') + card.text + (matched ? ', par encontrado' : '')
          : 'Carta ' + (index + 1) + ', virada para baixo';
        return <li key={card.id} className="flip h-28 sm:h-32">
          <button type="button" onClick={() => flip(card.id)} disabled={matched || complete} aria-label={label} aria-pressed={faceUp} className="h-full w-full rounded-2xl disabled:cursor-default">
            <span className={'flip-inner ' + (faceUp ? 'is-up' : '')}>
              <span className="flip-face border-2 border-mq-blue/60 bg-gradient-to-br from-[#163b86] via-mq-deep to-mq-navy shadow-[0_5px_0_#061640] transition hover:border-mq-cyan">
                <span className="flex flex-col items-center gap-1" aria-hidden="true">
                  <img src={logo} alt="" className="h-10 w-10 opacity-90" />
                  <span className="font-display text-lg font-black text-mq-cyan">?</span>
                </span>
              </span>
              <span className={'flip-face flip-front border-2 num text-[15px] leading-tight sm:text-lg ' + (matched
                ? 'border-mq-green bg-gradient-to-b from-[#1f7a2a] to-[#0f4a18] text-white shadow-[0_0_22px_rgba(33,192,43,.55)]'
                : card.kind === 'operation'
                  ? 'border-mq-cyan bg-gradient-to-b from-[#0b3a5c] to-[#082440] text-white shadow-[0_5px_0_#04192c]'
                  : 'border-mq-orange bg-gradient-to-b from-[#5a3510] to-[#341e07] text-mq-yellow shadow-[0_5px_0_#2a1704]')}>
                {faceUp ? card.text : ''}
              </span>
            </span>
          </button>
        </li>;
      })}
    </ul>

    <div className={'mt-5 flex items-center gap-3 rounded-2xl border p-3 ' + (game.lastResult === 'mismatch' ? 'border-mq-orange/40 bg-mq-orange/10' : game.lastResult === 'match' ? 'border-mq-green/40 bg-mq-green/10' : 'border-white/10 bg-mq-night/50')}>
      <Mascot key={mood + game.attempts} expression={mood} decorative className="h-16 w-16 shrink-0 animate-bounce-in object-contain" />
      <p role="status" className="text-sm text-slate-100">{feedback}</p>
    </div>

    {complete && <div className="mt-5 rounded-2xl border-2 border-mq-green/50 bg-mq-green/10 p-5 text-center animate-pop">
      <MascotPose pose="celebrating" decorative className="mx-auto h-40 w-auto animate-float" />
      <p className="font-display text-xs font-bold uppercase tracking-[.2em] text-mq-green">Memória concluída</p>
      <h2 className="mt-2 font-display text-2xl font-black text-white">Todos os {totalPairs} pares encontrados!</h2>
      <p className="mt-2 text-sm text-slate-200">Você usou {game.attempts} tentativas. Na próxima partida, tente calcular cada operação antes de procurar o resultado.</p>
      <button onClick={restart} className="btn btn-action mt-4 w-full">Jogar novamente</button>
    </div>}
  </section>;
}
